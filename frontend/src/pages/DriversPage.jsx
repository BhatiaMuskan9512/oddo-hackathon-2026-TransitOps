import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const API = "http://localhost:5000";

function Badge({ status }) {
  const map = {
    Available: ["#22c55e", "#f0fdf4"],
    On_Trip:   ["#3b82f6", "#eff6ff"],
    Off_Duty:  ["#f59e0b", "#fffbeb"],
    Suspended: ["#ef4444", "#fef2f2"],
  };
  const [clr, bg] = map[status] || ["#64748b", "#f8fafc"];
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      color: clr, background: bg, border: `1px solid ${clr}30`,
    }}>
      {status}
    </span>
  );
}

const EMPTY_FORM = {
  name: "", license_number: "", license_category: "",
  license_expiry: "", contact_number: "", safety_score: 100, status: "Available",
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/drivers`, { headers: token() });
      const data = await res.json();
      setDrivers(data.drivers || []);
    } catch {
      setDrivers([]);
    }
    setLoading(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({
      name: d.name, license_number: d.license_number,
      license_category: d.license_category, license_expiry: d.license_expiry,
      contact_number: d.contact_number, safety_score: d.safety_score, status: d.status,
    });
    setShowModal(true);
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API}/drivers/${editingId}` : `${API}/drivers`;
    const method = editingId ? "PUT" : "POST";
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...token() },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      fetchDrivers();
    } catch {
      alert("Could not save driver. Check if backend is running.");
    }
  };

  const isExpiringSoon = (expiry) => {
    const days = (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 30;
  };
  const isExpired = (expiry) => new Date(expiry) < new Date();

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>
            Drivers
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
            Manage driver profiles, licenses and status
          </div>
        </div>
        <button onClick={openAdd} style={{
          background: "#FF6B6B", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,107,0.35)",
        }}>
          + Add Driver
        </button>
      </div>

      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)", overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading...</div>
        ) : drivers.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
            No drivers yet. Click "Add Driver" to register one.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name", "License No.", "Category", "Expiry", "Contact", "Safety Score", "Status", ""].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700,
                    color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5,
                    borderBottom: "1px solid #f1f5f9",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{d.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.license_number}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.license_category}</td>
                  <td style={{
                    padding: "12px 16px", fontSize: 13,
                    color: isExpired(d.license_expiry) ? "#ef4444" : isExpiringSoon(d.license_expiry) ? "#f59e0b" : "#64748b",
                    fontWeight: isExpired(d.license_expiry) || isExpiringSoon(d.license_expiry) ? 700 : 400,
                  }}>
                    {d.license_expiry}
                    {isExpired(d.license_expiry) && " (Expired)"}
                    {!isExpired(d.license_expiry) && isExpiringSoon(d.license_expiry) && " (Soon)"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.contact_number}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{d.safety_score}</td>
                  <td style={{ padding: "12px 16px" }}><Badge status={d.status} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => openEdit(d)} style={{
                      background: "none", border: "1px solid #e2e8f0", borderRadius: 8,
                      padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer",
                    }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
        }}>
          <form onSubmit={handleSave} style={{
            background: "#fff", borderRadius: 18, padding: "1.75rem 2rem",
            width: 420, maxHeight: "85vh", overflowY: "auto",
          }}>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, marginBottom: 18, color: "#1e293b" }}>
              {editingId ? "Edit Driver" : "Add Driver"}
            </div>

            {[
              ["name", "Full Name", "text"],
              ["license_number", "License Number", "text"],
              ["license_category", "License Category", "text"],
              ["license_expiry", "License Expiry", "date"],
              ["contact_number", "Contact Number", "text"],
              ["safety_score", "Safety Score", "number"],
            ].map(([key, label, type]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={set(key)}
                  required
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 10,
                    border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none",
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Status</label>
              <select value={form.status} onChange={set("status")} style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none",
              }}>
                {["Available", "On_Trip", "Off_Duty", "Suspended"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => setShowModal(false)} style={{
                flex: 1, padding: 11, borderRadius: 10, background: "#f1f5f9",
                border: "none", fontSize: 13, fontWeight: 700, color: "#475569", cursor: "pointer",
              }}>Cancel</button>
              <button type="submit" style={{
                flex: 1, padding: 11, borderRadius: 10, background: "#FF6B6B",
                border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
              }}>Save</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}