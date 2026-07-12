const Certificate = require('../models/Certificate');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { generateCertificateId } = require('../utils/helpers');
const { generateQR } = require('../services/certificate.service');

exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const progress = await Progress.findOne({ user: req.user._id, course: courseId, isCompleted: true });

    if (!progress) return res.status(400).json({ success: false, message: 'Course not completed yet' });

    const existing = await Certificate.findOne({ user: req.user._id, course: courseId });
    if (existing) return res.json({ success: true, certificate: existing });

    const course = await Course.findById(courseId);
    const certificateId = generateCertificateId();
    const verificationUrl = `${process.env.CLIENT_URL}/verify-certificate/${certificateId}`;
    const qrCode = await generateQR(verificationUrl);

    const certificate = await Certificate.create({
      user: req.user._id,
      course: courseId,
      certificateId,
      studentName: req.user.name,
      courseName: course.title,
      completionDate: Date.now(),
      qrCode,
      instructorSignature: course.instructor?.toString() || '',
    });

    res.status(201).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id }).populate('course', 'title thumbnail');
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('user', 'name email')
      .populate('course', 'title');

    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
