const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    files: [
      {
        originalName: String,
        url: String,
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'submitted', 'reviewed', 'approved', 'rejected'],
      default: 'pending',
    },
    marks: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 100 },
    feedback: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
  },
  { timestamps: true }
);

assignmentSchema.index({ student: 1 });
assignmentSchema.index({ course: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
