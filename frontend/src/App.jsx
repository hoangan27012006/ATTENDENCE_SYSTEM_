// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Student pages
import StudentClassesPage from "./pages/student/StudentClassesPage.jsx";
import StudentLeavePage from "./pages/student/StudentLeavePage.jsx";
import ClassSessionsPage from "./pages/student/ClassSessionsPage.jsx"; // ✅ thêm

// Teacher pages
import TeacherClassesPage from "./pages/teacher/TeacherClassesPage.jsx";
import TeacherLeavePage from "./pages/teacher/TeacherLeavePage.jsx";
import TeacherSessionsPage from "./pages/teacher/TeacherSessionsPage.jsx"; // ✅ đã import

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* STUDENT */}
      <Route
        path="/student/classes"
        element={
          <ProtectedRoute role="student">
            <StudentClassesPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ sessions theo class */}
      <Route
        path="/student/classes/:classId/sessions"
        element={
          <ProtectedRoute role="student">
            <ClassSessionsPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ xin vắng theo class */}
      <Route
        path="/student/classes/:classId/leave"
        element={
          <ProtectedRoute role="student">
            <StudentLeavePage />
          </ProtectedRoute>
        }
      />

      {/* (tuỳ chọn) giữ route cũ nếu bạn đang dùng link /student/leave ở chỗ khác */}
      <Route
        path="/student/leave"
        element={
          <ProtectedRoute role="student">
            <StudentLeavePage />
          </ProtectedRoute>
        }
      />

      {/* TEACHER */}
      <Route
        path="/teacher/classes"
        element={
          <ProtectedRoute role="teacher">
            <TeacherClassesPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ NEW: teacher sessions theo class (SỬA LỖI BỊ ĐÁ VỀ LOGIN) */}
      <Route
        path="/teacher/classes/:classId/sessions"
        element={
          <ProtectedRoute role="teacher">
            <TeacherSessionsPage />
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
