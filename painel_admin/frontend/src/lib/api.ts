/**
 * Cliente HTTP central. Sempre envia cookies (credentials: 'include').
 * 401 → emite evento global "tlp:unauthenticated"; o useAuth recupera e
 * redireciona para /login.
 */

/**
 * Toda chamada à API passa pelo prefixo /admin, porque:
 *  - Produção: Vercel rewrite `tlpulse.com/admin/* → discloud/admin/*`. A LP já
 *    usa /api/* nativamente, então o painel **não pode** colidir com isso.
 *  - Dev local: Vite proxy reescreve /admin/api/* → http://localhost:8080/admin/api/*.
 * Override apenas em cenários atípicos via VITE_API_BASE.
 */
// `||` (não `??`) para tratar string vazia como "use default". Isso protege
// contra .env mal preenchido tipo `VITE_API_BASE=` (vazio sem nullish).
const BASE = (import.meta.env.VITE_API_BASE || "/admin").replace(/\/$/, "");

/** Mini App aberto pelo /adm: o initData assinado pelo Telegram autentica cada chamada. */
export function authHeaders(): Record<string, string> {
  const initData = window.Telegram?.WebApp?.initData;
  return initData ? { Authorization: `tma ${initData}` } : {};
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type Init = Omit<RequestInit, "body"> & { body?: unknown; query?: Record<string, unknown> };

function buildUrl(path: string, query?: Record<string, unknown>) {
  const url = new URL(BASE + path, window.location.origin);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function api<T = unknown>(path: string, init: Init = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  for (const [k, v] of Object.entries(authHeaders())) headers.set(k, v);
  let body: BodyInit | undefined;
  if (init.body !== undefined && init.body !== null) {
    if (init.body instanceof FormData) {
      body = init.body;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(init.body);
    }
  }

  const res = await fetch(buildUrl(path, init.query), {
    ...init,
    headers,
    body,
    credentials: "include",
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let parsed: unknown = text;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      // mantém texto cru
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent("tlp:unauthenticated"));
    }
    const detail =
      (parsed && typeof parsed === "object" && "detail" in parsed
        ? String((parsed as { detail: unknown }).detail)
        : null) || `HTTP ${res.status}`;
    throw new ApiError(detail, res.status, parsed);
  }

  return parsed as T;
}

export const apiBase = BASE;
