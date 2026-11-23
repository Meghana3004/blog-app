const db = require('../db');
const bcrypt = require('bcryptjs');
const { answerQuestion, queuePostEmbedding } = require('../services/aiAssistant');

const databaseError = (res, message, err) => {
  console.error(message, err);
  return res.status(500).json({ error: message });
};

const rollbackTransaction = async (client) => {
  try {
    await client.query('ROLLBACK');
  } catch (error) {
    console.error('Failed to roll back transaction:', error);
  }
};

const establishSession = async (req, user) => {
  await new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
  req.session.user = user;
  await new Promise((resolve, reject) => {
    req.session.save((error) => (error ? reject(error) : resolve()));
  });
};

const normalizeTags = (tags) => {
  const values = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags.split(',')
      : [];
  return [...new Set(values
    .filter((tag) => typeof tag === 'string')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean))]
    .slice(0, 20);
};

const validatePostTaxonomy = (category, tags) => {
  if (category !== undefined && category !== null && typeof category !== 'string') {
    return 'Category must be text';
  }
  if (typeof category === 'string' && category.trim().length > 60) {
    return 'Category must be 60 characters or fewer';
  }
  if (tags !== undefined && tags !== null && typeof tags !== 'string' && !Array.isArray(tags)) {
    return 'Tags must be a comma-separated string or an array';
  }
  const tagValues = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags.split(',')
      : [];
  if (tagValues.some((tag) => typeof tag !== 'string' || tag.trim().length > 50)) {
    return 'Each tag must be 50 characters or fewer';
  }
  if (tagValues.length > 20) {
    return 'A post can have at most 20 tags';
  }
  return null;
};

const savePostTaxonomy = async (client, postId, category, tags) => {
  await client.query('DELETE FROM post_categories WHERE post_id = $1', [postId]);
  await client.query('DELETE FROM post_tags WHERE post_id = $1', [postId]);

  if (typeof category === 'string' && category.trim()) {
    const categoryResult = await client.query(
      `INSERT INTO categories (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING category_id`,
      [category.trim().toLowerCase()],
    );
    await client.query(
      'INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2)',
      [postId, categoryResult.rows[0].category_id],
    );
  }

  for (const tag of normalizeTags(tags)) {
    const tagResult = await client.query(
      `INSERT INTO tags (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING tag_id`,
      [tag],
    );
    await client.query(
      'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
      [postId, tagResult.rows[0].tag_id],
    );
  }
};

const postMetadata = `
  (SELECT c.name
   FROM post_categories AS pc
   JOIN categories AS c ON c.category_id = pc.category_id
   WHERE pc.post_id = p.post_id
   ORDER BY c.name
   LIMIT 1) AS category,
  COALESCE((
    SELECT array_agg(t.name ORDER BY t.name)
    FROM post_tags AS pt
    JOIN tags AS t ON t.tag_id = pt.tag_id
    WHERE pt.post_id = p.post_id
  ), ARRAY[]::TEXT[]) AS tags
`;

const postFilters = `
  ($1::text IS NULL OR EXISTS (
    SELECT 1 FROM post_categories AS pc
    JOIN categories AS c ON c.category_id = pc.category_id
    WHERE pc.post_id = p.post_id AND lower(c.name) = lower($1)
  ))
  AND ($2::text IS NULL OR EXISTS (
    SELECT 1 FROM post_tags AS pt
    JOIN tags AS t ON t.tag_id = pt.tag_id
    WHERE pt.post_id = p.post_id AND lower(t.name) = lower($2)
  ))
  AND ($3::text IS NULL OR p.title ILIKE '%' || $3 || '%' OR p.content ILIKE '%' || $3 || '%')
`;

