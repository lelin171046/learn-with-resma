const router = require('express').Router();
const { createAssignment, getMyAssignments, getAssignmentsByCourse, updateAssignmentStatus, deleteAssignment, getAllAssignments } = require('../controllers/assignment.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createAssignment);
router.get('/my', protect, getMyAssignments);
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.get('/all', protect, authorize('admin', 'superadmin'), getAllAssignments);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateAssignmentStatus);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteAssignment);

module.exports = router;
