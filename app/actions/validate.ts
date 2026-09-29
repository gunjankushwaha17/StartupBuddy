"use server";

import { FLASH_MODEL, getGeminiClient, callGeminiWithRotation } from "@/lib/gemini";
import {
  FormInput,
  InnovationData, MvpData, TechData, FinancialsData, MarketData,
  ProblemDim, PainRankingDim, PersonasDim, MarketDim,
  CompetitorsDim, DiffDim, CostStructureDim, BreakevenDim, VerdictDim,
  NineDimReport,
} from "@/lib/types";

// ─── Shared helpers ───────────────────────────────────────────────────────────

type SectionReturn<T> = { success: true; data: T } | { success: false; error: string };

/** One-line context header injected into every prompt. */
const ctx = (i: FormInput) =>
  `Startup: "${i.startupIdea}" | Audience: ${i.targetAudience} | Market: ${i.geographicMarket} | Budget: ${i.budget} | Timeline: ${i.timeline}`;


/** Core Gemini call with key rotation — throws on any error. */
async function callGemini(prompt: string, maxTokens = 450): Promise<string> {
  return callGeminiWithRotation(prompt, {
    model: FLASH_MODEL,
    maxOutputTokens: maxTokens,
    temperature: 0.7,
    // NOTE: Do NOT set responseMimeType: "application/json" — gemini-3.5-flash
    // wraps its response in prose ("Here is the JSON:") when that flag is set,
    // which causes parsing failures. The prompt instructs JSON-only output.
  });
}

/** Parse JSON, with fallback extraction and truncation repair. */
function parseJSON<T>(text: string): T {
  // 1. Direct parse (happy path)
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch { /* try fallbacks */ }

  // 2. Strip markdown code fences if present
  const fenceStripped = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(fenceStripped) as T;
  } catch { /* try fallbacks */ }

  // 3. Extract the largest {...} block
  const m = fenceStripped.match(/\{[\s\S]*\}/);
  const block = m ? m[0] : fenceStripped;
  try {
    return JSON.parse(block) as T;
  } catch { /* try repair */ }

  // 4. Attempt to repair truncated JSON by closing unclosed structures
  const repaired = repairTruncatedJson(block);
  try {
    return JSON.parse(repaired) as T;
  } catch {
    throw new Error("No JSON found in response: " + text.slice(0, 120));
  }
}

/**
 * Closes any unclosed strings, arrays and objects in a truncated JSON string.
 * Handles the common case where the model is cut off mid-value.
 */
function repairTruncatedJson(s: string): string {
  let result = s.trimEnd();
  // Remove trailing comma before we close things up
  result = result.replace(/,\s*$/, "");

  // Count unclosed structures by walking the string
  const stack: string[] = [];
  let inString = false;
  let escape = false;
  for (const ch of result) {
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") stack.pop();
  }

  // If we're mid-string, close it
  if (inString) result += '"';
  // Close all open structures in reverse
  result += stack.reverse().join("");
  return result;
}

/** Standard per-section catch handler. */
function handleSectionError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg === "TIMEOUT") return "Request timed out after 30s — click Retry.";
  if (msg === "NO_KEY") return "No Gemini API keys configured. Add GEMINI_API_KEY_1 to .env.local.";
  if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid"))
    return "Invalid Gemini API key. Check GEMINI_API_KEY_1/_2/_3 in .env.local";
  if (msg.includes("All API keys exhausted") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED"))
    return "All API keys hit their quota limits. Wait a minute and try again.";
  return `Error: ${msg}`;
}

// ─── Fallback data (used when no API key is configured) ───────────────────────

const fallbackInnovation = (i: FormInput): InnovationData => ({
  innovationScore: 7.3,
  swotAnalysis: {
    strengths: [
      `Clear problem statement: ${i.startupIdea.slice(0, 55)}`,
      "Identified target audience",
      "Defined geographic focus",
    ],
    weaknesses: ["Needs market validation", "Needs early customer interviews"],
    opportunities: ["Early-adopter segment in target market", "Low-cost MVP launch possible"],
    threats: ["Established competitors", "Budget / runway constraints"],
  },
});

