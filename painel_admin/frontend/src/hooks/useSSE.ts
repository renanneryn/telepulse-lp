import { useCallback, useRef, useState } from "react";
import { apiBase, authHeaders } from "@/lib/api";
import type { BroadcastBody } from "@/lib/queries";

export interface BroadcastProgress {
  event: "start" | "progress" | "wait" | "done";
  /** event=wait: o Telegram pediu pausa (FloodWait) de N segundos */
  seconds?: number;
  total: number;
  done?: number;
  sent?: number;
  blocked?: number;
  failed?: number;
}

/**
 * Hook para o /api/broadcast/send. Como SSE não permite POST com body
 * de forma nativa (EventSource é só GET), usamos fetch + ReadableStream
 * pra consumir `text/event-stream` direto.
 */
export function useBroadcastStream() {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<BroadcastProgress | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (body: BroadcastBody) => {
      setProgress(null);
      setError(null);
      setRunning(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await fetch(`${apiBase}/api/broadcast/send`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify(body),
          signal: ctrl.signal,
        });

        if (!res.ok || !res.body) {
          let detail = `HTTP ${res.status}`;
          try {
            const j = await res.json();
            if (j?.detail) detail = String(j.detail);
          } catch {
            /* ignore */
          }
          throw new Error(detail);
        }

        let gotDone = false;
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          // SSE separa eventos por linha em branco "\n\n"
          const events = buf.split("\n\n");
          buf = events.pop() || "";

          for (const evt of events) {
            const lines = evt.split("\n").filter((l) => l.startsWith("data: "));
            for (const line of lines) {
              const payload = line.slice(6);
              try {
                const parsed = JSON.parse(payload) as BroadcastProgress;
                setProgress(parsed);
                if (parsed.event === "done") {
                  gotDone = true;
                  setRunning(false);
                }
              } catch {
                /* keepalive ou comentário; ignora */
              }
            }
          }
        }
        // Conexão fechou sem o evento "done" (rede/proxy caiu): o envio no
        // servidor parou junto. Avisa em vez de parecer concluído — e sem
        // isso o admin tendia a reenviar para quem já recebeu.
        if (!gotDone) {
          throw new Error(
            "A conexão caiu antes do fim — o envio parou. Confira o progresso acima antes de reenviar (quem já recebeu receberia de novo).",
          );
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError((e as Error).message);
        }
      } finally {
        setRunning(false);
        abortRef.current = null;
      }
    },
    [],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { start, cancel, running, error, progress };
}
