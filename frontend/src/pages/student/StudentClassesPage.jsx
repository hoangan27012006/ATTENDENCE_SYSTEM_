import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const CLASSES_KEY = "attendance_teacher_classes_v1";

const DAYS = [
  { value: "MON", label: "Thứ 2" },
  { value: "TUE", label: "Thứ 3" },
  { value: "WED", label: "Thứ 4" },
  { value: "THU", label: "Thứ 5" },
  { value: "FRI", label: "Thứ 6" },
  { value: "SAT", label: "Thứ 7" },
  { value: "SUN", label: "Chủ nhật" },
];

function dayLabel(value) {
  return DAYS.find((d) => d.value === value)?.label ?? value;
}
function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function StudentClassesPage() {
  const nav = useNavigate();

  // ✅ Student đọc danh sách lớp do teacher tạo (trùng 100%)
  const [classes] = useState(() => safeLoad(CLASSES_KEY, []));
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) => {
      const name = (c.subjectName || "").toLowerCase();
      const code = (c.subjectCode || "").toLowerCase();
      const teacher = (c.teacherName || "").toLowerCase();
      return name.includes(q) || code.includes(q) || teacher.includes(q);
    });
  }, [classes, query]);

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Student Classes</h1>
      <div style={{ color: "#555", marginBottom: 16 }}>
        Danh sách lớp (đồng bộ từ Teacher)
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm theo tên môn / mã môn / giảng viên..."
        style={{ padding: 10, width: 420, maxWidth: "100%", border: "1px solid #ccc", borderRadius: 10 }}
      />

      <div style={{ marginTop: 18 }}>
        {classes.length === 0 ? (
          <div style={{ padding: 18, border: "1px dashed #bbb", borderRadius: 12, background: "#fafafa" }}>
            Chưa có lớp nào (Teacher chưa tạo class).
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 18, border: "1px dashed #bbb", borderRadius: 12, background: "#fafafa" }}>
            Không tìm thấy lớp phù hợp.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              style={{ padding: 16, marginBottom: 12, border: "1px solid #e5e5e5", borderRadius: 14, background: "#fff" }}
            >
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {c.subjectName} - {c.subjectCode}
              </div>
              <div style={{ marginTop: 6 }}>
                {dayLabel(c.dayOfWeek)} - Ca {c.period}
              </div>
              <div style={{ marginTop: 4, color: "#555" }}>GV: {c.teacherName}</div>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => nav(`/student/classes/${c.id}/sessions`, { state: { classInfo: c } })}
                  style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff" }}
                >
                  Vào buổi học (điểm danh)
                </button>

                <button
                  type="button"
                  onClick={() => nav(`/student/classes/${c.id}/leave`, { state: { classInfo: c } })}
                  style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "#fff" }}
                >
                  Xin vắng
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
