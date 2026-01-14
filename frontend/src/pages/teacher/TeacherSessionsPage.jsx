import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function generateCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
function fmtTime(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function TeacherSessionsPage() {
  const { classId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const classInfo = location.state?.classInfo;

  const [durationMin, setDurationMin] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState("");
  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [now, setNow] = useState(Date.now());

  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || !endAt) return;
    if (now >= endAt) setIsRunning(false);
  }, [now, endAt, isRunning]);

  const remainingMs = useMemo(() => {
    if (!isRunning || !endAt) return 0;
    return Math.max(0, endAt - now);
  }, [isRunning, endAt, now]);

  const remainingText = useMemo(() => {
    const s = Math.floor(remainingMs / 1000);
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm}m ${String(ss).padStart(2, "0")}s`;
  }, [remainingMs]);

  function startSession() {
    const code = generateCode(6);
    const start = Date.now();
    const end = start + Number(durationMin) * 60 * 1000;

    setAttendanceCode(code);
    setStartAt(start);
    setEndAt(end);
    setIsRunning(true);
    setChecked([]);
  }

  function stopSession() {
    setIsRunning(false);
  }

  // demo checkin
  const [demoStudentId, setDemoStudentId] = useState("");
  const [demoStudentName, setDemoStudentName] = useState("");
  const [demoInputCode, setDemoInputCode] = useState("");

  function demoCheckIn() {
    if (!isRunning) return alert("Chưa mở điểm danh.");
    if (!demoStudentId.trim() || !demoStudentName.trim()) return alert("Nhập MSSV và tên sinh viên.");
    if (demoInputCode.trim().toUpperCase() !== attendanceCode) return alert("Sai mã điểm danh!");
    const sid = demoStudentId.trim();
    if (checked.some((x) => x.studentId === sid)) return alert("Sinh viên này đã điểm danh rồi.");

    setChecked((prev) => [...prev, { studentId: sid, studentName: demoStudentName.trim(), checkedAt: Date.now() }]);
    setDemoInputCode("");
  }

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: "0 auto" }}>
      <button
        type="button"
        onClick={() => nav("/teacher/classes")}
        style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
      >
        ← Quay lại Classes
      </button>

      <div style={{ marginTop: 12 }}>
        <h1 style={{ marginBottom: 6 }}>Quản lý buổi điểm danh</h1>
        <div style={{ color: "#555" }}>
          Lớp: <b>{classInfo ? `${classInfo.subjectName} - ${classInfo.subjectCode}` : `ClassId: ${classId}`}</b>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 12, background: "#fff", padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Thiết lập & Mở điểm danh</div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <label style={{ fontWeight: 600 }}>Thời lượng (phút):</label>
            <input
              type="number"
              min={1}
              max={180}
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              style={{ width: 120, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
              disabled={isRunning}
            />

            {!isRunning ? (
              <button
                type="button"
                onClick={startSession}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff" }}
              >
                Tạo mã & Bắt đầu
              </button>
            ) : (
              <button
                type="button"
                onClick={stopSession}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #f3c2c2", background: "#fff5f5", color: "#b00020" }}
              >
                Dừng điểm danh
              </button>
            )}
          </div>

          <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "#fafafa", border: "1px dashed #ccc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#666", fontSize: 13 }}>Mã điểm danh</div>
                <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 2 }}>{attendanceCode || "------"}</div>
              </div>

              <div>
                <div style={{ color: "#666", fontSize: 13 }}>Trạng thái</div>
                <div style={{ fontWeight: 800 }}>{isRunning ? `Đang mở • Còn ${remainingText}` : "Chưa mở / Đã hết hạn"}</div>
                <div style={{ color: "#777", marginTop: 4 }}>
                  Bắt đầu: {startAt ? fmtTime(startAt) : "--:--:--"} • Kết thúc: {endAt ? fmtTime(endAt) : "--:--:--"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 12, background: "#fff", padding: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Giả lập sinh viên điểm danh (test)</div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <input value={demoStudentId} onChange={(e) => setDemoStudentId(e.target.value)} placeholder="MSSV" style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }} />
            <input value={demoStudentName} onChange={(e) => setDemoStudentName(e.target.value)} placeholder="Tên sinh viên" style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }} />
            <input value={demoInputCode} onChange={(e) => setDemoInputCode(e.target.value.toUpperCase())} placeholder="Nhập mã điểm danh" style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc", letterSpacing: 2, fontWeight: 800 }} />
            <button type="button" onClick={demoCheckIn} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff" }}>
              Điểm danh
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, border: "1px solid #ddd", borderRadius: 12, background: "#fff", padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Sinh viên đã điểm danh</div>
          <div style={{ color: "#666" }}>
            Tổng: <b>{checked.length}</b>
          </div>
        </div>

        {checked.length === 0 ? (
          <div style={{ marginTop: 10, color: "#777" }}>Chưa có sinh viên nào điểm danh.</div>
        ) : (
          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>#</th>
                  <th style={th}>MSSV</th>
                  <th style={th}>Họ tên</th>
                  <th style={th}>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {checked
                  .slice()
                  .sort((a, b) => a.checkedAt - b.checkedAt)
                  .map((s, idx) => (
                    <tr key={s.studentId}>
                      <td style={td}>{idx + 1}</td>
                      <td style={td}>{s.studentId}</td>
                      <td style={td}>{s.studentName}</td>
                      <td style={td}>{fmtTime(s.checkedAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const th = { textAlign: "left", padding: "10px 8px", borderBottom: "1px solid #eee", color: "#555", fontWeight: 700, fontSize: 13 };
const td = { padding: "10px 8px", borderBottom: "1px solid #f0f0f0" };
