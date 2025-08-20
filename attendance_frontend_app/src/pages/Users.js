import React, { useEffect, useState } from "react";
import { UserAPI } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", role: "student" });

  async function refresh() {
    try {
      const list = await UserAPI.listUsers();
      setUsers(list || []);
    } catch {}
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addUser(e) {
    e.preventDefault();
    if (!form.email.trim()) return;
    try {
      await UserAPI.createUser(form);
      setForm({ email: "", role: "student" });
      refresh();
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  async function remove(id) {
    try {
      await UserAPI.deleteUser(id);
      refresh();
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  return (
    <div>
      <h2 className="title">Users</h2>
      <form className="card form" onSubmit={addUser}>
        <input placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <button className="btn" type="submit">Invite</button>
      </form>

      <div className="table">
        <div className="row header">
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>
        {users.map((u) => (
          <div className="row" key={u.id}>
            <div>{u.email}</div>
            <div>{u.role}</div>
            <div>
              <button className="btn-secondary" onClick={() => remove(u.id)}>Remove</button>
            </div>
          </div>
        ))}
        {!users.length && <div className="row"><div>No users</div></div>}
      </div>
    </div>
  );
}
