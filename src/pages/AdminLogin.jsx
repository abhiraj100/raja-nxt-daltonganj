// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function AdminLogin() {
  const { adminLogin, isAdminLoggedIn } = useStore();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Already logged in → redirect
  useEffect(() => {
    if (isAdminLoggedIn) navigate("/admin", { replace: true });
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pw.trim()) { setError("Please enter the admin password."); return; }
    if (attempts >= 5) { setError("Too many failed attempts. Please try again later."); return; }

    setLoading(true);
    setError("");

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const ok = adminLogin(pw);
    setLoading(false);

    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setAttempts((a) => a + 1);
      setError("Incorrect password. Please try again.");
      setPw("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-cream to-stone-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-charcoal">Admin Access</h1>
            <p className="text-stone-400 text-sm mt-1">Raja Nxt Store Management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-style">Admin Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  autoFocus
                  className={`input-field pl-10 pr-12 ${error ? "border-red-300 focus:ring-red-200" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm animate-shake">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || attempts >= 5}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : (
                <><Lock size={16} /> Login to Admin <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {attempts >= 3 && attempts < 5 && (
            <p className="text-xs text-amber-600 text-center mt-3">
              {5 - attempts} attempt{5 - attempts !== 1 ? "s" : ""} remaining
            </p>
          )}

          <p className="text-center text-xs text-stone-400 mt-6">
            <span className="font-semibold text-stone-500">Hint:</span> admin@access123
          </p>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4">Raja Nxt Admin v2.0 · Powered by Vite</p>
      </div>
    </div>
  );
}
