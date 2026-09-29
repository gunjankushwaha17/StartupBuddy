"use client";

import { FileDown, Layout } from "lucide-react";
import { ValidationReport } from "@/lib/types";
import { useRouter } from "next/navigation";

interface ReportActionsProps {
  report: ValidationReport;
  ideaTitle: string;
}

export default function ReportActions({ report, ideaTitle }: ReportActionsProps) {
  const router = useRouter();

  const handlePDF = () => {
    window.print();
  };

  const handleSummary = () => {
    // Store report in sessionStorage and navigate
    sessionStorage.setItem("sb-summary-report", JSON.stringify({ report, ideaTitle }));
    router.push("/summary");
  };

  return (
    <div
      className="no-print"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 10,
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 16,
        padding: "10px 14px",
        boxShadow: "var(--shadow-lg)",
        zIndex: 50,
        animation: "slideUp 0.4s ease-out",
      }}
    >
      <button
        id="download-pdf-btn"
        onClick={handlePDF}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
          borderRadius: 10, padding: "9px 16px",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
          color: "var(--text-secondary)", transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-glow)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-primary-strong)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        }}
      >
        <FileDown size={15} /> Download PDF
      </button>

      <button
        id="one-page-summary-btn"
        onClick={handleSummary}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "linear-gradient(135deg, rgba(244,197,66,0.2), rgba(255,243,176,0.5))",
          border: "1px solid var(--border-glow)",
          borderRadius: 10, padding: "9px 16px",
          cursor: "pointer", fontSize: 13, fontWeight: 700,
          color: "var(--accent-primary-strong)", transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
      >
        <Layout size={15} /> One-Page Summary
      </button>
    </div>
  );
}
