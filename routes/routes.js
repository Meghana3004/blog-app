const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload');

router.post('/users/signup', controller.saveFormData);
router.post('/users/login', controller.login);
router.post('/users/logout', controller.logout);
router.get('/users/me', requireAuth, controller.getCurrentUser);

router.use(requireAuth);

// User-related routes
router.get('/users/:username', controller.getUserData);
router.get('/users/:username/likes', controller.getLikeDislikeData);
router.post('/assistant/ask', controller.askAssistant);

// Post-related routes
router.post('/uploads', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Select an image to upload' });
  }
  return res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});
router.get('/posts/taxonomy', controller.getPostTaxonomy);
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

