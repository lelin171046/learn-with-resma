const router = require('express').Router();
const { createComment, getCommentsByLesson, toggleLike, deleteComment, getAllComments, toggleApproval } = require('../controllers/comment.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/lesson/:lessonId', getCommentsByLesson);
router.post('/', protect, createComment);
router.put('/:id/like', protect, toggleLike);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteComment);
router.get('/admin', protect, authorize('admin', 'superadmin'), getAllComments);
router.put('/:id/approve', protect, authorize('admin', 'superadmin'), toggleApproval);

module.exports = router;
