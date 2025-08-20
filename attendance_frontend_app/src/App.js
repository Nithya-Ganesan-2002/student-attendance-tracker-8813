import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AppShell from "./AppShell";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Classes from "./pages/Classes";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { getSupabaseClient } from "./lib/supabaseClient";

// PUBLIC_INTERFACE
function App() {
  /** Main application component with routes and auth guard. */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function RequireAuth() {
  /** Simple auth guard that redirects to /login if no session. */
  const [checked, setChecked] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setAuthed(Boolean(data?.session));
        setChecked(true);
      } catch {
        if (!mounted) return;
        setAuthed(false);
        setChecked(true);
      }
    })();
    return () => (mounted = false);
  }, []);

  if (!checked) return <div className="card">Checking session…</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return <React.Fragment><Routes><Route path="*" element={<AppShell />} /></Routes></React.Fragment>;
}

export default App;
