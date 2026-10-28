import { useRef, useState } from "react";
import {
  Send,
  Users,
  AlertTriangle,
  CheckCircle2,
  Square,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FlaskConical,
  Gift,
  Rocket,
} from "lucide-react";
import {
  useBroadcastDryRun,
  useBroadcastTest,
  type BroadcastAction,
  type BroadcastBody,
  type BroadcastButton,
  type BroadcastColor,
} from "@/lib/queries";
import { useBroadcastStream } from "@/hooks/useSSE";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { fmtNum } from "@/lib/format";
import { toast } from "@/hooks/useToast";
import { FORMAT_TOOLS, renderTelegramPreview, type ParseMode } from "@/lib/tgFormat";

const MAX_BUTTONS = 4;

const COLORS: { id: BroadcastColor; label: string }[] = [
  { id: "default", label: "Padrão" },
  { id: "primary", label: "Azul" },
  { id: "success", label: "Verde" },
  { id: "danger", label: "Vermelho" },
];

const ACTIONS: Record<
  BroadcastAction,
  { label: string; hint: string; text: string; color: BroadcastColor }
> = {
  vip30: {
    label: "RESGATAR VIP 30D",
    hint: "O usuário toca e ganha 30 dias de VIP (1x por broadcast).",
    text: "🎁 Resgatar 30 dias de VIP",
    color: "success",
  },
  start: {
    label: "ABRIR /START",
    hint: "Leva o usuário pro menu principal do bot, como se tivesse mandado /start.",
    text: "🚀 Abrir o bot",
    color: "primary",
  },
};

// ENVIAR só habilita depois de um dry-run que corresponda EXATAMENTE a este snapshot.
function bodyKey(b: BroadcastBody): string {
  return JSON.stringify(b);
}

