import { FinancialsData, SectionStatus } from "@/lib/types";
import { DollarSign, RefreshCw, ShieldCheck } from "lucide-react";

interface FinancialsCardProps {
  status: SectionStatus;
  data?: FinancialsData;
  onRetry: () => void;
}

function FinancialsSkeleton() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div className="skeleton" style={{ height: 12, width: "35%" }} />
            <div className="skeleton" style={{ height: 12, width: "20%" }} />
          </div>
          <div className="skeleton" style={{ height: 6, borderRadius: "3px" }} />
        </div>
      ))}
      <div className="skeleton" style={{ height: 90, borderRadius: "10px", marginTop: 16 }} />
    </>
  );
}

function FinancialsError({ onRetry }: { onRetry: () => void }) {
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

export default function FinancialsCard({ status, data, onRetry }: FinancialsCardProps) {
  const riskClassName = !data ? "" :
    data.riskAssessment.level === "High" ? "risk-high" :
    data.riskAssessment.level === "Low"  ? "risk-low"  : "risk-medium";
  const riskEmoji = !data ? "" :
    data.riskAssessment.level === "High" ? "🔴" :
    data.riskAssessment.level === "Low"  ? "🟢" : "🟡";

  const costItems = data ? [
    { label: "Dev Cost Estimate",   value: data.financials.devCostEstimate,        color: "#e6ad0c", barWidth: "70%" },
    { label: "Monthly Operations",  value: data.financials.monthlyOperationalCost, color: "#3b82f6", barWidth: "30%" },
    { label: "Marketing Allocation",value: data.financials.marketingAllocation,    color: "#0891b2", barWidth: "45%" },
  ] : [];

  return (
    <div className="glass-card animate-slide-up stagger-4" style={{ padding: "24px" }}>
      <div className="flex items-center gap-2 mb-5">
        <div style={{ width: 36, height: 36, borderRadius: "12px", background: "linear-gradient(135deg, rgba(244,197,66,0.22), rgba(255,243,176,0.72))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,197,66,0.3)" }}>
          <DollarSign size={16} color="#e6ad0c" />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            Financial &amp; Risk Breakdown
          </h2>
          <div className="section-pill" style={{ marginTop: "6px" }}>
            <ShieldCheck size={10} /> Resource outlook
          </div>
        </div>
      </div>

      {status === "loading" && <FinancialsSkeleton />}
      {status === "error"   && <FinancialsError onRetry={onRetry} />}

      {status === "done" && data && (
        <>
          {/* Cost bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            {costItems.map(({ label, value, color, barWidth }) => (
              <div key={label}>
                <div className="flex items-center justify-between" style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500" }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: "700", color, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                  <div className="progress-bar-fill" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)`, width: barWidth, boxShadow: `0 0 8px ${color}66` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Risk Assessment */}
          <div style={{ background: "#fffdf6", border: "1px solid rgba(244,197,66,0.2)", borderRadius: "12px", padding: "16px" }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Risk Assessment</span>
              <span className={riskClassName}>{riskEmoji} {data.riskAssessment.level} Risk</span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "10px" }}>
              <strong style={{ color: "var(--text-primary)" }}>Primary Risk: </strong>{data.riskAssessment.primaryRisk}
            </p>
            <div style={{ background: "rgba(244,197,66,0.14)", border: "1px solid rgba(244,197,66,0.24)", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#8a5b00", lineHeight: "1.5" }}>
              <strong>✅ Mitigation: </strong>{data.riskAssessment.mitigation}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
