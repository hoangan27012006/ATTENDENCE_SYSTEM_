// src/pages/teacher/TeacherLeavePage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { attendanceApi } from "../../api/attendanceApi";

export default function TeacherLeavePage() {
  const { classId } = useParams(); // route: /teacher/classes/:classId/leave

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");
      setMsg("");

      // ✅ cần attendanceApi.getLeaveRequestsByClass(...)
      const res = await attendanceApi.getLeaveRequestsByClass(classId, "PENDING");
      setLeaves(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!classId) {
      setLoading(false);
      setError("Thiếu classId trên URL. Hãy vào từ /teacher/classes.");
      return;
    }
    loadLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const onApprove = async (leaveId) => {
    try {
      setMsg("");
      await attendanceApi.approveLeave(leaveId);
      setMsg("Duyệt đơn thành công.");
      await loadLeaves();
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Duyệt xin vắng</h2>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            Lớp: <b>{classId}</b> — chỉ hiển thị đơn <b>PENDING</b>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={loadLeaves}
            style={{ padding: "10px 14px", borderRadius: 10 }}
          >
            Refresh
          </button>
          <Link to="/teacher/classes" style={{ alignSelf: "center" }}>
            Back Classes
          </Link>
        </div>
      </div>

      {msg && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #333",
            background: "#111",
          }}
        >
          {msg}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div>Lỗi: {error}</div>
        ) : leaves.length === 0 ? (
          <div>Không có đơn xin vắng PENDING.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {leaves.map((lv) => (
              <div
                key={lv._id}
                style={{
                  border: "1px solid #333",
                  borderRadius: 12,
                  padding: 14,
                  background: "#111",
                }}
              >
                <div style={{ fontWeight: 800 }}>
                  Student: {lv.studentId} — Status: {lv.status}
                </div>

                <div style={{ opacity: 0.9, marginTop: 8 }}>
                  Lý do: <span style={{ fontWeight: 600 }}>{lv.reason}</span>
                </div>

                {lv.sessionId && (
                  <div style={{ opacity: 0.85, marginTop: 8 }}>
                    Session: <b>{lv.sessionId.lesson}</b> —{" "}
                    {new Date(lv.sessionId.startTime).toLocaleString()}
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() => onApprove(lv._id)}
                    style={{ padding: "10px 14px", borderRadius: 10 }}
                  >
                    Approve
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
