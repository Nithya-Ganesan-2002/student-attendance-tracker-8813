import { APP_CONFIG } from "../config";
import { getSupabaseClient } from "../lib/supabaseClient";

/**
 * Lightweight REST API client using fetch with Supabase auth bearer token.
 */
async function getAuthHeader() {
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(await getAuthHeader()),
    ...(options.headers || {}),
  };

  const res = await fetch(`${APP_CONFIG.API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`API error: ${res.status} ${res.statusText} - ${text}`);
    err.status = res.status;
    throw err;
  }
  // Handle empty responses
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return res.text();
  }
  return res.json();
}

// PUBLIC_INTERFACE
export const AttendanceAPI = {
  /** Attendance related endpoints */
  getToday: (classId) => request(`/attendance/today?class_id=${encodeURIComponent(classId)}`),
  getByDateRange: (params) =>
    request(`/attendance/range?class_id=${encodeURIComponent(params.classId)}&start=${encodeURIComponent(params.start)}&end=${encodeURIComponent(params.end)}`),
  mark: (payload) => request(`/attendance/mark`, { method: "POST", body: JSON.stringify(payload) }),
};

// PUBLIC_INTERFACE
export const UserAPI = {
  /** User and role related endpoints */
  getProfile: () => request(`/users/me`),
  listUsers: () => request(`/users`),
  createUser: (payload) => request(`/users`, { method: "POST", body: JSON.stringify(payload) }),
  updateUser: (userId, payload) => request(`/users/${encodeURIComponent(userId)}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteUser: (userId) => request(`/users/${encodeURIComponent(userId)}`, { method: "DELETE" }),
};

// PUBLIC_INTERFACE
export const ClassAPI = {
  /** Class management endpoints */
  listClasses: () => request(`/classes`),
  createClass: (payload) => request(`/classes`, { method: "POST", body: JSON.stringify(payload) }),
  updateClass: (id, payload) => request(`/classes/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteClass: (id) => request(`/classes/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

// PUBLIC_INTERFACE
export const ReportAPI = {
  /** Report generation endpoints */
  summary: (params) =>
    request(`/reports/summary?class_id=${encodeURIComponent(params.classId)}&start=${encodeURIComponent(params.start)}&end=${encodeURIComponent(params.end)}`),
  exportCSV: (params) =>
    request(`/reports/export/csv?class_id=${encodeURIComponent(params.classId)}&start=${encodeURIComponent(params.start)}&end=${encodeURIComponent(params.end)}`),
  exportPDF: (params) =>
    request(`/reports/export/pdf?class_id=${encodeURIComponent(params.classId)}&start=${encodeURIComponent(params.start)}&end=${encodeURIComponent(params.end)}`),
};

// PUBLIC_INTERFACE
export const NotificationAPI = {
  /** Notification related endpoints */
  list: () => request(`/notifications`),
  acknowledge: (id) => request(`/notifications/${encodeURIComponent(id)}/ack`, { method: "POST" }),
};
