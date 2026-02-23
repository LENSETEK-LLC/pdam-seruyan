
import { GoogleGenAI } from "@google/genai";

// Ensure we don't crash if the API key is missing
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.error("Failed to initialize Gemini AI:", e);
}

export async function getFinancialInsight(prompt: string) {
  if (!ai) {
    console.warn("Gemini API key is not set. AI insights will be disabled.");
    return "Layanan AI saat ini tidak tersedia (API Key belum diatur).";
  }
  try {
    const response = await ai.models.get({ model: 'gemini-1.5-flash' }).catch(() => null);
    const modelId = response ? 'gemini-1.5-flash' : 'gemini-pro';

    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert financial consultant for a Water Utility (PDAM) in Indonesia. Use professional tone. Always answer in Indonesian. Provide brief, actionable insights based on the provided data scenario."
      }
    });
    return result.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
}
