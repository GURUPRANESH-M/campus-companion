const ExamSchedule = require("../models/ExamSchedule");
const Result = require("../models/Result");
const Grievance = require("../models/Grievance");

exports.getCoEDashboard = async (req, res) => {
    try {
        const upcomingExamsCount = await ExamSchedule.countDocuments({ status: "Scheduled" });
        const resultsPendingCount = await Result.countDocuments({ published: false });
        const resultsPublishedCount = await Result.countDocuments({ published: true });
        const examGrievancesCount = await Grievance.countDocuments({ category: "Examination", status: { $ne: "resolved" } });

        // get recent 5 scheduled
        const recentSchedules = await ExamSchedule.find({ status: "Scheduled" }).sort({ date: 1 }).limit(5);

        res.json({
            upcomingExams: upcomingExamsCount,
            resultsPending: resultsPendingCount,
            resultsPublished: resultsPublishedCount,
            examGrievances: examGrievancesCount,
            recentSchedules
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching COE stats", error: error.message });
    }
};

exports.getExamSchedules = async (req, res) => {
    try {
        const schedules = await ExamSchedule.find().sort({ date: 1 });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedules", error: error.message });
    }
};

exports.createExamSchedule = async (req, res) => {
    try {
        const { subjectCode, subject, date, time, duration, venue, department, year, semester } = req.body;

        if (!subjectCode || !subject || !date || !time || !duration || !venue || !department || !year || !semester) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const schedule = new ExamSchedule({
            subjectCode, subject, date, time, duration, venue, department, year, semester
        });

        await schedule.save();
        res.status(201).json({ message: "Exam schedule created", schedule });
    } catch (error) {
        res.status(500).json({ message: "Error creating schedule", error: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const results = await Result.find().populate("student", "name regNo email");
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching results", error: error.message });
    }
};
