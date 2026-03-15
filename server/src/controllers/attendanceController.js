const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Timetable = require("../models/Timetable");

/* =====================================
   GET STUDENTS FOR TIMETABLE PERIOD
===================================== */
exports.getStudentsForPeriod = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    const students = await User.find({
      role: "student",
      department: timetable.department,
      year: timetable.year,
      section: timetable.section,
    }).select("_id name");

    res.json({
      timetable,
      students,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================
   MARK ATTENDANCE FOR WHOLE PERIOD
===================================== */
exports.markPeriodAttendance = async (req, res) => {
  try {

    const { timetableId, records } = req.body;

    const timetable = await Timetable.findById(timetableId);

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    const today = new Date();
    const dateOnly = new Date(today.setHours(0,0,0,0));

    for (const record of records) {

      await Attendance.findOneAndUpdate(
        {
          student: record.studentId,
          date: dateOnly,
          period: timetable.period,
        },
        {
          student: record.studentId,
          timetable: timetable._id,
          subject: timetable.subject,
          department: timetable.department,
          year: timetable.year,
          section: timetable.section,
          date: dateOnly,
          period: timetable.period,
          status: record.status,
          markedBy: req.user._id,
        },
        { upsert: true }
      );
    }

    res.json({ message: "Attendance saved successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================
   GET LOGGED IN STUDENT'S ATTENDANCE
===================================== */
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ 
      student: req.user._id 
    }).select("subject status date period");

    res.json(records);

  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Error fetching attendance records" });
  }
};