"use client";

import { useState, useCallback } from "react";
import { FormInput } from "@/lib/types";
import { fetchInnovationSection, fetchMarketSection } from "@/app/actions/validate";
import LaunchpadForm from "@/components/LaunchpadForm";
import { ArrowLeftRight, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

interface IdeaResult {
  status: "idle" | "loading" | "done" | "error";
  innovationScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  tam?: string;
  cagr?: string;
  error?: string;
  label?: string;
}

const EMPTY_RESULT = (): IdeaResult => ({ status: "idle" });

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: "var(--border-subtle)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / 10) * 100}%`, background: color, borderRadius: 999, transition: "width 1.2s ease-out" }} />
      </div>
      <span style={{ fontWeight: 700, fontSize: 15, color, minWidth: 32 }}>{value.toFixed(1)}</span>
    </div>
  );
}

function ResultCard({ result, label }: { result: IdeaResult; label: string }) {
  if (result.status === "idle") return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-primary-strong)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        💡 {label}
      </div>
      {result.status === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14 }}>
          <Loader2 size={16} className="animate-spin" /> Analyzing with AI…
        </div>
      )}
      {result.status === "error" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ef4444", fontSize: 14 }}>
          <AlertTriangle size={15} /> {result.error}
        </div>
      )}
      {result.status === "done" && (
        <>
          <div>
            <div className="label-text">Innovation Score</div>
            <ScoreBar value={result.innovationScore ?? 0} color={result.innovationScore! >= 7 ? "#16a34a" : result.innovationScore! >= 5 ? "#f4c542" : "#ef4444"} />
          </div>
          {result.tam && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>TAM: <strong style={{ color: "var(--text-primary)" }}>{result.tam}</strong></div>
              {result.cagr && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>CAGR: <strong style={{ color: "var(--text-primary)" }}>{result.cagr}</strong></div>}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "💪 Strengths", items: result.strengths, color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
              { label: "⚠️ Weaknesses", items: result.weaknesses, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
              { label: "🌟 Opportunities", items: result.opportunities, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
              { label: "🔥 Threats", items: result.threats, color: "#f4c542", bg: "rgba(244,197,66,0.08)" },
            ].map(({ label: l, items, color, bg }) => (
              <div key={l} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  {(items ?? []).slice(0, 3).map((it, i) => (
                    <li key={i} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>• {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function DiffPage() {
  const [resultA, setResultA] = useState<IdeaResult>(EMPTY_RESULT());
  const [resultB, setResultB] = useState<IdeaResult>(EMPTY_RESULT());
  const [labelA, setLabelA] = useState("Idea A");
  const [labelB, setLabelB] = useState("Idea B");
  const [compared, setCompared] = useState(false);
  const [loading, setLoading] = useState(false);

  const runAnalysis = useCallback(async (input: FormInput, setter: (r: IdeaResult) => void, label: string) => {
    setter({ status: "loading" });
    try {
      const [innov, market] = await Promise.all([
        fetchInnovationSection(input),
        fetchMarketSection(input),
      ]);
      if (!innov.success) { setter({ status: "error", error: innov.error }); return; }
      setter({
        status: "done",
        label,
        innovationScore: innov.data?.innovationScore,
        strengths: innov.data?.swotAnalysis.strengths,
        weaknesses: innov.data?.swotAnalysis.weaknesses,
        opportunities: innov.data?.swotAnalysis.opportunities,
        threats: innov.data?.swotAnalysis.threats,
        tam: market.success ? market.data?.marketSizing.tam : undefined,
        cagr: market.success ? market.data?.growthDynamics.cagr : undefined,
      });
    } catch {
      setter({ status: "error", error: "Analysis failed. Please retry." });
    }
  }, []);

  const [formAInput, setFormAInput] = useState<FormInput | null>(null);
  const [formBInput, setFormBInput] = useState<FormInput | null>(null);
  const [step, setStep] = useState<"formA" | "formB" | "results">("formA");

  const handleSubmitA = (input: FormInput) => {
    setFormAInput(input);
    setLabelA(input.startupIdea.slice(0, 40) + (input.startupIdea.length > 40 ? "…" : ""));
    setStep("formB");
  };

  const handleSubmitB = async (input: FormInput) => {
    setFormBInput(input);
    setLabelB(input.startupIdea.slice(0, 40) + (input.startupIdea.length > 40 ? "…" : ""));
    setStep("results");
    setLoading(true);
    setCompared(false);
    await Promise.all([
      runAnalysis(formAInput!, setResultA, labelA),
      runAnalysis(input, setResultB, labelB),
    ]);
    setCompared(true);
    setLoading(false);
  };

  const recommendation = () => {
    if (resultA.status !== "done" || resultB.status !== "done") return null;
    const scoreA = resultA.innovationScore ?? 0;
    const scoreB = resultB.innovationScore ?? 0;
    const winner = scoreA >= scoreB ? "A" : "B";
    const winnerLabel = winner === "A" ? labelA : labelB;
    const diff = Math.abs(scoreA - scoreB).toFixed(1);
    return { winner, winnerLabel, diff, scoreA, scoreB };
  };

  const rec = recommendation();

  return (
    <div style={{ minHeight: "80vh", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-pill" style={{ margin: "0 auto 16px" }}>
            <ArrowLeftRight size={11} /> Diff Analysis
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Compare Two <span className="gradient-text">Startup Ideas</span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto" }}>
            Enter two startup ideas and get a side-by-side AI analysis — scores, SWOT, market size, and an AI recommendation on which to pursue.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 40 }}>
          {(["formA", "formB", "results"] as const).map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: step === s ? "linear-gradient(135deg, #f4c542, #e6ad0c)" : (["formA", "formB", "results"].indexOf(step) > i ? "var(--accent-green)" : "var(--bg-card)"),
                border: `2px solid ${step === s ? "#f4c542" : "var(--border-subtle)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color: step === s || ["formA", "formB", "results"].indexOf(step) > i ? "white" : "var(--text-muted)",
              }}>
                {["formA", "formB", "results"].indexOf(step) > i ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: step === s ? "var(--accent-primary-strong)" : "var(--text-muted)" }}>
                {["Idea A", "Idea B", "Results"][i]}
              </span>
              {i < 2 && <div style={{ width: 32, height: 1, background: "var(--border-subtle)" }} />}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        {step === "formA" && (
          <div style={{ maxWidth: 600, margin: "0 auto" }} className="animate-slide-up">
            <div className="glass-card-static" style={{ padding: 32 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4, color: "var(--text-primary)" }}>
                💡 Startup Idea A
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Describe your first startup idea</p>
              <LaunchpadForm onSubmit={handleSubmitA} />
            </div>
          </div>
        )}

        {step === "formB" && (
          <div style={{ maxWidth: 600, margin: "0 auto" }} className="animate-slide-up">
            <div className="glass-card-static" style={{ padding: 32 }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4, color: "var(--text-primary)" }}>
                💡 Startup Idea B
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Now describe your second startup idea</p>
              <LaunchpadForm onSubmit={handleSubmitB} />
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="animate-fade-in">
            {/* Side by side results */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }} className="diff-grid">
              <ResultCard result={resultA} label={labelA} />
              <ResultCard result={resultB} label={labelB} />
            </div>

            {/* AI Recommendation */}
            {compared && rec && (
              <div style={{
                background: "linear-gradient(135deg, var(--accent-primary-bg), var(--bg-card))",
                border: "1px solid var(--border-glow)",
                borderRadius: 20, padding: 32, textAlign: "center",
                animation: "slideUp 0.5s ease-out",
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                  AI Recommendation: <span className="gradient-text">Idea {rec.winner}</span>
                </h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 20px" }}>
                  Based on innovation scores ({rec.scoreA.toFixed(1)} vs {rec.scoreB.toFixed(1)}), Idea {rec.winner} scores {rec.diff} points higher. &ldquo;{rec.winnerLabel}&rdquo; shows stronger market differentiation and growth potential.
                </p>
                <button
                  onClick={() => { setStep("formA"); setResultA(EMPTY_RESULT()); setResultB(EMPTY_RESULT()); setCompared(false); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                    borderRadius: 10, padding: "10px 20px", cursor: "pointer",
                    fontSize: 14, fontWeight: 600, color: "var(--text-secondary)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <RefreshCw size={14} /> Compare Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) { .diff-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
