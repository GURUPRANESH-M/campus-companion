const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

router.get('/student', protect, authorize('student'), (req, res) => {
  res.json({ message: 'Student access granted' });
});

module.exports = router;
