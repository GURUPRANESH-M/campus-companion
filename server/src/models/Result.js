const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        subjectCode: { type: String, required: true },
        subject: { type: String, required: true },
        department: { type: String, required: true },
        semester: { type: Number, required: true },
        internalMarks: { type: Number, required: true },
        externalMarks: { type: Number, required: true },
        totalMarks: { type: Number, required: true },
        grade: { type: String, required: true },
        passStatus: { type: String, enum: ["Pass", "Fail"], required: true },
        published: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
