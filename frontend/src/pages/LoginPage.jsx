import { useState } from "react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


// backend Flask server ka base URL
const API_URL = "http://localhost:5000";

function EyeIcon({ show }) {
  return show
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed. Please check your details.");
        setLoading(false);
        return;
      }

      // backend user table ke role field ke hisab se store karo
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userId", data.user.id);

      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error("Could not reach server. Is the backend running?");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <div className="card">
        <button className="back" onClick={() => navigate("/")}>← Back</button>
        <div className="logo">TransitOps</div>
        <h1>Welcome Back</h1>
        <p className="subtitle">Login to manage your fleet operations</p>

        <form onSubmit={handleLogin}>
          <div className="field-mb">
            <label className="field-label">Email Address</label>
            <input
              className={`field-input ${errors.email ? "err" : ""}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <span className="field-err">{errors.email}</span>}
          </div>

          <div className="field-mb">
            <label className="field-label">Password</label>
            <div className="pwd-wrap">
              <input
                className={`field-input ${errors.password ? "err" : ""}`}
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 46 }}
              />
              <button type="button" className="pwd-eye" onClick={() => setShowPwd(s => !s)}>
                <EyeIcon show={showPwd} />
              </button>
            </div>
            {errors.password && <span className="field-err">{errors.password}</span>}
          </div>

          <div className="row-btw">
            <button type="button" className="forgot" onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </button>
          </div>

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <p className="signup-row">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}