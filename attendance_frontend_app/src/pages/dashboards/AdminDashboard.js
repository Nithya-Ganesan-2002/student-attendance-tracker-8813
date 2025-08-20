import React, { useEffect, useState } from "react";
import { ClassAPI, ReportAPI, UserAPI } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ classes: 0, users: 0, attendanceRate: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [classes, users, report] = await Promise.all([
          ClassAPI.listClasses(),
          UserAPI.listUsers(),
          ReportAPI.summary({ classId: "all", start: new Date().toISOString().slice(0, 10), end: new Date().toISOString().slice(0, 10) }).catch(() => ({ rate: 0 })),
        ]);
        if (mounted) {
          setStats({
            classes: classes?.length || 0,
            users: users?.length || 0,
            attendanceRate: report?.rate || 0,
          });
        }
      } catch {
        // ignore
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h2 className="title">Admin Dashboard</h2>
      <div className="grid">
        <div className="card">
          <div className="stat-label">Classes</div>
          <div className="stat-value">{stats.classes}</div>
        </div>
        <div className="card">
          <div className="stat-label">Users</div>
          <div className="stat-value">{stats.users}</div>
        </div>
        <div className="card">
          <div className="stat-label">Today Attendance Rate</div>
          <div className="stat-value">{Math.round(stats.attendanceRate * 100)}%</div>
        </div>
      </div>
      <p className="muted">Use the sidebar to manage classes, users, and reports.</p>
    </div>
  );
}
