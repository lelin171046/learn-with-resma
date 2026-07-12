const Blog = require('../models/Blog');
const { uniqueSlug } = require('../utils/helpers');

exports.createBlog = async (req, res) => {
  try {
    const blogData = { ...req.body, author: req.user._id };
    blogData.slug = await uniqueSlug(Blog, req.body.title);
    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, tag } = req.query;
    const query = { isPublished: true };
    if (search) query.$text = { $search: search };
    if (tag) query.tags = tag;

    const blogs = await Blog.find(query).populate('author', 'name avatar').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await Blog.countDocuments(query);

    res.json({ success: true, blogs, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name avatar');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    if (req.body.title) req.body.slug = await uniqueSlug(Blog, req.body.title);
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.togglePublished = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    blog.isPublished = !blog.isPublished;
    await blog.save({ validateBeforeSave: false });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
