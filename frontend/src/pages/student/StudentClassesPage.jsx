import { Link } from "react-router-dom";

export default function StudentClassesPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>/student/classes</h2>
      <p>Danh sách lớp (demo)</p>
      <Link to="/student/leave">Go Leave Request</Link>
    </div>
  );
}
