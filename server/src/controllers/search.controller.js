const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Lesson = require('../models/Lesson');

exports.globalSearch = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.json({ success: true, results: {} });

    const results = {};

    if (!type || type === 'course') {
      results.courses = await Course.find({ $text: { $search: q }, isPublished: true })
        .select('title slug thumbnail level price isFree')
        .limit(10);
    }

    if (!type || type === 'category') {
      results.categories = await Category.find({ name: { $regex: q, $options: 'i' }, isActive: true }).limit(10);
    }

    if (!type || type === 'blog') {
      results.blogs = await Blog.find({ $text: { $search: q }, isPublished: true })
        .select('title slug thumbnail excerpt')
        .limit(10);
    }

    if (!type || type === 'lesson') {
      results.lessons = await Lesson.find({ title: { $regex: q, $options: 'i' }, isPublished: true })
        .select('title course')
        .populate('course', 'title slug')
        .limit(10);
    }

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
