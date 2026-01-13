import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  // demo: lấy từ localStorage (bạn thay bằng auth thật sau)
  const userId = localStorage.getItem("userId") || "SV001";
  const role = localStorage.getItem("role") || "STUDENT";

  config.headers["x-user-id"] = userId;
  config.headers["x-role"] = role;
  return config;
});

export const attendanceApi = {
  // (cần backend thêm GET này)
  getSessionsByClass: (classId) =>
    api.get(`/api/attendance/sessions`, { params: { classId } }),

  checkIn: (sessionId, attendanceCode) =>
    api.post(`/api/attendance/check-in`, { sessionId, attendanceCode }),

  requestLeave: (sessionId, reason) =>
    api.post(`/api/attendance/leave-request`, { sessionId, reason }),

   getLeaveRequestsByClass: (classId, status = "PENDING") =>
    api.get(`/api/attendance/leave-requests`, { params: { classId, status } }),

  // teacher
  createSession: (payload) => api.post(`/api/attendance/create-session`, payload),
  closeSession: (sessionId) => api.post(`/api/attendance/close-session/${sessionId}`),
  approveLeave: (leaveId) => api.put(`/api/attendance/leave-approve/${leaveId}`),
};
