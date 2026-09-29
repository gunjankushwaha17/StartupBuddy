"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AppState, FormInput, NineDimReport } from "@/lib/types";
import { fetchNineDimReport } from "@/app/actions/validate";
import LaunchpadForm from "@/components/LaunchpadForm";
import NineDimDashboard from "@/components/report/NineDimDashboard";
import { ArrowRight, ChevronDown, Star, Check, Zap, Play, Pause } from "lucide-react";
import { useCurrency } from "@/lib/context/CurrencyContext";

// ─── Constants ────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "🚀 2,340 ideas validated this week",
  "⭐ 4.9/5 average founder rating",
  "🌍 Used in 50+ countries",
  "💡 9 investor-grade dimensions",
  "📊 94% report accuracy rate",
  "🤖 Powered by Gemini AI",
  "💰 Saves 40+ hours of research",
  "🏆 #1 AI startup validator",
  "⚡ Results in under 90 seconds",
  "🎯 15,000+ founders served",
];

const FAQS = [
  { q: "How accurate is the AI validation?", a: "Our AI is trained on thousands of startup case studies and market datasets. Founders consistently report 90%+ alignment with later professional due diligence." },
  { q: "What are the 9 investor-grade dimensions?", a: "Problem, Pain Ranking, Personas, Market (SAM), Competitors, Differentiation, Cost Structure, Breakeven, and Verdict. These are the exact categories seed-stage investors use to evaluate ideas." },
  { q: "Is my startup idea kept private?", a: "Yes. Your idea is used only to generate your report. We do not share it with third parties or train our models on your inputs." },
  { q: "What is the Diff Analysis feature?", a: "The /diff page lets you compare two startup ideas side-by-side — scores, competitive gaps, market differences, and an AI recommendation on which to pursue." },
  { q: "Can I export the report?", a: "Yes — download a PDF of your full 9-dimension report, or generate a shareable one-page summary you can send to investors or co-founders." },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const start = useCallback(() => setStarted(true), []);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return { count, start };
}

// ─── Ticker Bar ────────────────────────────────────────────────────────────────
function TickerBar() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-wrapper no-print">
      <div className="ticker-track">
        {doubled.map((item, i) => <span key={i} className="ticker-item">{item}</span>)}
      </div>
    </div>
  );
}

// ─── Reveal Wrapper ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "scroll-reveal", style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); }
    }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={className} style={{ animationDelay: `${delay}ms`, ...style }}>{children}</div>;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, delta, delay: d = 0 }: { value: number; suffix: string; label: string; delta?: string; delay?: number }) {
  const { count, start } = useCountUp(value, 1600);
  const startedRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        setTimeout(start, d);
        el.classList.add("revealed");
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [d, start]);
  return (
    <div ref={ref} className="scroll-reveal stat-panel">
      <div className="stat-panel-value">{count.toLocaleString()}{suffix}</div>
      <div className="stat-panel-label">{label}</div>
      {delta && <div className="stat-panel-delta">↑ {delta}</div>}
    </div>
  );
}

