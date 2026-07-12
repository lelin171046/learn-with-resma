const router = require('express').Router();
const { getProgress, markLessonComplete, saveWatchHistory, getWatchHistory, getCompletedCourses } = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth');

router.get('/:courseId', protect, getProgress);
router.put('/:courseId/lesson/:lessonId/complete', protect, markLessonComplete);
router.put('/:courseId/lesson/:lessonId/watch', protect, saveWatchHistory);
router.get('/history/watch', protect, getWatchHistory);
router.get('/courses/completed', protect, getCompletedCourses);

module.exports = router;
