const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    videoType: { type: String, enum: ['youtube', 'upload'], default: 'youtube' },
    duration: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    pdfNotes: [
      {
        title: String,
        url: String,
      },
    ],
    resources: [
      {
        title: String,
        url: String,
      },
    ],
    hasQuiz: { type: Boolean, default: true },
  },
  { timestamps: true }
);

lessonSchema.index({ course: 1 });
lessonSchema.index({ course: 1, sortOrder: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
