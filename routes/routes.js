const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// User-related routes
router.post('/users/signup', controller.saveFormData);
router.post('/users/login', controller.login);
router.get('/users/:username', controller.getUserData);
router.get('/users/:username/likes', controller.getLikeDislikeData);

// Post-related routes
router.post('/posts/newpost', controller.createPost);
router.get('/posts', controller.getPosts);
router.post('/posts/post-comment', controller.postComment);
router.delete('/posts/:id', controller.deletePost);
router.put('/posts/:id', controller.updatePost);
router.get('/posts/:postId/comments', controller.getComments);
router.get('/comments/:commentId/replies', controller.getReplies);
router.post('/reply', controller.postReply);
router.post('/posts/:postId/like', controller.likeDislikePost);
router.get('/posts/user', controller.getUserPosts);
router.get('/posts/:postId', controller.getPostDetails);
router.get('/posts/:postId/prevnext', controller.getPrevNextPostIds);
router.get('/search', controller.searchPosts);


module.exports = router;

