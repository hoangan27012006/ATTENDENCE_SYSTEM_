import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const sessionKey = (classId) => `attendance_active_session_${classId}`;
const checkinsKey = (classId) => `attendance_checkins_${classId}`;

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function fmtTime(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function ClassSessionsPage() {
  const { classId } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const classInfo = location.state?.classInfo;

  // ✅ Student đọc session/checkins CHUNG với teacher
  const [session, setSession] = useState(() => safeLoad(sessionKey(classId), null));
  const [checkins, setCheckins] = useState(() => safeLoad(checkinsKey(classId), []));

  const [now, setNow] = useState(Date.now());

  // Poll localStorage để cập nhật real-time (teacher mở/dừng là student thấy)
  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      setSession(safeLoad(sessionKey(classId), null));
      setCheckins(safeLoad(checkinsKey(classId), []));
    }, 800);
    return () => clearInterval(t);
  }, [classId]);

  const isOpen = useMemo(() => {
    if (!session?.isRunning) return false;
    if (!session?.startAt || !session?.endAt) return false;
    return now >= session.startAt && now <= session.endAt;
  }, [session, now]);

  const remainingMs = useMemo(() => {
    if (!isOpen) return 0;
    return Math.max(0, session.endAt - now);
  }, [isOpen, session, now]);

  const remainingText = useMemo(() => {
    const s = Math.floor(remainingMs / 1000);
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    return `${mm}m ${String(ss).padStart(2, "0")}s`;
  }, [remainingMs]);

  // Bạn có thể thay 2 dòng này bằng user đăng nhập thật (từ token/profile)
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const alreadyChecked = useMemo(() => {
    const sid = studentId.trim();
    if (!sid) return false;
    return checkins.some((x) => x.studentId === sid);
  }, [checkins, studentId]);

  function checkIn() {
    if (!isOpen) return alert("Chưa mở điểm danh hoặc đã hết giờ.");
    if (!studentId.trim() || !studentName.trim()) return alert("Nhập MSSV và họ tên.");
    if (alreadyChecked) return alert("Bạn đã điểm danh rồi.");
    if (codeInput.trim().toUpperCase() !== session.code) return alert("Sai mã điểm danh!");

    const newItem = {
      studentId: studentId.trim(),
      studentName: studentName.trim(),
      checkedAt: Date.now(),
    };

    const next = [...checkins, newItem];
    setCheckins(next);
    localStorage.setItem(checkinsKey(classId), JSON.stringify(next));
    setCodeInput("");
    alert("Điểm danh thành công!");
  }

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: "0 auto" }}>
      <button
        type="button"
        onClick={() => nav("/student/classes")}
        style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
      >
        ← Quay lại lớp
      </button>

      <div style={{ marginTop: 12 }}>
        <h1 style={{ marginBottom: 6 }}>Buổi học / Điểm danh</h1>
        <div style={{ color: "#555" }}>
          Lớp: <b>{classInfo ? `${classInfo.subjectName} - ${classInfo.subjectCode}` : `ClassId: ${classId}`}</b>
        </div>
      </div>

      {/* Session status */}
      <div style={{ marginTop: 14, padding: 14, borderRadius: 12, border: "1px solid #ddd", background: "#fff" }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Trạng thái điểm danh</div>

        {!session ? (
          <div style={{ marginTop: 8, color: "#777" }}>Teacher chưa tạo phiên điểm danh.</div>
        ) : (
          <div style={{ marginTop: 8 }}>
            <div>
              Mã hiện tại: <b style={{ letterSpacing: 2 }}>{session.code}</b>
            </div>
            <div style={{ marginTop: 4, color: "#666" }}>
              {session.startAt ? `Bắt đầu: ${fmtTime(session.startAt)}` : ""}{" "}
              {session.endAt ? `• Kết thúc: ${fmtTime(session.endAt)}` : ""}
            </div>
            <div style={{ marginTop: 6, fontWeight: 800 }}>
              {isOpen ? `Đang mở • Còn ${remainingText}` : "Không mở / Hết hạn / Đã dừng"}
            </div>
          </div>
        )}
      </div>

      {/* Check-in form */}
      <div style={{ marginTop: 12, padding: 14, borderRadius: 12, border: "1px solid #ddd", background: "#fff" }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Điểm danh</div>

        <div style={{ display: "grid", gap: 10, marginTop: 10, maxWidth: 520 }}>
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="MSSV"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Họ tên"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="Nhập mã điểm danh"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc", letterSpacing: 2, fontWeight: 800 }}
          />

          <button
            type="button"
            onClick={checkIn}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff" }}
            disabled={!isOpen}
          >
            Điểm danh
          </button>

          {alreadyChecked ? (
            <div style={{ color: "green", fontWeight: 700 }}>Bạn đã điểm danh.</div>
          ) : null}
        </div>
      </div>

      {/* Optional: show all checkins */}
      <div style={{ marginTop: 12, padding: 14, borderRadius: 12, border: "1px solid #ddd", background: "#fff" }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Danh sách đã điểm danh (class)</div>
        <div style={{ marginTop: 6, color: "#666" }}>
          Tổng: <b>{checkins.length}</b>
        </div>

        {checkins.length === 0 ? (
          <div style={{ marginTop: 8, color: "#777" }}>Chưa có ai điểm danh.</div>
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
                {checkins
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
