import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { attendanceApi } from "../../api/attendanceApi";

export default function LeaveRequestPage() {
  const { classId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setMsg("");
      if (!sessionId) return setMsg("Bạn chưa chọn buổi học (session).");
      if (!reason.trim()) return setMsg("Bạn chưa nhập lý do.");

      setSubmitting(true);
      await attendanceApi.requestLeave(sessionId, reason.trim());
      setMsg("Gửi đơn xin vắng thành công (PENDING).");
      setReason("");
      // nếu muốn reset luôn session:
      // setSessionId("");
    } catch (e2) {
      setMsg(e2?.response?.data?.message || e2.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <h2>Xin vắng - Lớp {classId}</h2>

      {loading ? (
        <div style={{ marginTop: 12 }}>Đang tải danh sách buổi học...</div>
      ) : sessions.length === 0 ? (
        <div style={{ marginTop: 12 }}>
          Lớp này chưa có buổi điểm danh nào. Hãy đợi giảng viên tạo session.
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <label>
            <div style={{ marginBottom: 6 }}>Chọn buổi học</div>
            <select
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10 }}
            >
              <option value="">-- Chọn session --</option>
              {sessions.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.lesson} ({new Date(s.startTime).toLocaleString()})
                </option>
              ))}
            </select>
          </label>

          <label>
            <div style={{ marginBottom: 6 }}>Lý do</div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="VD: Em bị ốm, xin phép vắng..."
              style={{ width: "100%", padding: 10, borderRadius: 10 }}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{ padding: "10px 14px" }}
          >
            {submitting ? "Đang gửi..." : "Gửi đơn"}
          </button>
        </form>
      )}

      {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
    </div>
  );
}
