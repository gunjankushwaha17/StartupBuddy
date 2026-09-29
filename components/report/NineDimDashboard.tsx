"use client";

import { useState, useCallback } from "react";
import { NineDimReport, FormInput, VerdictDecision } from "@/lib/types";
import DimensionCard, { ScoreChip, VerdictChip } from "@/components/report/DimensionCard";
import { ProblemDetail }       from "@/components/report/dimensions/ProblemDetail";
import { PainRankingDetail }   from "@/components/report/dimensions/PainRankingDetail";
import { PersonasDetail }      from "@/components/report/dimensions/PersonasDetail";
import { MarketDetail }        from "@/components/report/dimensions/MarketDetail";
import { CompetitorsDetail }   from "@/components/report/dimensions/CompetitorsDetail";
import { DiffDetail }          from "@/components/report/dimensions/DiffDetail";
import { CostDetail }          from "@/components/report/dimensions/CostDetail";
import { BreakevenDetail }     from "@/components/report/dimensions/BreakevenDetail";
import { VerdictDetail }       from "@/components/report/dimensions/VerdictDetail";
import CoFounderChat, { ChatToggleButton } from "@/components/chat/CoFounderChat";
import ReportActions from "@/components/report/ReportActions";
import { ValidationReport } from "@/lib/types";

interface LoadingState {
  status: "loading" | "done" | "error";
  error?: string;
}

interface NineDimDashboardProps {
  report: NineDimReport | null;
  loading: LoadingState;
  formInput: FormInput;
  onReset: () => void;
  onRetry: () => void;
}

const DIMENSIONS = [
  { key: "problem",         num: 1,  icon: "🔍", title: "Problem",         iconBg: "rgba(59,130,246,0.12)", iconColor: "var(--blue-600)" },
  { key: "painRanking",     num: 2,  icon: "📊", title: "Pain Ranking",    iconBg: "rgba(239,68,68,0.10)", iconColor: "#dc2626" },
  { key: "personas",        num: 3,  icon: "👥", title: "Personas",        iconBg: "rgba(124,58,237,0.10)", iconColor: "#7c3aed" },
  { key: "market",          num: 4,  icon: "🌍", title: "Market (SAM)",    iconBg: "rgba(14,165,233,0.10)", iconColor: "#0891b2" },
  { key: "competitors",     num: 5,  icon: "⚔️", title: "Competitors",     iconBg: "rgba(249,115,22,0.10)", iconColor: "var(--orange-600)" },
  { key: "differentiation", num: 6,  icon: "🚀", title: "Differentiation", iconBg: "var(--accent-primary-bg)", iconColor: "var(--accent-primary-strong)" },
  { key: "costStructure",   num: 7,  icon: "💰", title: "Cost Structure",  iconBg: "rgba(234,88,12,0.10)", iconColor: "var(--orange-700)" },
  { key: "breakeven",       num: 8,  icon: "⚖️", title: "Breakeven",       iconBg: "rgba(22,163,74,0.10)", iconColor: "var(--green-700)" },
  { key: "verdict",         num: 9,  icon: "⚡", title: "Verdict",         iconBg: "rgba(22,163,74,0.12)", iconColor: "var(--green-600)" },
] as const;

function getScoreChip(key: string, report: NineDimReport): React.ReactNode {
  switch (key) {
    case "verdict":       return <VerdictChip decision={report.verdict.decision as VerdictDecision} />;
    case "differentiation": {
      const defScore = { High: 8.5, Medium: 6.0, Low: 3.5 }[report.differentiation.defensibility] ?? 6;
      return <ScoreChip score={defScore} />;
    }
    case "painRanking":   return <ScoreChip score={report.painRanking.ranked[0]?.severityScore ?? 7} />;
    default:              return null;
  }
}

function getSummaryLine(key: string, report: NineDimReport): string {
  switch (key) {
    case "problem":         return report.problem.summaryLine;
    case "painRanking":     return report.painRanking.summaryLine;
    case "personas":        return report.personas.summaryLine;
    case "market":          return report.market.summaryLine;
    case "competitors":     return report.competitors.summaryLine;
    case "differentiation": return report.differentiation.summaryLine;
    case "costStructure":   return report.costStructure.summaryLine;
    case "breakeven":       return report.breakeven.summaryLine;
    case "verdict":         return report.verdict.summaryLine;
    default:                return "Analysis complete";
  }
}

function renderDetail(key: string, report: NineDimReport): React.ReactNode {
  switch (key) {
    case "problem":         return <ProblemDetail data={report.problem} />;
    case "painRanking":     return <PainRankingDetail data={report.painRanking} />;
    case "personas":        return <PersonasDetail data={report.personas} />;
    case "market":          return <MarketDetail data={report.market} />;
    case "competitors":     return <CompetitorsDetail data={report.competitors} />;
    case "differentiation": return <DiffDetail data={report.differentiation} />;
    case "costStructure":   return <CostDetail data={report.costStructure} />;
    case "breakeven":       return <BreakevenDetail data={report.breakeven} />;
    case "verdict":         return <VerdictDetail data={report.verdict} />;
    default:                return null;
  }
}

