import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { icon: "📊", label: "Dashboard",      path: "/dashboard" },
  { icon: "🚛", label: "Vehicles",       path: "/vehicles"  },
  { icon: "👤", label: "Drivers",        path: "/drivers"   },
  { icon: "📍", label: "Trips",          path: "/trips"     },
  { icon: "🔧", label: "Maintenance",    path: "/maintenance"},
  { icon: "⛽", label: "Fuel & Expenses", path: "/fuel"     },
  { icon: "📈", label: "Reports",        path: "/reports"   },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", flexDirection:"row" ,height: "100vh", width: "100vw", overflow: "hidden" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: "linear-gradient(175deg, #0f172a 0%, #1a1035 60%, #0f172a 100%)",
        display: "flex", flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Glow top */}
        <div style={{
          position: "absolute", width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,107,0.18) 0%, transparent 70%)",
          top: -60, left: -50, pointerEvents: "none",
        }} />

        {/* Brand */}
        <div style={{
          padding: "1.5rem 1.25rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            fontFamily: "Playfair Display, serif", fontWeight: 800,
            fontSize: 20, color: "#fff", letterSpacing: -0.5,
          }}>TransitOps</div>
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase", letterSpacing: 1.2, marginTop: 3,
          }}>Fleet Management</div>
        </div>

        {/* Nav links */}
        <nav style={{
          flex: 1, padding: "1rem 0.875rem",
          overflowY: "auto", position: "relative", zIndex: 1, diaplay:"flex", flexDirection:"column"
        }}>
          {NAV.map(item => {
            const active = pathname === item.path;
            return (
              <div key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "10px 13px", borderRadius: 12, marginBottom: 3,
                  cursor: "pointer", 
                  background: active ? "rgba(255,107,107,0.16)" : "transparent",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Icon box */}
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                  background: active ? "#FF6B6B" : "rgba(255,255,255,0.07)",
                  border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: active ? "0 4px 14px rgba(255,107,107,0.4)" : "none",
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: active ? "#fff" : "rgba(255,255,255,0.4)",
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div style={{
          padding: "1rem 1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4,
          }}>
            {user.name || "User"}
          </div>
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10,
          }}>
            {user.role || ""}
          </div>
          <button onClick={logout} style={{
            width: "100%", padding: 9, borderRadius: 10,
            background: "rgba(239,68,68,0.12)", color: "#fca5a5",
            border: "1px solid rgba(239,68,68,0.2)",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top navbar */}
        <header style={{
          height: 60, background: "#fff", flexShrink: 0,
          borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.75rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontFamily: "Playfair Display, serif", fontWeight: 700, fontSize: 16, color: "#1e293b" }}>
            {NAV.find(n => n.path === pathname)?.label || "Dashboard"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              background: "#fff5f3", border: "1px solid #fecaca",
              color: "#dc2626", padding: "4px 12px", borderRadius: 20,
              fontSize: 11.5, fontWeight: 600,
            }}>
              🚛 Fleet Ops
            </span>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#FF6B6B", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13,
            }}>
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", background: "#FFF8F0", padding: "1.75rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
}