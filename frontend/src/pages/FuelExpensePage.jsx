import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const API = "http://localhost:5000";

export default function FuelExpensePage() {
  const [tab, setTab] = useState("fuel"); // fuel | expense
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [fuelForm, setFuelForm] = useState({ vehicle_id: "", liters: "", cost: "", date: "" });
  const [expenseForm, setExpenseForm] = useState({ vehicle_id: "", type: "Toll", amount: "", date: "" });

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  useEffect(() => {
    fetchFuel();
    fetchExpenses();
    fetchVehicles();
  }, []);

  const fetchFuel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/fuel_logs`, { headers: token() });
      const data = await res.json();
      setFuelLogs(data.fuel_logs || []);
    } catch {
      setFuelLogs([]);
    }
    setLoading(false);
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API}/expenses`, { headers: token() });
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch {
      setExpenses([]);
    }
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

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/fuel_logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...token() },
        body: JSON.stringify(fuelForm),
      });
      setShowModal(false);
      setFuelForm({ vehicle_id: "", liters: "", cost: "", date: "" });
      fetchFuel();
    } catch {
      alert("Could not save fuel log");
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...token() },
        body: JSON.stringify(expenseForm),
      });
      setShowModal(false);
      setExpenseForm({ vehicle_id: "", type: "Toll", amount: "", date: "" });
      fetchExpenses();
    } catch {
      alert("Could not save expense");
    }
  };

  const vehicleName = (id) => vehicles.find(v => v.id === id)?.vehicle_name || `#${id}`;

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div><br></br><br></br>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>
            Fuel & Expenses
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
            Log fuel purchases and other trip expenses
          </div>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: "#FF6B6B", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,107,0.35)",
        }}>
          + Add Entry
        </button>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["fuel", "expense"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 700, fontFamily: "inherit",
            background: tab === t ? "#FF6B6B" : "#fff",
            color: tab === t ? "#fff" : "#64748b",
            boxShadow: tab === t ? "0 4px 14px rgba(255,107,107,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            {t === "fuel" ? "⛽ Fuel Logs" : "🧾 Expenses"}
          </button>
        ))}
      </div>

      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)", overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading...</div>
        ) : tab === "fuel" ? (
          fuelLogs.length === 0 ? (
            <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No fuel logs yet.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Vehicle", "Liters", "Cost (₹)", "Date"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fuelLogs.map(f => (
                  <tr key={f.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={tdStyle}>{f.vehicle_name || vehicleName(f.vehicle_id)}</td>
                    <td style={tdStyle}>{f.liters} L</td>
                    <td style={tdStyle}>₹{f.cost}</td>
                    <td style={tdStyle}>{f.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : expenses.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No expenses yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Vehicle", "Type", "Amount (₹)", "Date"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map(ex => (
                <tr key={ex.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={tdStyle}>{ex.vehicle_name || vehicleName(ex.vehicle_id)}</td>
                  <td style={tdStyle}>{ex.type}</td>
                  <td style={tdStyle}>₹{ex.amount}</td>
                  <td style={tdStyle}>{ex.date}</td>
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
          <div style={{ background: "#fff", borderRadius: 18, padding: "1.75rem 2rem", width: 400 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {["fuel", "expense"].map(t => (
                <button key={t} type="button" onClick={() => setTab(t)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 700, fontFamily: "inherit",
                  background: tab === t ? "#fff5f3" : "#f1f5f9",
                  color: tab === t ? "#FF6B6B" : "#64748b",
                }}>
                  {t === "fuel" ? "Fuel Log" : "Expense"}
                </button>
              ))}
            </div>

            {tab === "fuel" ? (
              <form onSubmit={handleFuelSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Vehicle</label>
                  <select value={fuelForm.vehicle_id} onChange={e => setFuelForm(f => ({ ...f, vehicle_id: e.target.value }))} required style={inputStyle}>
                    <option value="">Select vehicle</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicle_name} — {v.registration_number}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Liters</label>
                  <input type="number" value={fuelForm.liters} onChange={e => setFuelForm(f => ({ ...f, liters: e.target.value }))} required style={inputStyle} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Cost (₹)</label>
                  <input type="number" value={fuelForm.cost} onChange={e => setFuelForm(f => ({ ...f, cost: e.target.value }))} required style={inputStyle} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={fuelForm.date} onChange={e => setFuelForm(f => ({ ...f, date: e.target.value }))} required style={inputStyle} />
                </div>
                <FormButtons onCancel={() => setShowModal(false)} />
              </form>
            ) : (
              <form onSubmit={handleExpenseSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Vehicle</label>
                  <select value={expenseForm.vehicle_id} onChange={e => setExpenseForm(f => ({ ...f, vehicle_id: e.target.value }))} required style={inputStyle}>
                    <option value="">Select vehicle</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicle_name} — {v.registration_number}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Type</label>
                  <select value={expenseForm.type} onChange={e => setExpenseForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                    <option value="Toll">Toll</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Amount (₹)</label>
                  <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} required style={inputStyle} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} required style={inputStyle} />
                </div>
                <FormButtons onCancel={() => setShowModal(false)} />
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

function FormButtons({ onCancel }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button type="button" onClick={onCancel} style={{
        flex: 1, padding: 11, borderRadius: 10, background: "#f1f5f9",
        border: "none", fontSize: 13, fontWeight: 700, color: "#475569", cursor: "pointer",
      }}>Cancel</button>
      <button type="submit" style={{
        flex: 1, padding: 11, borderRadius: 10, background: "#FF6B6B",
        border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
      }}>Save</button>
    </div>
  );
}

const thStyle = {
  textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700,
  color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5,
  borderBottom: "1px solid #f1f5f9",
};
const tdStyle = { padding: "12px 16px", fontSize: 13, color: "#1e293b" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 5 };
const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none",
};