const Review = require('../models/Review');
const Course = require('../models/Course');

exports.createReview = async (req, res) => {
  try {
    const existing = await Review.findOne({ user: req.user._id, course: req.body.course });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed' });

    const review = await Review.create({ ...req.body, user: req.user._id });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviewsByCourse = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId, isApproved: true }).populate('user', 'name avatar');
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });

    if (review) {
      const reviews = await Review.find({ course: review.course, isApproved: true });
      const course = await Course.findById(review.course);
      if (course) {
        course.rating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
        course.totalRatings = reviews.length;
        await course.save({ validateBeforeSave: false });
      }
    }

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false }).populate('user', 'name').populate('course', 'title').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name').populate('course', 'title').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
