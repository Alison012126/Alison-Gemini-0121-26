import { GoogleGenAI } from "@google/genai";

export const generateContent = async (
  apiKey: string,
  model: string,
  prompt: string,
  systemInstruction?: string,
  inlineData?: { mimeType: string; data: string }
): Promise<string> => {
  if (!apiKey) {
    throw new Error("Please provide a valid API Key in the sidebar.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const parts: any[] = [];
    
    if (inlineData) {
      parts.push({
        inlineData: {
          mimeType: inlineData.mimeType,
          data: inlineData.data
        }
      });
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      },
    });

    return response.text || "No response text generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`Error calling Gemini API: ${error.message}`);
  }
};

export const repairAgentYaml = async (apiKey: string, rawContent: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key required for repair");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
  I have a file content that represents AI agents, but the format might be wrong, non-standard, or just a list of descriptions.
  Please transform the following content into a VALID YAML string that matches this specific schema Array<Agent>:
  
  interface Agent {
    id: string; // unique lowercase id with underscores
    name_en: string;
    name_tc: string; // Traditional Chinese Name
    category_tc: string;
    description_tc: string;
    model: string; // e.g. gemini-3-flash-preview
    default_temperature: number;
  }

  Return ONLY the YAML string inside a code block. Do not wrap in json, just pure yaml.

  CONTENT TO TRANSFORM:
  ${rawContent.substring(0, 30000)}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] }
    });
    
    let text = response.text || "";
    // Strip code blocks if present
    text = text.replace(/```yaml/g, '').replace(/```/g, '').trim();
    return text;
  } catch (e) {
    throw new Error("Failed to repair YAML with AI");
  }
};
