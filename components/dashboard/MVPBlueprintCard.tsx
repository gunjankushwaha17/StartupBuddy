import { MvpData, SectionStatus } from "@/lib/types";
import { Layers, RefreshCw, CheckCircle2 } from "lucide-react";

interface MVPBlueprintCardProps {
  status: SectionStatus;
  data?: MvpData;
  timeline: string;
  onRetry: () => void;
}

function MvpSkeleton() {
  return (
    <>
      <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 14 }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton" style={{ height: 34, borderRadius: "8px", marginBottom: 8 }} />
      ))}
      <div className="skeleton" style={{ height: 14, width: "35%", marginBottom: 12, marginTop: 16 }} />
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton" style={{ height: 34, borderRadius: "8px", marginBottom: 8 }} />
      ))}
    </>
  );
}

function MvpError({ error, onRetry }: { error?: string; onRetry: () => void }) {
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

export default function MVPBlueprintCard({ status, data, timeline, onRetry }: MVPBlueprintCardProps) {
  return (
    <div className="glass-card animate-slide-up stagger-2" style={{ padding: "24px" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div style={{ width: 36, height: 36, borderRadius: "12px", background: "linear-gradient(135deg, rgba(244,197,66,0.22), rgba(255,243,176,0.72))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,197,66,0.3)" }}>
            <Layers size={16} color="#e6ad0c" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              Product Blueprint (MVP)
            </h2>
            <div className="section-pill" style={{ marginTop: "6px" }}>{timeline}</div>
          </div>
        </div>
      </div>

      {status === "loading" && <MvpSkeleton />}
      {status === "error"   && <MvpError error={undefined} onRetry={onRetry} />}

      {status === "done" && data && (
        <>
          {/* Must Have */}
          <div style={{ marginBottom: "20px" }}>
            <div className="flex items-center gap-2 mb-3" style={{ fontSize: "11px", fontWeight: "700", color: "#166534", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span style={{ background: "rgba(22,163,74,0.12)", borderRadius: "999px", padding: "2px 8px", border: "1px solid rgba(22,163,74,0.24)" }}><CheckCircle2 size={11} style={{ display: "inline", marginRight: "4px" }} /> Must-Have</span>
              <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none", letterSpacing: "normal", fontSize: "12px" }}>Core for launch</span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {data.mvpBlueprint.mustHave.map((feature, i) => (
                <li key={i} className="tech-badge" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <span style={{ color: "#34d399", fontWeight: "700", minWidth: "20px" }}>{i + 1}.</span>
                  <span style={{ color: "var(--text-primary)", fontSize: "13px" }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nice to Have */}
          <div>
            <div className="flex items-center gap-2 mb-3" style={{ fontSize: "11px", fontWeight: "700", color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <span style={{ background: "rgba(8,145,178,0.12)", borderRadius: "999px", padding: "2px 8px", border: "1px solid rgba(8,145,178,0.24)" }}>💡 Nice-to-Have</span>
              <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none", letterSpacing: "normal", fontSize: "12px" }}>Post-launch</span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {data.mvpBlueprint.niceToHave.map((feature, i) => (
                <li key={i} className="tech-badge" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <span style={{ color: "#60a5fa", fontWeight: "700", minWidth: "20px" }}>+</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
