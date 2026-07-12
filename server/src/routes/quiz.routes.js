const router = require('express').Router();
const { createQuiz, getQuizById, getQuizzesByCourse, getQuizByLesson, submitQuiz, updateQuiz, deleteQuiz, getAllQuizzes } = require('../controllers/quiz.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'superadmin'), getAllQuizzes);
router.get('/course/:courseId', getQuizzesByCourse);
router.get('/lesson/:lessonId', getQuizByLesson);
router.get('/:id', getQuizById);
router.post('/', protect, authorize('admin', 'superadmin'), createQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateQuiz);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteQuiz);

module.exports = router;
