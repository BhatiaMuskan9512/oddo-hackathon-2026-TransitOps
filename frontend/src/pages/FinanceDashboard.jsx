import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const API = "http://localhost:5000";

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

export default function FinanceDashboard() {
  const [report, setReport] = useState(null);
  const [vehicleReports, setVehicleReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/reports`, { headers: token() });
      const data = await res.json();
      setReport(data.summary || null);
      setVehicleReports(data.vehicles || []);
    } catch {
      setReport(null);
      setVehicleReports([]);
    }
    setLoading(false);
  };

  const exportCSV = () => {
    if (vehicleReports.length === 0) return;
    const headers = ["Vehicle", "Fuel Cost (₹)", "Maintenance Cost (₹)", "Operational Cost (₹)", "ROI (%)"];
    const rows = vehicleReports.map(v => [
      v.vehicle_name, v.fuel_cost, v.maintenance_cost, v.operational_cost, v.roi
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transitops_finance_report.csv";
    a.click();
    URL.revokeObjectURL(url);
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
            {user.name || "Financial Analyst"} 💰
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Here's the cost breakdown across your fleet.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, color: "#1e293b" }}>
          Cost Overview
        </div>
        <button onClick={exportCSV} style={{
          background: "#fff", color: "#475569", border: "1px solid #e2e8f0",
          padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          ⬇ Export CSV
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading...</div>
      ) : (
        <>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            gap: 14, marginBottom: "1.5rem",
          }}>
            <StatCard icon="⛽" label="Total Fuel Cost" value={`₹${report?.total_fuel_cost ?? 0}`} color="#3b82f6" />
            <StatCard icon="🔧" label="Total Maintenance Cost" value={`₹${report?.total_maintenance_cost ?? 0}`} color="#f59e0b" />
            <StatCard icon="💸" label="Total Operational Cost" value={`₹${report?.total_operational_cost ?? 0}`} color="#FF6B6B" />
            <StatCard icon="📈" label="Avg Vehicle ROI" value={`${report?.avg_roi ?? 0}%`} color="#22c55e" />
          </div>

          <div style={{
            background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)", overflow: "hidden",
          }}>
            <div style={{
              fontFamily: "Playfair Display, serif", fontSize: 15, fontWeight: 800,
              color: "#1e293b", padding: "16px 20px", borderBottom: "1px solid #f1f5f9",
            }}>
              Per-Vehicle Cost Breakdown
            </div>
            {vehicleReports.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                No cost data yet.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Vehicle", "Fuel Cost", "Maintenance Cost", "Total Cost", "ROI"].map(h => (
                      <th key={h} style={{
                        textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 700,
                        color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5,
                        borderBottom: "1px solid #f1f5f9",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicleReports.map(v => (
                    <tr key={v.vehicle_id} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{v.vehicle_name}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748b" }}>₹{v.fuel_cost}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#64748b" }}>₹{v.maintenance_cost}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#1e293b", fontWeight: 600 }}>₹{v.operational_cost}</td>
                      <td style={{
                        padding: "12px 20px", fontSize: 13, fontWeight: 700,
                        color: v.roi >= 0 ? "#22c55e" : "#ef4444",
                      }}>{v.roi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}