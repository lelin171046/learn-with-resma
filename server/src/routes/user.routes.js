const router = require('express').Router();
const { getAllUsers, getUserById, updateUserRole, toggleUserActive, deleteUser, getEnrolledStudents, addToWishlist } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'superadmin'), getAllUsers);
router.get('/course/:courseId/students', protect, authorize('admin'), getEnrolledStudents);
router.put('/wishlist/:courseId', protect, addToWishlist);
router.get('/:id', protect, getUserById);
router.put('/:id/role', protect, authorize('superadmin'), updateUserRole);
router.put('/:id/toggle-active', protect, authorize('admin', 'superadmin'), toggleUserActive);
router.delete('/:id', protect, authorize('superadmin'), deleteUser);

module.exports = router;
