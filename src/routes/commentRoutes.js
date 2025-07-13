const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', commentController.getComments);
router.get('/:id', commentController.getCommentById);
router.post('/', commentController.createComment);
router.post('/admin', commentController.createCommentAdmin);
router.put('/:id', commentController.updateComment);
router.put('/delete/:id', commentController.deleteComment);
router.get('/video/:id_video', commentController.getCommentByVideoId);
router.post('/:commentId/like', commentController.likeComment);
router.put('/:commentId/unlike', commentController.unlikeComment);


module.exports = router;