// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Nếu bạn đã có các page này thì giữ import của bạn
import StudentClassesPage from "./pages/student/StudentClassesPage.jsx";
import StudentLeavePage from "./pages/student/StudentLeavePage.jsx";
import TeacherClassesPage from "./pages/teacher/TeacherClassesPage.jsx";
import TeacherLeavePage from "./pages/teacher/TeacherLeavePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/student/classes"
        element={
          <ProtectedRoute role="student">
            <StudentClassesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/leave"
        element={
          <ProtectedRoute role="student">
            <StudentLeavePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/classes"
        element={
          <ProtectedRoute role="teacher">
            <TeacherClassesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/leave"
        element={
          <ProtectedRoute role="teacher">
            <TeacherLeavePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
