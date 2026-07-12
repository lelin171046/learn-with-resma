const router = require('express').Router();
const { generateCertificate, getMyCertificates, verifyCertificate, getAllCertificates } = require('../controllers/certificate.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/generate/:courseId', protect, generateCertificate);
router.get('/my', protect, getMyCertificates);
router.get('/verify/:certificateId', verifyCertificate);
router.get('/', protect, authorize('admin', 'superadmin'), getAllCertificates);

module.exports = router;
