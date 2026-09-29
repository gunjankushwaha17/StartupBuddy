"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

interface AuthModalProps {
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export default function AuthModal({ onClose, defaultTab = "login" }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let result;
      if (tab === "login") {
        result = await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        result = await signup(form.name, form.email, form.password);
      }
      if (result.success) {
        setSuccess(true);
        setTimeout(onClose, 900);
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "var(--text-primary)" }}>
              {tab === "login" ? "Welcome back 👋" : "Join Startup Buddy 🚀"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
              {tab === "login" ? "Sign in to your account" : "Create your free account"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 8 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: "flex",
          background: "var(--bg-secondary)",
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
          gap: 4,
        }}>
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s ease",
                background: tab === t ? "var(--bg-card)" : "transparent",
                color: tab === t ? "var(--accent-primary-strong)" : "var(--text-muted)",
                boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              }}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {success ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            padding: "24px 0",
            color: "var(--accent-green)",
          }}>
            <CheckCircle size={48} />
            <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}>
              {tab === "login" ? "Signed in!" : "Account created!"}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "signup" && (
              <div>
                <label className="label-text" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <User size={12} /> Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={(e) => field("name", e.target.value)}
                  autoFocus
                  required
                />
              </div>
            )}

            <div>
              <label className="label-text" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="alex@example.com"
                value={form.email}
                onChange={(e) => field("email", e.target.value)}
                autoFocus={tab === "login"}
                required
              />
            </div>

            <div>
              <label className="label-text" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Lock size={12} /> Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field"
                  placeholder={tab === "signup" ? "At least 6 characters" : "Your password"}
                  value={form.password}
                  onChange={(e) => field("password", e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", padding: 2,
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ef4444",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
              </span>
            </button>

            {tab === "login" && (
              <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setTab("signup"); setError(null); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-primary-strong)", fontWeight: 600, fontSize: 13 }}
                >
                  Sign up free
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
