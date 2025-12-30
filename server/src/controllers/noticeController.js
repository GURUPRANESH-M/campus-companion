const Notice = require("../models/Notice");

/* ================= POST NOTICE ================= */
exports.createNotice = async (req, res) => {
  try {
    const { title, content, priority, targetRole } = req.body;

    const notice = await Notice.create({
      title,
      content,
      priority,
      targetRole,
      postedBy: req.user._id,
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET NOTICES ================= */
exports.getNotices = async (req, res) => {
  try {
    const role = req.user.role;

    const notices = await Notice.find({
      $or: [{ targetRole: "all" }, { targetRole: role }],
    })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name role");

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
