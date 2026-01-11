import { Link } from "react-router-dom";

export default function StudentLeavePage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>/student/leave</h2>
      <p>Gửi đơn xin nghỉ (demo)</p>
      <Link to="/login">Back Login</Link>
    </div>
  );
}
