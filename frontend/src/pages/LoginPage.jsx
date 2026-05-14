import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await client.post("/login", form);
      login(res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-space-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / header */}
        <div className="text-center mb-8">
          <p className="font-mono text-amber-500 text-xs tracking-[0.3em] uppercase mb-2">
            ◈ NEBULA CORP ◈
          </p>
          <h1 className="font-mono text-3xl font-bold text-slate-100 tracking-tight">
            Intergalactic
          </h1>
          <h1 className="font-mono text-3xl font-bold text-amber-500 tracking-tight">
            Cargo Portal
          </h1>
          <p className="text-slate-500 font-ui text-sm mt-2 tracking-widest uppercase">
            Secure Access Terminal
          </p>
        </div>

        {/* Card */}
        <div className="bg-space-900 border border-space-600 rounded-lg p-8">
          <h2 className="font-mono text-slate-400 text-xs uppercase tracking-widest mb-6">
            — Operator Login —
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="operator@nebula-corp.com"
                className="input-field"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-400 font-mono text-xs bg-red-950 border border-red-800 px-3 py-2 rounded">
                ✗ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Access Portal"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 font-ui text-sm">
            No account?{" "}
            <Link
              to="/signup"
              className="text-amber-500 hover:text-amber-400 transition-colors"
            >
              Request Access
            </Link>
          </p>
        </div>

        <p className="text-center font-mono text-xs text-space-600 mt-6 tracking-widest">
          CLASSIFIED SYSTEM — AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </div>
  );
}
