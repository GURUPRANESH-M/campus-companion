const Feedback = require("../models/Feedback");

/* ================= STUDENT ================= */
exports.submitFeedback = async (req, res) => {
  try {
    const { faculty, subject, rating, comment } = req.body;

    const feedback = await Feedback.create({
      student: req.user._id,
      faculty,
      subject,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= FACULTY ================= */
exports.getFacultyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      faculty: req.user._id,
    }).populate("student", "name");

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
