import React, { useEffect, useMemo, useRef, useState } from "react";
import { ClassAPI, ReportAPI } from "../services/api";
import { exportCSV, exportPDF } from "../utils/export";

export default function Reports() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [start, setStart] = useState(() => new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString().slice(0, 10));
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState([]);
  const reportRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await ClassAPI.listClasses();
        if (mounted) {
          setClasses(list || []);
          if (list?.length) setClassId(list[0].id);
        }
      } catch {}
    })();
    return () => (mounted = false);
  }, []);

  const canQuery = useMemo(() => Boolean(classId && start && end), [classId, start, end]);

  async function runReport() {
    if (!canQuery) return;
    try {
      const data = await ReportAPI.summary({ classId, start, end });
      setRows(data?.rows || []);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  function handleCSV() {
    if (!rows.length) return;
    const cols = ["student_name", "present", "absent", "rate"];
    exportCSV(rows, cols, "attendance_report.csv");
  }

  function handlePDF() {
    if (!reportRef.current) return;
    exportPDF(reportRef.current.innerHTML, "attendance_report.pdf");
  }

  return (
    <div>
      <h2 className="title">Reports</h2>
      <div className="card form">
        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        <button className="btn" onClick={runReport} disabled={!canQuery}>Run</button>
        <div className="spacer" />
        <button className="btn-secondary" onClick={handleCSV} disabled={!rows.length}>Export CSV</button>
        <button className="btn-secondary" onClick={handlePDF} disabled={!rows.length}>Export PDF</button>
      </div>

      <div className="card" ref={reportRef}>
        <div className="table">
          <div className="row header">
            <div>Student</div>
            <div>Present</div>
            <div>Absent</div>
            <div>Rate</div>
          </div>
          {rows.map((r, idx) => (
            <div className="row" key={idx}>
              <div>{r.student_name}</div>
              <div>{r.present}</div>
              <div>{r.absent}</div>
              <div>{Math.round((r.rate || 0) * 100)}%</div>
            </div>
          ))}
          {!rows.length && <div className="row"><div>No data</div></div>}
        </div>
      </div>
    </div>
  );
}
