"use client";

const TEAM = [
  { initials: "GK", name: "Gunjan K.", role: "Co-Founder & CEO", color: "#7c3aed", bio: "Serial entrepreneur with 2 exits. Obsessed with helping founders validate faster." },
  { initials: "AK", name: "Ashim K.", role: "Co-Founder & CTO", color: "#0891b2", bio: "Full-stack engineer & AI researcher. Built the core validation engine from the ground up." },
  { initials: "SL", name: "Sara Lee", role: "Head of Product", color: "#16a34a", bio: "Former PM at two unicorns. Shapes every feature around the founder journey." },
];

const VALUES = [
  { emoji: "🎯", title: "Founder-First", desc: "Every feature starts with one question: does this save a founder's time or sharpen their thinking?" },
  { emoji: "⚡", title: "Speed Matters", desc: "Validation that takes weeks shouldn't. We measure our success in seconds." },
  { emoji: "🔍", title: "Radical Clarity", desc: "No buzzword reports. Just clear, actionable insights you can act on today." },
  { emoji: "🌍", title: "Global by Default", desc: "Built for founders in every country, timezone, and currency from day one." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Hero */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--accent-primary-bg)", border: "1px solid var(--border-glow)",
            borderRadius: 999, padding: "6px 14px", fontSize: 12, color: "var(--accent-primary-strong)",
            fontWeight: 700, marginBottom: 24,
          }}
        >
          🚀 Our Story
        </div>
        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
            color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}
        >
          We build AI tools{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f4c542 0%, #e6ad0c 55%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            founders love
          </span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 620, margin: "0 auto" }}>
          Startup Buddy was born from a simple frustration: validating a startup idea took weeks of research,
          expensive consultants, and countless pivot cycles. We set out to compress all of that into 60 seconds —
          and make it accessible to every founder on the planet.
        </p>
      </section>

      {/* Mission */}
      <section style={{ background: "var(--bg-secondary)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="about-grid">
          <div>
            <div className="section-pill" style={{ marginBottom: 16 }}>🎯 Mission</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              Democratize startup validation for every founder
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
              We believe the best startup ideas come from everywhere — but the resources to evaluate them don&apos;t.
              A founder in Mumbai or Nairobi deserves the same quality of analysis as one in Silicon Valley.
            </p>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Startup Buddy uses state-of-the-art AI to give every founder a world-class co-founder experience —
              one that understands their market, their budget, and their constraints.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { num: "15K+", label: "Founders Served" },
              { num: "50+", label: "Countries" },
              { num: "94%", label: "Accuracy Rate" },
              { num: "60s", label: "Avg. Report Time" },
            ].map(({ num, label }) => (
              <div
                key={label}
                style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                  borderRadius: 16, padding: "24px 20px", textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 800, color: "var(--accent-primary-strong)", marginBottom: 4 }}>{num}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-pill" style={{ margin: "0 auto 16px" }}>💎 Values</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            What drives us
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="values-grid">
          {VALUES.map(({ emoji, title, desc }) => (
            <div
              key={title}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                borderRadius: 20, padding: "28px 24px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-glow)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
                (e.currentTarget as HTMLDivElement).style.transform = "";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{emoji}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "var(--bg-secondary)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-pill" style={{ margin: "0 auto 16px" }}>👥 Team</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              Meet the builders
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="team-grid">
            {TEAM.map(({ initials, name, role, color, bio }) => (
              <div
                key={name}
                style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                  borderRadius: 20, padding: 28, textAlign: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-glow)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", background: color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 700, color: "white",
                  margin: "0 auto 16px",
                  boxShadow: `0 8px 24px ${color}40`,
                }}>
                  {initials}
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 13, color: "var(--accent-primary-strong)", fontWeight: 600, marginBottom: 12 }}>{role}</div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, letterSpacing: "-0.01em" }}>
          Ready to validate your idea?
        </h2>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 28 }}>
          Join thousands of founders who get clarity in 60 seconds.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #f4c542 0%, #e6ad0c 100%)",
            border: "none", borderRadius: 14, color: "#213042",
            fontSize: 16, fontWeight: 700, padding: "14px 36px",
            textDecoration: "none", transition: "all 0.2s ease",
            boxShadow: "0 8px 28px rgba(244,197,66,0.35)",
          }}
        >
          Start Free →
        </a>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-grid, .values-grid, .team-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .about-grid, .values-grid, .team-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
