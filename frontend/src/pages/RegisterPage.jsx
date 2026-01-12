// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/auth.js";

export default function RegisterPage() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    setOkMsg("");

    if (password !== confirm) {
      setMsg("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = registerUser({ username, password, role });
      if (!res?.ok) {
        setMsg(res?.message || "Đăng ký thất bại");
        return;
      }

      setOkMsg("✅ Đăng ký thành công! Đang chuyển về trang đăng nhập...");
      setTimeout(() => nav("/login"), 900);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Đăng ký</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Tài khoản (email)
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập email"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            required
          />
        </label>

        <label>
          Vai trò
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            required
          />
        </label>

        <label>
          Nhập lại mật khẩu
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            required
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: 10, cursor: "pointer" }}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      {msg ? <p style={{ marginTop: 12, color: "tomato" }}>{msg}</p> : null}
      {okMsg ? <p style={{ marginTop: 12, color: "limegreen" }}>{okMsg}</p> : null}

      <p style={{ marginTop: 12 }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