const fallbackMvp = (): MvpData => ({
  mvpBlueprint: {
    mustHave: ["Landing page", "User signup & auth", "Core value demo", "Basic analytics"],
    niceToHave: ["Admin dashboard", "Email automation", "Mobile app"],
  },
});

const fallbackTech = (): TechData => ({
  techStack: {
    frontend: "Next.js + Tailwind CSS",
    backend: "Node.js + Express",
    database: "PostgreSQL (Supabase)",
    aiLayer: "Gemini 2.0 Flash",
  },
});

const fallbackFinancials = (): FinancialsData => ({
  financials: {
    devCostEstimate: "$8k – $20k",
    monthlyOperationalCost: "$500 – $2k",
    marketingAllocation: "15% – 25%",
  },
  riskAssessment: {
    level: "Medium",
    primaryRisk: "Market validation and early customer acquisition",
    mitigation: "Build a landing page, run 10 customer interviews before coding.",
  },
});

// ─── Section 1: Innovation Score + SWOT ──────────────────────────────────────

export async function fetchInnovationSection(
  input: FormInput
): Promise<SectionReturn<InnovationData>> {
  if (!getGeminiClient()) return { success: true, data: fallbackInnovation(input) };

  const prompt =
    `${ctx(input)}\n\n` +
    `Return ONLY valid JSON. Keep every list item under 8 words. No explanation text.\n` +
    `{"innovationScore":8.5,"swotAnalysis":{"strengths":["s1","s2","s3"],"weaknesses":["w1","w2","w3"],"opportunities":["o1","o2","o3"],"threats":["t1","t2","t3"]}}`;

  try {
    const text = await callGemini(prompt, 2000);
    const parsed = parseJSON<InnovationData>(text);
    if (!parsed.innovationScore || !parsed.swotAnalysis) throw new Error("Incomplete JSON");
    return { success: true, data: parsed };
  } catch (err) {
    console.error("[innovation]", err);
    return { success: false, error: handleSectionError(err) };
  }
}

// ─── Section 2: MVP Blueprint ─────────────────────────────────────────────────

export async function fetchMvpSection(
  input: FormInput
): Promise<SectionReturn<MvpData>> {
  if (!getGeminiClient()) return { success: true, data: fallbackMvp() };

  const prompt =
    `${ctx(input)}\n\n` +
    `Return ONLY valid JSON. Keep each feature name under 6 words. No explanation text.\n` +
    `{"mvpBlueprint":{"mustHave":["f1","f2","f3","f4"],"niceToHave":["n1","n2","n3"]}}`;

  try {
    const text = await callGemini(prompt, 1200);
    const parsed = parseJSON<MvpData>(text);
    if (!parsed.mvpBlueprint) throw new Error("Incomplete JSON");
    return { success: true, data: parsed };
  } catch (err) {
    console.error("[mvp]", err);
    return { success: false, error: handleSectionError(err) };
  }
}

// ─── Section 3: Tech Stack ────────────────────────────────────────────────────

export async function fetchTechSection(
  input: FormInput
): Promise<SectionReturn<TechData>> {
  if (!getGeminiClient()) return { success: true, data: fallbackTech() };

  const prompt =
    `${ctx(input)}\n\n` +
    `Return ONLY valid JSON. Each value is a short tech stack name (e.g. "Next.js + Tailwind"). No explanation.\n` +
    `{"techStack":{"frontend":"","backend":"","database":"","aiLayer":""}}`;

  try {
    const text = await callGemini(prompt, 600);
    const parsed = parseJSON<TechData>(text);
    if (!parsed.techStack) throw new Error("Incomplete JSON");
    return { success: true, data: parsed };
  } catch (err) {
    console.error("[tech]", err);
    return { success: false, error: handleSectionError(err) };
  }
}

// ─── Section 4: Financials + Risk ────────────────────────────────────────────

