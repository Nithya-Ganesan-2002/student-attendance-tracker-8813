import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut, getCurrentUser } from "./lib/supabaseClient";
import { NotificationAPI, UserAPI } from "./services/api";

/**
 * Responsive App Shell with sidebar navigation and top bar.
 */
export default function AppShell() {
  const [theme, setTheme] = useState("light");
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getCurrentUser();
        if (!u) {
          navigate("/login");
          return;
        }
        const p = await UserAPI.getProfile().catch(() => null);
        if (mounted) {
          setProfile(p || { role: "student", email: u.email });
        }
      } catch {
        navigate("/login");
      }
    })();

    // Load notifications
    (async () => {
      try {
        const list = await NotificationAPI.list();
        if (mounted) setNotifications(list || []);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const navItems = useMemo(() => {
    const items = [
      { to: "/dashboard", label: "Dashboard", roles: ["admin", "teacher", "student"] },
      { to: "/attendance", label: "Attendance", roles: ["teacher"] },
      { to: "/classes", label: "Classes", roles: ["admin"] },
      { to: "/users", label: "Users", roles: ["admin"] },
      { to: "/reports", label: "Reports", roles: ["admin", "teacher"] },
    ];
    const role = profile?.role || "student";
    return items.filter((i) => i.roles.includes(role));
  }, [profile]);

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Link to="/dashboard">Attendance</Link>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn-secondary" onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
            {theme === "light" ? "🌙" : "☀️"} Theme
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div />
          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
              🔔
              {notifications?.length ? <span className="badge">{notifications.length}</span> : null}
            </button>
            <div className="divider" />
            <span className="user-chip">{profile?.email || "User"}</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </div>
          {notifOpen && (
            <div className="notif-popover">
              <h4>Notifications</h4>
              {notifications?.length ? (
                <ul>
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <strong>{n.title || "Notice"}</strong>
                      <div className="notif-body">{n.message}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}
        </header>
        <section className="page">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
