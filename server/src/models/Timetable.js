const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({

  department: {
    type: String,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },

  section: {
    type: String,
    required: true,
  },

  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    required: true,
  },

  period: {
    type: Number,
    min: 1,
    max: 7,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 🔥 SINGLE DAY SUBSTITUTION SUPPORT
  substituteFaculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  substitutionDate: {
    type: Date,
  }

}, { timestamps: true });

/* Prevent duplicate timetable slot */
timetableSchema.index(
  { department:1, year:1, section:1, day:1, period:1 },
  { unique: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);