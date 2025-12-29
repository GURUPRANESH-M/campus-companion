const Feedback = require("../models/Feedback");

/* Student submits feedback */
exports.submitFeedback = async (req, res) => {
  const { faculty, subject, rating, comment } = req.body;

  const feedback = await Feedback.create({
    student: req.user._id,
    faculty,
    subject,
    rating,
    comment,
  });

  res.status(201).json(feedback);
};

/* Faculty views feedback */
exports.getFacultyFeedback = async (req, res) => {
  const feedback = await Feedback.find({ faculty: req.user._id });
  res.json(feedback);
};