exports.saveFormData = async (req, res) => {
  const { name, email, username, dob, mobile, password } = req.body || {};
  if (![name, email, username, dob, mobile, password].every(
    (value) => typeof value === 'string' && value.trim(),
  )) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (name.length > 20 || email.length > 45 || username.length > 15) {
    return res.status(400).json({ message: 'Name, email, or username is too long' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address' });
  }
  if (!/^[A-Za-z0-9_]{3,15}$/.test(username)) {
    return res.status(400).json({ message: 'Username must be 3-15 letters, numbers, or underscores' });
  }
  if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ message: 'Password must be 12-72 UTF-8 bytes' });
  }
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ message: 'Enter a valid 10-digit mobile number' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO signup (name, email, username, dob, mobile, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING username`,
      [name.trim(), email.trim().toLowerCase(), username.trim(), dob, mobile, passwordHash],
    );
    await establishSession(req, { username: result.rows[0].username });
    return res.status(201).json({
      message: 'Sign-up successful',
      user: { username: result.rows[0].username },
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email or username already exists' });
    }
    return databaseError(res, 'Error during sign-up', err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await db.query(
      'SELECT username, password_hash FROM signup WHERE email = $1',
      [email.trim().toLowerCase()],
    );
    const user = result.rows[0];
    if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    await establishSession(req, { username: user.username });
    return res.status(200).json({
      message: 'Login successful',
      user: { username: user.username },
    });
  } catch (err) {
    return databaseError(res, 'Database error', err);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT name, email, username FROM signup WHERE username = $1',
      [req.session.user.username],
    );
    if (result.rowCount === 0) {
      return req.session.destroy((error) => {
        if (error) {
          return databaseError(res, 'Unable to clear the invalid session', error);
        }
        res.clearCookie('blog.sid', {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        return res.status(401).json({ message: 'Authentication required' });
      });
    }
    return res.json({ user: result.rows[0] });
  } catch (err) {
    return databaseError(res, 'Error fetching current user', err);
  }
};

exports.logout = async (req, res) => {
  if (!req.session) {
    return res.sendStatus(204);
  }
  return req.session.destroy((error) => {
    if (error) {
      return databaseError(res, 'Logout failed', error);
    }
    res.clearCookie('blog.sid', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.sendStatus(204);
  });
};

exports.getUserData = async (req, res) => {
  if (req.params.username !== req.session.user.username) {
    return res.status(403).json({ message: 'You cannot view another user profile' });
  }
  try {
    const result = await db.query(
      'SELECT name, username, email, mobile FROM signup WHERE username = $1',
      [req.params.username],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(result.rows);
  } catch (err) {
    return databaseError(res, 'Error fetching user data', err);
  }
};

exports.getLikeDislikeData = async (req, res) => {
  if (req.params.username !== req.session.user.username) {
    return res.status(403).json({ message: "You cannot view another user's likes" });
  }
  try {
    const result = await db.query(
      `SELECT l.post_id, l.liked
       FROM likes AS l
       JOIN posts AS p ON p.post_id = l.post_id
       WHERE l.username = $1`,
      [req.params.username],
    );
    const data = result.rows.reduce((acc, row) => {
      if (row.liked === 1) {
        acc.likedPosts.push(row.post_id);
      } else {
        acc.dislikedPosts.push(row.post_id);
      }
      return acc;
    }, { likedPosts: [], dislikedPosts: [] });
    return res.json(data);
  } catch (err) {
    return databaseError(res, 'Error fetching like/dislike data', err);
  }
};

exports.createPost = async (req, res) => {
  const { title, content, image, category, tags } = req.body || {};
  const username = req.session.user.username;
  if (typeof title !== 'string' || !title.trim() || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  if (title.trim().length > 45) {
    return res.status(400).json({ message: 'Title must be 45 characters or fewer' });
  }
  const taxonomyError = validatePostTaxonomy(category, tags);
  if (taxonomyError) {
    return res.status(400).json({ message: taxonomyError });
  }

  let client;
  try {
    client = await db.connect();
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO posts (title, content, username, date, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING post_id`,
      [title.trim(), content, username, new Date(), image || null],
    );
    await savePostTaxonomy(client, result.rows[0].post_id, category, tags);
    await queuePostEmbedding(client, result.rows[0].post_id);
    await client.query('COMMIT');
    return res.status(201).json({
      message: 'Post created',
      post_id: result.rows[0].post_id,
    });
  } catch (err) {
    if (client) {
      await rollbackTransaction(client);
    }
    return databaseError(res, 'Failed to create post', err);
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.getPosts = async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const lim = Math.min(50, Math.max(1, Number.parseInt(req.query.lim, 10) || 5));
  const offset = (page - 1) * lim;
  const category = typeof req.query.category === 'string' && req.query.category.trim()
    ? req.query.category.trim()
    : null;
  const tag = typeof req.query.tag === 'string' && req.query.tag.trim()
    ? req.query.tag.trim()
    : null;
  const term = typeof req.query.term === 'string' && req.query.term.trim()
    ? req.query.term.trim()
    : null;

  try {
    const [posts, count] = await Promise.all([
      db.query(
        `SELECT p.*, ${postMetadata}
         FROM posts AS p
         WHERE ${postFilters}
         ORDER BY p.date DESC, p.post_id DESC
         LIMIT $4 OFFSET $5`,
        [category, tag, term, lim, offset],
      ),
      db.query(
        `SELECT COUNT(*) AS total
         FROM posts AS p
         WHERE ${postFilters}`,
        [category, tag, term],
      ),
    ]);
    const total = Number(count.rows[0].total);
    return res.status(200).json({
      posts: posts.rows,
      total,
      page,
      pages: Math.ceil(total / lim),
    });
  } catch (err) {
    return databaseError(res, 'Error fetching posts', err);
  }
};

