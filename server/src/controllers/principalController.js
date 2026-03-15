const User = require("../models/User");
const Attendance = require("../models/Attendance");
const InternalMark = require("../models/InternalMark");
const Grievance = require("../models/Grievance");
const Notice = require("../models/Notice");

exports.getPrincipalDashboard = async (req, res) => {
    try {
        // Basic counts
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalFaculty = await User.countDocuments({ role: "faculty" });

        // Grievance Stats
        const totalGrievances = await Grievance.countDocuments();
        const escalatedGrievances = await Grievance.countDocuments({ status: "escalated" });
        const resolvedGrievances = await Grievance.countDocuments({ status: "resolved" });

        // Pending Notices
        const notices = await Notice.find().sort({ createdAt: -1 }).limit(5);
        const totalNotices = await Notice.countDocuments();

        // Overall Attendance %
        const attendanceStats = await Attendance.aggregate([
            {
                $group: {
                    _id: null,
                    present: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                    total: { $sum: 1 },
                },
            },
        ]);
        const overallAttendance =
            attendanceStats.length > 0
                ? Math.round((attendanceStats[0].present / attendanceStats[0].total) * 100)
                : 0;

        // Internal Marks %
        const marksStats = await InternalMark.aggregate([
            {
                $group: {
                    _id: null,
                    obtained: { $sum: "$score" },
                    max: { $sum: "$maxScore" },
                },
            },
        ]);
        const overallPerformance =
            marksStats.length > 0
                ? Math.round((marksStats[0].obtained / marksStats[0].max) * 100)
                : 0;

        res.json({
            totalStudents,
            totalFaculty,
            overallAttendance,
            overallPerformance,
            grievances: {
                total: totalGrievances,
                escalated: escalatedGrievances,
                resolved: resolvedGrievances
            },
            noticesTotal: totalNotices,
            recentNotices: notices
        });
    } catch (error) {
        console.error("Error in getPrincipalDashboard:", error);
        res.status(500).json({ message: "Error fetching principal stats", error: error.message });
    }
};

exports.getDepartmentStats = async (req, res) => {
    try {
        // 1. Get all departments dynamically
        const departmentsArray = await User.distinct("department", {
            role: { $in: ["student", "faculty", "hod"] },
            department: { $nin: ["", null, "MANAGEMENT", "COE"] },
        });

        const departmentStats = [];

        for (const dept of departmentsArray) {
            // Students and Faculty count
            const students = await User.countDocuments({ role: "student", department: dept });
            const faculty = await User.countDocuments({ role: "faculty", department: dept });

            // Attendance
            const attStats = await Attendance.aggregate([
                { $match: { department: dept } },
                {
                    $group: {
                        _id: null,
                        present: {
                            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                        },
                        total: { $sum: 1 },
                    },
                },
            ]);
            const avgAttendance =
                attStats.length > 0
                    ? Math.round((attStats[0].present / attStats[0].total) * 100)
                    : 0;

            // Performance (Internal Marks)
            const internalMarksStats = await InternalMark.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "student",
                        foreignField: "_id",
                        as: "studentInfo",
                    },
                },
                { $unwind: "$studentInfo" },
                { $match: { "studentInfo.department": dept } },
                {
                    $group: {
                        _id: null,
                        obtained: { $sum: "$score" },
                        max: { $sum: "$maxScore" },
                    },
                },
            ]);
            const avgPerformance =
                internalMarksStats.length > 0
                    ? Math.round((internalMarksStats[0].obtained / internalMarksStats[0].max) * 100)
                    : 0;

            departmentStats.push({
                department: dept,
                totalStudents: students,
                totalFaculty: faculty,
                avgAttendance,
                avgPerformance,
            });
        }

        res.json(departmentStats);
    } catch (error) {
        console.error("Error in getDepartmentStats:", error);
        res.status(500).json({ message: "Error fetching department stats", error: error.message });
    }
};
