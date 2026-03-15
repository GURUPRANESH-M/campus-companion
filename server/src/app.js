const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const internalMarkRoutes = require("./routes/internalMarkRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const hodRoutes = require("./routes/hodRoutes");
const hodGrievanceRoutes = require("./routes/hodGrievanceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const grievanceRoutes = require("./routes/grievanceRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const principalRoutes = require("./routes/principalRoutes");
const coeRoutes = require("./routes/coeRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes");
const examGrievanceRoutes = require("./routes/examGrievanceRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/internal-marks", internalMarkRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/hod", hodGrievanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/principal", principalRoutes);
app.use("/api/coe", coeRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/exam-grievances", examGrievanceRoutes);
app.use("/api/subjects", subjectRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

module.exports = app;
