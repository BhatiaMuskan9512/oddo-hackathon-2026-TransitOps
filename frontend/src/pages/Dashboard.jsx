import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const API = "http://localhost:5000";

// Small KPI card
function KPICard({ icon, label, value, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "1.25rem 1.5rem",
      border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: color + "18", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 12,
        border: `1px solid ${color}30`,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 800, color: "#1e293b" }}>
        {value}
      </div>
    </div>
  );
}

// Status badge
function Badge({ status }) {
  const map = {
    Available: ["#22c55e", "#f0fdf4"],
    On_Trip:   ["#3b82f6", "#eff6ff"],
    In_Shop:   ["#f59e0b", "#fffbeb"],
    Retired:   ["#94a3b8", "#f8fafc"],
    Dispatched:["#3b82f6", "#eff6ff"],
    Completed: ["#22c55e", "#f0fdf4"],
    Cancelled: ["#94a3b8", "#f8fafc"],
    Draft:     ["#a855f7", "#faf5ff"],
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

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTrips();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setStats(data);
    } catch {
      // show zeros if server down
      setStats({ active_vehicles: 0, available_vehicles: 0, in_maintenance: 0, active_trips: 0, pending_trips: 0, drivers_on_duty: 0, fleet_utilization: 0 });
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${API}/trips`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setRecentTrips((data.trips || []).slice(0, 5));
    } catch {
      setRecentTrips([]);
    }
  };

  const kpis = stats ? [
    { icon: "🚛", label: "Active Vehicles",    value: stats.active_vehicles,    color: "#3b82f6" },
    { icon: "✅", label: "Available Vehicles",  value: stats.available_vehicles,  color: "#22c55e" },
    { icon: "🔧", label: "In Maintenance",      value: stats.in_maintenance,      color: "#f59e0b" },
    { icon: "📍", label: "Active Trips",         value: stats.active_trips,        color: "#FF6B6B" },
    { icon: "📋", label: "Pending Trips",        value: stats.pending_trips,       color: "#a855f7" },
    { icon: "👤", label: "Drivers On Duty",     value: stats.drivers_on_duty,     color: "#0ea5e9" },
  ] : [];

  return (
    <Layout>
      {/* Welcome */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1a1035 100%)",
        borderRadius: 18, padding: "1.75rem 2rem",
        marginBottom: "1.5rem", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 65%)",
          top: -80, right: -60, pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Good day,</div>
          <div style={{
            fontFamily: "Playfair Display, serif", fontSize: 22,
            fontWeight: 800, color: "#fff", marginBottom: 8,
          }}>
            {JSON.parse(localStorage.getItem("user") || "{}").name || "Manager"} 👋
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Here's what's happening with your fleet today.
          </div>
          {stats && (
            <div style={{
              marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,107,107,0.15)", borderRadius: 20,
              padding: "6px 16px", border: "1px solid rgba(255,107,107,0.3)",
            }}>
              <span style={{ fontSize: 13, color: "#fca5a5" }}>Fleet Utilization</span>
              <span style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, color: "#FF6B6B" }}>
                {stats.fleet_utilization}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
        gap: 14, marginBottom: "1.5rem",
      }}>
        {stats === null
          ? [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", border: "1px solid #f1f5f9", height: 110 }} />
          ))
          : kpis.map((k, i) => <KPICard key={i} {...k} />)
        }
      </div>

      {/* Recent Trips */}
      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
        padding: "1.25rem 1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontSize: 16,
          fontWeight: 800, color: "#1e293b", marginBottom: 16,
        }}>
          📍 Recent Trips
        </div>

        {recentTrips.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontSize: 14 }}>
            No trips yet. Create your first trip from the Trips page.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["#", "Source", "Destination", "Driver", "Vehicle", "Status"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "8px 12px",
                    fontSize: 11, fontWeight: 700, color: "#94a3b8",
                    textTransform: "uppercase", letterSpacing: 0.5,
                    borderBottom: "1px solid #f1f5f9",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((t, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#64748b" }}>#{t.id}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{t.source}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#1e293b" }}>{t.destination}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#64748b" }}>{t.driver_name || "—"}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#64748b" }}>{t.vehicle_name || "—"}</td>
                  <td style={{ padding: "10px 12px" }}><Badge status={t.trip_status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}