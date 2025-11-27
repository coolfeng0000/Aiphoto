
import { GoogleGenAI } from "@google/genai";
import { BackgroundConfig } from '../types';

// Initialize the client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Helper to clean base64 string
 */
const cleanBase64 = (data: string) => data.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

/**
 * Uses Gemini to replace the background of an image.
 */
export const changeImageBackground = async (
  originalImageBase64: string,
  backgroundConfig: BackgroundConfig,
  customBackgroundBase64?: string
): Promise<string> => {
  const ai = getAiClient();
  const originalClean = cleanBase64(originalImageBase64);

  try {
    let prompt = "";
    const parts: any[] = [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: originalClean
        }
      }
    ];

    // Strategy 1: Custom Background Upload
    if (backgroundConfig.type === 'custom' && customBackgroundBase64) {
      const customBgClean = cleanBase64(customBackgroundBase64);
      
      // Add the background image as the second part
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: customBgClean
        }
      });

      prompt = `Using the first image as the subject (person) and the second image as the background. 
      Composite the person from the first image onto the background provided in the second image. 
      The person should be centered and properly scaled to look like a professional ID photo. 
      Perform high-quality matting to ensure the hair strands and edges are perfect. 
      Do not distort the person's face.`;
    } 
    // Strategy 2: Transparent / Matting
    else if (backgroundConfig.type === 'transparent') {
      prompt = `Remove the background of this portrait photo completely. 
      Return the image with a pure white background (since transparency might not be fully supported in all viewports, prefer white if unsure, but ideally isolate the subject). 
      Actually, for this task, please replace the background with a pure, clean white background that is easy to remove later, or if possible, a checkerboard pattern indicating transparency. 
      
      (Note: To ensure best results with the current model, we will ask for a Pure White background which acts as a standard fallback for ID photos if transparency fails, or specific instruction):
      
      Extract the person from the background. Place them on a pure, solid white background (#FFFFFF). Ensure edges are extremely sharp and clean for easy background removal.`;
      
      // Note: True RGBA transparency generation is model-dependent. 
      // For reliable "Matting" in this UI, we often default to White or a specific Chroma color if the model doesn't output Alpha.
      // However, let's try to prompt for a "clean cutout look".
    }
    // Strategy 3: Presets (Solid or Template)
    else {
      let bgDescription = backgroundConfig.value;
      if (backgroundConfig.type === 'solid') {
        bgDescription = `a solid ${backgroundConfig.name} color (hex: ${backgroundConfig.value})`;
      }

      prompt = `Replace the background of this portrait photo with ${bgDescription}. 
      Maintain the person's edges perfectly, especially hair details. 
      Do not change the person's face, hair, or clothing. 
      The output must be a high-quality ID photo. 
      Lighting on the person should look natural against the new background.`;
    }

    // Add prompt as the last part
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts
      }
    });

    if (response.candidates && response.candidates.length > 0) {
      const resParts = response.candidates[0].content.parts;
      for (const part of resParts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("未能生成图片，请重试");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "背景替换失败");
  }
};