export async function fetchFinancialsSection(
  input: FormInput
): Promise<SectionReturn<FinancialsData>> {
  if (!getGeminiClient()) return { success: true, data: fallbackFinancials() };

  const prompt =
    `${ctx(input)}\n\n` +
    `Return ONLY valid JSON. Keep each string value short (under 10 words). No explanation text.\n` +
    `{"financials":{"devCostEstimate":"","monthlyOperationalCost":"","marketingAllocation":""},"riskAssessment":{"level":"Medium","primaryRisk":"","mitigation":""}}`;

  try {
    const text = await callGemini(prompt, 800);
    const parsed = parseJSON<FinancialsData>(text);
    if (!parsed.financials || !parsed.riskAssessment) throw new Error("Incomplete JSON");
    return { success: true, data: parsed };
  } catch (err) {
    console.error("[financials]", err);
    return { success: false, error: handleSectionError(err) };
  }
}
// ─── Section 5: Market Research ────────────────────────────────────────────────────────

const fallbackMarket = (i: FormInput): MarketData => ({
  marketSizing: {
    tam: "$50B", tamLabel: "Global addressable market",
    sam: "$8B",  samLabel: `${i.geographicMarket} segment`,
    som: "$200M", somLabel: "Realistic 3-year capture",
  },
  growthDynamics: {
    cagr: "14%", yearRange: "2025–2030",
    trends: ["AI personalisation demand", "Mobile-first consumer behaviour", "Subscription economy growth"],
  },
  competitorIntel: {
    direct: [
      { name: "Competitor A", pricing: "Freemium", weakness: "Poor localisation", scale: "1M users" },
      { name: "Competitor B", pricing: "$15/mo",   weakness: "Complex UI",        scale: "Series A" },
    ],
    indirect: ["Manual spreadsheets", "Generic recipe apps"],
  },
  icp: {
    ageRange: "25–40", jobTitle: "Professional / Manager", purchasingPower: "Medium-High",
    painPoints: ["Lack of time for planning", "Generic solutions don\'t fit their context"],
    willingnessToPay: "Medium", wtpReason: "Will pay if onboarding friction is low",
  },
  moat: {
    featureMoat: "Deep localisation competitors haven\'t built",
    costSpeedMoat: "3× faster setup than nearest alternative",
  },
  gtmExperiments: [
    { title: "Smoke-test landing page", description: "Launch landing page with waitlist CTA + $200 Meta ad", budget: "$200", week: "Week 1–2" },
    { title: "Cold outreach pilot",    description: "Email 50 target users, offer free beta access for feedback", budget: "$0", week: "Week 3–4" },
  ],
});

export async function fetchMarketSection(
  input: FormInput
): Promise<SectionReturn<MarketData>> {
  if (!getGeminiClient()) return { success: true, data: fallbackMarket(input) };

  const schema = JSON.stringify({
    marketSizing: {
      tam: "$XB", tamLabel: "short label",
      sam: "$XB", samLabel: "short label",
      som: "$XM", somLabel: "short label",
    },
    growthDynamics: { cagr: "X%", yearRange: "20XX–20XX", trends: ["t1", "t2", "t3"] },
    competitorIntel: {
      direct: [
        { name: "", pricing: "", weakness: "under 10 words", scale: "" },
      ],
      indirect: ["workaround1", "workaround2"],
    },
    icp: {
      ageRange: "", jobTitle: "", purchasingPower: "",
      painPoints: ["p1", "p2"],
      willingnessToPay: "Medium", wtpReason: "under 12 words",
    },
    moat: { featureMoat: "under 12 words", costSpeedMoat: "under 12 words" },
    gtmExperiments: [
      { title: "", description: "under 15 words", budget: "$X", week: "Week X–Y" },
    ],
  });

  const prompt =
    `${ctx(input)}\n\n` +
    `Return ONLY valid JSON — comprehensive market research for this startup.\n` +
    `Keep string values concise (under 15 words each). No prose outside the JSON.\n` +
    `Include 3–5 direct competitors and 2–3 GTM experiments.\n` +
    schema;

  try {
    const text = await callGemini(prompt, 3000);
    const parsed = parseJSON<MarketData>(text);
    if (!parsed.marketSizing || !parsed.competitorIntel || !parsed.icp)
      throw new Error("Incomplete JSON");
    return { success: true, data: parsed };
  } catch (err) {
    console.error("[market]", err);
    return { success: false, error: handleSectionError(err) };
  }
}

