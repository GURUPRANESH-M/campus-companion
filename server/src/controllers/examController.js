const ExamSchedule = require("../models/ExamSchedule");

exports.createExamSchedule = async (req, res) => {
    try {
        const { subjectCode, subject, date, time, duration, venue, status } = req.body;

        // Use default values for department, year, semester since user prompt asks for only a subset of fields 
        // but the DB schema expects them. Or we accept them if provided.
        const newSchedule = new ExamSchedule({
            subjectCode,
            subject,
            date,
            time,
            duration,
            venue,
            status: status || "Scheduled",
            department: req.body.department || "ALL",
            year: req.body.year || 1,
            semester: req.body.semester || 1
        });

        await newSchedule.save();
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json({ message: "Failed to create exam schedule", error: error.message });
    }
};

exports.getExamSchedules = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'student') {
            query.department = req.user.department;
            query.year = req.user.year;
        }

        const schedules = await ExamSchedule.find(query).sort({ date: 1 });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch exam schedules", error: error.message });
    }
};

exports.updateExamSchedule = async (req, res) => {
    try {
        const updated = await ExamSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Exam schedule not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Failed to update exam schedule", error: error.message });
    }
};

exports.deleteExamSchedule = async (req, res) => {
    try {
        const deleted = await ExamSchedule.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Exam schedule not found" });
        }

        res.json({ message: "Exam deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete exam schedule", error: error.message });
    }
};
