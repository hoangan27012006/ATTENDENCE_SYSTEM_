// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth.js";

export default function ProtectedRoute({ children, role }) {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    // nếu sai role thì đá về đúng trang theo role
    return <Navigate to={user.role === "teacher" ? "/teacher/classes" : "/student/classes"} replace />;
  }

  return children;
}
