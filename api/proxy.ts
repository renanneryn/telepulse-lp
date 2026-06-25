// Proxy server-side para a API do painel admin (FastAPI no Discloud).
//
// Por que existe: o rewrite EXTERNO da Vercel para telepulse.discloud.app falha
// com 502 DNS_HOSTNAME_EMPTY — o edge da Vercel não resolve o destino que está
// atrás do Cloudflare. Aqui o Node faz o fetch (resolver normal), contornando o
// problema. Como tudo é servido por tlpulse.com, o cookie JWT vira first-party.
//
// Roteado via vercel.json: /admin/api/:path*  ->  /api/proxy
//
// Tipos mínimos inline (não dependemos de @vercel/node instalado — em runtime a
// Vercel injeta os objetos req/res estilo Node IncomingMessage/ServerResponse).
type VercelRequest = any;
type VercelResponse = any;

const UPSTREAM = "https://telepulse.discloud.app";
const HOP_BY_HOP = new Set([
  "host", "connection", "content-length", "transfer-encoding",
  "keep-alive", "upgrade", "proxy-authenticate", "proxy-authorization", "te", "trailer",
]);

export const config = {
  // precisamos do body cru (sem parse) pra repassar POST/PATCH fielmente
  api: { bodyParser: false },
};

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // req.url já vem como /admin/api/... (o rewrite preserva o path original)
    const path = req.url || "/admin/api";
    const target = UPSTREAM + path;

    // monta headers de saída
    const outHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (v === undefined) continue;
      if (HOP_BY_HOP.has(k.toLowerCase())) continue;
      outHeaders[k] = Array.isArray(v) ? v.join(", ") : String(v);
    }
    // garante que o upstream receba o Host dele (Cloudflare exige)
    outHeaders["host"] = "telepulse.discloud.app";

    const method = (req.method || "GET").toUpperCase();
    let body: Buffer | undefined;
    if (method !== "GET" && method !== "HEAD") {
      body = await readRawBody(req);
      if (body && body.length) outHeaders["content-length"] = String(body.length);
    }

    const upstream = await fetch(target, {
      method,
      headers: outHeaders,
      body: body && body.length ? body : undefined,
      redirect: "manual",
    });

    // ── repassa Set-Cookie reescrevendo o Domain ──
    // o navegador descarta cookie com Domain que não casa com tlpulse.com,
    // então removemos o atributo Domain (vira host-only, o que queremos).
    const setCookies =
      typeof (upstream.headers as any).getSetCookie === "function"
        ? (upstream.headers as any).getSetCookie()
        : [];
    if (setCookies && setCookies.length) {
      const fixed = setCookies.map((c: string) =>
        c.replace(/;\s*Domain=[^;]+/gi, "")
      );
      res.setHeader("set-cookie", fixed);
    }

    // demais headers (exceto set-cookie já tratado e hop-by-hop)
    upstream.headers.forEach((value, key) => {
      const lk = key.toLowerCase();
      if (lk === "set-cookie") return;
      if (HOP_BY_HOP.has(lk)) return;
      if (lk === "content-encoding") return; // fetch já decodifica o corpo
      res.setHeader(key, value);
    });

    res.status(upstream.status);
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (err: any) {
    res.status(502).json({
      error: "proxy_upstream_error",
      detail: String(err?.message || err),
    });
  }
}
