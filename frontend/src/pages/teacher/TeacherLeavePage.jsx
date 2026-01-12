import { Link } from "react-router-dom";

export default function TeacherLeavePage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>/teacher/leave</h2>
      <p>Duyệt đơn xin nghỉ (demo)</p>
      <Link to="/login">Back Login</Link>
    </div>
  );
}
