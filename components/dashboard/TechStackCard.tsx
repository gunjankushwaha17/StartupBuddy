import { TechData, SectionStatus } from "@/lib/types";
import { Code2, RefreshCw, Cpu } from "lucide-react";

interface TechStackCardProps {
  status: SectionStatus;
  data?: TechData;
  onRetry: () => void;
}

const STACK_CONFIG = [
  { key: "frontend" as const, label: "Frontend", emoji: "🖥️", color: "#e6ad0c", bg: "rgba(244,197,66,0.12)", border: "rgba(244,197,66,0.25)" },
  { key: "backend"  as const, label: "Backend",  emoji: "⚙️", color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)"  },
  { key: "database" as const, label: "Database", emoji: "🗄️", color: "#06b6d4", bg: "rgba(6,182,212,0.12)",   border: "rgba(6,182,212,0.25)"   },
  { key: "aiLayer"  as const, label: "AI Layer", emoji: "🤖", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
];

function TechSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "10px", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 10, width: "40%", marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 14, width: "70%"  }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TechError({ onRetry }: { onRetry: () => void }) {
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

export default function TechStackCard({ status, data, onRetry }: TechStackCardProps) {
  return (
    <div className="glass-card animate-slide-up stagger-3" style={{ padding: "24px" }}>
      <div className="flex items-center gap-2 mb-5">
        <div style={{ width: 36, height: 36, borderRadius: "12px", background: "linear-gradient(135deg, rgba(244,197,66,0.22), rgba(255,243,176,0.72))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,197,66,0.3)" }}>
          <Code2 size={16} color="#e6ad0c" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            Tech Stack Recommendation
          </h2>
          <div className="section-pill" style={{ marginTop: "6px" }}>
            <Cpu size={10} /> Build-ready stack
          </div>
        </div>
      </div>

      {status === "loading" && <TechSkeleton />}
      {status === "error"   && <TechError onRetry={onRetry} />}

      {status === "done" && data && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {STACK_CONFIG.map(({ key, label, emoji, color, bg, border }) => (
              <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s ease" }}>
                <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${color}16`, border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                  {emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-primary)", lineHeight: "1.3" }}>{data.techStack[key]}</div>
                </div>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: "16px", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)", borderRadius: "8px", fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.5" }}>
            💡 Stack tailored to your budget &amp; timeline constraints. Ask your AI Co-Founder for alternatives.
          </div>
        </>
      )}
    </div>
  );
}
