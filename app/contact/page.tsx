"use client";

import { useState } from "react";
import { Mail, MapPin, MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";

const FAQS = [
  { q: "How do I get started?", a: "Just head to the homepage, fill in your startup idea details, and get your full validation report in under 60 seconds — no sign-up required for the free tier." },
  { q: "Is my data private?", a: "Yes. We never share your idea data with third parties or use it to train our models. All reports are private to your account." },
  { q: "What if I have a billing issue?", a: "Email us at billing@startupbuddy.ai and we'll resolve it within 1 business day." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const field = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate a short send delay (replace with real API call later)
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Header */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px 48px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--accent-primary-bg)", border: "1px solid var(--border-glow)",
          borderRadius: 999, padding: "6px 14px", fontSize: 12, color: "var(--accent-primary-strong)",
          fontWeight: 700, marginBottom: 24,
        }}>
          📬 Contact
        </div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, letterSpacing: "-0.02em" }}>
          Let&apos;s{" "}
          <span style={{ background: "linear-gradient(135deg, #f4c542 0%, #e6ad0c 55%, #f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            talk
          </span>
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Have a question, a partnership idea, or just want to say hi? We&apos;d love to hear from you.
        </p>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 48, alignItems: "start" }} className="contact-grid">
          {/* Left info panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { icon: <Mail size={18} />, title: "Email Us", value: "hello@startupbuddy.ai", color: "#f4c542" },
              { icon: <MessageSquare size={18} />, title: "Support", value: "support@startupbuddy.ai", color: "#3b82f6" },
              { icon: <MapPin size={18} />, title: "Based In", value: "India · Remote-first", color: "#16a34a" },
            ].map(({ icon, title, value, color }) => (
              <div
                key={title}
                style={{
                  display: "flex", gap: 16, alignItems: "flex-start",
                  background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
                  borderRadius: 16, padding: "20px 22px",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", color,
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{value}</div>
                </div>
              </div>
            ))}

            {/* Mini FAQ */}
            <div style={{ marginTop: 8 }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
                Quick Answers
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FAQS.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <button className="faq-question" style={{ fontSize: 14 }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{faq.q}</span>
                      <span style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", display: "inline-block", transition: "transform 0.3s ease" }}>▾</span>
                    </button>
                    <div className={`faq-answer ${openFaq === i ? "open" : ""}`}>{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card-static" style={{ padding: 36 }}>
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <CheckCircle size={56} color="var(--accent-green)" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                  Message sent!
                </h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24 }}>
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-secondary"
                  style={{ padding: "10px 24px" }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                  Send us a message
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
                  We respond to all messages within 24 hours.
                </p>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="label-text">Your Name</label>
                      <input type="text" className="input-field" placeholder="Alex Johnson" value={form.name} onChange={(e) => field("name", e.target.value)} required />
                    </div>
                    <div>
                      <label className="label-text">Email Address</label>
                      <input type="email" className="input-field" placeholder="alex@example.com" value={form.email} onChange={(e) => field("email", e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Subject</label>
                    <input type="text" className="input-field" placeholder="What&apos;s this about?" value={form.subject} onChange={(e) => field("subject", e.target.value)} required />
                  </div>
                  <div>
                    <label className="label-text">Message</label>
                    <textarea
                      className="input-field"
                      rows={5}
                      placeholder="Tell us what you need..."
                      value={form.message}
                      onChange={(e) => field("message", e.target.value)}
                      required
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  {status === "error" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ef4444" }}>
                      <AlertCircle size={14} /> Something went wrong. Please try again.
                    </div>
                  )}

                  <button type="submit" className="btn-primary" disabled={status === "sending"} style={{ marginTop: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Send size={16} />
                      {status === "sending" ? "Sending…" : "Send Message"}
                    </span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
