import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const API = "http://localhost:5000";

function Badge({ status }) {
  const [clr, bg] = status === "Completed" ? ["#22c55e", "#f0fdf4"] : ["#f59e0b", "#fffbeb"];
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      color: clr, background: bg, border: `1px solid ${clr}30`,
    }}>
      {status}
    </span>
  );
}

const EMPTY_FORM = { vehicle_id: "", description: "", cost: "", date: "" };

export default function MaintenancePage() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  useEffect(() => {
    fetchLogs();
    fetchVehicles();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/maintenance`, { headers: token() });
      const data = await res.json();
      setLogs(data.maintenance_logs || []);
    } catch {
      setLogs([]);
    }
    setLoading(false);
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API}/vehicles`, { headers: token() });
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch {
      setVehicles([]);
    }
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/maintenance`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...token() },
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchLogs();
      fetchVehicles();
    } catch {
      alert("Could not add maintenance record");
    }
  };

  const closeRecord = async (id) => {
    if (!confirm("Mark this maintenance as completed? Vehicle will become Available again.")) return;
    try {
      await fetch(`${API}/maintenance/${id}/close`, { method: "PUT", headers: token() });
      fetchLogs();
      fetchVehicles();
    } catch {
      alert("Could not close maintenance record");
    }
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div><br></br><br></br>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>
            Maintenance
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
            Track repairs and service history for every vehicle
          </div>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: "#FF6B6B", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,107,0.35)",
        }}>
          + Add Record
        </button>
      </div>

      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)", overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
            No maintenance records yet.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Vehicle", "Description", "Cost (₹)", "Date", "Status", ""].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700,
                    color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5,
                    borderBottom: "1px solid #f1f5f9",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(m => (
                <tr key={m.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{m.vehicle_name || `#${m.vehicle_id}`}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{m.description}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>₹{m.cost}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{m.date}</td>
                  <td style={{ padding: "12px 16px" }}><Badge status={m.status} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    {m.status !== "Completed" && (
                      <button onClick={() => closeRecord(m.id)} style={{
                        background: "none", border: "1px solid #22c55e40", borderRadius: 8,
                        padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#22c55e", cursor: "pointer",
                      }}>Mark Complete</button>
                    )}
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
          <form onSubmit={handleAdd} style={{
            background: "#fff", borderRadius: 18, padding: "1.75rem 2rem", width: 400,
          }}>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, marginBottom: 18, color: "#1e293b" }}>
              Add Maintenance Record
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Vehicle</label>
              <select value={form.vehicle_id} onChange={set("vehicle_id")} required style={inputStyle}>
                <option value="">Select vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.vehicle_name} — {v.registration_number}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Description</label>
              <input type="text" placeholder="e.g. Oil change" value={form.description} onChange={set("description")} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Cost (₹)</label>
              <input type="number" value={form.cost} onChange={set("cost")} required style={inputStyle} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.date} onChange={set("date")} required style={inputStyle} />
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

const labelStyle = { fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 };
const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none",
};