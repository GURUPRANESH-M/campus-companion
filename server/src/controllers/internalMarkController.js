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

/* FACULTY: Get students and existing marks for data entry */
exports.getStudentsForMarks = async (req, res) => {
  try {
    const { department, year, section, subject, examType } = req.query;

    if (!department || !year || !section || !subject || !examType) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    const User = require("../models/User");

    // Get students matching criteria
    const students = await User.find({
      role: "student",
      department,
      year: Number(year),
      section
    }).select("_id name regNo email");

    const studentIds = students.map(s => s._id);

    // Get existing marks if any
    const marks = await InternalMark.find({
      student: { $in: studentIds },
      subject,
      examType
    });

    const marksMap = {};
    marks.forEach(m => {
      marksMap[m.student.toString()] = m;
    });

    const result = students.map(s => ({
      _id: s._id,
      name: s.name,
      regNo: s.regNo || "N/A",
      email: s.email,
      score: marksMap[s._id.toString()] ? marksMap[s._id.toString()].score : "",
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* FACULTY: bulk submit marks for an entire class */
exports.submitBulkMarks = async (req, res) => {
  try {
    const { subject, examType, maxScore, marks } = req.body;
    const enteredBy = req.user._id;

    if (!subject || !examType || !marks || !Array.isArray(marks)) {
      return res.status(400).json({ message: "Missing required payload" });
    }

    const bulkOps = marks.map((m) => ({
      updateOne: {
        filter: { student: m.studentId, subject, examType },
        update: {
          $set: {
            student: m.studentId,
            subject,
            examType,
            score: Number(m.score),
            maxScore: Number(maxScore) || 100,
            enteredBy
          }
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await InternalMark.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Marks saved successfully" });
  } catch (error) {
    console.error("Error bulk uploading marks:", error);
    res.status(500).json({ message: error.message });
  }
};

