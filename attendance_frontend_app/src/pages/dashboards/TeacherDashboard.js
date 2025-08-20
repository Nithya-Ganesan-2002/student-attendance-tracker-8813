import React, { useEffect, useState } from "react";
import { AttendanceAPI, ClassAPI } from "../../services/api";
import { exportCSV } from "../../utils/export";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState("");
  const [today, setToday] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await ClassAPI.listClasses();
        if (mounted) {
          setClasses(list || []);
          if (list?.length) setSelected(list[0].id);
        }
      } catch {
        // ignore
      }
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!selected) return;
    (async () => {
      try {
        const t = await AttendanceAPI.getToday(selected);
        if (mounted) setToday(t || []);
      } catch {
        // ignore
      }
    })();
    return () => (mounted = false);
  }, [selected]);

  function handleExport() {
    const cols = ["student_name", "status", "timestamp"];
    exportCSV(today, cols, "today_attendance.csv");
  }

  return (
    <div>
      <h2 className="title">Teacher Dashboard</h2>
      <div className="toolbar">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="btn" onClick={handleExport}>Export CSV</button>
      </div>
      <div className="card">
        <h3>Today</h3>
        <div className="table">
          <div className="row header">
            <div>Student</div>
            <div>Status</div>
            <div>Time</div>
          </div>
          {today.map((r) => (
            <div className="row" key={r.id}>
              <div>{r.student_name}</div>
              <div>{r.status}</div>
              <div>{new Date(r.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
          {!today.length && <div className="row"><div>No records</div></div>}
        </div>
      </div>
    </div>
  );
}
