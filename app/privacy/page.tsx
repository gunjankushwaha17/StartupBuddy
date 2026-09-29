import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Startup Buddy",
  description: "Read the Startup Buddy Privacy Policy.",
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly: (a) Account information — name, email address, and password when you register; (b) Startup idea data — the ideas, descriptions, and parameters you submit for analysis; (c) Usage data — pages visited, features used, and actions taken in the app; (d) Device data — browser type, operating system, IP address, and timezone.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to: (a) Provide, operate, and improve the Service; (b) Generate AI-powered validation reports based on your submitted ideas; (c) Send transactional emails (account confirmation, password resets); (d) Analyze usage patterns to improve the product; (e) Respond to your inquiries and support requests; (f) Comply with legal obligations.`,
  },
  {
    title: "3. Your Startup Ideas — Ownership & Use",
    content: `You retain full ownership of any startup ideas you submit to Startup Buddy. We do not claim intellectual property rights over your ideas. We do not share your specific idea data with third parties. We do not use your idea submissions to train our AI models. Your ideas are processed solely to generate your validation report and are stored securely under your account.`,
  },
  {
    title: "4. Data Sharing",
    content: `We do not sell your personal data. We may share data only with: (a) AI model providers (Google Gemini) to generate your reports — only the minimum data necessary is transmitted; (b) Infrastructure providers (hosting, databases) under strict data processing agreements; (c) Law enforcement or government authorities when required by law; (d) Successors in the event of a merger or acquisition, with prior notice to you.`,
  },
  {
    title: "5. Cookies & Tracking",
    content: `We use cookies and similar technologies to: (a) Maintain your session and authentication state; (b) Remember your preferences (theme, currency); (c) Analyze how users interact with our Service using privacy-respecting analytics. You can control cookie settings through your browser. Disabling cookies may affect certain features of the Service.`,
  },
  {
    title: "6. Data Security",
    content: `We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction. These include encrypted storage, HTTPS transmission, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain your account data for as long as your account is active or as needed to provide the Service. You can request deletion of your account and associated data at any time by contacting us. We will honor deletion requests within 30 days, subject to legal retention obligations.`,
  },
  {
    title: "8. Your Rights",
    content: `Depending on your location, you may have rights including: (a) Access — request a copy of your personal data; (b) Correction — request correction of inaccurate data; (c) Deletion — request deletion of your data; (d) Portability — request a machine-readable export of your data; (e) Objection — object to certain types of processing; (f) Withdrawal of consent — where processing is based on consent. To exercise any right, contact us at privacy@startupbuddy.ai.`,
  },
  {
    title: "9. Children's Privacy",
    content: `The Service is not directed to individuals under the age of 16. We do not knowingly collect personal data from children under 16. If you believe we have collected such data, please contact us immediately and we will delete it.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes by email or by a prominent notice on our website. The "Last Updated" date at the top of this policy reflects the most recent revision. Your continued use of the Service after changes become effective constitutes your acceptance.`,
  },
  {
    title: "11. Contact",
    content: `For privacy-related inquiries, please contact our privacy team at privacy@startupbuddy.ai. For general inquiries, visit our Contact page.`,
  },
];

export default function PrivacyPage() {
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
            🔒 Legal
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>
            Last updated: July 26, 2026 · Effective immediately
          </p>
          <div style={{ marginTop: 20, background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#16a34a", display: "flex", alignItems: "center", gap: 8 }}>
            🛡️ <strong>Your privacy matters.</strong> We never sell your data or use your startup ideas to train AI models.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
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
            Questions about your privacy?{" "}
            <a href="/contact" style={{ color: "var(--accent-primary-strong)", fontWeight: 600 }}>Contact us</a>
            {" "}or read our{" "}
            <a href="/terms" style={{ color: "var(--accent-primary-strong)", fontWeight: 600 }}>Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
