const router = require('express').Router();
const { sendVerificationEmail, verifyEmail } = require('../controllers/emailVerification.controller');
const { protect } = require('../middleware/auth');

router.post('/send-verification', protect, sendVerificationEmail);
router.get('/verify/:token', verifyEmail);

module.exports = router;
