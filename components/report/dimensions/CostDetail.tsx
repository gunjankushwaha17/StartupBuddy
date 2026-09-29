import { CostStructureDim } from "@/lib/types";

export function CostDetail({ data }: { data: CostStructureDim }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Dev Cost", value: data.devCostEstimate, color: "var(--blue-600)" },
          { label: "Monthly Burn", value: data.monthlyBurnEstimate, color: "var(--orange-600)" },
          { label: "Marketing %", value: data.marketingAllocation, color: "var(--green-600)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 16px" }}>
            <div className="label-text" style={{ marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Line items */}
      <div>
        <div className="label-text" style={{ marginBottom: 10 }}>Lean Cost Breakdown</div>
        <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 12, overflow: "hidden" }}>
          {data.lineItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 2fr",
                padding: "12px 16px",
                borderBottom: i < data.lineItems.length - 1 ? "1px solid var(--border-subtle)" : "none",
                background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-secondary)",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{item.category}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-primary)", fontWeight: 700 }}>{item.monthlyCost}<span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>/mo</span></div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
