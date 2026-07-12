const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({ ...req.body, user: req.user._id });
    const populated = await comment.populate('user', 'name avatar');
    res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommentsByLesson = async (req, res) => {
  try {
    const comments = await Comment.find({ lesson: req.params.lessonId, parentComment: null, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const replies = await Comment.find({ lesson: req.params.lessonId, parentComment: { $ne: null }, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const commentsWithReplies = comments.map((c) => ({
      ...c.toObject(),
      replies: replies.filter((r) => r.parentComment?.toString() === c._id.toString()),
    }));

    res.json({ success: true, comments: commentsWithReplies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const index = comment.likes.indexOf(req.user._id);
    if (index > -1) {
      comment.likes.splice(index, 1);
    } else {
      comment.likes.push(req.user._id);
    }
    await comment.save({ validateBeforeSave: false });
    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ parentComment: req.params.id });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user', 'name').populate('lesson', 'title').sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleApproval = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    comment.isApproved = !comment.isApproved;
    await comment.save({ validateBeforeSave: false });
    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
