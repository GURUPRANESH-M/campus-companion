const express = require('express');
const router = express.Router();
const {
  createNotice,
  getNotices
} = require('../controllers/noticeController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Create notice
router.post(
  '/notices',
  protect,
  authorize('admin', 'principal', 'hod'),
  createNotice
);

// Get notices
router.get(
  '/notices',
  protect,
  getNotices
);

module.exports = router;
