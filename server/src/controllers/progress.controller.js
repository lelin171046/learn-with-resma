const Progress = require('../models/Progress');
const WatchHistory = require('../models/WatchHistory');
const Lesson = require('../models/Lesson');

exports.getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id, course: req.params.courseId });
    if (!progress) {
      progress = await Progress.create({ user: req.user._id, course: req.params.courseId });
    }
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    let progress = await Progress.findOne({ user: req.user._id, course: courseId });
    if (!progress) progress = await Progress.create({ user: req.user._id, course: courseId });

    if (!progress.completedLessons.some((id) => id.toString() === lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    const totalLessons = await Lesson.countDocuments({ course: courseId, isPublished: true });
    progress.progressPercentage = Math.round((progress.completedLessons.length / (totalLessons || 1)) * 100);

    if (progress.progressPercentage === 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = Date.now();
    }

    progress.lastActivity = Date.now();
    await progress.save({ validateBeforeSave: false });

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveWatchHistory = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { watchedDuration, totalDuration } = req.body;

    const isCompleted = watchedDuration >= totalDuration * 0.9;

    const history = await WatchHistory.findOneAndUpdate(
      { user: req.user._id, lesson: lessonId },
      { course: courseId, watchedDuration, totalDuration, isCompleted, lastWatched: Date.now() },
      { new: true, upsert: true }
    );

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWatchHistory = async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id })
      .populate('course', 'title thumbnail')
      .populate('lesson', 'title')
      .sort({ lastWatched: -1 })
      .limit(50);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompletedCourses = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id, isCompleted: true })
      .populate('course', 'title thumbnail instructor')
      .sort({ completedAt: -1 });
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
