"use client";

import { useState } from "react";
import { ChevronDown, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { SectionStatus } from "@/lib/types";

interface DimensionCardProps {
  num: number;
  icon: string;
  title: string;
  summaryLine: string | null;
  scoreChip?: React.ReactNode;
  status: SectionStatus;
  error?: string;
  isOpen: boolean;
  onToggle: () => void;
  onRetry?: () => void;
  children: React.ReactNode;               // Detail view rendered when open
  iconBg?: string;
  iconColor?: string;
}

export default function DimensionCard({
  num, icon, title, summaryLine, scoreChip,
  status, error, isOpen, onToggle, onRetry,
  children, iconBg = "var(--accent-primary-bg)", iconColor = "var(--accent-primary-strong)",
}: DimensionCardProps) {
  const isLoading = status === "loading";
  const isError   = status === "error";
  const isDone    = status === "done";

  return (
    <div className={`dim-row${isOpen ? " dim-row-open" : ""}`}>
      {/* Header row — always visible */}
      <div
        className="dim-header"
        onClick={() => { if (isDone) onToggle(); }}
        style={{ cursor: isDone ? "pointer" : isLoading ? "wait" : "default" }}
        aria-expanded={isOpen}
      >
        {/* Icon */}
        <div className="dim-icon" style={{ background: iconBg, color: iconColor }}>
          {isLoading ? <Loader2 size={18} className="animate-spin" style={{ color: iconColor }} /> : icon}
        </div>

        {/* Text */}
        <div className="dim-teaser">
          <div className="dim-num">Dimension {num} of 9</div>
          <div className="dim-title">{title}</div>
          <div className="dim-summary-line">
            {isLoading && "AI scanning…"}
            {isError && <span style={{ color: "var(--accent-red, #ef4444)" }}>⚠ {error}</span>}
            {isDone && (summaryLine ?? "Analysis complete")}
          </div>
        </div>

        {/* Right — score chip + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {isDone && scoreChip}
          {isError && onRetry && (
            <button
              onClick={(e) => { e.stopPropagation(); onRetry(); }}
              title="Retry"
              style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: "#ef4444", fontWeight: 600 }}
            >
              <RefreshCw size={12} /> Retry
            </button>
          )}
          {isDone && (
            <div className="dim-chevron">
              <ChevronDown size={18} />
            </div>
          )}
        </div>
      </div>

      {/* Detail panel — only rendered when open */}
      {isOpen && isDone && (
        <div className="dim-detail">{children}</div>
      )}
    </div>
  );
}

// ── Score chip helpers ──────────────────────────────────────────────────────

export function ScoreChip({ score }: { score: number }) {
  const cls = score >= 7 ? "score-high" : score >= 5 ? "score-mid" : "score-low";
  return <span className={`score-chip ${cls}`}>{score.toFixed(1)} / 10</span>;
}

export function VerdictChip({ decision }: { decision: "GO" | "NO-GO" | "PIVOT" }) {
  const cls = decision === "GO" ? "verdict-go" : decision === "NO-GO" ? "verdict-nogo" : "verdict-maybe";
  const label = decision === "GO" ? "✓ GO" : decision === "NO-GO" ? "✗ NO-GO" : "⟳ PIVOT";
  return <span className={`score-chip ${cls}`}>{label}</span>;
}

export function UrgencyChip({ urgency }: { urgency: string }) {
  const cls = urgency === "Critical" || urgency === "High" ? "score-low" : urgency === "Medium" ? "score-mid" : "score-high";
  return <span className={`score-chip ${cls}`}>{urgency}</span>;
}
