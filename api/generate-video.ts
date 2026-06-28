import { GoogleGenAI } from "@google/genai";

type VercelRequest = any;
type VercelResponse = any;

const MAX_IMAGE_BASE64_CHARS = 18 * 1024 * 1024;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY nao configurada na Vercel.");
  }
  return new GoogleGenAI({ apiKey });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const { imageBytes, mimeType, prompt } = req.body || {};
    if (!imageBytes || typeof imageBytes !== "string") {
      return res.status(400).json({ error: "missing_image" });
    }
    if (imageBytes.length > MAX_IMAGE_BASE64_CHARS) {
      return res.status(413).json({ error: "image_too_large" });
    }

    const ai = getAI();
    const operation = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-preview",
      prompt: prompt || "A cinematic motion graphic",
      image: {
        imageBytes,
        mimeType: mimeType || "image/png",
      },
      config: {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio: "16:9",
      },
    });

    return res.status(200).json({ operationName: operation.name });
  } catch (error: any) {
    console.error("[video] generate failed:", error);
    return res.status(500).json({
      error: "generate_failed",
      detail: String(error?.message || error),
    });
  }
}
