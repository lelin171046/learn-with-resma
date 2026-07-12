const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['lesson', 'grammar', 'vocabulary', 'listening', 'writing', 'ielts', 'pronunciation'],
      default: 'lesson',
    },
    questions: [questionSchema],
    passingScore: { type: Number, default: 80 },
    timeLimit: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

quizSchema.index({ course: 1 });
quizSchema.index({ lesson: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
