# 🚀 StartupBuddy

<div align="center">

  <h3>Your AI-Powered Startup Co-Founder & Instant Idea Validation Engine 💡</h3>

  <p>
    Validate startup ideas in 60 seconds. Get an investor-grade, 9-dimension analytical breakdown, market sizing, competitor intelligence, and an interactive AI Co-Founder in your corner.
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)

</div>

---

## 🌐 Live Demo & Deployment

> 🔗 **Live Application URL:**  
> 👉 **[Insert Your Deployed Link Here (e.g., https://startupbuddy.vercel.app)]**  
> *(Update this section with your live deployment URL on Vercel, Netlify, or your custom domain)*

---

## 💡 What is StartupBuddy?

**StartupBuddy** democratizes startup validation for entrepreneurs, indie hackers, and product builders worldwide. 

Turning an idea into a venture usually takes weeks of market research, competitor benchmarking, financial modeling, and pitch-deck drafting. **StartupBuddy** condenses this entire process into a **60-second AI-driven workflow**:

1. **Input Your Concept**: Provide your idea, target audience, budget, launch timeline, and target market.
2. **Instant 9-Dimension Due Diligence**: Receive an actionable, comprehensive feasibility study across 9 critical venture dimensions.
3. **Chat With Your AI Co-Founder**: Engage in real-time, context-aware Q&A pre-loaded with your full report data.
4. **Compare & Iterate**: Run side-by-side idea comparisons with the built-in **Idea Diff** engine and export one-page investor summaries.

---

## ✨ Key Features

### ⚡ 1. 60-Second Idea Launchpad
- Clean, intuitive onboarding flow tailored to founder thinking.
- Captures core venture constraints: problem hypothesis, target audience, budget tiers, and time-to-market goals.

### 📊 2. The 9-Dimension Deep-Dive Analysis
StartupBuddy scores and diagnoses your venture across nine structured dimensions:
- 🎯 **Problem & Market Need**: Validation of pain point severity, alternative workarounds, and urgency.
- 👥 **Target Personas & ICP**: Detailed buyer profiles, decision drivers, and demographics.
- 📈 **Market Sizing & Opportunity**: TAM, SAM, and SOM estimation with industry growth trajectory.
- 🥊 **Competitor Matrix & Moat**: Direct/indirect competitor landscape, pricing benchmarks, and defensibility strategy.
- ⚡ **Pain Ranking**: Ranking user friction points to prioritize MVP feature roadmap.
- 💰 **Cost Breakdown**: Estimated infrastructure, engineering, marketing, and operational expenses.
- ⚖️ **Breakeven & Unit Economics**: Projected customer acquisition cost (CAC), lifetime value (LTV), and breakeven horizons.
- 🚀 **MVP Blueprint & Go-To-Market**: Week-by-week agile roadmap and launch sequence.
- 🏆 **Final AI Verdict**: Go / Pivot / No-Go synthesis with high-impact recommendations.

### 🤖 3. Interactive AI Co-Founder Chat
- Embedded conversational co-founder that maintains full memory of your validation report.
- Ask for pitch deck copy, alternative revenue models, marketing campaign hooks, or tech architecture tradeoffs.

### ⚖️ 4. Idea Diff (Side-by-Side Comparison)
- Compare two startup ideas or strategic pivots side-by-side.
- Highlights trade-offs in capital efficiency, technical complexity, risk factors, and market size.

### 📄 5. Investor One-Page Summary & PDF Export
- Generate clean, investor-ready executive summaries with a single click.
- Shareable links and downloadable PDF formats ready for mentors, angels, or co-founders.

### 🌍 6. Global Multi-Currency Engine
- Real-time currency conversions (USD, INR, EUR, GBP, and more).
- Tailored budgeting calculations aligned to local purchasing power and regional founder markets.

### 🌓 7. Premium Dark & Light UI
- Designed with modern aesthetics, glassmorphism accents, smooth micro-animations, and fluid transitions.

### 🛡️ 8. High-Availability Gemini API Rotation
- Robust multi-key rotation engine (`lib/gemini.ts`) that automatically manages rate limits, output caps, and retries seamlessly without breaking user experience.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), CSS Custom Properties, [Lucide React Icons](https://lucide.dev/) |
| **AI Inference** | Google Gemini API via official [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK |
| **Schema Validation** | [Zod](https://zod.dev/) |
| **State & Context** | React Context (AuthContext, CurrencyContext, ThemeContext) |
| **Deployment** | [Vercel](https://vercel.com/) / Node.js / Docker ready |

---

## 📁 Repository Structure

```text
StartupBuddy/
├── app/
│   ├── about/          # About page & mission statement
│   ├── actions/        # Server actions for Gemini validation & chat
│   │   ├── chat.ts     # AI Co-Founder streaming & chat context
│   │   └── validate.ts # 9-Dimension validation pipeline
│   ├── contact/        # Founder contact & feedback form
│   ├── diff/           # Idea Diff side-by-side comparison engine
│   ├── privacy/        # Privacy policy
│   ├── summary/        # Shareable one-page summary view
│   ├── terms/          # Terms of service
│   ├── globals.css     # Design system tokens & utility classes
│   ├── layout.tsx      # Root layout with providers & metadata
│   └── page.tsx        # Homepage, hero section, and interactive launchpad
├── components/
│   ├── chat/           # CoFounderChat modal and toggle widgets
│   ├── dashboard/      # Financials, tech stack, MVP blueprint & market cards
│   ├── report/         # 9-Dimension interactive cards and breakdown modules
│   └── ui/             # Navbar, Footer, ThemeToggle, CurrencySelector, Modals
├── lib/
│   ├── context/        # Theme, Currency, and Auth state providers
│   ├── hooks/          # Custom hooks (useCountUp, useScrollReveal)
│   ├── gemini.ts       # Multi-key rotation & error handling AI engine
│   └── types.ts        # Comprehensive TypeScript interfaces & domain types
├── public/             # Static SVGs, logos, and favicons
├── package.json        # Project metadata & dependencies
└── tsconfig.json       # TypeScript configuration
```

---

## 🚀 Getting Started

Follow these steps to run **StartupBuddy** locally on your machine:

### 1. Prerequisites
- **Node.js** (v18.17+ or v20+ recommended)
- **npm**, **pnpm**, or **yarn**
- **Google Gemini API Key** (Get one free from [Google AI Studio](https://aistudio.google.com/))

### 2. Clone the Repository
```bash
git clone https://github.com/gunjankushwaha17/StartupBuddy.git
cd StartupBuddy
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Primary Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# (Optional) Multiple keys for automatic rotation & high throughput
# Comma-separated list of keys:
# GEMINI_API_KEYS=key1,key2,key3
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience **StartupBuddy**!

---


## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ for founders turning bold ideas into reality.</b>
</div>
