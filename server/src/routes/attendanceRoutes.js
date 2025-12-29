const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance
} = require('../controllers/attendanceController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Faculty marks attendance
router.post('/', protect, authorize('faculty'), markAttendance);

// Student views own attendance
router.get('/my', protect, authorize('student'), getMyAttendance);

module.exports = router;
