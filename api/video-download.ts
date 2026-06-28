import { GenerateVideosOperation, GoogleGenAI } from "@google/genai";

type VercelRequest = any;
type VercelResponse = any;

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
    const { operationName } = req.body || {};
    if (!operationName || typeof operationName !== "string") {
      return res.status(400).json({ error: "missing_operation" });
    }

    const ai = getAI();
    const operation = new GenerateVideosOperation();
    operation.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: "video_uri_not_found" });
    }

    const videoRes = await fetch(uri, {
      headers: { "x-goog-api-key": process.env.GEMINI_API_KEY || "" },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: "video_fetch_failed" });
    }

    const buffer = Buffer.from(await videoRes.arrayBuffer());
    res.setHeader("Content-Type", videoRes.headers.get("content-type") || "video/mp4");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buffer);
  } catch (error: any) {
    console.error("[video] download failed:", error);
    return res.status(500).json({
      error: "download_failed",
      detail: String(error?.message || error),
    });
  }
}
