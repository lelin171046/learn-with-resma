const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', protect, authorize('admin', 'superadmin'), updateSettings);

module.exports = router;
