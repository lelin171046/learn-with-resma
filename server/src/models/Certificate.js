const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    certificateId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    completionDate: { type: Date, default: Date.now },
    qrCode: { type: String, default: '' },
    instructorSignature: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1 });
certificateSchema.index({ certificateId: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
