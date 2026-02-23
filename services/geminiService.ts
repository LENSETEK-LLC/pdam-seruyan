import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure we don't crash if the API key is missing
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function getFinancialInsight(prompt: string) {
  if (!genAI) {
    console.warn("Gemini API key is not set. AI insights will be disabled.");
    return "Layanan AI saat ini tidak tersedia (API Key belum diatur).";
  }
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an expert financial consultant for a Water Utility (PDAM) in Indonesia. Use professional tone. Always answer in Indonesian. Provide brief, actionable insights based on the provided data scenario."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
}
