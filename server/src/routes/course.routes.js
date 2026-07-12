const router = require('express').Router();
const { createCourse, getAllCourses, getCourseBySlug, getCourseById, updateCourse, deleteCourse, enrollInCourse, getMyCourses, toggleFeatured, togglePublished } = require('../controllers/course.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllCourses);
router.get('/my-courses', protect, getMyCourses);
router.get('/:slug', getCourseBySlug);
router.get('/id/:id', protect, getCourseById);
router.post('/', protect, authorize('admin', 'superadmin'), createCourse);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateCourse);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCourse);
router.post('/:id/enroll', protect, enrollInCourse);
router.put('/:id/featured', protect, authorize('admin', 'superadmin'), toggleFeatured);
router.put('/:id/published', protect, authorize('admin', 'superadmin'), togglePublished);

module.exports = router;
