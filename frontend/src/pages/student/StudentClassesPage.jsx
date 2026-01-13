// src/pages/student/StudentClassesPage.jsx
import { Link } from "react-router-dom";

const DAYS = [
  { key: "T2", label: "Thứ 2" },
  { key: "T3", label: "Thứ 3" },
  { key: "T4", label: "Thứ 4" },
  { key: "T5", label: "Thứ 5" },
  { key: "T6", label: "Thứ 6" },
  { key: "T7", label: "Thứ 7" },
  { key: "CN", label: "Chủ nhật" },
];

const PERIODS = [1, 2, 3, 4];

// Demo schedule: DAY-CA -> môn học
// Bạn sửa classId/name/teacher theo dữ liệu thật của bạn sau
const scheduleMap = {
  "T2-4": { classId: "FIT001", name: "Fitness", teacher: "GV Fitness" },
  "T5-2": { classId: "SE001", name: "Công nghệ phần mềm", teacher: "Cô X" },
  "T5-4": { classId: "SAD001", name: "Phân tích thiết kế hệ thống", teacher: "Thầy Y" },
  "T7-1": { classId: "SAD001", name: "Phân tích thiết kế hệ thống", teacher: "Thầy Y" },
};

export default function StudentClassesPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>/student/classes</h2>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>Lịch học tuần (demo)</div>

      <div style={{ display: "grid", gap: 14, maxWidth: 760 }}>
        {DAYS.map((d) => (
          <div
            key={d.key}
            style={{
              border: "1px solid #333",
              borderRadius: 12,
              padding: 14,
              background: "#111",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 10 }}>{d.label}</div>

            <div style={{ display: "grid", gap: 10 }}>
              {PERIODS.map((ca) => {
                const item = scheduleMap[`${d.key}-${ca}`];

                if (!item) {
                  return (
                    <div
                      key={ca}
                      style={{
                        border: "1px dashed #333",
                        borderRadius: 10,
                        padding: 12,
                        opacity: 0.75,
                      }}
                    >
                      Ca {ca}: Trống
                    </div>
                  );
                }

                return (
                  <div
                    key={ca}
                    style={{
                      border: "1px solid #333",
                      borderRadius: 10,
                      padding: 12,
                      background: "#0f0f0f",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>
                      Ca {ca}: {item.name} - {item.classId}
                    </div>

                    <div style={{ opacity: 0.85, marginTop: 6 }}>
                      Giảng viên: {item.teacher}
                    </div>

                    {/* ✅ Đổi "Điểm danh" -> "Tham gia lớp" (vào trang điểm danh) */}
                    {/* ✅ "Xin vắng" giữ nguyên (vào trang xin vắng) */}
                    <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                      <Link to={`/student/classes/${item.classId}/sessions`}>
                        Tham gia lớp
                      </Link>
                      <Link to={`/student/classes/${item.classId}/leave`}>Xin vắng</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