export default function NineDimDashboard({ report, loading, formInput, onReset, onRetry }: NineDimDashboardProps) {
  const [openDim, setOpenDim] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggle = useCallback((key: string) => {
    setOpenDim((prev) => (prev === key ? null : key));
  }, []);

  // Build legacy ValidationReport for chat (uses what we have in the 9-dim data)
  const chatReport: ValidationReport | null = report ? {
    innovationScore:  report.verdict.compositeScore,
    swotAnalysis: {
      strengths:     report.differentiation.keyAdvantages,
      weaknesses:    [report.verdict.topRisk],
      opportunities: report.market.trends,
      threats:       report.competitors.direct.map((c) => `${c.name}: ${c.weakness}`),
    },
    mvpBlueprint:   { mustHave: [], niceToHave: [] },
    techStack:      { frontend: "Next.js", backend: "Node.js", database: "PostgreSQL", aiLayer: "Gemini" },
    financials:     { devCostEstimate: report.costStructure.devCostEstimate, monthlyOperationalCost: report.costStructure.monthlyBurnEstimate, marketingAllocation: report.costStructure.marketingAllocation },
    riskAssessment: { level: "Medium", primaryRisk: report.verdict.topRisk, mitigation: report.verdict.nextStep },
  } : null;

  const isDone = loading.status === "done" && !!report;
  const isError = loading.status === "error";

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* ─── Header bar ──────────────────────────────────────────────────── */}
      <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-subtle)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              id="back-to-home-btn"
              onClick={onReset}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-card)", border: "1.5px solid var(--border-subtle)", borderRadius: 9, padding: "7px 14px", cursor: "pointer", fontSize: 13, color: "var(--text-secondary)", fontWeight: 500, transition: "all 0.2s ease", fontFamily: "var(--font-body)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-primary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-primary-strong)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
            >
              ← New Idea
            </button>
            <div>
              <div style={{ fontSize: 11, color: "var(--accent-primary-strong)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                {loading.status === "loading" ? "⏳ AI Scanning…" : isDone ? "✅ 9 Dimensions Complete" : "⚠ Error"}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                {formInput.startupIdea.length > 80 ? formInput.startupIdea.slice(0, 80) + "…" : formInput.startupIdea}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>👥 {formInput.targetAudience}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>🌍 {formInput.geographicMarket}</span>
            {isDone && chatReport && (
              <button
                id="open-chat-btn"
                onClick={() => setIsChatOpen(true)}
                style={{ background: "var(--accent-primary-bg)", border: "1px solid var(--border-glow)", borderRadius: 9, color: "var(--accent-primary-strong)", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "7px 14px", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s ease", fontFamily: "var(--font-body)" }}
              >
                🤖 AI Co-Founder
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Verdict Summary (when done) ─────────────────────────────────── */}
      {isDone && report && (
        <div style={{ maxWidth: 900, margin: "20px auto 0", padding: "0 24px" }}>
          <div
            style={{
              background: report.verdict.decision === "GO"
                ? "linear-gradient(135deg, rgba(22,163,74,0.08), rgba(59,130,246,0.06))"
                : report.verdict.decision === "NO-GO"
                ? "linear-gradient(135deg, rgba(220,38,38,0.08), rgba(239,68,68,0.04))"
                : "linear-gradient(135deg, rgba(234,88,12,0.08), rgba(249,115,22,0.04))",
              border: "1.5px solid var(--border-strong)",
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <VerdictChip decision={report.verdict.decision as VerdictDecision} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                Composite Score: {report.verdict.compositeScore.toFixed(1)}/10
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{report.verdict.summaryLine}</div>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic", maxWidth: 300 }}>
              Next: {report.verdict.nextStep}
            </div>
          </div>
        </div>
      )}

      {/* ─── Error state ──────────────────────────────────────────────────── */}
      {isError && (
        <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 24px" }}>
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>Analysis Failed</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>{loading.error}</div>
            <button onClick={onRetry} style={{ background: "var(--green-600)", color: "white", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600 }}>
              Retry Analysis
            </button>
          </div>
        </div>
      )}

      {/* ─── 9 Dimension accordion ───────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: "16px auto 0", padding: "0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {DIMENSIONS.map((dim) => {
          const status = loading.status === "loading" ? "loading" : loading.status === "error" ? "error" : "done";
          const summaryLine = isDone && report ? getSummaryLine(dim.key, report) : null;
          const scoreChip = isDone && report ? getScoreChip(dim.key, report) : undefined;

          return (
            <DimensionCard
              key={dim.key}
              num={dim.num}
              icon={dim.icon}
              title={dim.title}
              summaryLine={summaryLine}
              scoreChip={scoreChip}
              status={status}
              error={loading.error}
              isOpen={openDim === dim.key}
              onToggle={() => handleToggle(dim.key)}
              onRetry={status === "error" ? onRetry : undefined}
              iconBg={dim.iconBg}
              iconColor={dim.iconColor}
            >
              {isDone && report ? renderDetail(dim.key, report) : null}
            </DimensionCard>
          );
        })}
      </div>

      {/* ─── Chat panel ──────────────────────────────────────────────────── */}
      {isDone && chatReport && (
        <>
          <CoFounderChat
            report={chatReport}
            formContext={{ idea: formInput.startupIdea, audience: formInput.targetAudience, market: formInput.geographicMarket, budget: formInput.budget, timeline: formInput.timeline }}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
          {!isChatOpen && <ChatToggleButton onClick={() => setIsChatOpen(true)} hasReport={true} />}
          <ReportActions report={chatReport} ideaTitle={formInput.startupIdea} />
        </>
      )}
    </div>
  );
}
