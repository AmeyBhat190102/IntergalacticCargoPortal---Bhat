import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function SignupPage() {
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
      // No role in payload — provisioned server-side by email domain
      await client.post("/signup", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-space-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-mono text-amber-500 text-xs tracking-[0.3em] uppercase mb-2">
            ◈ NEBULA CORP ◈
          </p>
          <h1 className="font-mono text-3xl font-bold text-slate-100 tracking-tight">
            Request Access
          </h1>
          <p className="text-slate-500 font-ui text-sm mt-2 tracking-widest uppercase">
            New Operator Registration
          </p>
        </div>

        {/* Card */}
        <div className="bg-space-900 border border-space-600 rounded-lg p-8">
          <h2 className="font-mono text-slate-400 text-xs uppercase tracking-widest mb-2">
            — Create Account —
          </h2>
          <p className="font-mono text-slate-600 text-xs mb-6">
            @nebula-corp.com emails receive Admin clearance.
          </p>

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
                placeholder="your@email.com"
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
                autoComplete="new-password"
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
              {loading ? "Registering..." : "Register Operator"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 font-ui text-sm">
            Already registered?{" "}
            <Link
              to="/"
              className="text-amber-500 hover:text-amber-400 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
