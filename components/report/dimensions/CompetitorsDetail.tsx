import { CompetitorsDim } from "@/lib/types";

export function CompetitorsDetail({ data }: { data: CompetitorsDim }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Gap callout */}
      <div style={{ background: "var(--accent-secondary-bg)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 12, padding: "12px 16px" }}>
        <div className="label-text" style={{ color: "var(--accent-secondary-strong)", marginBottom: 4 }}>Competitive Gap</div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{data.competitiveGap}</p>
      </div>

      {/* Direct competitors table */}
      <div>
        <div className="label-text" style={{ marginBottom: 10 }}>Direct Competitors</div>
        <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr 1fr", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-subtle)", padding: "8px 16px" }}>
            {["Name", "Pricing", "Key Weakness", "Scale"].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</div>
            ))}
          </div>
          {/* Rows */}
          {data.direct.map((c, i) => (
            <div
              key={i}
              style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr 1fr", padding: "12px 16px", borderBottom: i < data.direct.length - 1 ? "1px solid var(--border-subtle)" : "none", alignItems: "center", background: "var(--bg-card)" }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{c.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)" }}>{c.pricing}</div>
              <div style={{ fontSize: 13, color: "var(--accent-red, #ef4444)" }}>⚠ {c.weakness}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{c.scale}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Indirect / workarounds */}
      <div>
        <div className="label-text" style={{ marginBottom: 8 }}>Current Workarounds (Indirect Competition)</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {data.indirect.map((w, i) => (
            <span key={i} className="tech-badge" style={{ fontSize: 13 }}>📌 {w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
