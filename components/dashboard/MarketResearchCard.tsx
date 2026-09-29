import { MarketData, SectionStatus } from "@/lib/types";
import { BarChart2, RefreshCw, TrendingUp, Target, ShieldCheck, Compass } from "lucide-react";

interface MarketResearchCardProps {
  status: SectionStatus;
  data?: MarketData;
  onRetry: () => void;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function MarketSkeleton() {
  return (
    <>
      {/* TAM/SAM/SOM rings */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
        {[120, 84, 56].map((size, i) => (
          <div key={i} className="skeleton" style={{ width: size, height: size, borderRadius: "50%" }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 12, width: "60%", margin: "0 auto 20px" }} />
      {/* Competitors table rows */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton" style={{ height: 36, borderRadius: "8px", marginBottom: "8px" }} />
      ))}
      <div className="skeleton" style={{ height: 80, borderRadius: "10px", marginTop: "16px" }} />
    </>
  );
}

// ─── Error ────────────────────────────────────────────────────────────────────
function MarketError({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontSize: "32px", marginBottom: "10px" }}>😞</div>
      <p style={{ fontSize: "12px", color: "#f87171", marginBottom: "16px" }}>Failed to load this section.</p>
      <button
        onClick={onRetry}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "rgba(244,197,66,0.16)", border: "1px solid rgba(244,197,66,0.28)",
          borderRadius: "8px", color: "#a36b00", cursor: "pointer",
          fontSize: "12px", fontWeight: "600", padding: "8px 16px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <RefreshCw size={13} /> Retry
      </button>
    </div>
  );
}

