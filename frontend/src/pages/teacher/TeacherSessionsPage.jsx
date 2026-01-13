import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { attendanceApi } from "../../api/attendanceApi";

export default function TeacherSessionsPage() {
  const { classId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sessions, setSessions] = useState([]);

  // form create session
  const [lesson, setLesson] = useState("");
  const [attendanceCode, setAttendanceCode] = useState("");
  const [startTime, setStartTime] = useState(""); // datetime-local
  const [endTime, setEndTime] = useState("");     // datetime-local
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await attendanceApi.getSessionsByClass(classId);
      setSessions(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const genCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setAttendanceCode(code);
  };

  const toISOFromLocal = (localStr) => {
    // datetime-local -> Date -> ISO string
    // localStr dạng "2026-01-13T21:30"
    if (!localStr) return "";
    return new Date(localStr).toISOString();
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!lesson.trim() || !attendanceCode.trim() || !startTime || !endTime) {
      setMsg("Vui lòng nhập đủ: lesson, code, startTime, endTime.");
      return;
    }

    try {
      setSubmitting(true);
      await attendanceApi.createSession({
        classId,
        lesson: lesson.trim(),
        attendanceCode: attendanceCode.trim(),
        startTime: toISOFromLocal(startTime),
        endTime: toISOFromLocal(endTime),
      });

      setMsg("Tạo session thành công.");
      setLesson("");
      setAttendanceCode("");
      setStartTime("");
      setEndTime("");
      await loadSessions();
    } catch (e2) {
      setMsg(e2?.response?.data?.message || e2.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onClose = async (sessionId) => {
    try {
      setMsg("");
      await attendanceApi.closeSession(sessionId);
      setMsg("Đóng session thành công.");
      await loadSessions();
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <h2 style={{ marginBottom: 6 }}>Quản lý buổi điểm danh - Lớp {classId}</h2>
      <div style={{ opacity: 0.85, marginBottom: 14 }}>
        Tạo session để sinh viên vào “Tham gia lớp” và điểm danh.
      </div>

      {/* Create form */}
      <div style={{ border: "1px solid #333", borderRadius: 12, padding: 14, background: "#111" }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Tạo session</div>

        <form onSubmit={onCreate} style={{ display: "grid", gap: 10 }}>
          <label>
            <div style={{ marginBottom: 6 }}>Buổi / Lesson</div>
            <input
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder="VD: Buổi 3 - Chương 2"
              style={{ width: "100%", padding: 10, borderRadius: 10 }}
            />
          </label>

          <label>
            <div style={{ marginBottom: 6 }}>Mã điểm danh</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={attendanceCode}
                onChange={(e) => setAttendanceCode(e.target.value)}
                placeholder="VD: 123456"
                style={{ flex: 1, padding: 10, borderRadius: 10 }}
              />
              <button
                type="button"
                onClick={genCode}
                style={{ padding: "10px 14px", borderRadius: 10 }}
              >
                Tạo mã
              </button>
            </div>
          </label>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <label>
              <div style={{ marginBottom: 6 }}>Start time</div>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 10 }}
              />
            </label>

            <label>
              <div style={{ marginBottom: 6 }}>End time</div>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 10 }}
              />
            </label>
          </div>

          <button type="submit" disabled={submitting} style={{ padding: "10px 14px", width: 180 }}>
            {submitting ? "Đang tạo..." : "Tạo session"}
          </button>
        </form>

        {msg && <div style={{ marginTop: 10 }}>{msg}</div>}
      </div>

      {/* List sessions */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Danh sách sessions</div>

        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div>Lỗi: {error}</div>
        ) : sessions.length === 0 ? (
          <div>Chưa có session nào cho lớp này.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {sessions.map((s) => (
              <div
                key={s._id}
                style={{
                  border: "1px solid #333",
                  borderRadius: 12,
                  padding: 14,
                  background: "#0f0f0f",
                }}
              >
                <div style={{ fontWeight: 800 }}>
                  {s.lesson} {s.isClosed ? "(Đã đóng)" : "(Đang mở)"}
                </div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>
                  Code: <span style={{ fontWeight: 700 }}>{s.attendanceCode}</span>
                </div>
                <div style={{ opacity: 0.85 }}>
                  Start: {new Date(s.startTime).toLocaleString()}
                </div>
                <div style={{ opacity: 0.85 }}>
                  End: {new Date(s.endTime).toLocaleString()}
                </div>
                <div style={{ opacity: 0.75, marginTop: 6 }}>SessionId: {s._id}</div>

                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() => onClose(s._id)}
                    disabled={s.isClosed}
                    style={{ padding: "10px 14px", borderRadius: 10 }}
                  >
                    Đóng session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
