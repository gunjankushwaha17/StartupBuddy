import { DiffDim } from "@/lib/types";

const DEFENSIBILITY_COLORS: Record<string, { bg: string; text: string }> = {
  High:   { bg: "rgba(22,163,74,0.10)", text: "var(--green-700)" },
  Medium: { bg: "rgba(249,115,22,0.10)", text: "var(--orange-700)" },
  Low:    { bg: "rgba(239,68,68,0.10)", text: "#b91c1c" },
};

export function DiffDetail({ data }: { data: DiffDim }) {
  const def = DEFENSIBILITY_COLORS[data.defensibility] ?? DEFENSIBILITY_COLORS.Medium;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* UVP */}
      <div style={{ background: "var(--accent-primary-bg)", border: "1px solid var(--border-strong)", borderRadius: 12, padding: "16px 20px" }}>
        <div className="label-text" style={{ color: "var(--accent-primary-strong)", marginBottom: 6 }}>Unique Value Proposition</div>
        <p style={{ fontSize: 15, color: "var(--text-primary)", fontWeight: 600, lineHeight: 1.6 }}>{data.uniqueValue}</p>
      </div>

      {/* Moats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 16px" }}>
          <div className="label-text" style={{ marginBottom: 6 }}>Feature Moat</div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>🔒 {data.featureMoat}</div>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 16px" }}>
          <div className="label-text" style={{ marginBottom: 6 }}>Speed / Cost Moat</div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>⚡ {data.speedCostMoat}</div>
        </div>
      </div>

      {/* Key Advantages */}
      <div>
        <div className="label-text" style={{ marginBottom: 10 }}>Key Competitive Advantages</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.keyAdvantages.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "var(--green-600)", fontSize: 16, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Defensibility rating */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: def.bg, border: `1px solid ${def.text}30`, borderRadius: 10, padding: "10px 16px" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: def.text, textTransform: "uppercase", letterSpacing: "0.07em" }}>Defensibility</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: def.text }}>{data.defensibility}</span>
      </div>
    </div>
  );
}
