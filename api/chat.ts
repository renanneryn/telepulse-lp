type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type VercelRequest = any;
type VercelResponse = any;

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const MAX_MESSAGES = 12;
const MAX_CONTENT_LENGTH = 1200;
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_MAX = Number(process.env.CHAT_RATE_LIMIT_PER_MIN) || 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_ALLOWED_ORIGINS = ["https://tlpulse.com", "https://www.tlpulse.com"];
const DEV_ORIGINS = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"];

const SYSTEM_PROMPT = `
Voce e o assistente comercial do TelePulse, uma ferramenta para automatizar Telegram.
Responda em portugues do Brasil, com clareza e objetividade.
Ajude visitantes a entender clone de canais, espelhamento em tempo real, troca de links,
limpeza de textos, botoes de CTA, ofertas rotativas e operacao 24/7.
Conduza para o proximo passo quando fizer sentido: abrir o bot @tele_pulsebot ou falar no WhatsApp.
Nao prometa recursos que nao foram citados e nao peca dados sensiveis.
`.trim();

function getAllowedOrigins(): Set<string> {
  const extra = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  const isDev = !process.env.VERCEL && process.env.NODE_ENV !== "production";
  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...extra, ...(isDev ? DEV_ORIGINS : [])]);
}

function requestOrigin(headers: Record<string, any>): string | null {
  const origin = headers?.origin;
  if (typeof origin === "string" && origin) return origin.replace(/\/+$/, "");
  const referer = headers?.referer;
  if (typeof referer === "string" && referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }
  return null;
}

export function isOriginAllowed(headers: Record<string, any>): boolean {
  const origin = requestOrigin(headers);
  return !!origin && getAllowedOrigins().has(origin);
}

export function clientIp(headers: Record<string, any>, fallback?: string): string {
  const forwarded = headers?.["x-forwarded-for"];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.toString().split(",")[0]?.trim();
  return first || headers?.["x-real-ip"]?.toString() || fallback || "unknown";
}

// Best effort: o Map vive na memoria de cada instancia serverless, entao nao e um
// limite global. Para limite real use Vercel Firewall (rate limiting) ou Upstash.
const hits = new Map<string, number[]>();

export function isRateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export function resetRateLimit() {
  hits.clear();
}

/** Valida metodo, origem, tamanho e limite por IP. Retorna null se a requisicao pode seguir. */
export function guardChatRequest(req: {
  method?: string;
  headers: Record<string, any>;
  body?: unknown;
  ip?: string;
}): { status: number; body: Record<string, string>; headers?: Record<string, string> } | null {
  if (req.method !== "POST") {
    return { status: 405, body: { error: "method_not_allowed" }, headers: { allow: "POST" } };
  }
  if (!isOriginAllowed(req.headers)) {
    return { status: 403, body: { error: "forbidden_origin" } };
  }
  const declared = Number(req.headers?.["content-length"]);
  let size = Number.isFinite(declared) ? declared : 0;
  if (!size && req.body !== undefined) {
    try {
      size = Buffer.byteLength(JSON.stringify(req.body));
    } catch {
      size = MAX_BODY_BYTES + 1;
    }
  }
  if (size > MAX_BODY_BYTES) {
    return { status: 413, body: { error: "payload_too_large" } };
  }
  const messages = (req.body as any)?.messages;
  if (Array.isArray(messages) && messages.length > MAX_MESSAGES * 4) {
    return { status: 400, body: { error: "too_many_messages" } };
  }
  if (isRateLimited(clientIp(req.headers, req.ip))) {
    return {
      status: 429,
      body: { error: "rate_limited", message: "Muitas mensagens em pouco tempo. Aguarde um minuto." },
      headers: { "retry-after": "60" },
    };
  }
  return null;
}

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") return false;
      const candidate = message as Record<string, unknown>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_CONTENT_LENGTH),
    }));
}

export async function createChatReply(messagesInput: unknown) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      status: 503,
      body: {
        error: "missing_groq_api_key",
        message: "Chat IA indisponivel: configure GROQ_API_KEY no ambiente.",
      },
    };
  }

  const messages = normalizeMessages(messagesInput);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return {
      status: 400,
      body: {
        error: "invalid_messages",
        message: "Envie ao menos uma mensagem do usuario.",
      },
    };
  }

  const response = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.45,
      max_tokens: 420,
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    console.error("[chat] groq status:", response.status);
    return {
      status: response.status === 429 ? 429 : 502,
      body: {
        error: "groq_request_failed",
        message: "Nao consegui responder agora. Tente novamente em alguns instantes.",
      },
    };
  }

  const reply = payload?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return {
      status: 502,
      body: {
        error: "empty_groq_response",
        message: "A IA retornou uma resposta vazia.",
      },
    };
  }

  return {
    status: 200,
    body: { reply },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const blocked = guardChatRequest({ method: req.method, headers: req.headers || {}, body: req.body, ip: req.socket?.remoteAddress });
  if (blocked) {
    for (const [key, value] of Object.entries(blocked.headers || {})) res.setHeader(key, value);
    return res.status(blocked.status).json(blocked.body);
  }

  try {
    const result = await createChatReply(req.body?.messages);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error("[chat] failed:", error?.message || error);
    return res.status(500).json({
      error: "chat_internal_error",
      message: "Chat IA indisponivel no momento.",
    });
  }
}
