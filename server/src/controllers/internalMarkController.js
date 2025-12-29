const InternalMark = require("../models/InternalMark");

/* FACULTY: add marks */
exports.addInternalMarks = async (req, res) => {
  try {
    const { student, subject, examType, score, maxScore } = req.body;

    const record = await InternalMark.create({
      student,
      subject,
      examType,
      score,
      maxScore,
      enteredBy: req.user._id,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* STUDENT: view own marks */
exports.getMyMarks = async (req, res) => {
  try {
    const records = await InternalMark.find({
      student: req.user._id,
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
