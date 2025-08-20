import React, { useEffect, useState } from "react";
import { ReportAPI } from "../../services/api";

export default function StudentDashboard() {
  const [summary, setSummary] = useState({ rate: 0, total: 0, present: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const s = await ReportAPI.summary({ classId: "mine", start: today, end: today });
        if (mounted) setSummary(s || { rate: 0, total: 0, present: 0 });
      } catch {
        // ignore
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h2 className="title">Student Dashboard</h2>
      <div className="grid">
        <div className="card">
          <div className="stat-label">Today Present</div>
          <div className="stat-value">{summary.present}</div>
        </div>
        <div className="card">
          <div className="stat-label">Total Classes</div>
          <div className="stat-value">{summary.total}</div>
        </div>
        <div className="card">
          <div className="stat-label">Attendance Rate</div>
          <div className="stat-value">{Math.round((summary.rate || 0) * 100)}%</div>
        </div>
      </div>
      <p className="muted">Check notifications for attendance updates.</p>
    </div>
  );
}
