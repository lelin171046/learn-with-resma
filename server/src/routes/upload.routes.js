const router = require('express').Router();
const { upload } = require('../config/cloudinary');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage, uploadMultiple, deleteImage } = require('../controllers/upload.controller');

router.post('/', protect, upload.single('image'), uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadMultiple);
router.delete('/', protect, deleteImage);

module.exports = router;
