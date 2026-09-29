"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Globe, Code, Send } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Validate Idea", href: "/" },
    { label: "Diff Analysis", href: "/diff" },
    { label: "One-Page Summary", href: "/summary" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="no-print" style={{ background: "var(--bg-footer)", color: "#9aa3b2", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "auto" }}>
      {/* Main Grid */}
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "64px 24px 48px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
          gap: 48,
        }}
        className="footer-grid"
      >
        {/* Brand Column */}
        <div>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #f4c542, #e6ad0c)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🚀</div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "#e8eaf0" }}>
              Startup<span style={{ color: "#f4c542" }}>Buddy</span>
            </span>
          </Link>
          <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
            AI-powered startup validation platform. Transform your raw idea into a comprehensive report in 60 seconds.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { icon: <ExternalLink size={16} />, label: "Twitter", href: "#" },
              { icon: <Globe size={16} />, label: "LinkedIn", href: "#" },
              { icon: <Code size={16} />, label: "GitHub", href: "#" },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#9aa3b2", textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(244,197,66,0.15)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(244,197,66,0.3)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#f4c542";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#9aa3b2";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <div key={category}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e8eaf0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
              {category}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={{ fontSize: 14, color: "#9aa3b2", textDecoration: "none", transition: "color 0.2s ease" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = "#f4c542"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = "#9aa3b2"}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e8eaf0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            Newsletter
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
            Get weekly founder tips, market insights, and AI tool updates.
          </p>
          {subscribed ? (
            <div style={{
              background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.3)",
              borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#4ade80",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              ✅ You&apos;re subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#e8eaf0",
                  outline: "none", transition: "border-color 0.2s ease", fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(244,197,66,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #f4c542 0%, #e6ad0c 100%)",
                  border: "none", borderRadius: 10, cursor: "pointer",
                  padding: "10px 14px", color: "#213042", transition: "all 0.2s ease",
                  display: "flex", alignItems: "center",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
              >
                <Send size={15} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px" }}>
        <div style={{
          maxWidth: 1320, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, fontSize: 13,
        }}>
          <span>© {new Date().getFullYear()} StartupBuddy. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/terms" style={{ color: "#9aa3b2", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = "#f4c542"}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = "#9aa3b2"}
            >Terms of Service</Link>
            <Link href="/privacy" style={{ color: "#9aa3b2", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = "#f4c542"}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = "#9aa3b2"}
            >Privacy Policy</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
