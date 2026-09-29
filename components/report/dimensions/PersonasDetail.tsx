import { PersonasDim } from "@/lib/types";

const WTP_COLORS: Record<string, { bg: string; color: string }> = {
  High:   { bg: "rgba(22,163,74,0.10)", color: "var(--green-700)" },
  Medium: { bg: "rgba(249,115,22,0.10)", color: "var(--orange-700)" },
  Low:    { bg: "rgba(239,68,68,0.10)", color: "#b91c1c" },
};

export function PersonasDetail({ data }: { data: PersonasDim }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {data.personas.map((persona, i) => {
          const wtp = WTP_COLORS[persona.willingnessToPay] ?? WTP_COLORS.Medium;
          const isPrimary = persona.name === data.primaryPersona;
          return (
            <div
              key={i}
              style={{
                background: isPrimary ? "linear-gradient(145deg, var(--bg-card), var(--accent-primary-bg))" : "var(--bg-secondary)",
                border: `1.5px solid ${isPrimary ? "var(--border-strong)" : "var(--border-subtle)"}`,
                borderRadius: 14, padding: "20px 18px",
                position: "relative", overflow: "hidden",
              }}
            >
              {isPrimary && (
                <div style={{ position: "absolute", top: 10, right: 12, background: "var(--green-600)", color: "white", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                  PRIMARY
                </div>
              )}

              {/* Avatar */}
              <div style={{ width: 44, height: 44, borderRadius: 12, background: isPrimary ? "var(--green-600)" : "var(--blue-600)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "white", marginBottom: 12 }}>
                {isPrimary ? "🧑‍💼" : "👔"}
              </div>

              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{persona.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{persona.ageRange} · {persona.jobTitle}</div>

              {/* Pain Points */}
              <div className="label-text" style={{ marginBottom: 6 }}>Pain Points</div>
              {persona.painPoints.map((p, j) => (
                <div key={j} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>• {p}</div>
              ))}

              {/* WTP */}
              <div style={{ marginTop: 14, background: wtp.bg, borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: wtp.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                  WTP: {persona.willingnessToPay}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{persona.wtpReason}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
