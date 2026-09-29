import { PainRankingDim } from "@/lib/types";
import { UrgencyChip } from "../DimensionCard";

export function PainRankingDetail({ data }: { data: PainRankingDim }) {
  const maxScore = 10;
  const urgencyColors: Record<string, string> = {
    Critical: "#dc2626", High: "#ea580c", Medium: "var(--blue-500)", Low: "var(--green-600)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Pain callout */}
      <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.20)", borderRadius: 12, padding: "14px 18px" }}>
        <div className="label-text" style={{ color: "#dc2626", marginBottom: 4 }}>Top Pain</div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{data.topPain}</p>
      </div>

      {/* Ranked bars */}
      <div>
        <div className="label-text" style={{ marginBottom: 14 }}>Pain Severity Ranking</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {data.ranked.map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", minWidth: 14 }}>#{i + 1}</span>
                  <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>{item.problem}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.frequency}</span>
                  <UrgencyChip urgency={item.urgency} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: urgencyColors[item.urgency] ?? "var(--text-primary)" }}>
                    {item.severityScore.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="feature-bar-track">
                <div
                  className="feature-bar-fill"
                  style={{
                    width: `${(item.severityScore / maxScore) * 100}%`,
                    background: urgencyColors[item.urgency] ?? "var(--accent-primary)",
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
