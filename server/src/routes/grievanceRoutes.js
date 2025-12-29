const express = require('express');
const router = express.Router();
const {
  createGrievance,
  getMyGrievances,
  getAllGrievances,
  updateGrievanceStatus
} = require('../controllers/grievanceController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Student routes
router.post('/', protect, authorize('student'), createGrievance);
router.get('/my', protect, authorize('student'), getMyGrievances);

// Admin/HOD routes
router.get('/', protect, authorize('admin', 'hod'), getAllGrievances);
router.put('/:id', protect, authorize('admin', 'hod'), updateGrievanceStatus);

module.exports = router;
