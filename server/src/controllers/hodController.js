const User = require("../models/User");
const Attendance = require("../models/Attendance");
const InternalMark = require("../models/InternalMark");
const Grievance = require("../models/Grievance");
const Timetable = require("../models/Timetable");

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

exports.createWeeklyTimetable = async (req, res) => {
  try {

    const { department, year, section, weekSchedule } = req.body;

    if (!department || !year || !section || !weekSchedule) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure HOD can only manage their department
    if (req.user.department !== department) {
      return res.status(403).json({ message: "Unauthorized department access" });
    }

    // Remove existing timetable for this class
    await Timetable.deleteMany({ department, year, section });

    const timetableEntries = [];

    for (const dayData of weekSchedule) {

      const { day, periods } = dayData;

      for (const periodData of periods) {

        const { period, subject, faculty } = periodData;

        // Validate faculty belongs to same department
        const facultyUser = await User.findById(faculty);

        if (!facultyUser || facultyUser.department !== department) {
          return res.status(400).json({
            message: `Invalid faculty for ${day} period ${period}`
          });
        }

        timetableEntries.push({
          department,
          year,
          section,
          day,
          period,
          subject,
          faculty
        });
      }
    }

    await Timetable.insertMany(timetableEntries);

    res.status(201).json({
      message: "Weekly timetable created successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating timetable" });
  }
};

exports.createFacultyTimetable = async (req, res) => {
  try {
    const { facultyId, weekSchedule } = req.body;
    const department = req.user.department;

    if (!facultyId || !weekSchedule) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify faculty belongs to the same department
    const facultyUser = await User.findById(facultyId);
    if (!facultyUser || facultyUser.department !== department) {
      return res.status(403).json({ message: "Invalid or unauthorized faculty" });
    }

    // Remove existing timetable entries for this faculty across all departments
    await Timetable.deleteMany({ faculty: facultyId });

    const timetableEntries = [];

    for (const dayData of weekSchedule) {
      const { day, periods } = dayData;
      for (const periodData of periods) {
        const { period, subject, year, section, department: classDepartment } = periodData;
        
        // Only add entry if year, section, subject and department are provided
        if (subject && year && section && classDepartment) {
          timetableEntries.push({
            department: classDepartment,
            year: Number(year),
            section,
            day,
            period,
            subject,
            faculty: facultyId
          });
        }
      }
    }

    if (timetableEntries.length > 0) {
      await Timetable.insertMany(timetableEntries);
    }

    res.status(201).json({
      message: "Faculty weekly timetable saved successfully"
    });

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Conflict: This class is already assigned to another teacher at this time." });
    }
    res.status(500).json({ message: "Error creating faculty timetable" });
  }
};



/**
 * @desc    Get timetable for a class
 * @route   GET /api/hod/timetable
 * @access  HOD
 */
exports.getClassTimetable = async (req, res) => {
  try {

    const { department, year, section } = req.query;

    const timetable = await Timetable.find({
      department,
      year,
      section
    }).populate("faculty", "name email");

    res.json(timetable);

  } catch (error) {
    res.status(500).json({ message: "Error fetching timetable" });
  }
};

exports.getFacultyTimetable = async (req, res) => {
  try {
    const { facultyId } = req.query;

    if (!facultyId) {
      return res.status(400).json({ message: "Faculty ID is required" });
    }

    const timetable = await Timetable.find({
      faculty: facultyId
    });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty timetable" });
  }
};

/**
 * @desc    Assign single day substitution
 * @route   PUT /api/hod/timetable/substitute/:id
 * @access  HOD
 */
exports.assignSubstitution = async (req, res) => {
  try {

    const { substituteFaculty, date } = req.body;

    const timetableEntry = await Timetable.findById(req.params.id);

    if (!timetableEntry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    timetableEntry.substituteFaculty = substituteFaculty;
    timetableEntry.substitutionDate = date;

    await timetableEntry.save();

    res.json({ message: "Substitution assigned successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error assigning substitution" });
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
