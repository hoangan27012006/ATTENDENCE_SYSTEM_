import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "attendance_teacher_classes_v1";

const DAYS = [
  { value: "MON", label: "Thứ 2" },
  { value: "TUE", label: "Thứ 3" },
  { value: "WED", label: "Thứ 4" },
  { value: "THU", label: "Thứ 5" },
  { value: "FRI", label: "Thứ 6" },
  { value: "SAT", label: "Thứ 7" },
  { value: "SUN", label: "Chủ nhật" },
];

const PERIODS = [1, 2, 3, 4];

function dayLabel(value) {
  return DAYS.find((d) => d.value === value)?.label ?? value;
}

function normalizeCode(code) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

function loadClasses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function TeacherClassesPage() {
  const navigate = useNavigate();

  // ✅ Load & Save localStorage
  const [classes, setClasses] = useState(() => loadClasses());
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    } catch {}
  }, [classes]);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    subjectName: "",
    subjectCode: "",
    teacherName: "",
    dayOfWeek: "MON",
    period: 1,
  });

  const [errors, setErrors] = useState({});

  // ✅ Search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;

    return classes.filter((c) => {
      const name = (c.subjectName || "").toLowerCase();
      const code = (c.subjectCode || "").toLowerCase();
      const teacher = (c.teacherName || "").toLowerCase();
      return name.includes(q) || code.includes(q) || teacher.includes(q);
    });
  }, [classes, query]);

  function validate(nextForm) {
    const e = {};
    if (!nextForm.subjectName.trim()) e.subjectName = "Vui lòng nhập tên môn học.";
    if (!nextForm.subjectCode.trim()) e.subjectCode = "Vui lòng nhập mã môn.";
    if (!nextForm.teacherName.trim()) e.teacherName = "Vui lòng nhập tên giảng viên.";

    const code = normalizeCode(nextForm.subjectCode);
    if (classes.some((c) => c.subjectCode === code)) e.subjectCode = "Mã môn đã tồn tại.";

    return e;
  }

  function resetForm() {
    setForm({
      subjectName: "",
      subjectCode: "",
      teacherName: "",
      dayOfWeek: "MON",
      period: 1,
    });
    setErrors({});
  }

  function closeModal() {
    setOpen(false);
    resetForm();
  }

  function submit(e) {
    e.preventDefault();

    const nextForm = {
      subjectName: form.subjectName.trim(),
      subjectCode: normalizeCode(form.subjectCode),
      teacherName: form.teacherName.trim(),
      dayOfWeek: form.dayOfWeek,
      period: Number(form.period),
    };

    const eMap = validate(nextForm);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setClasses((prev) => [{ id: crypto.randomUUID(), ...nextForm }, ...prev]);
    closeModal();
  }

  // ✅ Xóa 1 lớp
  function deleteClass(classId) {
    const ok = window.confirm("Bạn chắc chắn muốn xóa lớp này?");
    if (!ok) return;

    setClasses((prev) => prev.filter((x) => x.id !== classId));
  }

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Teacher Classes</h1>
      <div style={{ color: "#555", marginBottom: 16 }}>Tạo class + tìm kiếm (dữ liệu được lưu)</div>

      {/* TOP BAR */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên môn / mã môn / giảng viên..."
          style={{
            padding: 10,
            width: 420,
            maxWidth: "100%",
            border: "1px solid #ccc",
            borderRadius: 10,
          }}
        />

        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          + Tạo class
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <Stat label="Tổng lớp" value={classes.length} />
        <Stat label="Đang hiển thị" value={filtered.length} />
        <Stat label="Ca học" value="1–4" />
      </div>

      {/* LIST */}
      <div style={{ marginTop: 18 }}>
        {classes.length === 0 ? (
          <div style={{ padding: 18, border: "1px dashed #bbb", borderRadius: 12, background: "#fafafa" }}>
            Chưa có lớp nào. Bấm <b>“+ Tạo class”</b> để tạo lớp đầu tiên.
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 18, border: "1px dashed #bbb", borderRadius: 12, background: "#fafafa" }}>
            Không tìm thấy môn phù hợp.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              style={{
                padding: 16,
                marginBottom: 12,
                border: "1px solid #e5e5e5",
                borderRadius: 14,
                background: "#fff",
              }}
            >
              {/* ✅ Môn - Mã môn */}
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {c.subjectName} - {c.subjectCode}
              </div>

              {/* ✅ Ngày - Ca */}
              <div style={{ marginTop: 6 }}>{dayLabel(c.dayOfWeek)} - Ca {c.period}</div>

              {/* ✅ GV nằm dưới */}
              <div style={{ marginTop: 4, color: "#555" }}>GV: {c.teacherName}</div>

              {/* ✅ ACTIONS */}
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {/* Quản lý điểm danh */}
                <button
                  type="button"
                  onClick={() => navigate(`/teacher/classes/${c.id}/sessions`, { state: { classInfo: c } })}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Quản lý buổi điểm danh
                </button>

                {/* ✅ Duyệt đơn vắng */}
                <button
                  type="button"
                  onClick={() => navigate(`/teacher/classes/${c.id}/leave`, { state: { classInfo: c } })}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Duyệt đơn vắng
                </button>

                {/* ✅ Xóa lớp */}
                <button
                  type="button"
                  onClick={() => deleteClass(c.id)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #f3c2c2",
                    background: "#fff5f5",
                    color: "#b00020",
                    cursor: "pointer",
                  }}
                >
                  Xóa lớp
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL CREATE */}
      {open ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 999,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #eee",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Tạo class mới</div>
              <div style={{ color: "#666", marginTop: 4 }}>
                Nhập: Tên môn, Mã môn, Tên giảng viên, Ngày học (T2–CN), Ca (1–4).
              </div>
            </div>

            <form onSubmit={submit} style={{ padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                  label="Tên môn học"
                  value={form.subjectName}
                  onChange={(v) => setForm((p) => ({ ...p, subjectName: v }))}
                  error={errors.subjectName}
                  placeholder="VD: Công nghệ phần mềm"
                />
                <Field
                  label="Mã môn"
                  value={form.subjectCode}
                  onChange={(v) => setForm((p) => ({ ...p, subjectCode: v }))}
                  error={errors.subjectCode}
                  placeholder="VD: SE001"
                />
                <Field
                  label="Tên giảng viên"
                  value={form.teacherName}
                  onChange={(v) => setForm((p) => ({ ...p, teacherName: v }))}
                  error={errors.teacherName}
                  placeholder="VD: ThS. Nguyễn Văn A"
                />

                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Ngày học</div>
                  <select
                    value={form.dayOfWeek}
                    onChange={(e) => setForm((p) => ({ ...p, dayOfWeek: e.target.value }))}
                    style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
                  >
                    {DAYS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Ca học</div>
                  <select
                    value={form.period}
                    onChange={(e) => setForm((p) => ({ ...p, period: Number(e.target.value) }))}
                    style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
                  >
                    {PERIODS.map((p) => (
                      <option key={p} value={p}>
                        Ca {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: "#fff" }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff" }}
                >
                  Tạo class
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ====== UI small components ====== */
function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 180, padding: 12, border: "1px solid #e5e5e5", borderRadius: 12, background: "#fff" }}>
      <div style={{ color: "#666", fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 22, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, error }) {
  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 10,
          border: error ? "1px solid #ff8a8a" : "1px solid #ccc",
          background: error ? "#fff2f2" : "#fff",
        }}
      />
      {error ? <div style={{ color: "#b00020", marginTop: 4, fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}
