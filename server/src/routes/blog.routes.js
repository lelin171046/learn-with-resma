const router = require('express').Router();
const { createBlog, getAllBlogs, getBlogBySlug, updateBlog, deleteBlog, togglePublished, getAllBlogsAdmin } = require('../controllers/blog.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllBlogs);
router.get('/admin', protect, authorize('admin', 'superadmin'), getAllBlogsAdmin);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, authorize('admin', 'superadmin'), createBlog);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateBlog);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteBlog);
router.put('/:id/published', protect, authorize('admin', 'superadmin'), togglePublished);

module.exports = router;
