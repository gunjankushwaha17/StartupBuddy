"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CurrencySelector from "@/components/ui/CurrencySelector";
import AuthModal from "@/components/ui/AuthModal";
import { useAuth } from "@/lib/context/AuthContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/diff", label: "Diff" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="navbar no-print"
        style={{
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          {/* ── Brand ── */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--green-500), var(--green-700))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 12px rgba(22,163,74,0.30)",
              }}
            >
              🚀
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Startup<span className="gradient-text">Buddy</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="responsive-nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${pathname === href ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="responsive-nav-actions">
            <CurrencySelector />
            <ThemeToggle />

            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "var(--accent-primary-bg)",
                    border: "1px solid var(--border-glow)",
                    borderRadius: 10, padding: "6px 12px",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                    color: "var(--accent-primary-strong)", transition: "all 0.2s ease",
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--green-500), var(--green-700))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "white", fontWeight: 700,
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.name.split(" ")[0]}
                  <ChevronDown size={12} style={{ transition: "transform 0.2s ease", transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)" }} />
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "var(--bg-modal)", border: "1px solid var(--border-subtle)",
                    borderRadius: 14, padding: 6, minWidth: 160,
                    boxShadow: "var(--shadow-lg)", zIndex: 200, animation: "fadeIn 0.15s ease-out",
                  }}>
                    <div style={{ padding: "8px 12px 6px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{user.email}</div>
                    </div>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, width: "100%",
                        padding: "8px 12px", background: "none", border: "none",
                        cursor: "pointer", fontSize: 13, color: "#ef4444", borderRadius: 8,
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  id="nav-signin-btn"
                  onClick={() => setAuthModal("login")}
                  className="btn-ghost"
                >
                  Sign In
                </button>
                <button
                  id="nav-getstarted-btn"
                  onClick={() => setAuthModal("signup")}
                  className="btn-primary"
                  style={{ fontSize: 13, padding: "8px 18px", borderRadius: 10, whiteSpace: "nowrap" }}
                >
                  Get Started →
                </button>
              </>
            )}

            {/* Hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
              className="mobile-menu-btn"
              style={{
                display: "none",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 9,
                cursor: "pointer",
                padding: 7,
                color: "var(--text-secondary)",
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-nav)",
              padding: "16px 24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              animation: "slideUp 0.2s ease-out",
            }}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${pathname === href ? "active" : ""}`}
                style={{ fontSize: 15, padding: "10px 12px" }}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div style={{ height: 1, background: "var(--border-subtle)", margin: "8px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <CurrencySelector />
              <ThemeToggle />
            </div>
            {!user ? (
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => { setAuthModal("login"); setMobileOpen(false); }}
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: 14 }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthModal("signup"); setMobileOpen(false); }}
                  className="btn-primary"
                  style={{ flex: 1, fontSize: 14, padding: "10px 0" }}
                >
                  <span>Get Started</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px",
                  cursor: "pointer", fontSize: 13, color: "#ef4444", fontWeight: 600, marginTop: 8,
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── Auth Modal ── */}
      {authModal && (
        <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />
      )}

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (max-width: 900px) {
          .responsive-nav-links { display: none !important; }
          .responsive-nav-actions .btn-ghost,
          .responsive-nav-actions > a,
          .responsive-nav-actions > button:last-of-type { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 640px) {
          .responsive-nav-actions { gap: 6px !important; }
        }
      `}</style>
    </>
  );
}
