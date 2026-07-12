const { createCheckoutSession: createStripeSession } = require('../services/payment.service');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');
const { generateInvoiceNumber } = require('../utils/helpers');

exports.createCheckoutSession = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.isFree) return res.status(400).json({ success: false, message: 'Invalid course' });

    const successUrl = `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.CLIENT_URL}/course/${course.slug}`;

    const session = await createStripeSession(course, req.user, successUrl, cancelUrl);

    await Payment.create({
      user: req.user._id,
      course: course._id,
      amount: course.price,
      stripeSessionId: session.id,
      status: 'pending',
    });

    res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ stripeSessionId: req.query.session_id });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    payment.status = 'completed';
    payment.invoiceNumber = generateInvoiceNumber();
    await payment.save({ validateBeforeSave: false });

    const user = await User.findById(payment.user);
    if (!user.enrolledCourses.includes(payment.course)) {
      user.enrolledCourses.push(payment.course);
      await user.save({ validateBeforeSave: false });
    }

    await Course.findByIdAndUpdate(payment.course, { $inc: { totalStudents: 1 } });

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate('course', 'title thumbnail').sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').populate('course', 'title').sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentStats = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({ success: true, totalRevenue: totalRevenue[0]?.total || 0, monthlyRevenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
