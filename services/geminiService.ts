import { GoogleGenAI } from "@google/genai";

// Fix: Aligned with Gemini API guidelines. The GoogleGenAI client is now initialized directly
// with `process.env.API_KEY`, which is assumed to be available.
// Removed placeholder API key and mock response logic.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function getScheduleRecommendation(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.5,
                topP: 0.95,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get recommendation from AI service.");
    }
}
