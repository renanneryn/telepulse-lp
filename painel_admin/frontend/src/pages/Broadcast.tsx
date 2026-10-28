import { useState } from "react";
import { Send, Users, AlertTriangle, CheckCircle2, Square } from "lucide-react";
import { useBroadcastDryRun, type BroadcastBody } from "@/lib/queries";
import { useBroadcastStream } from "@/hooks/useSSE";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { fmtNum } from "@/lib/format";
import { toast } from "@/hooks/useToast";

// M10: hash simples do corpo atual — ENVIAR só habilita depois de um dry-run
// que corresponda EXATAMENTE a este snapshot (audience+text+parseMode).
function bodyKey(audience: string, text: string, parseMode: string): string {
  return JSON.stringify({ audience, text, parseMode });
}

export function Broadcast() {
  const [audience, setAudience] = useState<BroadcastBody["audience"]>("all");
  const [parseMode, setParseMode] = useState<"html" | "markdown">("html");
  const [text, setText] = useState("");
  const [confirmSend, setConfirmSend] = useState(false);
  const [dryRunKey, setDryRunKey] = useState<string | null>(null);

  const dry = useBroadcastDryRun();
  const stream = useBroadcastStream();

  const currentKey = bodyKey(audience, text, parseMode);
  const dryRunStale = dryRunKey !== currentKey;

  async function runDry() {
    try {
      const r = await dry.mutateAsync({ audience, text, parse_mode: parseMode });
      setDryRunKey(bodyKey(audience, text, parseMode));
      toast("ok", `Audience: ${r.target_count} usuários`);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function runSend() {
    setConfirmSend(false);
    await stream.start({ audience, text, parse_mode: parseMode });
  }

  const target = dry.data?.target_count;
  const progress = stream.progress;
  const total = progress?.total ?? 0;
  const done = progress?.done ?? (progress?.event === "done" ? total : 0);
  const pct = total ? ((done / total) * 100).toFixed(1) : "0";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Broadcast</h1>
          <div className="page-sub">// envio em massa · 25 msgs / 1.5s automático</div>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "3fr 2fr", alignItems: "start" }}>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">COMPOSITOR</div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label className="input-label">AUDIENCE</label>
              <select
                className="select"
                value={audience}
                onChange={(e) => setAudience(e.target.value as BroadcastBody["audience"])}
              >
                <option value="all">TODOS · ativos</option>
                <option value="connected">CONECTADOS · com sessão</option>
                <option value="never_connected">NUNCA CONECTARAM</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">PARSE_MODE</label>
              <select
                className="select"
                value={parseMode}
                onChange={(e) => setParseMode(e.target.value as "html" | "markdown")}
              >
                <option value="html">HTML</option>
                <option value="markdown">MARKDOWN</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">MENSAGEM</label>
            <textarea
              className="textarea"
              placeholder={
                parseMode === "html"
                  ? "<b>Olá!</b>\nCurte uma atualização?"
                  : "*Olá!*\nCurte uma atualização?"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="label-caps" style={{ marginTop: 6 }}>
              {text.length} CHARS
            </div>
          </div>

          <div className="row gap-sm">
            <button
              className="btn"
              onClick={runDry}
              disabled={dry.isPending || !text}
            >
              <Users size={12} />
              {dry.isPending ? "..." : "DRY-RUN"}
            </button>
            <button
              className="btn primary"
              onClick={() => setConfirmSend(true)}
              disabled={!text || stream.running || dryRunStale}
              title={dryRunStale ? "Rode um DRY-RUN do texto atual antes de enviar" : undefined}
            >
              <Send size={12} />
              ENVIAR
            </button>
            {stream.running && (
              <button className="btn danger" onClick={() => stream.cancel()}>
                <Square size={12} />
                PARAR
              </button>
            )}
          </div>
          {dryRunStale && !stream.running && (
            <div className="label-caps" style={{ marginTop: 8, color: "var(--text-dimmer)" }}>
              rode um DRY-RUN do texto atual pra habilitar o envio
            </div>
          )}
        </div>

        <div className="flex-col">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">PREVIEW · AUDIENCE</div>
            </div>
            {dry.data ? (
              <div>
                <div className="label-caps">TARGET</div>
                <div className="num" style={{ fontSize: "var(--fz-2xl)", margin: "4px 0 8px" }}>
                  {fmtNum(target ?? 0)}
                </div>
                <div className="label-caps">{dry.data.audience.toUpperCase()}</div>
              </div>
            ) : (
              <div className="label-caps" style={{ color: "var(--text-dimmer)" }}>
                rode um DRY-RUN para ver o alcance
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">PROGRESSO</div>
              {stream.running && (
                <span className="row gap-sm label-caps">
                  <span className="pulse" /> ENVIANDO
                </span>
              )}
            </div>

            {!progress && !stream.running && !stream.error && (
              <div className="label-caps" style={{ color: "var(--text-dimmer)" }}>
                aguardando envio
              </div>
            )}

            {stream.error && (
              <div className="login-error" style={{ marginTop: 0 }}>
                <AlertTriangle size={12} /> {stream.error}
              </div>
            )}

            {progress && (
              <div>
                <div className="progress" style={{ marginBottom: 10 }}>
                  <div className="progress-bar" style={{ width: `${pct}%` }} />
                </div>
                <div
                  className="num"
                  style={{ fontSize: "var(--fz-xs)", color: "var(--text-dim)", marginBottom: 12 }}
                >
                  {fmtNum(done)} / {fmtNum(total)} · {pct}%
                </div>
                <div className="grid-3" style={{ gap: 8 }}>
                  <ProgressCell label="OK" value={progress.sent ?? 0} tone="accent" />
                  <ProgressCell label="BLOCKED" value={progress.blocked ?? 0} tone="dim" />
                  <ProgressCell label="FAILED" value={progress.failed ?? 0} tone="danger" />
                </div>
                {progress.event === "done" && (
                  <div
                    className="row gap-sm"
                    style={{ marginTop: 14, color: "var(--accent)", fontSize: "var(--fz-xs)" }}
                  >
                    <CheckCircle2 size={14} /> ENVIO CONCLUÍDO
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmSend}
        title="Disparar broadcast?"
        body={
          <>
            Vai enviar para{" "}
            <strong>{target ? fmtNum(target) : "—"}</strong> usuários da audience{" "}
            <strong>{audience}</strong>. Não pode ser revertido. Recomendado rodar DRY-RUN antes.
          </>
        }
        confirmLabel="DISPARAR"
        loading={stream.running}
        onConfirm={runSend}
        onCancel={() => setConfirmSend(false)}
      />
    </div>
  );
}

function ProgressCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "accent" | "dim" | "danger";
}) {
  const color =
    tone === "accent" ? "var(--accent)" : tone === "danger" ? "var(--danger)" : "var(--text-dim)";
  return (
    <div>
      <div className="label-caps">{label}</div>
      <div className="num" style={{ fontSize: "var(--fz-lg)", color, marginTop: 2 }}>
        {fmtNum(value)}
      </div>
    </div>
  );
}
