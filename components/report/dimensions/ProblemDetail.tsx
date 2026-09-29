import { ProblemDim } from "@/lib/types";

export function ProblemDetail({ data }: { data: ProblemDim }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Statement */}
      <div style={{ background: "var(--accent-primary-bg)", border: "1px solid var(--border-strong)", borderRadius: 12, padding: "16px 20px" }}>
        <div className="label-text" style={{ marginBottom: 8, color: "var(--accent-primary-strong)" }}>Fact-Checked Problem Statement</div>
        <p style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, fontWeight: 500 }}>{data.statement}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Evidence */}
        <div>
          <div className="label-text" style={{ marginBottom: 10 }}>Supporting Evidence</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.evidence.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "var(--accent-primary-bg)", border: "1px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--accent-primary-strong)" }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{e}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Adjacent Problems */}
        <div>
          <div className="label-text" style={{ marginBottom: 10 }}>Adjacent Problems</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.adjacentProblems.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, color: "var(--accent-secondary)", fontSize: 16, lineHeight: 1.4 }}>→</span>
                <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
