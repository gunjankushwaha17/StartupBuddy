import { VerdictDim } from "@/lib/types";

const DECISION_CONFIG = {
  "GO":    { emoji: "✓", label: "GO", bg: "var(--green-600)", shadow: "rgba(22,163,74,0.35)", border: "rgba(22,163,74,0.30)" },
  "NO-GO": { emoji: "✗", label: "NO-GO", bg: "#dc2626", shadow: "rgba(220,38,38,0.30)", border: "rgba(220,38,38,0.25)" },
  "PIVOT": { emoji: "⟳", label: "PIVOT", bg: "var(--orange-600)", shadow: "rgba(234,88,12,0.30)", border: "rgba(234,88,12,0.25)" },
};

function ScoreRing({ score }: { score: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const color = score >= 7 ? "var(--green-500)" : score >= 5 ? "var(--orange-500)" : "#ef4444";

  return (
    <div style={{ position: "relative", width: 100, height: 100 }}>
      <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={50} cy={50} r={radius} fill="none" stroke="var(--border-subtle)" strokeWidth={8} />
        <circle
          cx={50} cy={50} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{score.toFixed(1)}</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>/ 10</div>
      </div>
    </div>
  );
}

export function VerdictDetail({ data }: { data: VerdictDim }) {
  const cfg = DECISION_CONFIG[data.decision] ?? DECISION_CONFIG["GO"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero verdict row */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, background: `${cfg.bg}18`, border: `1.5px solid ${cfg.border}`, borderRadius: 16, padding: "24px 24px" }}>
        {/* Score ring */}
        <ScoreRing score={data.compositeScore} />

        {/* Decision badge + rationale */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ background: cfg.bg, color: "white", borderRadius: 10, padding: "6px 16px", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, letterSpacing: "0.02em", boxShadow: `0 4px 16px ${cfg.shadow}` }}>
              {cfg.emoji} {cfg.label}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>Composite Score: {data.compositeScore.toFixed(1)}/10</div>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{data.rationale}</p>
        </div>
      </div>

      {/* Strength / Risk / Next Step */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <div style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.20)", borderRadius: 12, padding: "14px 16px" }}>
          <div className="label-text" style={{ color: "var(--green-700)", marginBottom: 6 }}>Top Strength</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>✓ {data.topStrength}</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)", borderRadius: 12, padding: "14px 16px" }}>
          <div className="label-text" style={{ color: "#dc2626", marginBottom: 6 }}>Top Risk</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>⚠ {data.topRisk}</p>
        </div>
        <div style={{ background: "var(--accent-secondary-bg)", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 12, padding: "14px 16px" }}>
          <div className="label-text" style={{ color: "var(--accent-secondary-strong)", marginBottom: 6 }}>Immediate Next Step</div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>→ {data.nextStep}</p>
        </div>
      </div>
    </div>
  );
}