// ─── 9-Dimension Report ────────────────────────────────────────────────────────
// Runs 4 parallel Gemini calls covering all 9 investor-grade dimensions.

type NineDimReturn = { success: true; data: NineDimReport } | { success: false; error: string };

// ── Fallback 9-dim data ───────────────────────────────────────────────────────
function fallbackNineDim(i: FormInput): NineDimReport {
  const idea = i.startupIdea.slice(0, 60);
  return {
    problem: {
      statement: `${idea} addresses a real, underserved gap felt daily by ${i.targetAudience}.`,
      evidence: ["No dominant solution exists at this price/UX point", "Growing search volume for related terms", "High churn in existing tools due to complexity"],
      adjacentProblems: ["Time wasted on manual workarounds", "High cost of existing alternatives", "Lack of mobile-first access"],
      summaryLine: "Clearly articulated, evidence-backed problem with adjacent opportunity.",
    },
    painRanking: {
      ranked: [
        { problem: idea.slice(0, 40), severityScore: 8.2, frequency: "Daily", urgency: "High" },
        { problem: "Manual workaround friction", severityScore: 6.8, frequency: "Weekly", urgency: "Medium" },
        { problem: "Cost of existing solutions", severityScore: 5.5, frequency: "Monthly", urgency: "Medium" },
      ],
      topPain: `${i.targetAudience} face this problem daily and lack a fast, affordable solution.`,
      summaryLine: "Top pain severity: 8.2/10 — daily occurrence, high urgency.",
    },
    personas: {
      personas: [
        { name: "The Ambitious Doer", ageRange: "25–35", jobTitle: i.targetAudience, painPoints: ["Overwhelmed by tools", "No time to research alternatives", "Budget constraints"], willingnessToPay: "Medium", wtpReason: "Will pay if onboarding takes under 5 minutes" },
        { name: "The Delegating Manager", ageRange: "35–50", jobTitle: `Senior ${i.targetAudience}`, painPoints: ["Needs team-level visibility", "Reporting overhead", "Vendor lock-in fear"], willingnessToPay: "High", wtpReason: "Pays for time saved per week" },
      ],
      primaryPersona: "The Ambitious Doer",
      summaryLine: "2 distinct personas — primary is budget-conscious but pain-aware.",
    },
    market: {
      tam: "$24B", tamLabel: "Global total addressable market",
      sam: "$3.2B", samLabel: `${i.geographicMarket} serviceable market`,
      som: "$96M", somLabel: "Realistic 3-year capture",
      cagr: "16.4%", yearRange: "2025–2030",
      trends: ["AI-driven automation demand", "Mobile-first workflow shift", "Subscription economy maturity"],
      summaryLine: "$3.2B SAM, 16.4% CAGR — high growth window still open.",
    },
    competitors: {
      direct: [
        { name: "Competitor A", pricing: "Freemium", weakness: "Poor localisation for target market", scale: "1M+ users" },
        { name: "Competitor B", pricing: "$25/mo", weakness: "Complex onboarding, high churn", scale: "Series A" },
        { name: "Competitor C", pricing: "$49/mo", weakness: "Enterprise focus — overbuilt for SMB", scale: "B2B only" },
      ],
      indirect: ["Excel/Sheets manual tracking", "WhatsApp group coordination"],
      competitiveGap: "No solution combines speed, localisation, and affordability in this segment.",
      summaryLine: "3 direct competitors identified — all miss key UX/price parity.",
    },
    differentiation: {
      uniqueValue: `${idea.slice(0, 50)} built specifically for ${i.targetAudience} with a 5-minute setup vs. hours for alternatives.`,
      featureMoat: "Deep market-specific workflow automation competitors haven't built",
      speedCostMoat: "3× faster time-to-value, 40% lower price point",
      defensibility: "Medium",
      keyAdvantages: ["First-mover in this specific niche", "Network effects once user base reaches 5K", "Proprietary data flywheel from user behaviour"],
      summaryLine: "Medium defensibility — clear UVP, needs network effect to harden moat.",
    },
    costStructure: {
      devCostEstimate: `${i.budget} estimated dev cost`,
      monthlyBurnEstimate: "₹80K–1.4L/mo (lean)",
      marketingAllocation: "20% of monthly budget",
      lineItems: [
        { category: "Engineering (2 FTE)", monthlyCost: "₹60K", note: "Contract / co-founder equity split" },
        { category: "Cloud & Infra", monthlyCost: "₹12K", note: "AWS/GCP free tier then usage-based" },
        { category: "AI API (Gemini)", monthlyCost: "₹8K", note: "Scales with MAU — manageable at <1K users" },
        { category: "Marketing", monthlyCost: "₹20K", note: "Paid social + content" },
        { category: "Tools & SaaS", monthlyCost: "₹6K", note: "Notion, Figma, analytics stack" },
      ],
      summaryLine: "Lean burn of ₹80K–1.4L/mo — viable for 6-month runway on budget.",
    },
    breakeven: {
      revenueTarget: "₹1.1L/month",
      timeToBreakeven: "Month 8–11",
      unitEconomics: "CAC ₹1,800 / LTV ₹9,600 (5.3× ratio)",
      keyAssumptions: ["Avg revenue per user ₹599/mo", "10% MoM user growth after Month 3", "Churn under 7%/mo"],
      summaryLine: "Break-even by Month 8–11 at 184 paying users — achievable.",
    },
    verdict: {
      decision: "GO",
      compositeScore: 7.4,
      rationale: "Strong problem-market fit with an accessible competitive gap. Budget is sufficient for an MVP. Key risk is customer acquisition speed — validate with 50 paying users before scaling.",
      topStrength: "Underserved, well-defined niche with clear willingness to pay",
      topRisk: "Market education cost — target users may not yet search for this solution",
      nextStep: "Launch a $200 paid-traffic smoke test to a landing page within 2 weeks",
      summaryLine: "GO — composite score 7.4/10. Validate demand before scaling.",
    },
  };
}