exports.getPostTaxonomy = async (req, res) => {
  try {
    const [categories, tags] = await Promise.all([
      db.query('SELECT name FROM categories ORDER BY name'),
      db.query('SELECT name FROM tags ORDER BY name'),
    ]);
    return res.json({
      categories: categories.rows.map((row) => row.name),
      tags: tags.rows.map((row) => row.name),
    });
  } catch (err) {
    return databaseError(res, 'Error fetching post categories and tags', err);
  }
};

exports.postComment = async (req, res) => {
  const { post_id, content } = req.body;
  const username = req.session.user.username;
  const createdAt = new Date();
  if (!post_id || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Post ID and comment content are required' });
  }

  try {
    const result = await db.query(
      `INSERT INTO comments (post_id, username, content, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING comment_id`,
      [post_id, username, content, createdAt],
    );
    return res.status(201).json({
      message: 'Comment posted successfully',
      comment_id: result.rows[0].comment_id,
      username,
      timestamp: createdAt.toISOString(),
    });
  } catch (err) {
    return databaseError(res, 'Failed to post comment', err);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM posts WHERE post_id = $1 AND username = $2',
      [req.params.id, req.session.user.username],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return databaseError(res, 'Failed to delete post', err);
  }
};

exports.updatePost = async (req, res) => {
  const { title, content, image, category, tags } = req.body || {};
  if (typeof title !== 'string' || !title.trim() || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  if (title.trim().length > 45) {
    return res.status(400).json({ message: 'Title must be 45 characters or fewer' });
  }
  const taxonomyError = validatePostTaxonomy(category, tags);
  if (taxonomyError) {
    return res.status(400).json({ message: taxonomyError });
  }

  let client;
  try {
    client = await db.connect();
    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE posts SET title = $1, content = $2, image = $3
       WHERE post_id = $4 AND username = $5`,
      [title.trim(), content, image || null, req.params.id, req.session.user.username],
    );
    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Post not found' });
    }
    await savePostTaxonomy(client, req.params.id, category, tags);
    await queuePostEmbedding(client, req.params.id);
    await client.query('COMMIT');
    return res.json({ message: 'Post updated successfully' });
  } catch (err) {
    if (client) {
      await rollbackTransaction(client);
    }
    return databaseError(res, 'Failed to update post', err);
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.getComments = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC',
      [req.params.postId],
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    return databaseError(res, 'Failed to retrieve comments', err);
  }
};

exports.getReplies = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM replies WHERE comment_id = $1 ORDER BY created_at DESC',
      [req.params.commentId],
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    return databaseError(res, 'Failed to retrieve replies', err);
  }
};

exports.postReply = async (req, res) => {
  const { comment_id, content } = req.body;
  const username = req.session.user.username;
  if (!comment_id) {
    return res.status(400).json({ error: 'Comment ID is required' });
  }
  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Reply content is required' });
  }
  const createdAt = new Date();

  try {
    const result = await db.query(
      `INSERT INTO replies (comment_id, username, content, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING reply_id`,
      [comment_id, username, content, createdAt],
    );
    return res.status(201).json({
      message: 'Reply posted successfully',
      reply_id: result.rows[0].reply_id,
      username,
      timestamp: createdAt.toISOString(),
    });
  } catch (err) {
    return databaseError(res, 'Failed to post reply', err);
  }
};

exports.likeDislikePost = async (req, res) => {
  const { liked } = req.body;
  const username = req.session.user.username;
  const likedValue = liked === true || liked === 1 || liked === '1'
    ? 1
    : liked === false || liked === 0 || liked === '0'
      ? 0
      : null;
  if (likedValue === null) {
    return res.status(400).json({ error: 'Liked must be 0 or 1' });
  }

  let client;
  try {
    client = await db.connect();
    await client.query('BEGIN');
    await client.query(
      'DELETE FROM likes WHERE post_id = $1 AND username = $2',
      [req.params.postId, username],
    );
    await client.query(
      'INSERT INTO likes (post_id, username, liked) VALUES ($1, $2, $3)',
      [req.params.postId, username, likedValue],
    );
    await client.query('COMMIT');
    return res.sendStatus(200);
  } catch (err) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Failed to roll back like/dislike transaction:', rollbackError);
      }
    }
    return databaseError(res, 'Failed to save like/dislike', err);
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, ${postMetadata}
       FROM posts AS p
       WHERE p.username = $1
       ORDER BY p.date DESC, p.post_id DESC`,
      [req.session.user.username],
    );
    return res.json(result.rows);
  } catch (err) {
    return databaseError(res, 'Failed to fetch user posts', err);
  }
};

exports.getPostDetails = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, ${postMetadata}
       FROM posts AS p
       WHERE p.post_id = $1`,
      [req.params.postId],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return databaseError(res, 'Error fetching post data', err);
  }
};

exports.getPrevNextPostIds = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         (SELECT post_id FROM posts WHERE post_id < $1 ORDER BY post_id DESC LIMIT 1) AS "prevPostId",
         (SELECT post_id FROM posts WHERE post_id > $1 ORDER BY post_id ASC LIMIT 1) AS "nextPostId"`,
      [req.params.postId],
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return databaseError(res, 'Error fetching previous and next post IDs', err);
  }
};

exports.searchPosts = async (req, res) => {
  const term = typeof req.query.term === 'string' && req.query.term.trim()
    ? req.query.term.trim()
    : null;
  const category = typeof req.query.category === 'string' && req.query.category.trim()
    ? req.query.category.trim()
    : null;
  const tag = typeof req.query.tag === 'string' && req.query.tag.trim()
    ? req.query.tag.trim()
    : null;
  try {
    const result = await db.query(
      `SELECT p.*, ${postMetadata}
       FROM posts AS p
       WHERE ${postFilters}
       ORDER BY p.date DESC, p.post_id DESC`,
      [category, tag, term],
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    return databaseError(res, 'Error searching posts', err);
  }
};

exports.askAssistant = async (req, res) => {
  try {
    const result = await answerQuestion(req.body?.query);
    return res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Blog assistant request failed:', error.message);
    return res.status(502).json({ message: 'The blog assistant is temporarily unavailable.' });
  }
};
