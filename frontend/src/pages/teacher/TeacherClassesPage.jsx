import { Link } from "react-router-dom";

const demoClasses = [
  { id: "SAD001", name: "Phân tích thiết kế hệ thống", note: "T5 ca4, T7 ca1" },
  { id: "SE001", name: "Công nghệ phần mềm", note: "T5 ca2" },
  { id: "FIT001", name: "Fitness", note: "T2 ca4" },
];

export default function TeacherClassesPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 10 }}>/teacher/classes</h2>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>Teacher Classes (demo)</div>

      <div style={{ display: "grid", gap: 12, maxWidth: 760 }}>
        {demoClasses.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #333",
              borderRadius: 12,
              padding: 14,
              background: "#111",
            }}
          >
            <div style={{ fontWeight: 800 }}>
              {c.name} - {c.id}
            </div>
            <div style={{ opacity: 0.85, marginTop: 6 }}>{c.note}</div>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <Link to={`/teacher/classes/${c.id}/sessions`}>Quản lý buổi điểm danh</Link>
              <Link to={`/teacher/classes/${c.id}/leave`}>Duyệt xin vắng</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
