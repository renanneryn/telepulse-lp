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

const SYSTEM_PROMPT = `
Voce e o assistente comercial do TelePulse, uma ferramenta para automatizar Telegram.
Responda em portugues do Brasil, com clareza e objetividade.
Ajude visitantes a entender clone de canais, espelhamento em tempo real, troca de links,
limpeza de textos, botoes de CTA, ofertas rotativas e operacao 24/7.
Conduza para o proximo passo quando fizer sentido: abrir o bot @tele_pulsebot ou falar no WhatsApp.
Nao prometa recursos que nao foram citados e nao peca dados sensiveis.
`.trim();

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
    return {
      status: response.status,
      body: {
        error: "groq_request_failed",
        message: "Nao consegui responder agora. Tente novamente em alguns instantes.",
        detail: payload?.error?.message,
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
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
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
