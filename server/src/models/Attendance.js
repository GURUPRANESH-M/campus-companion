const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    timetable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    period: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance
attendanceSchema.index(
  { student: 1, date: 1, period: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);