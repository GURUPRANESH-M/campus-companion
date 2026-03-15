const User = require("../models/User");
const InternalMark = require("../models/InternalMark");
const Result = require("../models/Result");

exports.uploadResults = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Payload must be an array of records in CSV format" });
        }

        const records = req.body;
        // Extract all regNos to query User collection once
        const regNos = records.map(r => r.regNo);
        const students = await User.find({ regNo: { $in: regNos } });

        const studentMap = {};
        students.forEach(s => { studentMap[s.regNo] = s; });

        const finalResults = [];

        for (const record of records) {
            const student = studentMap[record.regNo];
            if (!student) continue;

            const subjectCode = record.subjectCode;
            const externalMarks = Number(record.externalMarks) || 0;

            // Notice we use the "SubjectCode" since sometimes teachers input CS101 as subject
            const marks = await InternalMark.find({
                student: student._id,
                subject: subjectCode
            });

            // Aggregate internal marks (For simplicity, capping at 50 or summing)
            let internalMarks = 0;
            marks.forEach(m => {
                internalMarks += m.score;
            });
            if (internalMarks > 50) internalMarks = 50; // Cap assumption

            const totalMarks = internalMarks + externalMarks;

            let grade = 'F';
            let passStatus = 'Fail';

            if (totalMarks >= 90) grade = 'O';
            else if (totalMarks >= 80) grade = 'A+';
            else if (totalMarks >= 70) grade = 'A';
            else if (totalMarks >= 60) grade = 'B+';
            else if (totalMarks >= 50) grade = 'B';

            // Assume external pass cutoff is 45/100, and overall 50
            if (totalMarks >= 50) {
                passStatus = 'Pass';
            }

            finalResults.push({
                student: student._id,
                subjectCode: subjectCode,
                subject: record.subjectName || subjectCode,
                department: student.department || "ALL",
                semester: record.semester || 1,
                internalMarks,
                externalMarks,
                totalMarks,
                grade,
                passStatus,
                published: false
            });
        }

        if (finalResults.length === 0) {
            return res.status(400).json({ message: "No valid students found from the provided Register Numbers" });
        }

        const results = await Result.insertMany(finalResults);
        return res.status(201).json({ message: "Results uploaded successfully", results });
    } catch (error) {
        res.status(500).json({ message: "Failed to upload results", error: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const results = await Result.find().populate("student", "name email regNo");
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch results", error: error.message });
    }
};

exports.updateResult = async (req, res) => {
    try {
        const updated = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Failed to update result", error: error.message });
    }
};

exports.publishResults = async (req, res) => {
    try {
        await Result.updateMany({ published: false }, { published: true });
        res.json({ message: "All pending results published successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to publish results", error: error.message });
    }
};
