const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meetingPlatform: { type: String, enum: ['zoom', 'meet'], default: 'meet' },
    meetingLink: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    maxStudents: { type: Number, default: 100 },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isLive: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    recording: { type: String, default: '' },
  },
  { timestamps: true }
);

liveClassSchema.index({ scheduledAt: 1 });
liveClassSchema.index({ instructor: 1 });

module.exports = mongoose.model('LiveClass', liveClassSchema);
