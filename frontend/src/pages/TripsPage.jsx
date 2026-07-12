import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const API = "http://localhost:5000";

function Badge({ status }) {
  const map = {
    Draft:      ["#a855f7", "#faf5ff"],
    Dispatched: ["#3b82f6", "#eff6ff"],
    Completed:  ["#22c55e", "#f0fdf4"],
    Cancelled:  ["#94a3b8", "#f8fafc"],
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
  vehicle_id: "", driver_id: "", source: "", destination: "",
  cargo_weight: "", planned_distance: "", revenue: "",
};

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  useEffect(() => {
    fetchTrips();
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/trips`, { headers: token() });
      const data = await res.json();
      setTrips(data.trips || []);
    } catch {
      setTrips([]);
    }
    setLoading(false);
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API}/vehicles`, { headers: token() });
      const data = await res.json();
      // sirf Available vehicles hi trip mein select karne dena
      setVehicles((data.vehicles || []).filter(v => v.status === "Available"));
    } catch {
      setVehicles([]);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API}/drivers`, { headers: token() });
      const data = await res.json();
      setDrivers((data.drivers || []).filter(d => d.status === "Available"));
    } catch {
      setDrivers([]);
    }
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // client side check bhi kar lo, asli validation backend karega
    const vehicle = vehicles.find(v => v.id === Number(form.vehicle_id));
    if (vehicle && Number(form.cargo_weight) > vehicle.max_load_capacity) {
      alert(`Cargo weight exceeds vehicle capacity (${vehicle.max_load_capacity} kg)`);
      return;
    }

    try {
      const res = await fetch(`${API}/trips/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...token() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not create trip");
        return;
      }
      setShowModal(false);
      fetchTrips();
      fetchVehicles();
      fetchDrivers();
    } catch {
      alert("Could not reach server");
    }
  };

  const dispatchTrip = async (id) => {
    try {
      await fetch(`${API}/trips/${id}/dispatch`, { method: "PUT", headers: token() });
      fetchTrips();
      fetchVehicles();
      fetchDrivers();
    } catch {
      alert("Could not dispatch trip");
    }
  };

  const completeTrip = async (id) => {
    const final_odometer = prompt("Enter final odometer reading:");
    const fuel_consumed = prompt("Enter fuel consumed (liters):");
    if (!final_odometer || !fuel_consumed) return;
    try {
      await fetch(`${API}/trips/${id}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...token() },
        body: JSON.stringify({ final_odometer, fuel_consumed }),
      });
      fetchTrips();
      fetchVehicles();
      fetchDrivers();
    } catch {
      alert("Could not complete trip");
    }
  };

  const cancelTrip = async (id) => {
    if (!confirm("Cancel this trip?")) return;
    try {
      await fetch(`${API}/trips/${id}/cancel`, { method: "PUT", headers: token() });
      fetchTrips();
      fetchVehicles();
      fetchDrivers();
    } catch {
      alert("Could not cancel trip");
    }
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>
            Trips
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
            Create and track trips from dispatch to completion
          </div>
        </div>
        <button onClick={openAdd} style={{
          background: "#FF6B6B", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,107,0.35)",
        }}>
          + New Trip
        </button>
      </div>

      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)", overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading...</div>
        ) : trips.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
            No trips yet. Click "New Trip" to create one.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["#", "Source", "Destination", "Driver", "Vehicle", "Cargo (kg)", "Status", "Actions"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700,
                    color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5,
                    borderBottom: "1px solid #f1f5f9",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trips.map(t => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>#{t.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{t.source}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#1e293b" }}>{t.destination}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{t.driver_name || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{t.vehicle_name || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{t.cargo_weight}</td>
                  <td style={{ padding: "12px 16px" }}><Badge status={t.trip_status} /></td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                    {t.trip_status === "Draft" && (
                      <button onClick={() => dispatchTrip(t.id)} style={actionBtn("#3b82f6")}>Dispatch</button>
                    )}
                    {t.trip_status === "Dispatched" && (
                      <button onClick={() => completeTrip(t.id)} style={actionBtn("#22c55e")}>Complete</button>
                    )}
                    {(t.trip_status === "Draft" || t.trip_status === "Dispatched") && (
                      <button onClick={() => cancelTrip(t.id)} style={actionBtn("#ef4444")}>Cancel</button>
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
          <form onSubmit={handleCreate} style={{
            background: "#fff", borderRadius: 18, padding: "1.75rem 2rem",
            width: 420, maxHeight: "85vh", overflowY: "auto",
          }}>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, marginBottom: 18, color: "#1e293b" }}>
              New Trip
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Vehicle</label>
              <select value={form.vehicle_id} onChange={set("vehicle_id")} required style={inputStyle}>
                <option value="">Select available vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.vehicle_name} — {v.registration_number} (max {v.max_load_capacity}kg)</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Driver</label>
              <select value={form.driver_id} onChange={set("driver_id")} required style={inputStyle}>
                <option value="">Select available driver</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} — {d.license_number}</option>
                ))}
              </select>
            </div>

            {[
              ["source", "Source", "text"],
              ["destination", "Destination", "text"],
              ["cargo_weight", "Cargo Weight (kg)", "number"],
              ["planned_distance", "Planned Distance (km)", "number"],
              ["revenue", "Expected Revenue (₹)", "number"],
            ].map(([key, label, type]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{label}</label>
                <input type={type} value={form[key]} onChange={set(key)} required style={inputStyle} />
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button type="button" onClick={() => setShowModal(false)} style={{
                flex: 1, padding: 11, borderRadius: 10, background: "#f1f5f9",
                border: "none", fontSize: 13, fontWeight: 700, color: "#475569", cursor: "pointer",
              }}>Cancel</button>
              <button type="submit" style={{
                flex: 1, padding: 11, borderRadius: 10, background: "#FF6B6B",
                border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
              }}>Create Trip</button>
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
const actionBtn = (color) => ({
  background: "none", border: `1px solid ${color}40`, borderRadius: 8,
  padding: "5px 10px", fontSize: 12, fontWeight: 600, color, cursor: "pointer",
});