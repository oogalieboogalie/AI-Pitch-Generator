
import { GoogleGenAI, Type } from "@google/genai";
import { PITCH_QUESTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generatePitch(productDescription: string): Promise<string[]> {
  try {
    const prompt = `You are an expert business pitch writer. A user will provide a description of their business idea. Your task is to answer the following 12 questions based on the user's description. Each answer must be clear, compelling, and strictly limited to two sentences.

    **The 12 Questions:**
    ${PITCH_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join('\n')}

    **User's Business Description:**
    ---
    ${productDescription}
    ---

    Please provide the answers in a JSON array of strings, where each string is the answer to the corresponding question in order.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A succinct, two-sentence answer to one of the 12 pitch questions."
          }
        },
      },
    });

    const responseText = response.text.trim();
    const parsedResponse = JSON.parse(responseText);

    if (Array.isArray(parsedResponse) && parsedResponse.every(item => typeof item === 'string')) {
      return parsedResponse;
    } else {
      throw new Error("AI response was not in the expected format.");
    }

  } catch (error) {
    console.error("Error generating pitch:", error);
    throw new Error("Failed to generate pitch from AI. The model may be unavailable or the request was invalid.");
  }
}
