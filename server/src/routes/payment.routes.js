const router = require('express').Router();
const { createCheckoutSession, confirmPayment, getMyPayments, getAllPayments, getPaymentStats } = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/checkout/:courseId', protect, createCheckoutSession);
router.get('/confirm', protect, confirmPayment);
router.get('/my', protect, getMyPayments);
router.get('/stats', protect, authorize('admin', 'superadmin'), getPaymentStats);
router.get('/', protect, authorize('admin', 'superadmin'), getAllPayments);

module.exports = router;
