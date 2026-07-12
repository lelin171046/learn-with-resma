const LiveClass = require('../models/LiveClass');
const Notification = require('../models/Notification');

exports.createLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.create({ ...req.body, instructor: req.user._id });
    res.status(201).json({ success: true, liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllLiveClasses = async (req, res) => {
  try {
    const { upcoming } = req.query;
    const query = {};
    if (upcoming === 'true') {
      query.scheduledAt = { $gte: new Date() };
      query.isCompleted = false;
    }
    const liveClasses = await LiveClass.find(query).populate('instructor', 'name avatar').populate('course', 'title').sort({ scheduledAt: -1 });
    res.json({ success: true, liveClasses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLiveClassById = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id).populate('instructor', 'name avatar').populate('course', 'title');
    res.json({ success: true, liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.enrollInLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (liveClass.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }
    liveClass.enrolledStudents.push(req.user._id);
    await liveClass.save({ validateBeforeSave: false });

    await Notification.create({
      user: req.user._id,
      title: 'Live Class Enrollment',
      message: `You are enrolled in "${liveClass.title}"`,
      type: 'live_class',
      link: `/live-class/${liveClass._id}`,
    });

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, liveClass });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLiveClass = async (req, res) => {
  try {
    await LiveClass.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Live class deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
