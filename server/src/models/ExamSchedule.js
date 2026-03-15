const mongoose = require("mongoose");

const examScheduleSchema = new mongoose.Schema(
    {
        subjectCode: { type: String, required: true },
        subject: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        duration: { type: String, required: true },
        venue: { type: String, required: true },
        department: { type: String, required: true },
        year: { type: Number, required: true },
        semester: { type: Number, required: true },
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExamSchedule", examScheduleSchema);
