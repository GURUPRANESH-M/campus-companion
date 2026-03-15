const Subject = require("../models/Subject");

exports.createSubject = async (req, res) => {
    try {
        const existing = await Subject.findOne({ subjectCode: req.body.subjectCode });
        if (existing) {
            return res.status(400).json({ message: "Subject code already exists" });
        }
        const newSubject = new Subject(req.body);
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (error) {
        res.status(500).json({ message: "Failed to create subject", error: error.message });
    }
};

exports.getSubjects = async (req, res) => {
    try {
        const filters = {};
        if (req.query.department) filters.department = req.query.department;
        if (req.query.year) filters.year = req.query.year;
        if (req.query.semester) filters.semester = req.query.semester;

        const subjects = await Subject.find(filters).sort({ year: 1, semester: 1, department: 1, subjectCode: 1 });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch subjects", error: error.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Failed to update subject", error: error.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const deleted = await Subject.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.json({ message: "Subject deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete subject", error: error.message });
    }
};
