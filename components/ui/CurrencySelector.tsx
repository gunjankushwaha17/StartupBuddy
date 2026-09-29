"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/lib/context/CurrencyContext";

export default function CurrencySelector() {
  const { currency, currencies, setCurrencyCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        id="currency-selector-btn"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          padding: "6px 10px",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-secondary)",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
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
        <span>{currency.flag}</span>
        <span>{currency.code}</span>
        <ChevronDown
          size={12}
          style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "var(--bg-modal)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 14,
            padding: "6px",
            minWidth: 180,
            boxShadow: "var(--shadow-lg)",
            zIndex: 200,
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrencyCode(c.code); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "8px 12px",
                background: c.code === currency.code ? "var(--accent-primary-bg)" : "transparent",
                border: "none",
                borderRadius: 9,
                cursor: "pointer",
                fontSize: 13,
                color: c.code === currency.code ? "var(--accent-primary-strong)" : "var(--text-primary)",
                fontWeight: c.code === currency.code ? 700 : 400,
                textAlign: "left",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (c.code !== currency.code)
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                if (c.code !== currency.code)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span>{c.flag}</span>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ opacity: 0.6, fontFamily: "monospace" }}>{c.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
