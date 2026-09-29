"use server";

import { FLASH_MODEL, callGeminiWithRotation, getGeminiStatus } from "@/lib/gemini";
import { ChatMessage, ValidationReport } from "@/lib/types";

export async function sendChatMessage(
  userMessage: string,
  history: ChatMessage[],
  report: ValidationReport,
  formContext: { idea: string; audience: string; market: string; budget: string; timeline: string }
): Promise<{ success: true; reply: string } | { success: false; error: string }> {
  const { configured } = getGeminiStatus();

  if (!configured) {
    const fallbackReply = `Demo mode is active. I can help you think through the startup idea for "${formContext.idea}" with a practical first-pass plan. In a live setup, add a Gemini API key to .env.local to enable real AI responses.`;
    return { success: true, reply: fallbackReply };
  }

  try {
    const systemContext = `You are an AI co-founder for this startup: "${formContext.idea}". Market: ${formContext.market}, Budget: ${formContext.budget}, Timeline: ${formContext.timeline}, Audience: ${formContext.audience}.
Report summary: Innovation=${report.innovationScore}/10, Risk=${report.riskAssessment.level}, Stack=${report.techStack.frontend}/${report.techStack.backend}.
Answer concisely (2-3 short paragraphs). Be specific to the ${formContext.market} market and budget context.`;

    const historyText = history
      .slice(-4)
      .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
      .join("\n");

    const fullPrompt = `${systemContext}\n\nHistory:\n${historyText}\n\nUser: ${userMessage}\nAI:`;

    const reply = (
      await callGeminiWithRotation(fullPrompt, {
        model: FLASH_MODEL,
        temperature: 0.8,
        maxOutputTokens: 512,
      })
    ).trim();

    if (!reply) {
      return { success: false, error: "No response generated. Please try again." };
    }

    return { success: true, reply };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat error:", error);
    return {
      success: false,
      error: `AI error: ${msg}`,
    };
  }
}
