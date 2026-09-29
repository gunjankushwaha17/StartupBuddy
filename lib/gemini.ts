// Gemini AI client — with multi-key rotation
import { GoogleGenAI } from "@google/genai";

// ─── Model name ───────────────────────────────────────────────────────────────
// gemini-3.1-flash-lite: confirmed working on free tier (STOP, 686+ chars output).
// gemini-3.5-flash had tight per-response output caps; 2.5-flash/2.5-flash-lite
// are no longer available to new users as of mid-2026.
export const FLASH_MODEL = "gemini-3.1-flash-lite";

// ─── Key pool ─────────────────────────────────────────────────────────────────
// Auth keys (AQ.Ab...) are the NEW standard format as of mid-2026.
// Old AIzaSy keys are being phased out. Both formats are accepted here.

function loadKeyPool(): string[] {
  const candidates = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY,
  ];
  return candidates.filter((k): k is string => Boolean(k && k.trim().length > 10));
}

export function getKeyPool(): string[] {
  return loadKeyPool();
}

// ─── Status ───────────────────────────────────────────────────────────────────

export function getGeminiStatus(): { configured: boolean; message: string } {
  const keys = loadKeyPool();
  return {
    configured: keys.length > 0,
    message:
      keys.length > 0
        ? `Gemini configured with ${keys.length} key(s).`
        : "No Gemini API keys found. Add GEMINI_API_KEY_1 (etc.) to .env.local.",
  };
}

/** Returns true when at least one key is available. */
export function getGeminiClient(): true | null {
  return loadKeyPool().length > 0 ? true : null;
}

// ─── Core call with key rotation ─────────────────────────────────────────────

const QUOTA_CODES = new Set([429, 403]);
const isRetryableError = (e: unknown): boolean => {
  if (e instanceof Error) {
    const msg = e.message;
    if (
      msg.includes("429") ||
      msg.includes("403") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("quota") ||
      msg.includes("rate") ||
      msg.includes("RATE_LIMIT") ||
      // SDK throws this when model returns empty candidates (silent content filter)
      msg.includes("cannot both be empty") ||
      msg.includes("model output error")
    )
      return true;
    const anyErr = e as { status?: number };
    if (anyErr.status && QUOTA_CODES.has(anyErr.status)) return true;
  }
  return false;
};

export interface GeminiCallOptions {
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  responseMimeType?: string;
  timeoutMs?: number;
}

/**
 * Calls the Gemini API, automatically rotating through available keys when a
 * key hits a quota / rate-limit error (429 / 403).  Throws on all other
 * errors or when every key is exhausted.
 */
export async function callGeminiWithRotation(
  prompt: string,
  opts: GeminiCallOptions = {}
): Promise<string> {
  const keys = loadKeyPool();
  if (keys.length === 0) throw new Error("NO_KEY");

  const {
    model = FLASH_MODEL,
    maxOutputTokens = 450,
    temperature = 0.7,
    responseMimeType,
    timeoutMs = 30_000,
  } = opts;

  let lastError: unknown = null;

  for (let i = 0; i < keys.length; i++) {
    const ai = new GoogleGenAI({ apiKey: keys[i] });

    const callPromise = ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature,
        maxOutputTokens,
        ...(responseMimeType ? { responseMimeType } : {}),
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs)
    );

    try {
      const response = await Promise.race([callPromise, timeoutPromise]);
      // Safely access .text — the SDK getter throws if candidates is empty
      let text = "";
      try {
        text = response.text ?? "";
      } catch (textErr) {
        // Empty candidates (silent content filter) — treat as retryable
        if (i < keys.length - 1) {
          console.warn(`[FounderPilot] Key #${i + 1} returned empty output, rotating...`);
          lastError = textErr;
          continue;
        }
        throw textErr;
      }

      const finishReason = response.candidates?.[0]?.finishReason;

      // If the response was cut off very early (tight per-key output cap),
      // try the next key instead.
      if (finishReason === "MAX_TOKENS" && text.length < 200 && i < keys.length - 1) {
        console.warn(
          `[FounderPilot] Key #${i + 1} hit output cap (${text.length} chars), rotating...`
        );
        lastError = new Error(`Output cap hit on key #${i + 1}`);
        continue;
      }

      return text;
    } catch (err) {
      lastError = err;
      if (isRetryableError(err)) {
        console.warn(`[FounderPilot] Key #${i + 1} retryable error, rotating...`);
        continue;
      }
      throw err;
    }
  }

  // All keys exhausted
  throw lastError ?? new Error("All API keys exhausted");
}

export async function generateGeminiText(prompt: string, opts: GeminiCallOptions = {}): Promise<string> {
  return callGeminiWithRotation(prompt, opts);
}
