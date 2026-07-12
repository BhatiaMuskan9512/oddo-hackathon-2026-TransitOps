import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

// backend Flask server ka base URL
const API_URL = "http://localhost:5000";

// User model ke role column ke liye allowed values
const ROLES = ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"];

function EyeIcon({ show }) {
  return show
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}

function PasswordField({ label, placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 4 }}>
      <label className="field-label">{label}</label>
      <div className="pwd-wrap">
        <input
          className={`field-input ${error ? "err" : ""}`}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ paddingRight: 46 }}
        />
        <button type="button" className="pwd-eye" onClick={() => setShow(s => !s)}>
          <EyeIcon show={show} />
        </button>
      </div>
      {error && <span className="field-err">{error}</span>}
    </div>
  );
}

function StrengthBar({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#16a34a"];
  return (
    <div style={{ margin: "8px 0 16px" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i <= score ? colors[score] : "#e2e8f0",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: colors[score], fontWeight: 600 }}>{labels[score]}</p>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES[0],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!agreedTerms) e.terms = "You must agree to the Terms & Privacy Policy";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created! Please login to continue.");
      navigate("/login");
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
        <h1>Create Account</h1>
        <p className="subtitle">Join your team and start managing the fleet</p>

        <form onSubmit={handleSignup}>
          <div className="field-mb">
            <label className="field-label">Full Name</label>
            <input
              className={`field-input ${errors.name ? "err" : ""}`}
              type="text"
              placeholder="Himanshi Jethva"
              value={form.name}
              onChange={set("name")}
            />
            {errors.name && <span className="field-err">{errors.name}</span>}
          </div>

          <div className="field-mb">
            <label className="field-label">Email Address</label>
            <input
              className={`field-input ${errors.email ? "err" : ""}`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
            />
            {errors.email && <span className="field-err">{errors.email}</span>}
          </div>

          <div className="field-mb">
            <label className="field-label">Role</label>
            <select
              className="field-input"
              value={form.role}
              onChange={set("role")}
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <PasswordField
            label="Password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
          />
          <StrengthBar password={form.password} />

          <div style={{ marginBottom: 8 }}>
            <PasswordField
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              error={errors.confirmPassword}
            />
            {form.confirmPassword && form.password === form.confirmPassword && (
              <p style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginTop: 4 }}>✓ Passwords match</p>
            )}
          </div>

          <div className="terms-row">
            <input
              type="checkbox"
              className="checkbox"
              id="terms"
              checked={agreedTerms}
              onChange={e => setAgreedTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="terms-text">
              I agree to the{" "}
              <span className="terms-link" onClick={() => window.open("/terms", "_blank")}>Terms of Service</span>
              {" "}and{" "}
              <span className="terms-link" onClick={() => window.open("/privacy", "_blank")}>Privacy Policy</span>.
            </label>
          </div>
          {errors.terms && <span className="terms-err">{errors.terms}</span>}

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <p className="login-row">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}