// ─── TAM / SAM / SOM nested rings ────────────────────────────────────────────
function MarketRings({ tam, sam, som, tamLabel, samLabel, somLabel }: {
  tam: string; sam: string; som: string;
  tamLabel: string; samLabel: string; somLabel: string;
}) {
  const rings = [
    { value: tam, label: tamLabel, abbr: "TAM", color: "#e6ad0c", r: 58, stroke: 8 },
    { value: sam, label: samLabel, abbr: "SAM", color: "#f4c542", r: 42, stroke: 7 },
    { value: som, label: somLabel, abbr: "SOM", color: "#8a5b00", r: 27, stroke: 6 },
  ];
  const cx = 70; const cy = 70;
  const circumference = (r: number) => 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
      {/* SVG nested rings — TAM 100%, SAM 65%, SOM 38% fill to show relative size */}
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
          {rings.map(({ color, r, stroke }, i) => {
            const c = circumference(r);
            const pct = i === 0 ? 0.92 : i === 1 ? 0.65 : 0.38;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
                  strokeLinecap="round" strokeDasharray={c}
                  strokeDashoffset={c - pct * c}
                  style={{ filter: `drop-shadow(0 0 5px ${color}88)`, transition: "stroke-dashoffset 1s ease" }}
                />
              </g>
            );
          })}
        </svg>
        {/* Centre label */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "9px", color: "var(--text-muted)", fontWeight: 600 }}>SOM</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: "700", color: "#06b6d4", lineHeight: 1 }}>{som}</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
        {rings.map(({ abbr, value, color }) => (
          <div key={abbr} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color, fontWeight: "700", letterSpacing: "0.06em" }}>{abbr}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: "700", color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Labels under rings */}
      <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "2px", alignItems: "center" }}>
        {rings.map(({ abbr, label, color }) => (
          <div key={abbr} style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            <span style={{ color, fontWeight: 600 }}>{abbr}</span>: {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export default function MarketResearchCard({ status, data, onRetry }: MarketResearchCardProps) {
  return (
    <div className="glass-card animate-slide-up stagger-5" style={{ padding: "24px", gridColumn: "1 / -1" }}>
      <div className="flex items-center gap-2 mb-5">
        <div style={{ width: 36, height: 36, borderRadius: "12px", background: "linear-gradient(135deg, rgba(244,197,66,0.22), rgba(255,243,176,0.72))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,197,66,0.3)" }}>
          <BarChart2 size={16} color="#e6ad0c" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            Market Research
          </h2>
          <div className="section-pill" style={{ marginTop: "6px" }}>
            <Compass size={10} /> Market map
          </div>
        </div>
        {status === "loading" && (
          <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#e6ad0c", boxShadow: "0 0 6px #e6ad0c", animation: "pulse 1.4s ease-in-out infinite" }} />
        )}
      </div>

      {status === "loading" && <MarketSkeleton />}
      {status === "error"   && <MarketError onRetry={onRetry} />}

      {status === "done" && data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>

          {/* ── Column 1: TAM/SAM/SOM + Growth ── */}
          <div>
            <MarketRings {...data.marketSizing} />

            {/* Growth Dynamics */}
            <div style={{ background: "#fffdf6", border: "1px solid rgba(244,197,66,0.18)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                <TrendingUp size={12} style={{ display: "inline", marginRight: "4px" }} /> Growth Dynamics
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", fontWeight: "700", color: "#10b981" }}>{data.growthDynamics.cagr}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>CAGR {data.growthDynamics.yearRange}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {data.growthDynamics.trends.map((t, i) => (
                  <div key={i} style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: "#10b981", flexShrink: 0 }}>↗</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Column 2: Competitor Grid ── */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
              🥊 Competitor Intelligence
            </div>

            {/* Direct competitors table */}
            <div style={{ overflowX: "auto", marginBottom: "12px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                <thead>
                  <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
                    {["Competitor", "Pricing", "Key Weakness", "Scale"].map((h) => (
                      <th key={h} style={{ padding: "4px 8px", fontWeight: "600", whiteSpace: "nowrap", borderBottom: "1px solid var(--border-subtle)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.competitorIntel.direct.map((c, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(33,48,66,0.06)", transition: "background 0.15s" }}>
                      <td style={{ padding: "7px 8px", color: "#a36b00", fontWeight: "600", whiteSpace: "nowrap" }}>{c.name}</td>
                      <td style={{ padding: "7px 8px", color: "#0f766e" }}>{c.pricing}</td>
                      <td style={{ padding: "7px 8px", color: "var(--text-secondary)", lineHeight: "1.4" }}>{c.weakness}</td>
                      <td style={{ padding: "7px 8px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{c.scale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Indirect */}
            <div style={{ background: "#fffdf6", border: "1px solid rgba(244,197,66,0.18)", borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>Indirect Alternatives</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {data.competitorIntel.indirect.map((alt, i) => (
                  <span key={i} style={{ fontSize: "11px", background: "rgba(244,197,66,0.16)", border: "1px solid rgba(244,197,66,0.24)", borderRadius: "20px", padding: "3px 10px", color: "#8a5b00" }}>{alt}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Column 3: ICP + Moat + GTM ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* ICP */}
            <div style={{ background: "#fffdf6", border: "1px solid rgba(244,197,66,0.18)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                <Target size={12} style={{ display: "inline", marginRight: "4px" }} /> Ideal Customer Profile
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                {[
                  { label: "Age Range", value: data.icp.ageRange, color: "#a36b00" },
                  { label: "Role", value: data.icp.jobTitle, color: "#3b82f6" },
                  { label: "Purchasing Power", value: data.icp.purchasingPower, color: "#10b981" },
                  {
                    label: "Willingness to Pay",
                    value: data.icp.willingnessToPay,
                    color: data.icp.willingnessToPay === "High" ? "#10b981" : data.icp.willingnessToPay === "Low" ? "#ef4444" : "#f59e0b"
                  },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "2px" }}>{label}</div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "6px" }}>Pain points:</div>
              {data.icp.painPoints.map((p, i) => (
                <div key={i} style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0 }}>🔴</span> {p}
                </div>
              ))}
              <div style={{ marginTop: "8px", fontSize: "11px", color: "#8a5b00", background: "rgba(244,197,66,0.14)", border: "1px solid rgba(244,197,66,0.24)", borderRadius: "6px", padding: "6px 10px" }}>
                💡 {data.icp.wtpReason}
              </div>
            </div>

            {/* Moat */}
            <div style={{ background: "#fffdf6", border: "1px solid rgba(244,197,66,0.18)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                <ShieldCheck size={12} style={{ display: "inline", marginRight: "4px" }} /> Competitive Moat
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#e6ad0c", flexShrink: 0 }}>⚡</span>
                  <span><strong style={{ color: "var(--text-primary)" }}>Feature:</strong> {data.moat.featureMoat}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", gap: "8px" }}>
                  <span style={{ color: "#10b981", flexShrink: 0 }}>🚀</span>
                  <span><strong style={{ color: "var(--text-primary)" }}>Speed/Cost:</strong> {data.moat.costSpeedMoat}</span>
                </div>
              </div>
            </div>

            {/* GTM Experiments */}
            <div style={{ background: "#fffdf6", border: "1px solid rgba(244,197,66,0.18)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                🧪 GTM Validation Experiments
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.gtmExperiments.map((exp, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "2px" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #f4c542, #e6ad0c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: "#213042" }}>
                        {i + 1}
                      </div>
                      {i < data.gtmExperiments.length - 1 && (
                        <div style={{ width: 1, height: "100%", minHeight: "20px", background: "rgba(244,197,66,0.3)", margin: "4px 0" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-primary)" }}>{exp.title}</div>
                        <div style={{ fontSize: "10px", color: "#8a5b00", background: "rgba(244,197,66,0.16)", border: "1px solid rgba(244,197,66,0.24)", borderRadius: "20px", padding: "1px 8px", whiteSpace: "nowrap", marginLeft: "8px" }}>{exp.week}</div>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4", marginBottom: "3px" }}>{exp.description}</div>
                      <div style={{ fontSize: "11px", color: "#166534", fontWeight: "600" }}>Budget: {exp.budget}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
