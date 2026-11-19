const db = require('../db');

// User-related controllers
exports.saveFormData = async (req, res) => {
  const { name, email, username, dob, mobile } = req.body;

  db.executeStoredProcedure('CheckEmail', [email], async (err, results) => {
      if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
      }
      
      const emailCount = results[0][0].email_count;
      if (emailCount > 0) {
      return res.status(409).json({ message: 'Email already exists' });
      }

      db.executeStoredProcedure('InsertUser', [name, email, username, dob, mobile], (err, result) => {
      if (err) {
          console.error('Error during signup', err);
          return res.status(500).json({ message: 'Error during sign-up' });
      }
      return res.status(201).json({ message: 'Sign-up successful' });
      });
  });
};

exports.login = async (req, res) => {

  const { email } = req.body;
      db.executeStoredProcedure('ValidateUser', [email], async (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ message: 'Database error' });
      }
  
      const emailResults = results[0];
  
      if (emailResults.length === 0) {
          return res.status(401).json({ message: 'Invalid email' });
      }
      const user = emailResults[0];
      return res.status(200).json({ message: 'Login successful', username: user.username });
  });
};


exports.getUserData = (req, res) => {
    const username = req.params.username;
  
    db.executeStoredProcedure('FetchUserData', [username], (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const userData = results[0];
      res.json(userData);
    });
};

exports.getLikeDislikeData = (req, res) => {
    const username = req.params.username;
  
    db.executeStoredProcedure('FetchLikes', [username], (err, results) => {
      if (err) {
        console.error(`Error fetching like/dislike data for user ${username}:`, err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      const likeDislikeData = results[0].reduce((acc, row) => {
        const { post_id: postId, liked } = row;
        if (liked === 1) {
          acc.likedPosts.push(postId);
        } else {
          acc.dislikedPosts.push(postId);
        }
        return acc;
      }, { likedPosts: [], dislikedPosts: [] });
  
      res.json(likeDislikeData);
    });
};


// Post-related controllers
exports.createPost = (req, res) => {
    const { title, content, username, image } = req.body;
    const date = new Date();  
  
    db.executeStoredProcedure('NewPost', [title, content, username, date, image], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create post', details: err});
      }else{
      const post_id = result[0]?.[0]?.insertId;  
      return res.status(201).json({ message: 'Post created', post_id });
      }
    });
};

exports.getPosts = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const lim = parseInt(req.query.lim) || 5;
  
    db.executeStoredProcedure('FetchPosts', [page, lim], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Error fetching data' });
      } else {
        const posts = results[0];
        const total = results[1][0].total;
        res.status(200).json({
          posts,
          total,
          page,
          pages: Math.ceil(total / lim),
        });
      }
    });
};

exports.postComment = (req, res) => {
  const { post_id, content, username } = req.body;
  const created_at = new Date();

  db.executeStoredProcedure('InsertComment', [post_id, username, content, created_at], (err, result) => {
    if(err){
      console.error('Error posting comments:', err);
      return res.status(500).json({ error: 'Failed to post commment', details: err});
    }

    const comment_id = result[0]?.[0]?.insertId;
    return res.status(201).json({
        mesage: 'Comment posted successfully', 
        comment_id,
        username,
        timestamp: created_at.toISOString()});
  });
}

exports.deletePost = (req, res) => {
    const postId = req.params.id;

    db.executeStoredProcedure('DeletePostById', [postId], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(204).send(); 
    });
};

exports.updatePost = (req, res) => {
    const postId = req.params.id;
    const { title, content, image } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    db.executeStoredProcedure('UpdatePostById', [title, content, image, postId], (err, results) => {
      if (err) {
        console.error('Error updating post:', err);
        return res.status(500).json({ error: 'Failed to update post' });
      }
  
      if (results.affectedRows > 0) {
        res.json({ message: 'Post updated successfully' });
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    });
};

exports.getComments = (req, res) => {
    const post_id = req.params.postId; 

    db.executeStoredProcedure('GetComments', [post_id], (err, results) => {    
    if (err) {      
      console.error('Error fetching comments:', err);      
      return res.status(500).json({ error: 'Failed to retrieve comments', details: err });    
    }
      return res.status(200).json(results[0]);  
    });
};

exports.getReplies = (req, res) => {
    const comment_id = req.params.commentId;  

    db.executeStoredProcedure('GetReplies', [comment_id], (err, results) => {    
    if (err) {      
      console.error('Error fetching replies:', err);      
      return res.status(500).json({ error: 'Failed to retrieve replies', details: err });    
    }
      return res.status(200).json(results[0]);  
    });
};

exports.postReply = (req, res) => {
    const { comment_id, content, username } = req.body;
    const created_at = new Date();

    if (!comment_id) {
      return res.status(400).json({ error: 'Comment ID is required' });
    }  
  
    db.executeStoredProcedure('InsertReply', [comment_id, username, content, created_at], (err, result) => {
      if (err) {
        console.error('Error posting reply:', err);
        return res.status(500).json({ error: 'Failed to post reply', details: err });
      }
  
      const reply_id = result[0]?.[0]?.insertId;
      return res.status(201).json({
        message: 'Reply posted successfully',
        reply_id,
        username,
        timestamp: created_at.toISOString()
      });
    });
};

exports.likeDislikePost = async (req, res) => {
    const { postId } = req.params;
    const { username, liked } = req.body;
  
    try {
      db.executeStoredProcedure('DeleteLikes', [postId, username]);
  
      db.executeStoredProcedure('InsertLikes', [postId, username, liked]);
  
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
};

exports.getUserPosts = (req, res) => {
    const username = req.query.username;

    db.executeStoredProcedure('FetchPostsByUsername', [username], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results[0]);
    });
};

exports.getPostDetails = (req, res) => {
    const postId = req.params.postId;
    db.executeStoredProcedure('FetchPostById', [postId], (err, results) => {
      if (err) {
        console.error(`Error fetching post data for post ID ${postId}:`, err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
  
      const postData = results[0][0];
      res.json(postData);
    });
};

exports.getPrevNextPostIds = (req, res) => {
  const postId = req.params.postId;

  db.executeStoredProcedure('GetPrevNextPostIds', [postId], (err, results) => {
    if (err) {
      console.error('Error fetching previous and next post IDs:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const { prevPostId, nextPostId } = results[0][0];
    res.json({ prevPostId, nextPostId });
  });
};

exports.searchPosts = (req, res) => {
    const searchTerm =req.query.term;

    db.executeStoredProcedure('SearchTitle', [searchTerm], (err,results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Error fetching data' });
      } else {
        const searchResults = results[0];
        res.status(200).json(results[0]); 
      }
});
};


