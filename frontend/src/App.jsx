import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";

import StudentClassesPage from "./pages/student/StudentClassesPage.jsx";
import StudentLeavePage from "./pages/student/StudentLeavePage.jsx";

import TeacherClassesPage from "./pages/teacher/TeacherClassesPage.jsx";
import TeacherLeavePage from "./pages/teacher/TeacherLeavePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/student/classes" element={<StudentClassesPage />} />
      <Route path="/student/leave" element={<StudentLeavePage />} />

      <Route path="/teacher/classes" element={<TeacherClassesPage />} />
      <Route path="/teacher/leave" element={<TeacherLeavePage />} />

      <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
    </Routes>
  );
}
