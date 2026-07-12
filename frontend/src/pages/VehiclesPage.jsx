import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const API = "http://localhost:5000";
const TYPES = ["Truck", "Van", "Bus", "Car", "Trailer", "Tanker"];
const STATUSES = ["Available", "On_Trip", "In_Shop", "Retired"];

function Badge({ status }) {
  const map = {
    Available: ["#22c55e", "#f0fdf4"],
    On_Trip:   ["#3b82f6", "#eff6ff"],
    In_Shop:   ["#f59e0b", "#fffbeb"],
    Retired:   ["#94a3b8", "#f8fafc"],
  };
  const [c, bg] = map[status] || ["#64748b", "#f8fafc"];
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: c, background: bg, border: `1px solid ${c}30` }}>
      {status}
    </span>
  );
}

const EMPTY = { registration_number: "", vehicle_name: "", vehicle_type: "Truck", max_load_capacity: "", odometer: "", acquisition_cost: "", status: "Available" };

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => { fetchVehicles(); }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API}/vehicles`, { headers });
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch { toast.error("Could not load vehicles"); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (v) => {
    setForm({
      registration_number: v.registration_number,
      vehicle_name: v.vehicle_name,
      vehicle_type: v.vehicle_type,
      max_load_capacity: v.max_load_capacity,
      odometer: v.odometer,
      acquisition_cost: v.acquisition_cost,
      status: v.status,
    });
    setEditId(v.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editId ? `${API}/vehicles/${editId}` : `${API}/vehicles`;
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Error"); return; }
      toast.success(editId ? "Vehicle updated!" : "Vehicle added!");
      setShowForm(false);
      fetchVehicles();
    } catch { toast.error("Server error"); }
  };

  const inp = {
    width: "100%", padding: "10px 13px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#f8fafc",
    fontSize: 14, color: "#1e293b", outline: "none", fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const filtered = vehicles.filter(v =>
    v.registration_number?.toLowerCase().includes(search.toLowerCase()) ||
    v.vehicle_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>
            🚛 Vehicle Registry
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>
            {vehicles.length} vehicles registered
          </p>
        </div>
        <button onClick={openAdd} style={{
          background: "#FF6B6B", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 10, fontSize: 14,
          fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        }}>
          + Add Vehicle
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="🔍  Search by reg number or name..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inp, marginBottom: 16, maxWidth: 360 }}
      />

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Reg Number", "Name / Model", "Type", "Capacity (kg)", "Odometer", "Cost (₹)", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                No vehicles found. Click "+ Add Vehicle" to get started.
              </td></tr>
            ) : filtered.map((v, i) => (
              <tr key={v.id} style={{ borderTop: "1px solid #f1f5f9" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fffdf8"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "#1e293b", fontSize: 13 }}>{v.registration_number}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#1e293b" }}>{v.vehicle_name}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#64748b" }}>{v.vehicle_type}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#1e293b", fontWeight: 600 }}>{v.max_load_capacity} kg</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#64748b" }}>{v.odometer} km</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#64748b" }}>₹{Number(v.acquisition_cost).toLocaleString()}</td>
                <td style={{ padding: "12px 14px" }}><Badge status={v.status} /></td>
                <td style={{ padding: "12px 14px" }}>
                  <button onClick={() => openEdit(v)} style={{
                    background: "none", border: "1px solid #e2e8f0", borderRadius: 8,
                    padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#64748b",
                  }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, backdropFilter: "blur(3px)",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, padding: "2rem",
            width: "100%", maxWidth: 480,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, color: "#1e293b", marginBottom: 20 }}>
              {editId ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>

            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Registration No.*</label>
                  <input style={inp} required placeholder="MH01AB1234"
                    value={form.registration_number}
                    onChange={e => setForm(f => ({ ...f, registration_number: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Vehicle Name*</label>
                  <input style={inp} required placeholder="Tata 407"
                    value={form.vehicle_name}
                    onChange={e => setForm(f => ({ ...f, vehicle_name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Type*</label>
                  <select style={{ ...inp, cursor: "pointer" }} value={form.vehicle_type}
                    onChange={e => setForm(f => ({ ...f, vehicle_type: e.target.value }))}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Max Capacity (kg)*</label>
                  <input style={inp} required type="number" placeholder="1000"
                    value={form.max_load_capacity}
                    onChange={e => setForm(f => ({ ...f, max_load_capacity: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Odometer (km)</label>
                  <input style={inp} type="number" placeholder="0"
                    value={form.odometer}
                    onChange={e => setForm(f => ({ ...f, odometer: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Acquisition Cost (₹)*</label>
                  <input style={inp} required type="number" placeholder="500000"
                    value={form.acquisition_cost}
                    onChange={e => setForm(f => ({ ...f, acquisition_cost: e.target.value }))} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 }}>Status</label>
                <select style={{ ...inp, cursor: "pointer" }} value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{
                  flex: 1, padding: 12, borderRadius: 10, border: "1.5px solid #e2e8f0",
                  background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#64748b",
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  flex: 1, padding: 12, borderRadius: 10, border: "none",
                  background: "#FF6B6B", color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  {editId ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}