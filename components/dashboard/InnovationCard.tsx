import { InnovationData, SectionStatus } from "@/lib/types";
import { TrendingUp, RefreshCw, Sparkles } from "lucide-react";

interface InnovationCardProps {
  status: SectionStatus;
  data?: InnovationData;
  onRetry: () => void;
}

const SWOT_CONFIG = [
  { key: "strengths"     as const, label: "Strengths",     className: "swot-strength",    emoji: "💪", color: "#10b981" },
  { key: "weaknesses"    as const, label: "Weaknesses",    className: "swot-weakness",    emoji: "⚠️", color: "#ef4444" },
  { key: "opportunities" as const, label: "Opportunities", className: "swot-opportunity", emoji: "🚀", color: "#3b82f6" },
  { key: "threats"       as const, label: "Threats",       className: "swot-threat",      emoji: "🛡️", color: "#f59e0b" },
];

// ─── Inline skeleton ──────────────────────────────────────────────────────────
function InnovationSkeleton() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 120, height: 120, borderRadius: "50%" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 90, borderRadius: "10px" }} />
        ))}
      </div>
    </>
  );
}

// ─── Inline error ─────────────────────────────────────────────────────────────
function InnovationError({ error, onRetry }: { error?: string; onRetry: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontSize: "32px", marginBottom: "10px" }}>😞</div>
      <p style={{ fontSize: "12px", color: "#f87171", marginBottom: "16px", lineHeight: "1.5" }}>
        {error ?? "Failed to load this section."}
      </p>
      <button
        onClick={onRetry}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "rgba(244,197,66,0.16)", border: "1px solid rgba(244,197,66,0.28)",
          borderRadius: "8px", color: "#a36b00", cursor: "pointer",
          fontSize: "12px", fontWeight: "600", padding: "8px 16px",
          fontFamily: "'Inter', sans-serif", transition: "all 0.2s ease",
        }}
      >
        <RefreshCw size={13} /> Retry
      </button>
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export default function InnovationCard({ status, data, onRetry }: InnovationCardProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = data ? (data.innovationScore / 10) * 100 : 0;
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;
  const scoreColor = !data ? "#7c8a9a" : data.innovationScore >= 7.5 ? "#16a34a" : data.innovationScore >= 5 ? "#e6ad0c" : "#ef4444";

  return (
    <div className="glass-card animate-slide-up stagger-1" style={{ padding: "24px" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div style={{ width: 36, height: 36, borderRadius: "12px", background: "linear-gradient(135deg, rgba(244,197,66,0.24), rgba(255,243,176,0.7))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,197,66,0.3)" }}>
            <TrendingUp size={16} color="#e6ad0c" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              Strategy &amp; Innovation
            </h2>
            <div className="section-pill" style={{ marginTop: "6px" }}>
              <Sparkles size={10} /> Strategic signal
            </div>
          </div>
        </div>
        {status === "loading" && (
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e6ad0c", boxShadow: "0 0 6px #e6ad0c", animation: "pulse 1.4s ease-in-out infinite" }} />
        )}
      </div>

      {status === "loading" && <InnovationSkeleton />}
      {status === "error"   && <InnovationError error={data as undefined} onRetry={onRetry} />}

      {status === "done" && data && (
        <>
          {/* Score Ring */}
          <div className="flex flex-col items-center mb-6">
            <div style={{ position: "relative", width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(33,48,66,0.08)" strokeWidth="10" />
                <circle cx="70" cy="70" r={radius} fill="none" stroke={scoreColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="score-ring"
                  style={{ filter: `drop-shadow(0 0 8px ${scoreColor}55)` }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "30px", fontWeight: "700", color: scoreColor, lineHeight: 1 }}>
                  {data.innovationScore.toFixed(1)}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>/ 10</span>
              </div>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: "var(--text-secondary)", marginTop: "8px" }}>
              Innovation Score
            </div>
          </div>

          {/* SWOT Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {SWOT_CONFIG.map(({ key, label, className, emoji, color }) => (
              <div key={key} className={className}>
                <div className="flex items-center gap-1 mb-2" style={{ fontSize: "11px", fontWeight: "700", color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <span>{emoji}</span> {label}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {data.swotAnalysis[key].map((item, i) => (
                    <li key={i} style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", paddingLeft: "8px", borderLeft: `2px solid ${color}44`, marginBottom: "4px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
