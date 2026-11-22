const db = require('../db');

const databaseError = (res, message, err) => {
  console.error(message, err);
  return res.status(500).json({ error: message });
};

exports.saveFormData = async (req, res) => {
  const { name, email, username, dob, mobile } = req.body;

  try {
    const existingEmail = await db.query(
      'SELECT 1 FROM signup WHERE email = $1',
      [email],
    );
    if (existingEmail.rowCount > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    await db.query(
      `INSERT INTO signup (name, email, username, dob, mobile)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, username, dob, mobile],
    );
    return res.status(201).json({ message: 'Sign-up successful' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email or username already exists' });
    }
    return databaseError(res, 'Error during sign-up', err);
  }
};

exports.login = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT username FROM signup WHERE email = $1',
      [req.body.email],
    );
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    return res.status(200).json({
      message: 'Login successful',
      username: result.rows[0].username,
    });
  } catch (err) {
    return databaseError(res, 'Database error', err);
  }
};

exports.getUserData = async (req, res) => {
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
  const { title, content, username, image } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO posts (title, content, username, date, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING post_id`,
      [title, content, username, new Date(), image],
    );
    return res.status(201).json({
      message: 'Post created',
      post_id: result.rows[0].post_id,
    });
  } catch (err) {
    return databaseError(res, 'Failed to create post', err);
  }
};

exports.getPosts = async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const lim = Math.max(1, Number.parseInt(req.query.lim, 10) || 5);
  const offset = (page - 1) * lim;

  try {
    const [posts, count] = await Promise.all([
      db.query(
        'SELECT * FROM posts ORDER BY date DESC LIMIT $1 OFFSET $2',
        [lim, offset],
      ),
      db.query('SELECT COUNT(*) AS total FROM posts'),
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

exports.postComment = async (req, res) => {
  const { post_id, content, username } = req.body;
  const createdAt = new Date();

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
    await db.query('DELETE FROM posts WHERE post_id = $1', [req.params.id]);
    return res.status(204).send();
  } catch (err) {
    return databaseError(res, 'Failed to delete post', err);
  }
};

exports.updatePost = async (req, res) => {
  const { title, content, image } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const result = await db.query(
      `UPDATE posts SET title = $1, content = $2, image = $3
       WHERE post_id = $4`,
      [title, content, image, req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json({ message: 'Post updated successfully' });
  } catch (err) {
    return databaseError(res, 'Failed to update post', err);
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
  const { comment_id, content, username } = req.body;
  if (!comment_id) {
    return res.status(400).json({ error: 'Comment ID is required' });
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
  const { username, liked } = req.body;
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
      'SELECT * FROM posts WHERE username = $1',
      [req.query.username],
    );
    return res.json(result.rows);
  } catch (err) {
    return databaseError(res, 'Failed to fetch user posts', err);
  }
};

exports.getPostDetails = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM posts WHERE post_id = $1',
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
  try {
    const result = await db.query(
      'SELECT * FROM posts WHERE title ILIKE $1',
      [`%${req.query.term || ''}%`],
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    return databaseError(res, 'Error searching posts', err);
  }
};
