const router = require('express').Router();
const { upload, uploadPdf } = require('../config/cloudinary');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage, uploadMultiple, uploadPdf: uploadPdfCtrl, deleteImage } = require('../controllers/upload.controller');

router.post('/', protect, upload.single('image'), uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadMultiple);
router.post('/pdf', protect, uploadPdf.single('pdf'), uploadPdfCtrl);
router.delete('/', protect, deleteImage);

module.exports = router;
