
import { GoogleGenAI } from "@google/genai";

// Ensure we don't crash if the API key is missing
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getFinancialInsight(prompt: string) {
  if (!ai) {
    console.warn("Gemini API key is not set. AI insights will be disabled.");
    return "Layanan AI saat ini tidak tersedia (API Key belum diatur).";
  }
  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
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
