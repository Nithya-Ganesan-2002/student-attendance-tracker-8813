import React, { useEffect, useState } from "react";
import { ClassAPI } from "../services/api";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");

  async function refresh() {
    try {
      const data = await ClassAPI.listClasses();
      setClasses(data || []);
    } catch {}
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addClass(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await ClassAPI.createClass({ name });
      setName("");
      refresh();
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  async function remove(id) {
    try {
      await ClassAPI.deleteClass(id);
      refresh();
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  return (
    <div>
      <h2 className="title">Classes</h2>
      <form className="card form" onSubmit={addClass}>
        <input placeholder="Class name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn" type="submit">Add</button>
      </form>
      <div className="list">
        {classes.map((c) => (
          <div className="list-item" key={c.id}>
            <div className="grow">
              <div className="item-title">{c.name}</div>
              <div className="item-subtitle">ID: {c.id}</div>
            </div>
            <div className="actions">
              <button className="btn-secondary" onClick={() => remove(c.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!classes.length && <div className="card">No classes yet.</div>}
      </div>
    </div>
  );
}
