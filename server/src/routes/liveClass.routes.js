const router = require('express').Router();
const { createLiveClass, getAllLiveClasses, getLiveClassById, enrollInLiveClass, updateLiveClass, deleteLiveClass } = require('../controllers/liveClass.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllLiveClasses);
router.get('/:id', getLiveClassById);
router.post('/', protect, authorize('admin', 'superadmin'), createLiveClass);
router.post('/:id/enroll', protect, enrollInLiveClass);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateLiveClass);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteLiveClass);

module.exports = router;
