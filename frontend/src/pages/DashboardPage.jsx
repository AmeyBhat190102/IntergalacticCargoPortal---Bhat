import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import CargoTable from "../components/CargoTable";
import FileUpload from "../components/FileUpload";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { email, role, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchCargo = useCallback(async () => {
    setFetching(true);
    setFetchError("");
    try {
      const res = await client.get("/api/cargo");
      setRecords(res.data);
    } catch {
      setFetchError("Failed to fetch cargo records.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCargo();
  }, [fetchCargo]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-space-950 text-slate-200">
      {/* Top nav */}
      <header className="bg-space-900 border-b border-space-600 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-amber-500 text-lg font-bold tracking-tight">
              ◈ NEBULA CORP
            </span>
            <span className="text-space-600 font-mono">|</span>
            <span className="font-mono text-slate-400 text-sm tracking-widest uppercase">
              Cargo Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-500 text-xs hidden sm:block">
              {email}
            </span>
            <span
              className={isAdmin ? "role-badge-admin" : "role-badge-standard"}
            >
              {role}
            </span>
            <button
              onClick={handleLogout}
              className="font-mono text-xs text-slate-400 hover:text-red-400
                         border border-space-600 hover:border-red-900
                         px-3 py-1.5 rounded transition-colors duration-200 uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-mono text-2xl font-bold text-slate-100 tracking-tight">
            Cargo Manifest
          </h1>
          <p className="font-mono text-slate-500 text-xs mt-1 tracking-widest uppercase">
            {isAdmin
              ? "Admin View — Weights in KG — Upload enabled"
              : "Standard View — Weights in LBS — Read only"}
          </p>
        </div>

        {/* Upload section — conditionally rendered, NOT hidden in DOM for Standard */}
        {isAdmin && (
          <div className="mb-8 bg-space-900 border border-space-600 rounded-lg p-6">
            <h2 className="font-mono text-amber-500 text-xs uppercase tracking-widest mb-4">
              — Upload Manifest —
            </h2>
            <FileUpload onUploadSuccess={fetchCargo} />
          </div>
        )}

        {/* Cargo table section */}
        <div className="bg-space-900 border border-space-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-amber-500 text-xs uppercase tracking-widest">
              — Cargo Records ({records.length}) —
            </h2>
            <button
              onClick={fetchCargo}
              disabled={fetching}
              className="font-mono text-xs text-slate-400 hover:text-amber-500
                         border border-space-600 hover:border-amber-800
                         px-3 py-1.5 rounded transition-colors duration-200
                         uppercase tracking-widest disabled:opacity-40"
            >
              {fetching ? "Syncing..." : "↻ Refresh"}
            </button>
          </div>

          {fetchError && (
            <p className="text-red-400 font-mono text-xs bg-red-950 border border-red-800 px-3 py-2 rounded mb-4">
              ✗ {fetchError}
            </p>
          )}

          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <p className="font-mono text-slate-500 text-xs tracking-widest uppercase animate-pulse">
                Scanning cargo bays...
              </p>
            </div>
          ) : (
            <CargoTable records={records} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-space-700 mt-16 py-4 text-center">
        <p className="font-mono text-space-600 text-xs tracking-widest uppercase">
          Intergalactic Cargo Portal v1.0.0 — Nebula Corp © 2026
        </p>
      </footer>
    </div>
  );
}
