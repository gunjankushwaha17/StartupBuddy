import { BreakevenDim } from "@/lib/types";

export function BreakevenDetail({ data }: { data: BreakevenDim }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Key numbers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--accent-primary-bg)", border: "1px solid var(--border-strong)", borderRadius: 14, padding: "20px 18px" }}>
          <div className="label-text" style={{ color: "var(--accent-primary-strong)", marginBottom: 6 }}>Revenue Target</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--green-600)", letterSpacing: "-0.02em" }}>{data.revenueTarget}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>monthly to break even</div>
        </div>
        <div style={{ background: "var(--accent-secondary-bg)", border: "1px solid rgba(59,130,246,0.22)", borderRadius: 14, padding: "20px 18px" }}>
          <div className="label-text" style={{ color: "var(--accent-secondary-strong)", marginBottom: 6 }}>Time to Breakeven</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--blue-600)", letterSpacing: "-0.02em" }}>{data.timeToBreakeven}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>from launch</div>
        </div>
      </div>

      {/* Unit Economics */}
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 18px" }}>
        <div className="label-text" style={{ marginBottom: 6 }}>Unit Economics</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--text-primary)", fontWeight: 700 }}>{data.unitEconomics}</div>
      </div>

      {/* Assumptions */}
      <div>
        <div className="label-text" style={{ marginBottom: 10 }}>Key Assumptions</div>
        {data.keyAssumptions.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>A{i + 1}</span>
            <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
