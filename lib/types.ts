// ─── Startup Buddy — TypeScript Types ───────────────────────────────────────

export interface FormInput {
  startupIdea: string;
  targetAudience: string;
  geographicMarket: string;
  budget: string;
  timeline: "3 months" | "6 months" | "12 months";
}

// ─── Legacy types (kept for diff page & chat context) ─────────────────────

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MvpBlueprint {
  mustHave: string[];
  niceToHave: string[];
}

export interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  aiLayer: string;
}

export interface Financials {
  devCostEstimate: string;
  monthlyOperationalCost: string;
  marketingAllocation: string;
}

export interface RiskAssessment {
  level: "High" | "Medium" | "Low";
  primaryRisk: string;
  mitigation: string;
}

export interface ValidationReport {
  innovationScore: number;
  swotAnalysis: SwotAnalysis;
  mvpBlueprint: MvpBlueprint;
  techStack: TechStack;
  financials: Financials;
  riskAssessment: RiskAssessment;
}

// ─── 9-Dimension Report ──────────────────────────────────────────────────────

/** Dim 1: Problem */
export interface ProblemDim {
  statement: string;            // Fact-checked, specific 1-2 sentence problem statement
  evidence: string[];           // 2-3 data points / evidence backing the problem
  adjacentProblems: string[];   // 2-3 related problems this also touches
  summaryLine: string;          // One-liner teaser for collapsed view
}

/** Dim 2: Pain Ranking */
export interface PainRankingItem {
  problem: string;
  severityScore: number;        // 0–10
  frequency: string;            // e.g. "Daily", "Weekly"
  urgency: "Critical" | "High" | "Medium" | "Low";
}

export interface PainRankingDim {
  ranked: PainRankingItem[];    // 3–5 items ranked by severity
  topPain: string;              // The #1 pain in 1 sentence
  summaryLine: string;
}

/** Dim 3: Personas */
export interface Persona {
  name: string;                 // Archetype name e.g. "The Overwhelmed Manager"
  ageRange: string;
  jobTitle: string;
  painPoints: string[];         // 2–3 specific pain points
  willingnessToPay: "High" | "Medium" | "Low";
  wtpReason: string;
}

export interface PersonasDim {
  personas: Persona[];          // 2–3 personas
  primaryPersona: string;       // Name of the primary persona
  summaryLine: string;
}

/** Dim 4: Market (SAM) */
export interface MarketDim {
  tam: string; tamLabel: string;
  sam: string; samLabel: string;
  som: string; somLabel: string;
  cagr: string; yearRange: string;
  trends: string[];             // 3 growth trends
  summaryLine: string;
}

/** Dim 5: Competitors */
export interface CompetitorItem {
  name: string;
  pricing: string;
  weakness: string;
  scale: string;
}

export interface CompetitorsDim {
  direct: CompetitorItem[];     // 3–5
  indirect: string[];           // 2–3 workarounds
  competitiveGap: string;       // What the gap is in 1 line
  summaryLine: string;
}

/** Dim 6: Differentiation */
export interface DiffDim {
  uniqueValue: string;          // Core UVP in 1 sentence
  featureMoat: string;
  speedCostMoat: string;
  defensibility: "High" | "Medium" | "Low";
  keyAdvantages: string[];      // 3 bullet advantages
  summaryLine: string;
}

/** Dim 7: Cost Structure */
export interface CostLineItem {
  category: string;             // e.g. "Engineering", "Cloud Infra"
  monthlyCost: string;
  oneTimeCost?: string;
  note: string;
}

export interface CostStructureDim {
  devCostEstimate: string;
  monthlyBurnEstimate: string;
  marketingAllocation: string;
  lineItems: CostLineItem[];    // 4–6 items
  summaryLine: string;
}

/** Dim 8: Breakeven */
export interface BreakevenDim {
  revenueTarget: string;        // Monthly revenue needed to break even
  timeToBreakeven: string;      // e.g. "Month 8–10"
  unitEconomics: string;        // e.g. "CAC $40 / LTV $180"
  keyAssumptions: string[];     // 2–3 assumptions driving this
  summaryLine: string;
}

/** Dim 9: Verdict */
export type VerdictDecision = "GO" | "NO-GO" | "PIVOT";

export interface VerdictDim {
  decision: VerdictDecision;
  compositeScore: number;       // 0–10 overall score
  rationale: string;            // 2–3 sentence explanation
  topStrength: string;
  topRisk: string;
  nextStep: string;             // Most important immediate action
  summaryLine: string;
}

/** Full 9-dimension report */
export interface NineDimReport {
  problem:       ProblemDim;
  painRanking:   PainRankingDim;
  personas:      PersonasDim;
  market:        MarketDim;
  competitors:   CompetitorsDim;
  differentiation: DiffDim;
  costStructure: CostStructureDim;
  breakeven:     BreakevenDim;
  verdict:       VerdictDim;
}

// ─── Section loading state ────────────────────────────────────────────────────

export type SectionStatus = "loading" | "done" | "error";

export interface SectionResult<T> {
  status: SectionStatus;
  data?: T;
  error?: string;
}

/** Legacy section data types (kept for diff page) */
export interface InnovationData {
  innovationScore: number;
  swotAnalysis: SwotAnalysis;
}

export interface MvpData { mvpBlueprint: MvpBlueprint; }
export interface TechData { techStack: TechStack; }
export interface FinancialsData { financials: Financials; riskAssessment: RiskAssessment; }

export interface MarketSizing { tam: string; sam: string; som: string; tamLabel: string; samLabel: string; somLabel: string; }
export interface GrowthDynamics { cagr: string; yearRange: string; trends: string[]; }
export interface Competitor { name: string; pricing: string; weakness: string; scale: string; }
export interface CompetitorIntel { direct: Competitor[]; indirect: string[]; }
export interface ICP { ageRange: string; jobTitle: string; purchasingPower: string; painPoints: string[]; willingnessToPay: "High" | "Medium" | "Low"; wtpReason: string; }
export interface Moat { featureMoat: string; costSpeedMoat: string; }
export interface GTMExperiment { title: string; description: string; budget: string; week: string; }
export interface MarketData { marketSizing: MarketSizing; growthDynamics: GrowthDynamics; competitorIntel: CompetitorIntel; icp: ICP; moat: Moat; gtmExperiments: GTMExperiment[]; }

export interface ReportSections {
  innovation:  SectionResult<InnovationData>;
  mvp:         SectionResult<MvpData>;
  tech:        SectionResult<TechData>;
  financials:  SectionResult<FinancialsData>;
  market:      SectionResult<MarketData>;
}

/** 9-dim loading state */
export interface NineDimSections {
  problem:       SectionResult<ProblemDim>;
  painRanking:   SectionResult<PainRankingDim>;
  personas:      SectionResult<PersonasDim>;
  market:        SectionResult<MarketDim>;
  competitors:   SectionResult<CompetitorsDim>;
  differentiation: SectionResult<DiffDim>;
  costStructure: SectionResult<CostStructureDim>;
  breakeven:     SectionResult<BreakevenDim>;
  verdict:       SectionResult<VerdictDim>;
}

export interface ChatMessage { id: string; role: "user" | "assistant"; content: string; timestamp: Date; }
export type AppState = "form" | "dashboard";
