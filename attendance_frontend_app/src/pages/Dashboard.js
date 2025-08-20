import React, { useEffect, useState } from "react";
import { UserAPI } from "../services/api";
import AdminDashboard from "./dashboards/AdminDashboard";
import TeacherDashboard from "./dashboards/TeacherDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";

/**
 * Dashboard wrapper that chooses role-specific dashboard.
 */
export default function Dashboard() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await UserAPI.getProfile();
        if (mounted) setRole(me?.role || "student");
      } catch {
        if (mounted) setRole("student");
      }
    })();
    return () => (mounted = false);
  }, []);

  if (!role) return <div className="card">Loading dashboard…</div>;

  if (role === "admin") return <AdminDashboard />;
  if (role === "teacher") return <TeacherDashboard />;
  return <StudentDashboard />;
}
