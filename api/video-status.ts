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

    return res.status(200).json({ done: Boolean(updated.done) });
  } catch (error: any) {
    console.error("[video] status failed:", error);
    return res.status(500).json({
      error: "status_failed",
      detail: String(error?.message || error),
    });
  }
}
