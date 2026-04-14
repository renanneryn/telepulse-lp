import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Telegram session management (simplified for demo)
const sessions: Record<string, TelegramClient> = {};

app.post("/api/telegram/connect", async (req, res) => {
  const { apiId, apiHash, phoneNumber } = req.body;
  
  if (!apiId || !apiHash || !phoneNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const client = new TelegramClient(new StringSession(""), parseInt(apiId), apiHash, {
      connectionRetries: 5,
    });
    res.json({ message: "Connection initiated. Please check your Telegram for the code." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

if (!process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