// ── Call 1: Problem + Pain Ranking ──────────────────────────────────────────
async function fetchProblemPain(i: FormInput): Promise<{ problem: ProblemDim; painRanking: PainRankingDim }> {
  const schema = {
    problem: {
      statement: "2-sentence fact-checked problem statement",
      evidence: ["data point 1", "data point 2", "data point 3"],
      adjacentProblems: ["adjacent 1", "adjacent 2"],
      summaryLine: "1 sentence teaser",
    },
    painRanking: {
      ranked: [
        { problem: "problem name", severityScore: 8.5, frequency: "Daily", urgency: "High" },
        { problem: "problem name", severityScore: 6.0, frequency: "Weekly", urgency: "Medium" },
        { problem: "problem name", severityScore: 4.5, frequency: "Monthly", urgency: "Low" },
      ],
      topPain: "1 sentence",
      summaryLine: "1 sentence teaser",
    },
  };
  const prompt = `${ctx(i)}\n\nReturn ONLY valid JSON (no prose). Analyze the startup above and populate:\n${JSON.stringify(schema)}`;
  const text = await callGemini(prompt, 2000);
  return parseJSON(text);
}

// ── Call 2: Personas + Market ───────────────────────────────────────────────
async function fetchPersonasMarket(i: FormInput): Promise<{ personas: PersonasDim; market: MarketDim }> {
  const schema = {
    personas: {
      personas: [
        { name: "Archetype Name", ageRange: "25-35", jobTitle: "role", painPoints: ["p1","p2"], willingnessToPay: "Medium", wtpReason: "short reason" },
      ],
      primaryPersona: "Name",
      summaryLine: "1 sentence teaser",
    },
    market: {
      tam: "$XB", tamLabel: "short label", sam: "$XB", samLabel: "short label",
      som: "$XM", somLabel: "short label", cagr: "X%", yearRange: "20XX-20XX",
      trends: ["trend 1", "trend 2", "trend 3"],
      summaryLine: "1 sentence teaser",
    },
  };
  const prompt = `${ctx(i)}\n\nReturn ONLY valid JSON (no prose). Analyze the startup above and populate:\n${JSON.stringify(schema)}`;
  const text = await callGemini(prompt, 2500);
  return parseJSON(text);
}

