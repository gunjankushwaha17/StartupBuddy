import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Startup Buddy",
  description: "Read the Startup Buddy Terms of Service.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Startup Buddy ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: "2. Description of Service",
    content: `Startup Buddy provides an AI-powered platform for startup idea validation, including SWOT analysis, MVP blueprinting, tech stack recommendations, financial projections, and market research. The Service is provided "as is" and is intended for informational and planning purposes only. It does not constitute legal, financial, or investment advice.`,
  },
  {
    title: "3. User Accounts",
    content: `You may create an account to access additional features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account and update it to keep it current.`,
  },
  {
    title: "4. Acceptable Use",
    content: `You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to gain unauthorized access to any part of the Service; (c) interfere with or disrupt the integrity or performance of the Service; (d) submit false, misleading, or fraudulent information; (e) collect or harvest any personally identifiable information from the Service; (f) use automated means to access the Service without our express consent.`,
  },
  {
    title: "5. Intellectual Property",
    content: `The Service and its original content, features, and functionality are owned by Startup Buddy and are protected by international copyright, trademark, and other intellectual property laws. AI-generated reports are produced for your personal use. You retain ownership of the startup ideas you submit, and we do not claim any intellectual property rights over them.`,
  },
  {
    title: "6. Privacy & Data",
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. We take your privacy seriously and handle your data in accordance with applicable data protection laws. Please review our Privacy Policy to understand our practices.`,
  },
  {
    title: "7. AI-Generated Content Disclaimer",
    content: `Startup Buddy uses artificial intelligence to generate validation reports and analysis. While we strive for accuracy, AI-generated content may contain errors, inaccuracies, or omissions. The reports are not a substitute for professional due diligence, legal advice, or market research. Always validate AI outputs with real customer discovery and professional consultation before making significant business decisions.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the fullest extent permitted by applicable law, Startup Buddy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.`,
  },
  {
    title: "9. Termination",
    content: `We reserve the right to suspend or terminate your access to the Service at any time, with or without cause or notice, if we believe you have violated these Terms or if we need to do so for any other reason. Upon termination, your right to use the Service will immediately cease.`,
  },
  {
    title: "10. Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will provide notice of material changes by updating the "Last Updated" date. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.`,
  },
  {
    title: "11. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts located in India.`,
  },
  {
    title: "12. Contact Us",
    content: `If you have any questions about these Terms, please contact us at legal@startupbuddy.ai or through our Contact page.`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ minHeight: "80vh", padding: "64px 24px 80px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--accent-primary-bg)", border: "1px solid var(--border-glow)",
            borderRadius: 999, padding: "6px 14px", fontSize: 12, color: "var(--accent-primary-strong)",
            fontWeight: 700, marginBottom: 20,
          }}>
            📋 Legal
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>
            Last updated: July 26, 2026 · Effective immediately
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {SECTIONS.map(({ title, content }) => (
            <div
              key={title}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                borderRadius: 16, padding: "24px 28px",
              }}
            >
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
                {title}
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>{content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Questions?{" "}
            <a href="/contact" style={{ color: "var(--accent-primary-strong)", fontWeight: 600 }}>Contact us</a>
            {" "}or review our{" "}
            <a href="/privacy" style={{ color: "var(--accent-primary-strong)", fontWeight: 600 }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
