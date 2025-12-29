const Attendance = require('../models/Attendance');

// Faculty marks attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, subject, date, status } = req.body;

    const attendance = await Attendance.create({
      student: studentId,
      subject,
      date,
      status,
      markedBy: req.user._id
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Student views attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user._id });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