// ─── Demo Terminal ─────────────────────────────────────────────────────────────
const DEMO_STEPS = [
  { label: "Problem",         lines: [{ t: "prompt", c: 'startup-buddy scan --idea "AI fitness coach app"' }, { t: "muted", c: "Initializing 9-dimension scan…" }, { t: "blue", c: "[ 1/9 ] Verifying problem statement…" }, { t: "green", c: "✓ Problem: Fitness personalization gap confirmed" }, { t: "green", c: "✓ Evidence: 3 data points anchored" }] },
  { label: "Pain Ranking",    lines: [{ t: "blue", c: "[ 2/9 ] Ranking pain severity…" }, { t: "green", c: "✓ #1 Pain Score: 8.4/10 (Daily frequency)" }, { t: "green", c: "✓ Urgency: HIGH across primary segment" }] },
  { label: "Personas",        lines: [{ t: "blue", c: "[ 3/9 ] Building customer personas…" }, { t: "green", c: "✓ Primary: 'The Time-Starved Professional' (28–38)" }, { t: "green", c: "✓ WTP: Medium → High if onboarding < 5 min" }] },
  { label: "Market (SAM)",    lines: [{ t: "blue", c: "[ 4/9 ] Sizing the market…" }, { t: "yellow", c: "★ TAM: $12.4B  |  SAM: $1.8B  |  SOM: $54M" }, { t: "green", c: "✓ CAGR: 18.2% (2025–2030)" }] },
  { label: "Competitors",     lines: [{ t: "blue", c: "[ 5/9 ] Mapping competitive landscape…" }, { t: "green", c: "✓ 4 direct competitors mapped" }, { t: "yellow", c: "⚡ Gap: No local-market + AI combo exists" }] },
  { label: "Differentiation", lines: [{ t: "blue", c: "[ 6/9 ] Scoring differentiation…" }, { t: "green", c: "✓ Defensibility: MEDIUM" }, { t: "green", c: "✓ UVP: 3× faster onboarding, AI-personalized" }] },
  { label: "Cost Structure",  lines: [{ t: "blue", c: "[ 7/9 ] Modeling cost structure…" }, { t: "green", c: "✓ Dev cost: $8K–18K" }, { t: "green", c: "✓ Monthly burn: $1.1K (lean mode)" }] },
  { label: "Breakeven",       lines: [{ t: "blue", c: "[ 8/9 ] Computing break-even…" }, { t: "green", c: "✓ Target: $3.2K/mo  |  Month 8–10" }, { t: "green", c: "✓ Unit: CAC $42 / LTV $196 (4.7× ratio)" }] },
  { label: "Verdict",         lines: [{ t: "blue", c: "[ 9/9 ] Synthesizing verdict…" }, { t: "yellow", c: "★ Composite Score: 7.6/10" }, { t: "green", c: "✓ VERDICT: GO — validate with 50 paying users first" }, { t: "muted", c: "Full 9-dimension report ready in 84 seconds." }] },
];

