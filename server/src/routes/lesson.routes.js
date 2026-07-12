const router = require('express').Router();
const { createLesson, getLessonsByCourse, getLessonById, updateLesson, deleteLesson, reorderLessons } = require('../controllers/lesson.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById);
router.post('/', protect, authorize('admin', 'superadmin'), createLesson);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateLesson);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteLesson);
router.put('/reorder/:courseId', protect, authorize('admin', 'superadmin'), reorderLessons);

module.exports = router;
