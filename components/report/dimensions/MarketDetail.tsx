import { MarketDim } from "@/lib/types";

export function MarketDetail({ data }: { data: MarketDim }) {
  const bars = [
    { label: "TAM", value: data.tam, sublabel: data.tamLabel, pct: 100, color: "var(--blue-600)" },
    { label: "SAM", value: data.sam, sublabel: data.samLabel, pct: 55, color: "var(--green-600)" },
    { label: "SOM", value: data.som, sublabel: data.somLabel, pct: 18, color: "var(--orange-500)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* TAM/SAM/SOM funnel */}
      <div>
        <div className="label-text" style={{ marginBottom: 14 }}>Market Sizing</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bars.map((b) => (
            <div key={b.label}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: b.color, marginRight: 8 }}>{b.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{b.value}</span>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 200, textAlign: "right" }}>{b.sublabel}</span>
              </div>
              <div className="feature-bar-track">
                <div className="feature-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--accent-primary-bg)", border: "1px solid var(--border-strong)", borderRadius: 12, padding: "16px 18px" }}>
          <div className="label-text" style={{ color: "var(--accent-primary-strong)", marginBottom: 8 }}>Growth Rate</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--green-600)", letterSpacing: "-0.02em" }}>{data.cagr}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>CAGR · {data.yearRange}</div>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "16px 18px" }}>
          <div className="label-text" style={{ marginBottom: 10 }}>Growth Drivers</div>
          {data.trends.map((t, i) => (
            <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>→ {t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
