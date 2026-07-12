const router = require('express').Router();
const { getAdminStats, getStudentStats } = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin', protect, authorize('admin', 'superadmin'), getAdminStats);
router.get('/student', protect, getStudentStats);

module.exports = router;
