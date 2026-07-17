const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { uniqueSlug } = require('../utils/helpers');

exports.createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body, instructor: req.user._id };
    courseData.slug = await uniqueSlug(Course, req.body.title);
    const course = await Course.create(courseData);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, level, price, sort, search, featured, all } = req.query;
    const query = all ? {} : { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (price === 'free') query.isFree = true;
    if (price === 'paid') query.isFree = false;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { totalStudents: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };

    const courses = await Course.find(query)
      .populate('category', 'name slug')
      .populate('instructor', 'name avatar')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);
    res.json({ success: true, courses, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate('instructor', 'name avatar email');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const lessons = await Lesson.find({ course: course._id, isPublished: true }).sort('sortOrder');
    res.json({ success: true, course, lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('instructor', 'name avatar email');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const lessons = await Lesson.find({ course: course._id }).sort('sortOrder');
    res.json({ success: true, course, lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    if (req.body.title) req.body.slug = await uniqueSlug(Course, req.body.title);
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Lesson.deleteMany({ course: req.params.id });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const user = req.user;
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }

    user.enrolledCourses.push(course._id);
    await user.save({ validateBeforeSave: false });

    course.totalStudents += 1;
    await course.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const user = req.user;
    const courses = await Course.find({ _id: { $in: user.enrolledCourses } })
      .populate('category', 'name slug')
      .populate('instructor', 'name avatar');
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    course.isFeatured = !course.isFeatured;
    await course.save({ validateBeforeSave: false });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.togglePublished = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    course.isPublished = !course.isPublished;
    await course.save({ validateBeforeSave: false });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
