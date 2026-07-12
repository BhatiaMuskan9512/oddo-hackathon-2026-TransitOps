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

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "1.25rem 1.5rem",
      border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 12, border: `1px solid ${color}30`,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 800, color: "#1e293b" }}>
        {value}
      </div>
    </div>
  );
}

export default function SafetyDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  const isExpired = (expiry) => new Date(expiry) < new Date();
  const isExpiringSoon = (expiry) => {
    const days = (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 30;
  };

  const expiredCount = drivers.filter(d => isExpired(d.license_expiry)).length;
  const expiringSoonCount = drivers.filter(d => isExpiringSoon(d.license_expiry)).length;
  const suspendedCount = drivers.filter(d => d.status === "Suspended").length;
  const avgSafetyScore = drivers.length
    ? Math.round(drivers.reduce((sum, d) => sum + d.safety_score, 0) / drivers.length)
    : 0;

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/drivers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...token() },
        body: JSON.stringify({ status }),
      });
      fetchDrivers();
    } catch {
      alert("Could not update driver status");
    }
  };

  return (
    <Layout>
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1a1035 100%)",
        borderRadius: 18, padding: "1.75rem 2rem", marginBottom: "1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 65%)",
          top: -80, right: -60, pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Good day,</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            {user.name || "Safety Officer"} 🛡️
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Keep an eye on driver compliance and license validity.
          </div>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
        gap: 14, marginBottom: "1.5rem",
      }}>
        <StatCard icon="⚠️" label="Expired Licenses" value={expiredCount} color="#ef4444" />
        <StatCard icon="⏳" label="Expiring in 30 Days" value={expiringSoonCount} color="#f59e0b" />
        <StatCard icon="🚫" label="Suspended Drivers" value={suspendedCount} color="#94a3b8" />
        <StatCard icon="✅" label="Avg Safety Score" value={avgSafetyScore} color="#22c55e" />
      </div>

      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)", overflow: "hidden",
      }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontSize: 15, fontWeight: 800,
          color: "#1e293b", padding: "16px 20px", borderBottom: "1px solid #f1f5f9",
        }}>
          Driver Compliance
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading...</div>
        ) : drivers.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
            No drivers registered yet.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name", "License Expiry", "Safety Score", "Status", "Action"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700,
                    color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5,
                    borderBottom: "1px solid #f1f5f9",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{d.name}</td>
                  <td style={{
                    padding: "12px 20px", fontSize: 13,
                    color: isExpired(d.license_expiry) ? "#ef4444" : isExpiringSoon(d.license_expiry) ? "#f59e0b" : "#64748b",
                    fontWeight: isExpired(d.license_expiry) || isExpiringSoon(d.license_expiry) ? 700 : 400,
                  }}>
                    {d.license_expiry}
                    {isExpired(d.license_expiry) && " (Expired)"}
                    {!isExpired(d.license_expiry) && isExpiringSoon(d.license_expiry) && " (Soon)"}
                  </td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748b" }}>{d.safety_score}</td>
                  <td style={{ padding: "12px 20px" }}><Badge status={d.status} /></td>
                  <td style={{ padding: "12px 20px" }}>
                    {d.status === "Suspended" ? (
                      <button onClick={() => updateStatus(d.id, "Available")} style={{
                        background: "none", border: "1px solid #22c55e40", borderRadius: 8,
                        padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#22c55e", cursor: "pointer",
                      }}>Reinstate</button>
                    ) : (
                      <button onClick={() => updateStatus(d.id, "Suspended")} style={{
                        background: "none", border: "1px solid #ef444440", borderRadius: 8,
                        padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#ef4444", cursor: "pointer",
                      }}>Suspend</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}