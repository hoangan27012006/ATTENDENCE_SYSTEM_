import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { attendanceApi } from "../../api/attendanceApi";

export default function ClassSessionsPage() {
  const { classId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [attendanceCode, setAttendanceCode] = useState("");
  const [msg, setMsg] = useState("");

  const selectedSession = useMemo(
    () => sessions.find((s) => s._id === selectedSessionId),
    [sessions, selectedSessionId]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setMsg("");
        const res = await attendanceApi.getSessionsByClass(classId);
        if (mounted) setSessions(res.data || []);
      } catch (e) {
        setMsg(e?.response?.data?.message || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [classId]);

  const onCheckIn = async () => {
    try {
      setMsg("");
      if (!selectedSessionId || !attendanceCode) {
        setMsg("Thiếu session hoặc mã điểm danh.");
        return;
      }
      const res = await attendanceApi.checkIn(selectedSessionId, attendanceCode);
      setMsg(res.data?.message || "Điểm danh thành công");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 6 }}>Buổi điểm danh - Lớp {classId}</h2>

      {loading ? (
        <div>Đang tải sessions...</div>
      ) : (
        <>
          <div style={{ margin: "12px 0", opacity: 0.9 }}>
            Chọn session đang mở để điểm danh.
          </div>

          <div style={{ display: "grid", gap: 10, maxWidth: 900 }}>
            {sessions.map((s) => (
              <label
                key={s._id}
                style={{
                  border: "1px solid #333",
                  borderRadius: 10,
                  padding: 12,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  background: selectedSessionId === s._id ? "#151515" : "#0f0f0f",
                }}
              >
                <input
                  type="radio"
                  name="session"
                  value={s._id}
                  checked={selectedSessionId === s._id}
                  onChange={() => setSelectedSessionId(s._id)}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {s.lesson} {s.isClosed ? "(Đã đóng)" : "(Đang mở)"}
                  </div>
                  <div style={{ opacity: 0.85, marginTop: 4 }}>
                    Bắt đầu: {new Date(s.startTime).toLocaleString()}
                  </div>
                  <div style={{ opacity: 0.85 }}>
                    Kết thúc: {new Date(s.endTime).toLocaleString()}
                  </div>
                  <div style={{ opacity: 0.75, marginTop: 4 }}>
                    SessionId: {s._id}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div style={{ marginTop: 16, maxWidth: 520 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Nhập mã điểm danh</div>
            <input
              value={attendanceCode}
              onChange={(e) => setAttendanceCode(e.target.value)}
              placeholder="VD: 123456"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid #333",
                background: "#0f0f0f",
                color: "white",
              }}
            />
            <button
              onClick={onCheckIn}
              disabled={!selectedSession || selectedSession?.isClosed}
              style={{ marginTop: 10, padding: "10px 14px" }}
            >
              Điểm danh
            </button>
            {selectedSession?.isClosed && (
              <div style={{ marginTop: 8, color: "#ffb" }}>
                Session đã đóng, không thể điểm danh.
              </div>
            )}
          </div>

          {msg && <div style={{ marginTop: 14 }}>{msg}</div>}
        </>
      )}
    </div>
  );
}
