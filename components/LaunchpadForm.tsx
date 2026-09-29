"use client";

import { useState } from "react";
import { FormInput } from "@/lib/types";
import { Rocket, Lightbulb, Users, Globe, Wallet, Clock, AlertCircle } from "lucide-react";

interface LaunchpadFormProps {
  /** Called with validated form data — the page handles all API calls. */
  onSubmit: (input: FormInput) => void;
}

const MARKETS = [
  "India", "USA", "UK", "Canada", "Australia", "Singapore",
  "UAE", "Germany", "France", "Japan", "South East Asia", "Global",
];

const TIMELINES = ["3 months", "6 months", "12 months"] as const;

export default function LaunchpadForm({ onSubmit }: LaunchpadFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const [form, setForm] = useState<FormInput>({
    startupIdea: "",
    targetAudience: "",
    geographicMarket: "India",
    budget: "",
    timeline: "6 months",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.startupIdea.trim() || form.startupIdea.length < 20) {
      setError("Please describe your idea in at least 20 characters.");
      return;
    }
    if (!form.targetAudience.trim()) {
      setError("Please specify your target audience.");
      return;
    }
    if (!form.budget.trim()) {
      setError("Please enter your starting budget.");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Startup Idea */}
      <div>
        <label htmlFor="startupIdea" className="label-text flex items-center gap-2">
          <Lightbulb size={13} className="text-purple-400" />
          Your Startup Idea
        </label>
        <textarea
          id="startupIdea"
          className="input-field resize-none"
          rows={4}
          maxLength={500}
          placeholder="e.g., An AI-powered tutoring app for JEE/NEET students that creates personalized study plans and tracks weak topics..."
          value={form.startupIdea}
          onChange={(e) => {
            setForm((f) => ({ ...f, startupIdea: e.target.value }));
            setCharCount(e.target.value.length);
          }}
        />
        <div className="flex justify-end mt-1">
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {charCount}/500
          </span>
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label htmlFor="targetAudience" className="label-text flex items-center gap-2">
          <Users size={13} className="text-blue-400" />
          Target Audience
        </label>
        <input
          id="targetAudience"
          type="text"
          className="input-field"
          placeholder="e.g., College Students, School Teachers, Freelancers..."
          value={form.targetAudience}
          onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))}
        />
      </div>

      {/* Market + Budget row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="geographicMarket" className="label-text flex items-center gap-2">
            <Globe size={13} className="text-cyan-400" />
            Market
          </label>
          <select
            id="geographicMarket"
            className="input-field"
            value={form.geographicMarket}
            onChange={(e) => setForm((f) => ({ ...f, geographicMarket: e.target.value }))}
          >
            {MARKETS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="label-text flex items-center gap-2">
            <Wallet size={13} className="text-amber-400" />
            Budget (₹ Lakhs)
          </label>
          <input
            id="budget"
            type="text"
            className="input-field"
            placeholder="e.g., 2 Lakhs, 5L, 50K"
            value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
          />
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className="label-text flex items-center gap-2">
          <Clock size={13} className="text-rose-400" />
          Execution Timeline
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TIMELINES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((f) => ({ ...f, timeline: t }))}
              style={{
                background: form.timeline === t
                  ? "linear-gradient(135deg, rgba(244,197,66,0.24) 0%, rgba(255,243,176,0.72) 100%)"
                  : "rgba(255,255,255,0.04)",
                border: form.timeline === t
                  ? "1px solid rgba(244,197,66,0.38)"
                  : "1px solid var(--border-subtle)",
                borderRadius: "10px",
                color: form.timeline === t ? "#8a5b00" : "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: form.timeline === t ? "600" : "400",
                padding: "10px 8px",
                transition: "all 0.2s ease",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 animate-fade-in"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#f87171",
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        id="validate-btn"
        type="submit"
        className="btn-primary"
      >
        <span className="flex items-center justify-center gap-2">
          <Rocket size={18} />
          Validate My Idea
        </span>
      </button>
    </form>
  );
}
