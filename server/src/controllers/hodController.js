const User = require("../models/User");
const Attendance = require("../models/Attendance");
const InternalMark = require("../models/InternalMark");
const Grievance = require("../models/Grievance");

exports.getDepartmentFaculty = async (req, res) => {
    try {
      const faculty = await User.find({
        role: "faculty",
        department: req.user.department,
      }).select("name email department");
  
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


exports.getHODDashboard = async (req, res) => {
  try {
    const department = req.user.department;

    // Students & Faculty
    const totalStudents = await User.countDocuments({
      role: "student",
      department,
    });

    const totalFaculty = await User.countDocuments({
      role: "faculty",
      department,
    });

    // Attendance %
    const attendanceStats = await Attendance.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      { $match: { "student.department": department } },
      {
        $group: {
          _id: null,
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },
          total: { $sum: 1 },
        },
      },
    ]);

    const avgAttendance =
      attendanceStats.length > 0
        ? Math.round(
            (attendanceStats[0].present / attendanceStats[0].total) * 100
          )
        : 0;

    // Internal Marks %
    const marksStats = await InternalMark.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      { $match: { "student.department": department } },
      {
        $group: {
          _id: null,
          obtained: { $sum: "$score" },
          max: { $sum: "$maxScore" },
        },
      },
    ]);

    const avgMarks =
      marksStats.length > 0
        ? Math.round((marksStats[0].obtained / marksStats[0].max) * 100)
        : 0;

    // Pending Grievances
    const pendingGrievances = await Grievance.countDocuments({
      department,
      status: { $ne: "resolved" },
    });

    res.json({
      totalStudents,
      totalFaculty,
      avgAttendance,
      avgMarks,
      pendingGrievances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentPerformance = async (req, res) => {
    try {
      const department = req.user.department;
  
      // Get students of department
      const students = await User.find({
        role: "student",
        department,
      }).select("_id name regNo");
  
      const performance = [];
  
      for (const student of students) {
        // Attendance %
        const attendance = await Attendance.aggregate([
          { $match: { student: student._id } },
          {
            $group: {
              _id: null,
              present: {
                $sum: {
                  $cond: [{ $eq: ["$status", "present"] }, 1, 0],
                },
              },
              total: { $sum: 1 },
            },
          },
        ]);
  
        const attendancePct =
          attendance.length > 0
            ? Math.round(
                (attendance[0].present / attendance[0].total) * 100
              )
            : 0;
  
        // Marks %
        const marks = await InternalMark.aggregate([
          { $match: { student: student._id } },
          {
            $group: {
              _id: null,
              obtained: { $sum: "$score" },
              max: { $sum: "$maxScore" },
            },
          },
        ]);
  
        const marksPct =
          marks.length > 0
            ? Math.round((marks[0].obtained / marks[0].max) * 100)
            : 0;
  
        // Risk logic
        let status = "Safe";
        if (attendancePct < 75 || marksPct < 50) status = "Warning";
        if (attendancePct < 60 || marksPct < 40) status = "Critical";
  
        performance.push({
          id: student._id,
          name: student.name,
          regNo: student.regNo,
          attendance: attendancePct,
          marks: marksPct,
          status,
        });
      }
  
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  