function DemoTerminal({ onTryNow }: { onTryNow: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  const currentLines = DEMO_STEPS[activeTab].lines;

  useEffect(() => {
    setLineIdx(0);
  }, [activeTab]);

  useEffect(() => {
    if (!playing || lineIdx >= currentLines.length) return;
    const t = setTimeout(() => setLineIdx((i) => i + 1), 700);
    return () => clearTimeout(t);
  }, [playing, lineIdx, currentLines.length]);

  const colorMap: Record<string, string> = {
    prompt: "#e3b341", muted: "#8b949e", blue: "#79c0ff", green: "#3fb950", yellow: "#e3b341",
  };

  return (
    <div className="terminal-card" style={{ maxWidth: 560, width: "100%" }}>
      {/* Header */}
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        <span style={{ marginLeft: 8, fontSize: 12, color: "#8b949e", fontFamily: "var(--font-mono)" }}>
          startup-buddy — 9-Dimension Scan
        </span>
      </div>

      {/* Dim tabs */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(48,54,61,0.8)", scrollbarWidth: "none", padding: "0 4px" }}>
        {DEMO_STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => { setActiveTab(i); setPlaying(true); }}
            style={{
              flex: "0 0 auto",
              padding: "7px 14px",
              background: "none",
              border: "none",
              borderBottom: activeTab === i ? "2px solid #3fb950" : "2px solid transparent",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? "#3fb950" : "#8b949e",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {i + 1}. {step.label}
          </button>
        ))}
      </div>

      {/* Terminal output */}
      <div className="terminal-body" style={{ minHeight: 200, padding: "16px 20px" }}>
        {currentLines.slice(0, lineIdx).map((line, i) => (
          <div key={i} className="terminal-line animate-fade-in">
            {line.t === "prompt" && <span className="terminal-prompt">$</span>}
            <span style={{ color: colorMap[line.t] ?? "#e6edf3" }}>{line.c}</span>
          </div>
        ))}
        {lineIdx < currentLines.length && playing && (
          <div className="terminal-line"><span className="cursor" /></div>
        )}
        {lineIdx >= currentLines.length && activeTab < DEMO_STEPS.length - 1 && (
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => { setActiveTab((a) => a + 1); setPlaying(true); }}
              style={{ background: "rgba(63,185,80,0.12)", border: "1px solid rgba(63,185,80,0.25)", borderRadius: 8, color: "#3fb950", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-mono)", padding: "5px 12px", fontWeight: 600 }}
            >
              Next: {DEMO_STEPS[activeTab + 1].label} →
            </button>
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div style={{ borderTop: "1px solid rgba(48,54,61,0.8)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <button onClick={() => setPlaying((p) => !p)} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(139,148,158,0.12)", border: "1px solid rgba(139,148,158,0.25)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 11, color: "#8b949e", fontFamily: "var(--font-mono)" }}>
          {playing ? <><Pause size={10} /> Pause</> : <><Play size={10} /> Play</>}
        </button>
        <button onClick={onTryNow} style={{ background: "var(--green-600)", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "white", fontFamily: "var(--font-display)", transition: "all 0.2s ease" }}>
          Try with your idea →
        </button>
      </div>
    </div>
  );
}

// ─── Parallax Sky ──────────────────────────────────────────────────────────────
function SkySection({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const c1 = useRef<HTMLDivElement>(null);
  const c2 = useRef<HTMLDivElement>(null);
  const c3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      if (c1.current) c1.current.style.transform = `translateY(${progress * 18}px)`;
      if (c2.current) c2.current.style.transform = `translateY(${progress * 28}px)`;
      if (c3.current) c3.current.style.transform = `translateY(${progress * 12}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="sky-bg" id={id} style={{ position: "relative", overflow: "hidden" }}>
      <div ref={c1} className="cloud-layer cloud-1" />
      <div ref={c2} className="cloud-layer cloud-2" />
      <div ref={c3} className="cloud-layer cloud-3" />
      <div className="stars" />
      {children}
    </div>
  );
}

// ─── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <ChevronDown size={18} style={{ flexShrink: 0, transition: "transform 0.3s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
      </button>
      <div className={`faq-answer${open ? " open" : ""}`}>{a}</div>
    </div>
  );
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────
function PricingCard({ plan, onCta }: { plan: { name: string; price: number; period: string; features: string[]; cta: string; featured: boolean }; onCta: () => void }) {
  const { formatPrice } = useCurrency();
  return (
    <div className={`pricing-card${plan.featured ? " featured" : ""}`}>
      {plan.featured && (
        <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "var(--green-600)", color: "white", borderRadius: 999, padding: "3px 14px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
          Most Popular
        </div>
      )}
      <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{plan.name}</div>
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: plan.featured ? "var(--green-600)" : "var(--text-primary)", letterSpacing: "-0.03em" }}>
          {plan.price === 0 ? "Free" : formatPrice(plan.price)}
        </span>
        {plan.price > 0 && <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>{plan.period}</span>}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-secondary)" }}>
            <Check size={14} color="var(--green-600)" style={{ flexShrink: 0 }} />{f}
          </li>
        ))}
      </ul>
      <button onClick={onCta} className={plan.featured ? "btn-primary" : "btn-secondary"} style={{ width: "100%", padding: "12px 0" }}>
        {plan.cta}
      </button>
    </div>
  );
}

// ─── Bento Features ────────────────────────────────────────────────────────────
function BentoFeatures() {
  const items = [
    { emoji: "🔍", title: "9 Investor Dimensions", desc: "Problem → Pain → Personas → Market → Competitors → Differentiation → Cost → Breakeven → Verdict. Every dimension real investors care about.", span: "2 / span 2" },
    { emoji: "⚡", title: "4 Parallel AI Calls", desc: "All 9 dimensions run concurrently — full report in under 90 seconds, not 20 minutes.", span: "auto" },
    { emoji: "🤖", title: "AI Co-Founder Chat", desc: "Pre-loaded with your full report for deep Q&A.", span: "auto" },
    { emoji: "📊", title: "Diff Analysis", desc: "Compare two ideas side-by-side, let AI pick the winner.", span: "auto" },
    { emoji: "📄", title: "PDF + Summary Export", desc: "Investor-ready PDF and shareable one-page summary.", span: "auto" },
    { emoji: "🌍", title: "50+ Markets", desc: "Market sizing and competitor intel localised to your geography.", span: "2 / span 2" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="bento-responsive">
      {items.map((item, i) => (
        <div
          key={i}
          className="bento-cell tilt-card"
          style={{ gridColumn: item.span }}
          onMouseMove={(e) => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            (e.currentTarget as HTMLDivElement).style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
          }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; }}
        >
          <div style={{ fontSize: 32, marginBottom: 14 }}>{item.emoji}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{item.title}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const [appState, setAppState] = useState<AppState>("form");
  const [formInput, setFormInput] = useState<FormInput | null>(null);
  const [report, setReport] = useState<NineDimReport | null>(null);
  const [loading, setLoading] = useState<{ status: "loading" | "done" | "error"; error?: string }>({ status: "loading" });
  const [demoOpen, setDemoOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const scrollToDemo = useCallback(() => {
    setDemoOpen(true);
    setTimeout(() => demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, []);

  const handleFormSubmit = useCallback(async (input: FormInput) => {
    setFormInput(input);
    setReport(null);
    setLoading({ status: "loading" });
    setAppState("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const result = await fetchNineDimReport(input);
    if (result.success) {
      setReport(result.data);
      setLoading({ status: "done" });
    } else {
      setLoading({ status: "error", error: result.error });
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState("form");
    setReport(null);
    setFormInput(null);
    setLoading({ status: "loading" });
  }, []);

  const handleRetry = useCallback(async () => {
    if (!formInput) return;
    setLoading({ status: "loading" });
    const result = await fetchNineDimReport(formInput);
    if (result.success) {
      setReport(result.data);
      setLoading({ status: "done" });
    } else {
      setLoading({ status: "error", error: result.error });
    }
  }, [formInput]);

  // ─── Dashboard view ────────────────────────────────────────────────────────
  if (appState === "dashboard" && formInput) {
    return (
      <NineDimDashboard
        report={report}
        loading={loading}
        formInput={formInput}
        onReset={handleReset}
        onRetry={handleRetry}
      />
    );
  }

  // ─── Landing page ──────────────────────────────────────────────────────────
  const PLANS = [
    { name: "Free",  price: 0,  period: "Forever",    features: ["3 validations/month", "All 9 dimensions", "PDF export", "AI Co-Founder chat"], cta: "Start Free",    featured: false },
    { name: "Pro",   price: 29, period: "per month",  features: ["Unlimited validations", "Diff analysis", "One-page summary", "Priority AI speed", "Team sharing"],     cta: "Get Pro",      featured: true  },
    { name: "Scale", price: 79, period: "per month",  features: ["Everything in Pro", "5-seat workspace", "API access", "White-label PDF", "Dedicated support"],         cta: "Contact Us",   featured: false },
  ];

  return (
    <>
      <TickerBar />

      {/* ── HERO (Sky background) ───────────────────────────────────────── */}
      <SkySection>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "88px 24px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-grid">
          {/* Left copy */}
          <div>
            <div className="animate-slide-up" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent-primary-bg)", border: "1px solid var(--border-glow)", borderRadius: 999, padding: "5px 14px", fontSize: 12, color: "var(--accent-primary-strong)", fontWeight: 700, marginBottom: 22, fontFamily: "var(--font-display)" }}>
              <Zap size={11} /> 9 Investor-Grade Dimensions
            </div>

            <h1 className="display-xl animate-slide-up stagger-1" style={{ color: "var(--text-primary)", marginBottom: 20 }}>
              Validate your<br />
              startup idea<br />
              <span className="gradient-text">in 90 seconds.</span>
            </h1>

            <p className="animate-slide-up stagger-2" style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 36, maxWidth: 500, fontFamily: "var(--font-body)" }}>
              Get a complete investor-grade report across the 9 dimensions that actually matter — Problem, Market, Competitors, Cost, Breakeven, and Verdict — before you write a single line of code.
            </p>

            <div className="animate-slide-up stagger-3" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              <button
                id="hero-cta-btn"
                onClick={scrollToForm}
                className="btn-primary"
                style={{ fontSize: 16, padding: "14px 32px", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}
              >
                Validate My Idea <ArrowRight size={16} />
              </button>
              <button
                onClick={scrollToDemo}
                className="btn-secondary"
                style={{ fontSize: 15, padding: "14px 26px", borderRadius: 12 }}
              >
                See it in action
              </button>
            </div>

            {/* Social proof avatars */}
            <div className="animate-slide-up stagger-4" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex" }}>
                {["PM", "JW", "AS", "RK", "SL"].map((init, i) => (
                  <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: ["var(--green-600)", "var(--blue-600)", "var(--green-700)", "var(--orange-600)", "var(--blue-700)"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", border: "2px solid var(--bg-primary)", marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i, position: "relative" }}>
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2 }}>{[...Array(5)].map((_, i) => <Star key={i} size={13} fill="var(--orange-400)" color="var(--orange-400)" />)}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
                  Trusted by <strong style={{ color: "var(--text-primary)" }}>15,000+</strong> founders
                </div>
              </div>
            </div>
          </div>

          {/* Right — floating icon + 9-dim preview */}
          <div className="animate-fade-in stagger-2" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            {/* 3D floating growth icon */}
            <div className="float-anim" style={{ fontSize: 72, filter: "drop-shadow(0 12px 32px rgba(22,163,74,0.30))" }}>🚀</div>

            {/* 9-dim preview cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, width: "100%", maxWidth: 380 }}>
              {[
                { icon: "🔍", label: "Problem", color: "var(--blue-600)" },
                { icon: "📊", label: "Pain",    color: "#dc2626" },
                { icon: "👥", label: "Personas", color: "#7c3aed" },
                { icon: "🌍", label: "Market",  color: "#0891b2" },
                { icon: "⚔️", label: "Rivals",  color: "var(--orange-600)" },
                { icon: "🚀", label: "Diff",    color: "var(--green-600)" },
                { icon: "💰", label: "Costs",   color: "var(--orange-700)" },
                { icon: "⚖️", label: "BEP",     color: "var(--green-700)" },
                { icon: "⚡", label: "Verdict", color: "var(--green-600)" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-subtle)", borderRadius: 10, padding: "12px 10px", textAlign: "center", transition: "all 0.2s ease", cursor: "default" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = item.color; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLDivElement).style.transform = ""; }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: item.color, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SkySection>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-secondary)", padding: "18px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {["🔒 SOC 2 Ready", "🤖 Gemini 2.0 Flash", "⚡ &lt;90s Results", "🌍 50+ Countries", "🆓 Free to Start"].map((b) => (
            <span key={b} style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }} dangerouslySetInnerHTML={{ __html: b }} />
          ))}
        </div>
      </div>

      {/* ── STATS (validatorai-style dense panels) ───────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="stats-grid">
          <StatCard value={15000} suffix="+" label="IDEAS VALIDATED"   delta="↑ 340 this week"  delay={0}   />
          <StatCard value={94}    suffix="%" label="REPORT ACCURACY"   delta="vs manual research" delay={120} />
          <StatCard value={9}     suffix=""  label="INVESTOR DIMENSIONS" delay={240} />
          <StatCard value={90}    suffix="s" label="AVG REPORT TIME"   delta="4× faster than v1"  delay={360} />
        </div>
      </section>

      {/* ── BENTO FEATURES ──────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-secondary)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-pill" style={{ margin: "0 auto 14px" }}>✨ What you get</div>
            <h2 className="display-md" style={{ color: "var(--text-primary)", marginBottom: 14 }}>
              Built for founders,<br /><span className="gradient-text">not spreadsheets.</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Five parallel AI calls. Nine dimensions. One report that saves you 40+ hours of research.
            </p>
          </Reveal>
          <BentoFeatures />
        </div>
      </section>

      {/* ── "LET'S START" DEMO SECTION (sky background, clearly separated) ─ */}
      <SkySection id="demo">
        <div ref={demoRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-pill" style={{ margin: "0 auto 14px", background: "rgba(34,197,94,0.10)", borderColor: "rgba(34,197,94,0.25)" }}>🔬 See It In Action</div>
            <h2 className="display-md" style={{ color: "var(--text-primary)", marginBottom: 14 }}>
              Let&apos;s start —<br /><span className="gradient-text">watch a live scan.</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto 32px" }}>
              Click below to see exactly how Startup Buddy scans all 9 investor dimensions in real time. Each tab shows a different analysis step.
            </p>

            {!demoOpen && (
              <button
                id="demo-open-btn"
                onClick={() => setDemoOpen(true)}
                className="btn-primary"
                style={{ fontSize: 16, padding: "14px 36px", borderRadius: 14, display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 8px 28px rgba(22,163,74,0.30)" }}
              >
                <Play size={18} /> Let&apos;s start
              </button>
            )}
          </Reveal>

          {/* Demo terminal — only revealed after click */}
          {demoOpen && (
            <div className="animate-scale-in" style={{ display: "flex", justifyContent: "center" }}>
              <DemoTerminal onTryNow={scrollToForm} />
            </div>
          )}
        </div>
      </SkySection>

      {/* ── TRY IT FORM ─────────────────────────────────────────────────── */}
      <section id="try-it" ref={formRef} style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-pill" style={{ margin: "0 auto 14px" }}>🚀 Try It Free</div>
          <h2 className="display-md" style={{ color: "var(--text-primary)", marginBottom: 12 }}>
            Your idea. 9 dimensions. <span className="gradient-text">90 seconds.</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto" }}>
            Fill in the form and watch your full validation report generate in real time.
          </p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="try-grid">
          {/* Left: dimension checklist */}
          <div>
            {[
              { icon: "🔍", title: "Problem",         desc: "Fact-checked problem statement + adjacent problems" },
              { icon: "📊", title: "Pain Ranking",    desc: "Ranked by severity, frequency & urgency" },
              { icon: "👥", title: "Personas",        desc: "2–3 customer archetypes with WTP analysis" },
              { icon: "🌍", title: "Market (SAM)",    desc: "TAM/SAM/SOM funnel + CAGR + growth drivers" },
              { icon: "⚔️", title: "Competitors",     desc: "3–5 direct + workaround intel + gap analysis" },
              { icon: "🚀", title: "Differentiation", desc: "UVP, moat score, defensibility rating" },
              { icon: "💰", title: "Cost Structure",  desc: "Lean burn model + line-item breakdown" },
              { icon: "⚖️", title: "Breakeven",       desc: "Revenue target, timeline, unit economics" },
              { icon: "⚡", title: "Verdict",         desc: "GO / NO-GO / PIVOT with composite score & next step" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "var(--accent-primary-bg)", border: "1px solid var(--border-glow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 2, fontFamily: "var(--font-display)" }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: form */}
          <div className="glass-card-static" style={{ padding: 32, borderRadius: 18 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>The Launchpad 🚀</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Tell us about your idea. Our AI does the rest in &lt;90 seconds.</p>
            <LaunchpadForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-secondary)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-pill" style={{ margin: "0 auto 14px" }}>❤️ Founders love it</div>
            <h2 className="display-md" style={{ color: "var(--text-primary)" }}>
              Real founders, <span className="gradient-text">real results.</span>
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="testimonials-grid">
            {[
              { name: "Priya Mehta", role: "Founder, EduTech", avatar: "PM", color: "var(--green-600)", quote: "Startup Buddy gave me a SWOT and competitor map in 60 seconds that took my last co-founder 3 weeks to cobble together in Notion. The 9-dimension structure is exactly what my seed investor asked for.", stars: 5 },
              { name: "James Wilson", role: "Serial Entrepreneur, London", avatar: "JW", color: "var(--blue-600)", quote: "The Verdict dimension alone is worth it. It said 'GO — but validate CAC first.' That single sentence saved me from burning runway on the wrong acquisition channel.", stars: 5 },
              { name: "Arjun Sharma", role: "Product Manager → Founder", avatar: "AS", color: "var(--green-700)", quote: "I ran 3 of my ideas through it and used the Diff page to compare the top 2. The AI recommendation matched what my mentor said — but I got it in 90 seconds, not 3 weeks.", stars: 5 },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="testimonial-card">
                  <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>{[...Array(t.stars)].map((_, j) => <Star key={j} size={13} fill="var(--orange-400)" color="var(--orange-400)" />)}</div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 18 }}>&ldquo;{t.quote}&rdquo;</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ maxWidth: 1000, margin: "0 auto", padding: "72px 24px" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
          <div className="section-pill" style={{ margin: "0 auto 14px" }}>💰 Pricing</div>
          <h2 className="display-md" style={{ color: "var(--text-primary)", marginBottom: 10 }}>
            Simple, <span className="gradient-text">transparent</span> pricing.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>No credit card required to start. Upgrade anytime.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="pricing-grid">
          {PLANS.map((plan, i) => <PricingCard key={i} plan={plan} onCta={scrollToForm} />)}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-secondary)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-pill" style={{ margin: "0 auto 14px" }}>❓ FAQ</div>
            <h2 className="display-md" style={{ color: "var(--text-primary)" }}>
              Common <span className="gradient-text">questions.</span>
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA (sky background) ─────────────────────────────────── */}
      <SkySection>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 56, marginBottom: 16 }} className="float-slow">🚀</div>
            <h2 className="display-md" style={{ color: "var(--text-primary)", marginBottom: 16 }}>
              Ready to validate?
            </h2>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 36, lineHeight: 1.7 }}>
              Join 15,000+ founders who got clarity in 90 seconds. No credit card needed.
            </p>
            <button
              id="closing-cta-btn"
              onClick={scrollToForm}
              className="btn-primary"
              style={{ fontSize: 18, fontWeight: 800, padding: "18px 48px", borderRadius: 16, boxShadow: "0 12px 40px rgba(22,163,74,0.35)", display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              Validate My Startup Idea — Free <ArrowRight size={20} />
            </button>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16 }}>
              ✓ No credit card &nbsp;·&nbsp; ✓ 9 investor dimensions &nbsp;·&nbsp; ✓ 90 seconds
            </div>
          </Reveal>
        </div>
      </SkySection>

      {/* ── Responsive overrides ─────────────────────────────────────────── */}
      <style>{`
        .hero-grid  { grid-template-columns: 1fr 1fr; }
        .stats-grid { grid-template-columns: repeat(4,1fr); }
        .bento-responsive { grid-template-columns: repeat(4,1fr); }
        .testimonials-grid { grid-template-columns: repeat(3,1fr); }
        .pricing-grid { grid-template-columns: repeat(3,1fr); }
        .try-grid { grid-template-columns: 1fr 1fr; }

        @media (max-width: 1024px) {
          .bento-responsive { grid-template-columns: repeat(2,1fr) !important; }
          .bento-responsive .bento-cell[style*="span 2"] { grid-column: auto !important; }
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; padding-top: 48px !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .try-grid { grid-template-columns: 1fr !important; }
          .bento-responsive { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .bento-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
