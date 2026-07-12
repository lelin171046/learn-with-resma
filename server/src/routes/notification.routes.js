const router = require('express').Router();
const { createNotification, getMyNotifications, markAsRead, markAllRead, deleteNotification } = require('../controllers/notification.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'superadmin'), createNotification);
router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
