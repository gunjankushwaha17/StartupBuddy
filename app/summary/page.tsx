"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ValidationReport } from "@/lib/types";
import { FileDown, ArrowLeft, Star } from "lucide-react";

interface SummaryData {
  report: ValidationReport;
  ideaTitle: string;
}

function ScoreCircle({ score }: { score: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const dash = (score / 10) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={60} cy={60} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={10} />
        <circle
          cx={60} cy={60} r={r}
          fill="none"
          stroke="url(#gold-grad)"
          strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.5s ease-out" }}
        />
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f4c542" />
            <stop offset="100%" stopColor="#e6ad0c" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--accent-primary-strong)", lineHeight: 1 }}>
          {score.toFixed(1)}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>/10</div>
      </div>
    </div>
  );
}

export default function SummaryPage() {
  const router = useRouter();
  const [data, setData] = useState<SummaryData | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sb-summary-report");
    if (!stored) { setMissing(true); return; }
    try { setData(JSON.parse(stored)); } catch { setMissing(true); }
  }, []);

  if (missing) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
        <div style={{ fontSize: 48 }}>🤔</div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>No report found</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Generate a validation report first to view the one-page summary.</p>
        <button onClick={() => router.push("/")} className="btn-primary" style={{ width: "auto", padding: "12px 28px" }}>
          <span>Go to homepage</span>
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--accent-primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const { report, ideaTitle } = data;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Action bar */}
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <button
          onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <button
          id="summary-pdf-btn"
          onClick={() => window.print()}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #f4c542, #e6ad0c)", border: "none", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#213042" }}
        >
          <FileDown size={15} /> Download PDF
        </button>
      </div>

      {/* Summary Card */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 24, padding: "40px 36px", boxShadow: "var(--shadow-md)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36, paddingBottom: 28, borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-primary-strong)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            🚀 Startup Buddy — Validation Report
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 0, lineHeight: 1.3 }}>
            {ideaTitle}
          </h1>
        </div>

        {/* Score + Key Metrics row */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 36, alignItems: "center", marginBottom: 32 }} className="summary-top">
          <div style={{ position: "relative", display: "inline-flex" }}>
            <ScoreCircle score={report.innovationScore} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { label: "Risk Level", value: report.riskAssessment.level, color: report.riskAssessment.level === "Low" ? "#16a34a" : report.riskAssessment.level === "High" ? "#ef4444" : "#f4c542" },
              { label: "Dev Cost", value: report.financials.devCostEstimate },
              { label: "Monthly Ops", value: report.financials.monthlyOperationalCost },
              { label: "Marketing", value: report.financials.marketingAllocation },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "var(--bg-secondary)", borderRadius: 12, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: color ?? "var(--text-primary)" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SWOT */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
            SWOT Analysis
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "💪 Strengths", items: report.swotAnalysis.strengths.slice(0, 3), className: "swot-strength" },
              { label: "⚠️ Weaknesses", items: report.swotAnalysis.weaknesses.slice(0, 3), className: "swot-weakness" },
              { label: "🌟 Opportunities", items: report.swotAnalysis.opportunities.slice(0, 3), className: "swot-opportunity" },
              { label: "🔥 Threats", items: report.swotAnalysis.threats.slice(0, 3), className: "swot-threat" },
            ].map(({ label, items, className }) => (
              <div key={label} className={className}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  {items.map((it, i) => <li key={i} style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.4 }}>• {it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* MVP */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
            MVP Blueprint
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 8, textTransform: "uppercase" }}>✅ Must Have</div>
              {report.mvpBlueprint.mustHave.slice(0, 4).map((f, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>• {f}</div>)}
            </div>
            <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", marginBottom: 8, textTransform: "uppercase" }}>💡 Nice to Have</div>
              {report.mvpBlueprint.niceToHave.slice(0, 4).map((f, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>• {f}</div>)}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
            Recommended Tech Stack
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {Object.entries(report.techStack).map(([key, val]) => (
              <div key={key} className="tech-badge">
                <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{key}:</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk */}
        <div style={{ background: "var(--bg-secondary)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              ⚠️ Primary Risk
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{report.riskAssessment.primaryRisk}</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>Mitigation: {report.riskAssessment.mitigation}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Generated by <strong style={{ color: "var(--accent-primary-strong)" }}>Startup Buddy</strong> · startupbuddy.ai
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f4c542" color="#f4c542" />)}
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>4.9 / 5</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .summary-top { grid-template-columns: 1fr !important; }
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
