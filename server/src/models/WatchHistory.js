const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    watchedDuration: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    lastWatched: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

watchHistorySchema.index({ user: 1, course: 1 });
watchHistorySchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
