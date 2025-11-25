import { GoogleGenAI, Type } from "@google/genai";
import { CropAnalysis, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to guide the model to be an agricultural expert
const SYSTEM_INSTRUCTION = `
You are HariyaliGuide, an expert agricultural assistant for farmers in Pakistan and India. 
Your goal is to diagnose crop diseases from images or descriptions and suggest specific pesticides and care instructions.
If the input is an image, analyze it for diseases.
If the input is voice/text, answer the query related to farming.
Always be polite, encouraging, and clear.
Return the response in JSON format matching the schema provided.
`;

export const analyzeCropWithGemini = async (
  text: string,
  language: Language,
  imageBase64?: string,
  audioBase64?: string
): Promise<CropAnalysis> => {

  const modelId = "gemini-2.5-flash"; // Using Flash for speed and multimodal capabilities

  try {
    const parts: any[] = [];

    // Add Text Prompt
    let prompt = text;
    if (!text && imageBase64) prompt = "Analyze this image for crop diseases.";
    if (!text && audioBase64) prompt = "Listen to this audio and answer the farming question.";
    
    parts.push({ text: prompt });

    // Add Image if present
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      });
    }

    // Add Audio if present
    if (audioBase64) {
      parts.push({
        inlineData: {
          mimeType: "audio/wav", // Assuming WAV from MediaRecorder, adjust if needed
          data: audioBase64,
        },
      });
    }

    // Define the schema for structured output
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + ` Respond in ${language === Language.URDU ? 'Urdu' : 'English'}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: { type: Type.STRING, description: "Name of the disease or 'Healthy' or 'Unknown'" },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            pesticides: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "List of recommended pesticides" 
            },
            instructions: { type: Type.STRING, description: "Step-by-step care instructions" },
            severity: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Severity level" }
          },
          required: ["diseaseName", "pesticides", "instructions", "severity"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CropAnalysis;
    } else {
      throw new Error("No response from AI");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback error response
    return {
      diseaseName: "Error / خطا",
      confidence: 0,
      pesticides: [],
      instructions: "Could not analyze. Please try again. / تجزیہ نہیں ہو سکا۔ براہ کرم دوبارہ کوشش کریں۔",
      severity: "Low"
    };
  }
};
