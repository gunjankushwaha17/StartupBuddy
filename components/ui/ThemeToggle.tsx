"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-primary-bg)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-glow)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-primary-strong)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
      }}
    >
      <span
        style={{
          display: "flex",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: theme === "dark" ? "rotate(20deg)" : "rotate(0deg)",
        }}
      >
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </span>
    </button>
  );
}
