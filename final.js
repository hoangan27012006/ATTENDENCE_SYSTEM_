const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json()); // [cite: 35]

// 1. MODELS (Phải khai báo đầu tiên)

// Model: AttendanceSession 
const AttendanceSession = mongoose.model("AttendanceSession", new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, required: true },
    lesson: { type: String, required: true },
    attendanceCode: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isClosed: { type: Boolean, default: false }
}, { timestamps: true }));

// Model: AttendanceRecord 
const attendanceRecordSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceSession", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["PRESENT", "ABSENT", "EXCUSED"], default: "ABSENT" },
    checkInTime: { type: Date }
}, { timestamps: true });
attendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);

// Model: LeaveRequest
const LeaveRequest = mongoose.model("LeaveRequest", new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceSession", required: true },
    studentId: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" }
}, { timestamps: true }));

// 2. CONTROLLERS 

// Tạo session
const createSession = async (req, res) => {
  try {
    const { classId, lesson, attendanceCode, startTime, endTime } = req.body;
    if (!classId || !lesson || !attendanceCode || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const session = await AttendanceSession.create({
      classId, lesson, attendanceCode, startTime, endTime, createdBy: "TEMP_TEACHER"
    });
    res.status(201).json(session);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Điểm danh 
const checkIn = async (req, res) => {
  try {
    const { sessionId, attendanceCode } = req.body;
    if (!sessionId || !attendanceCode) return res.status(400).json({ message: "Missing data" });
    const session = await AttendanceSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.attendanceCode !== attendanceCode) {
      return res.status(400).json({ message: "Wrong attendance code" });
    }
    const record = await AttendanceRecord.create({
      sessionId, studentId: "TEMP_STUDENT", status: "PRESENT", checkInTime: new Date()
    });
    res.json({ message: "Attendance success", record });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Xin vắng 
const requestLeave = async (req, res) => {
  try {
    const { sessionId, reason } = req.body;
    if (!sessionId || !reason) return res.status(400).json({ message: "Missing data" });
    const leave = await LeaveRequest.create({ sessionId, studentId: "TEMP_STUDENT", reason });
    res.status(201).json(leave);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Duyệt đơn 
const approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const leave = await LeaveRequest.findByIdAndUpdate(leaveId, { status: "APPROVED" }, { new: true });
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    res.json(leave);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. ROUTES 

app.post("/api/attendance/create-session", createSession); 
app.post("/api/attendance/check-in", checkIn); 
app.post("/api/attendance/leave-request", requestLeave);
app.put("/api/attendance/leave-approve/:leaveId", approveLeave); 

app.get("/", (req, res) => {
  res.send("Attendance Backend is running (Single File Mode)"); 
});

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendance_system") 
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});