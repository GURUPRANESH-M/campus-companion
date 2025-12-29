const Notice = require('../models/Notice');

// Create notice (Admin / Principal / HOD)
exports.createNotice = async (req, res) => {
  try {
    const { title, message, visibleTo } = req.body;

    const notice = await Notice.create({
      title,
      message,
      visibleTo,
      createdBy: req.user._id
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get notices for logged-in user
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({
      visibleTo: req.user.role
    }).sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
