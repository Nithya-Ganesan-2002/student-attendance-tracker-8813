import React, { useEffect, useState } from "react";
import { AttendanceAPI, ClassAPI } from "../services/api";

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await ClassAPI.listClasses();
        if (mounted) {
          setClasses(list || []);
          if (list?.length) setSelected(list[0].id);
        }
      } catch {}
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!selected) return;
    (async () => {
      try {
        const t = await AttendanceAPI.getToday(selected);
        if (mounted) setStudents(t || []);
      } catch {}
    })();
    return () => (mounted = false);
  }, [selected]);

  async function mark(studentId, status) {
    try {
      await AttendanceAPI.mark({ class_id: selected, student_id: studentId, status });
      const t = await AttendanceAPI.getToday(selected);
      setStudents(t || []);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(`Failed to mark attendance: ${e.message}`);
    }
  }

  return (
    <div>
      <h2 className="title">Mark Attendance</h2>
      <div className="toolbar">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="list">
        {students.map((s) => (
          <div className="list-item" key={s.student_id}>
            <div className="grow">
              <div className="item-title">{s.student_name}</div>
              <div className="item-subtitle">Status: {s.status || "unmarked"}</div>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => mark(s.student_id, "present")}>Present</button>
              <button className="btn-secondary" onClick={() => mark(s.student_id, "absent")}>Absent</button>
            </div>
          </div>
        ))}
        {!students.length && <div className="card">No students found.</div>}
      </div>
    </div>
  );
}
