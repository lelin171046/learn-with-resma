const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const paidCourses = await Course.countDocuments({ isFree: false });
    const freeCourses = await Course.countDocuments({ isFree: true });

    const revenueData = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const revenue = revenueData[0]?.total || 0;

    const monthlyEnrollments = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      {
        $lookup: {
          from: 'courses',
          localField: 'enrolledCourses',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
      {
        $group: {
          _id: { $month: '$course.createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const completionRate = await Progress.aggregate([
      { $group: { _id: '$isCompleted', count: { $sum: 1 } } },
    ]);

    const popularCourses = await Course.find({ isPublished: true })
      .select('title totalStudents rating')
      .sort({ totalStudents: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalCourses,
        paidCourses,
        freeCourses,
        revenue,
        monthlyEnrollments,
        completionRate,
        popularCourses,
        recentUsers,
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentStats = async (req, res) => {
  try {
    const enrolledCourses = req.user.enrolledCourses.length;

    const completedProgress = await Progress.countDocuments({ user: req.user._id, isCompleted: true });

    const quizzesAttempted = await Progress.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: '$quizResults' },
      { $count: 'total' },
    ]);

    const certificates = await Certificate.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      stats: {
        enrolledCourses,
        completedCourses: completedProgress,
        quizzesAttempted: quizzesAttempted[0]?.total || 0,
        certificates,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
