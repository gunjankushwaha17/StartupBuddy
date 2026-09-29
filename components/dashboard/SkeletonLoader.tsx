import { ReportSections } from "@/lib/types";
import { CheckCircle, XCircle, Loader } from "lucide-react";

interface SectionProgressProps {
  sections: ReportSections;
}

const STEPS: {
  key: keyof ReportSections;
  label: string;
  loadingLabel: string;
  emoji: string;
}[] = [
  { key: "innovation", emoji: "🔍", label: "Market & Strategy",    loadingLabel: "Analyzing market & SWOT..." },
  { key: "mvp",        emoji: "📋", label: "MVP Blueprint",        loadingLabel: "Building MVP blueprint..." },
  { key: "tech",       emoji: "🛠️", label: "Tech Stack",           loadingLabel: "Recommending tech stack..." },
  { key: "financials", emoji: "💰", label: "Financials & Risk",    loadingLabel: "Estimating financials..." },
  { key: "market",     emoji: "📊", label: "Market Research",      loadingLabel: "Researching market & competitors..." },
];

export default function SectionProgress({ sections }: SectionProgressProps) {
  const allDone = STEPS.every((s) => sections[s.key].status !== "loading");
  const anyLoading = STEPS.some((s) => sections[s.key].status === "loading");

  if (allDone) return null; // Hide once everything is resolved

  return (
    <div
      className="animate-fade-in"
      style={{
        background: "rgba(244,197,66,0.1)",
        border: "1px solid rgba(244,197,66,0.2)",
        borderRadius: "14px",
        padding: "16px 20px",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2"
        style={{ marginBottom: "14px" }}
      >
        {anyLoading && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#f4c542",
              boxShadow: "0 0 8px rgba(244,197,66,0.35)",
              animation: "pulse 1.4s ease-in-out infinite",
            }}
          />
        )}
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "13px",
            fontWeight: "600",
            color: "#a36b00",
          }}
        >
          {anyLoading ? "Generating your report…" : "Finalising…"}
        </span>
      </div>

      {/* Step list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {STEPS.map(({ key, emoji, label, loadingLabel }) => {
          const status = sections[key].status;
          return (
            <div
              key={key}
              className="flex items-center gap-3"
              style={{
                opacity: status === "loading" ? 1 : 0.75,
                transition: "opacity 0.3s ease",
              }}
            >
              {/* Status icon */}
              <div style={{ width: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {status === "loading" && (
                  <Loader
                    size={14}
                    color="#a36b00"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                )}
                {status === "done" && <CheckCircle size={14} color="#34d399" />}
                {status === "error" && <XCircle size={14} color="#f87171" />}
              </div>

              <span style={{ fontSize: "12px" }}>{emoji}</span>

              <span
                style={{
                  fontSize: "12px",
                  color: status === "loading"
                    ? "var(--text-primary)"
                    : status === "done"
                    ? "#34d399"
                    : "#f87171",
                  fontWeight: status === "loading" ? "500" : "400",
                  transition: "color 0.3s ease",
                }}
              >
                {status === "loading" ? loadingLabel : label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Inline spin keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