export function Broadcast() {
  const [audience, setAudience] = useState<BroadcastBody["audience"]>("all");
  const [parseMode, setParseMode] = useState<ParseMode>("html");
  const [text, setText] = useState("");
  const [buttons, setButtons] = useState<BroadcastButton[]>([]);
  const [confirmSend, setConfirmSend] = useState(false);
  const [dryRunKey, setDryRunKey] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const dry = useBroadcastDryRun();
  const test = useBroadcastTest();
  const stream = useBroadcastStream();

  const body: BroadcastBody = {
    audience,
    text,
    parse_mode: parseMode,
    buttons: buttons.map((b) => ({ ...b, text: b.text.trim() })),
  };
  const currentKey = bodyKey(body);
  const dryRunStale = dryRunKey !== currentKey;
  const buttonsInvalid = buttons.some((b) => !b.text.trim());
  const hasVip = buttons.some((b) => b.action === "vip30");

  function patchButton(i: number, patch: Partial<BroadcastButton>) {
    setButtons((bs) => bs.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  }
  function addButton(action: BroadcastAction) {
    const p = ACTIONS[action];
    setButtons((bs) => (bs.length >= MAX_BUTTONS ? bs : [...bs, { text: p.text, action, color: p.color }]));
  }
  function moveButton(i: number, dir: -1 | 1) {
    setButtons((bs) => {
      const j = i + dir;
      if (j < 0 || j >= bs.length) return bs;
      const next = [...bs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function applyFormat(open: string, close: string, sample: string) {
    const ta = textRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const sel = text.slice(s, e) || sample;
    setText(text.slice(0, s) + open + sel + close + text.slice(e));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + open.length, s + open.length + sel.length);
    });
  }

  async function runDry() {
    try {
      const r = await dry.mutateAsync(body);
      setDryRunKey(currentKey);
      toast("ok", `Audience: ${r.target_count} usuários`);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function runTest() {
    try {
      await test.mutateAsync(body);
      toast("ok", "Teste enviado pra você no Telegram");
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function runSend() {
    setConfirmSend(false);
    await stream.start(body);
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

      <div className="grid-2-comp">
        <div className="flex-col">
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
                <label className="input-label">FORMATAÇÃO</label>
                <select
                  className="select"
                  value={parseMode}
                  onChange={(e) => setParseMode(e.target.value as ParseMode)}
                >
                  <option value="html">HTML</option>
                  <option value="markdown">MARKDOWN</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">MENSAGEM</label>
              <div className="fmt-bar">
                {FORMAT_TOOLS[parseMode].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="fmt-btn"
                    title={t.title}
                    onClick={() => applyFormat(t.open, t.close, t.sample)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={textRef}
                className="textarea"
                placeholder={
                  parseMode === "html"
                    ? "<b>Olá!</b>\nCurte uma atualização?"
                    : "**Olá!**\nCurte uma atualização?"
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="label-caps" style={{ marginTop: 6 }}>
                {text.length} / 4096 CHARS
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                BOTÕES · {buttons.length}/{MAX_BUTTONS}
              </div>
            </div>

            {buttons.length === 0 && (
              <div className="label-caps" style={{ color: "var(--text-dimmer)", marginBottom: 12 }}>
                sem botões — a mensagem vai só com o texto
              </div>
            )}

            <div className="flex-col" style={{ gap: 10 }}>
              {buttons.map((b, i) => (
                <div className="btn-editor" key={i}>
                  <div className="btn-editor-head">
                    <span className="label-caps">BOTÃO {i + 1}</span>
                    <span className="row gap-sm">
                      <button
                        type="button"
                        className="icon-btn"
                        title="Subir"
                        disabled={i === 0}
                        onClick={() => moveButton(i, -1)}
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        title="Descer"
                        disabled={i === buttons.length - 1}
                        onClick={() => moveButton(i, 1)}
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        title="Remover"
                        onClick={() => setButtons((bs) => bs.filter((_, j) => j !== i))}
                      >
                        <Trash2 size={13} />
                      </button>
                    </span>
                  </div>

                  <div className="input-group" style={{ marginBottom: 10 }}>
                    <label className="input-label">TEXTO DO BOTÃO</label>
                    <input
                      className="input"
                      maxLength={40}
                      value={b.text}
                      onChange={(e) => patchButton(i, { text: e.target.value })}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 10 }}>
                    <label className="input-label">AÇÃO</label>
                    <div className="seg">
                      {(Object.keys(ACTIONS) as BroadcastAction[]).map((a) => (
                        <button
                          key={a}
                          type="button"
                          className={"seg-item" + (b.action === a ? " on" : "")}
                          onClick={() => patchButton(i, { action: a })}
                        >
                          {a === "vip30" ? <Gift size={12} /> : <Rocket size={12} />}
                          {ACTIONS[a].label}
                        </button>
                      ))}
                    </div>
                    <div className="label-caps" style={{ marginTop: 6, color: "var(--text-dimmer)" }}>
                      {ACTIONS[b.action].hint}
                    </div>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">COR</label>
                    <div className="swatches">
                      {COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className={`swatch ${c.id}` + (b.color === c.id ? " on" : "")}
                          title={c.label}
                          aria-label={c.label}
                          aria-pressed={b.color === c.id}
                          onClick={() => patchButton(i, { color: c.id })}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row gap-sm" style={{ marginTop: buttons.length ? 14 : 0, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn"
                disabled={buttons.length >= MAX_BUTTONS}
                onClick={() => addButton("vip30")}
              >
                <Plus size={12} /> <Gift size={12} /> VIP 30 DIAS
              </button>
              <button
                type="button"
                className="btn"
                disabled={buttons.length >= MAX_BUTTONS}
                onClick={() => addButton("start")}
              >
                <Plus size={12} /> <Rocket size={12} /> IR PRO /START
              </button>
            </div>
            {hasVip && (
              <div className="label-caps" style={{ marginTop: 10, color: "var(--accent-2)" }}>
                // cada usuário resgata 1x por broadcast · quem já tem plano ganha +30 dias
              </div>
            )}
            <div className="label-caps" style={{ marginTop: 8, color: "var(--text-dimmer)" }}>
              // o Telegram só aceita cor azul, verde, vermelha ou padrão
            </div>
          </div>
        </div>

        <div className="flex-col">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">PREVIEW · TELEGRAM</div>
            </div>
            <div className="tg-chat">
              <div className="tg-bubble">
                {text ? (
                  <div
                    className="tg-text"
                    dangerouslySetInnerHTML={{ __html: renderTelegramPreview(text, parseMode) }}
                  />
                ) : (
                  <div className="tg-text" style={{ opacity: 0.45 }}>
                    sua mensagem aparece aqui…
                  </div>
                )}
              </div>
              {buttons.length > 0 && (
                <div className="tg-kb">
                  {buttons.map((b, i) => (
                    <div key={i} className={`tg-key ${b.color}`}>
                      {b.text || "…"}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="row gap-sm" style={{ marginTop: 14, flexWrap: "wrap" }}>
              <button
                className="btn"
                onClick={runTest}
                disabled={test.isPending || !text || buttonsInvalid}
                title="Manda esta mensagem só pra você, no Telegram"
              >
                <FlaskConical size={12} />
                {test.isPending ? "..." : "TESTAR EM MIM"}
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">ENVIO</div>
            </div>
            {dry.data ? (
              <div style={{ marginBottom: 14 }}>
                <div className="label-caps">TARGET · {dry.data.audience.toUpperCase()}</div>
                <div className="num" style={{ fontSize: "var(--fz-2xl)", margin: "4px 0 0" }}>
                  {fmtNum(target ?? 0)}
                </div>
              </div>
            ) : (
              <div className="label-caps" style={{ color: "var(--text-dimmer)", marginBottom: 14 }}>
                rode um DRY-RUN para ver o alcance
              </div>
            )}

            <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
              <button className="btn" onClick={runDry} disabled={dry.isPending || !text || buttonsInvalid}>
                <Users size={12} />
                {dry.isPending ? "..." : "DRY-RUN"}
              </button>
              <button
                className="btn primary"
                onClick={() => setConfirmSend(true)}
                disabled={!text || buttonsInvalid || stream.running || dryRunStale}
                title={dryRunStale ? "Rode um DRY-RUN do conteúdo atual antes de enviar" : undefined}
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
            {buttonsInvalid && (
              <div className="label-caps" style={{ marginTop: 8, color: "var(--danger)" }}>
                todo botão precisa de um texto
              </div>
            )}
            {dryRunStale && !buttonsInvalid && !stream.running && (
              <div className="label-caps" style={{ marginTop: 8, color: "var(--text-dimmer)" }}>
                rode um DRY-RUN do conteúdo atual pra habilitar o envio
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
            Vai enviar para <strong>{target ? fmtNum(target) : "—"}</strong> usuários da audience{" "}
            <strong>{audience}</strong>
            {buttons.length > 0 && (
              <>
                {" "}
                com <strong>{buttons.length}</strong> botão(ões)
                {hasVip && <> — incluindo <strong>resgate de 30 dias de VIP</strong></>}
              </>
            )}
            . Não pode ser revertido. Recomendado testar em você antes.
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
