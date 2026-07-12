const router = require('express').Router();
const { createReview, getReviewsByCourse, approveReview, deleteReview, getPendingReviews, getAllReviews } = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/course/:courseId', getReviewsByCourse);
router.post('/', protect, createReview);
router.get('/pending', protect, authorize('admin', 'superadmin'), getPendingReviews);
router.get('/', protect, authorize('admin', 'superadmin'), getAllReviews);
router.put('/:id/approve', protect, authorize('admin', 'superadmin'), approveReview);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteReview);

module.exports = router;
