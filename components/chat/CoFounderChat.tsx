"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { sendChatMessage } from "@/app/actions/chat";
import { ChatMessage, ValidationReport } from "@/lib/types";
import { Send, Bot, X, MessageSquare, Sparkles } from "lucide-react";

interface CoFounderChatProps {
  report: ValidationReport;
  formContext: {
    idea: string;
    audience: string;
    market: string;
    budget: string;
    timeline: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "How do I acquire my first 100 users?",
  "What's my go-to-market strategy?",
  "How do I validate this before building?",
  "What are the biggest mistakes to avoid?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f4c542, #e6ad0c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          flexShrink: 0,
        }}
      >
        🤖
      </div>
      <div className="chat-ai-bubble" style={{ display: "flex", alignItems: "center", gap: "4px", padding: "12px 16px" }}>
        <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-yellow)" }} />
        <div className="pulse-dot-2" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-yellow)" }} />
        <div className="pulse-dot-3" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-yellow)" }} />
      </div>
    </div>
  );
}

export default function CoFounderChat({ report, formContext, isOpen, onClose }: CoFounderChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hey! I've fully analyzed your startup idea — **"${formContext.idea.slice(0, 60)}${formContext.idea.length > 60 ? "..." : ""}"**\n\nI have all the context from your validation report. Ask me anything about your business strategy, market approach, or next steps! 🚀`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isPending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    startTransition(async () => {
      const result = await sendChatMessage(text.trim(), messages, report, formContext);
      setIsTyping(false);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: result.success ? result.reply : `❌ ${result.error}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Format message content (basic markdown-like formatting)
  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="animate-fade-in"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 39,
            display: "none",
          }}
        />
      )}

      {/* Chat Panel */}
      <div
        className={isOpen ? "animate-slide-right" : ""}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "380px",
          background: "rgba(255, 251, 233, 0.97)",
          borderLeft: "1px solid var(--border-subtle)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          zIndex: 40,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(244,197,66,0.12)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f4c542, #e6ad0c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 0 16px rgba(244,197,66,0.25)",
            }}
          >
            🤖
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: "600",
                fontSize: "15px",
                color: "var(--text-primary)",
              }}
            >
              AI Co-Founder
            </div>
            <div className="flex items-center gap-1" style={{ fontSize: "12px", color: "#34d399" }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#34d399",
                  boxShadow: "0 0 6px #34d399",
                }}
              />
              Online • Knows your startup report
            </div>
          </div>
          <button
            id="close-chat-btn"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 16px 8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`animate-fade-in flex items-end gap-2 mb-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "assistant" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f4c542, #e6ad0c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    flexShrink: 0,
                  }}
                >
                  🤖
                </div>
              )}
              <div
                className={msg.role === "user" ? "chat-user-bubble" : "chat-ai-bubble"}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div
            style={{
              padding: "0 16px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isPending}
                style={{
                  background: "rgba(244,197,66,0.14)",
                  border: "1px solid rgba(244,197,66,0.28)",
                  borderRadius: "20px",
                  color: "#8a5b00",
                  cursor: "pointer",
                  fontSize: "11px",
                  padding: "5px 12px",
                  transition: "all 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: "8px",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            className="input-field"
            placeholder="Ask your AI Co-Founder anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            style={{ fontSize: "13px", padding: "10px 14px" }}
          />
          <button
            id="chat-send-btn"
            onClick={() => sendMessage(input)}
            disabled={isPending || !input.trim()}
            style={{
              background: input.trim() && !isPending
                ? "linear-gradient(135deg, #f4c542, #e6ad0c)"
                : "rgba(255,255,255,0.06)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              color: input.trim() && !isPending ? "white" : "var(--text-muted)",
              cursor: input.trim() && !isPending ? "pointer" : "not-allowed",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

// Floating chat toggle button (exported separately for use in page)
export function ChatToggleButton({ onClick, hasReport }: { onClick: () => void; hasReport: boolean }) {
  return (
    <button
      id="open-chat-btn"
      onClick={onClick}
      disabled={!hasReport}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: hasReport
          ? "linear-gradient(135deg, #f4c542, #e6ad0c)"
          : "rgba(255,255,255,0.1)",
        border: "none",
        cursor: hasReport ? "pointer" : "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hasReport ? "0 8px 32px rgba(244,197,66,0.24)" : "none",
        zIndex: 38,
        transition: "all 0.3s ease",
        color: "white",
      }}
      title={hasReport ? "Chat with AI Co-Founder" : "Generate a report first"}
    >
      <MessageSquare size={22} />
      {hasReport && (
        <div
          style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "#10b981",
            border: "2px solid var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={6} color="white" />
        </div>
      )}
    </button>
  );
}
