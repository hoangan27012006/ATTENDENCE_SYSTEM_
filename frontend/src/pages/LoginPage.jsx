import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>/login</h2>
      <p>Trang Login (demo)</p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/student/classes">Go Student Classes</Link>
        <Link to="/teacher/classes">Go Teacher Classes</Link>
      </div>
    </div>
  );
}