// ── Call 3: Competitors + Differentiation ───────────────────────────────────
async function fetchCompetitorsDiff(i: FormInput): Promise<{ competitors: CompetitorsDim; differentiation: DiffDim }> {
  const schema = {
    competitors: {
      direct: [{ name: "", pricing: "", weakness: "under 10 words", scale: "" }],
      indirect: ["workaround 1", "workaround 2"],
      competitiveGap: "1 sentence",
      summaryLine: "1 sentence teaser",
    },
    differentiation: {
      uniqueValue: "1 sentence UVP",
      featureMoat: "under 12 words",
      speedCostMoat: "under 12 words",
      defensibility: "Medium",
      keyAdvantages: ["adv 1", "adv 2", "adv 3"],
      summaryLine: "1 sentence teaser",
    },
  };
  const prompt = `${ctx(i)}\n\nReturn ONLY valid JSON (no prose). Real competitors only. Populate:\n${JSON.stringify(schema)}`;
  const text = await callGemini(prompt, 2500);
  return parseJSON(text);
}

// ── Call 4: Cost Structure + Breakeven + Verdict ────────────────────────────
async function fetchFinanceVerdict(i: FormInput): Promise<{ costStructure: CostStructureDim; breakeven: BreakevenDim; verdict: VerdictDim }> {
  const schema = {
    costStructure: {
      devCostEstimate: "e.g. $8K–18K",
      monthlyBurnEstimate: "e.g. $1.2K/mo",
      marketingAllocation: "e.g. 20%",
      lineItems: [{ category: "", monthlyCost: "", note: "short" }],
      summaryLine: "1 sentence teaser",
    },
    breakeven: {
      revenueTarget: "e.g. $3K/mo",
      timeToBreakeven: "e.g. Month 8–10",
      unitEconomics: "e.g. CAC $40 / LTV $180",
      keyAssumptions: ["assumption 1", "assumption 2"],
      summaryLine: "1 sentence teaser",
    },
    verdict: {
      decision: "GO",
      compositeScore: 7.5,
      rationale: "2-3 sentence synthesis",
      topStrength: "1 sentence",
      topRisk: "1 sentence",
      nextStep: "Most important immediate action",
      summaryLine: "1 sentence teaser with score",
    },
  };
  const prompt = `${ctx(i)}\n\nReturn ONLY valid JSON (no prose). Give a realistic financial model and a clear go/no-go verdict. decision must be "GO", "NO-GO", or "PIVOT". Populate:\n${JSON.stringify(schema)}`;
  const text = await callGemini(prompt, 3000);
  return parseJSON(text);
}

// ── Main export: fetch all 9 dimensions in parallel ─────────────────────────
export async function fetchNineDimReport(input: FormInput): Promise<NineDimReturn> {
  if (!getGeminiClient()) {
    return { success: true, data: fallbackNineDim(input) };
  }

  try {
    const [call1, call2, call3, call4] = await Promise.all([
      fetchProblemPain(input),
      fetchPersonasMarket(input),
      fetchCompetitorsDiff(input),
      fetchFinanceVerdict(input),
    ]);

    const fb = fallbackNineDim(input);

    const report: NineDimReport = {
      problem:         call1.problem        ?? fb.problem,
      painRanking:     call1.painRanking    ?? fb.painRanking,
      personas:        call2.personas       ?? fb.personas,
      market:          call2.market         ?? fb.market,
      competitors:     call3.competitors    ?? fb.competitors,
      differentiation: call3.differentiation ?? fb.differentiation,
      costStructure:   call4.costStructure  ?? fb.costStructure,
      breakeven:       call4.breakeven      ?? fb.breakeven,
      verdict:         call4.verdict        ?? fb.verdict,
    };

    return { success: true, data: report };
  } catch (err) {
    console.error("[9dim]", err);
    return { success: false, error: handleSectionError(err) };
  }
}
