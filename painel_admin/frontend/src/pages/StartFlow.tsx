import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FlaskConical,
  Play,
  RotateCcw,
  Save,
  Link2,
  LogIn,
  Info,
} from "lucide-react";
import {
  useStartFlow,
  useSaveStartFlow,
  useTestStartFlow,
  type StartFlowAction,
  type StartFlowButton,
  type StartFlowColor,
  type StartFlowConfig,
} from "@/lib/queries";
import { ErrorBanner } from "@/components/ErrorBanner";
import { toast } from "@/hooks/useToast";
import { renderTelegramPreview } from "@/lib/tgFormat";

const COLORS: { id: StartFlowColor; label: string }[] = [
  { id: "default", label: "Padrão" },
  { id: "primary", label: "Azul" },
  { id: "success", label: "Verde" },
  { id: "danger", label: "Vermelho" },
];

const ACTION_UI: Record<StartFlowAction, { label: string; icon: typeof Info; hint: string }> = {
  connect: { label: "CONECTAR", icon: LogIn, hint: "Abre o passo a passo para conectar a conta do Telegram." },
  info: { label: "SOBRE", icon: Info, hint: "Mostra a tela de como o TelePulse funciona." },
  url: { label: "LINK", icon: Link2, hint: "Abre um link (site, canal, suporte)." },
};

const VARS: { v: string; hint: string }[] = [
  { v: "{nome}", hint: "primeiro nome do usuário" },
  { v: "{dias}", hint: "dias de teste grátis" },
  { v: "{teste}", hint: "a frase de teste grátis (some com o trial desligado)" },
];

const clone = (c: StartFlowConfig): StartFlowConfig => JSON.parse(JSON.stringify(c));

function fillVars(text: string, cfg: StartFlowConfig, trialDays: number | null): string {
  const teste = trialDays ? cfg.trial_text.split("{dias}").join(String(trialDays)) : "";
  return text
    .split("{nome}").join("Fulano")
    .split("{dias}").join(String(trialDays ?? 0))
    .split("{teste}").join(teste)
    .trim();
}

export function StartFlow() {
  const q = useStartFlow();
  const save = useSaveStartFlow();
  const test = useTestStartFlow();
  const [draft, setDraft] = useState<StartFlowConfig | null>(null);

  // rascunho começa igual ao salvo (e volta a ele quando o servidor muda)
  useEffect(() => {
    if (q.data) setDraft(clone(q.data.config));
  }, [q.dataUpdatedAt]);

  const dirty = useMemo(
    () => !!(draft && q.data && JSON.stringify(draft) !== JSON.stringify(q.data.config)),
    [draft, q.data],
  );

  if (q.isLoading || (!draft && !q.isError)) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Fluxo Inicial</h1>
        </div>
        <div className="skeleton" style={{ height: 160 }} />
      </div>
    );
  }
  if (q.isError || !q.data || !draft) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Fluxo Inicial</h1>
        </div>
        <ErrorBanner
          message={`Falha ao carregar o Fluxo Inicial: ${(q.error as Error)?.message || "erro desconhecido"}`}
          onRetry={() => q.refetch()}
        />
      </div>
    );
  }

  const { limits, trial_days: trialDays } = q.data;
  const set = (patch: Partial<StartFlowConfig>) => setDraft({ ...draft, ...patch });

  function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
    const next = [...list];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    return next;
  }
  const patchMsg = (i: number, p: Partial<StartFlowConfig["messages"][number]>) =>
    set({ messages: draft.messages.map((m, j) => (j === i ? { ...m, ...p } : m)) });
  const patchBtn = (i: number, p: Partial<StartFlowButton>) =>
    set({ buttons: draft.buttons.map((b, j) => (j === i ? { ...b, ...p } : b)) });

  async function doSave() {
    try {
      await save.mutateAsync(draft as StartFlowConfig);
      toast("ok", "Fluxo Inicial salvo");
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function doTest() {
    try {
      await test.mutateAsync(draft as StartFlowConfig);
      toast("ok", "Enviando o rascunho para o seu Telegram…");
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fluxo Inicial</h1>
          <div className="page-sub">// apresentação que o usuário novo recebe no 1º /start</div>
        </div>
      </div>

      {/* Liga/desliga */}
      <div
        className="card split-card"
        style={{
          marginBottom: 16, padding: 16, borderRadius: 10,
          border: `1px solid ${draft.enabled ? "var(--accent, #b8ff3d)" : "var(--border)"}`,
        }}
      >
        <div>
          <div style={{ color: "var(--text)", fontWeight: 600 }}>
            {draft.enabled ? "Fluxo Inicial LIGADO" : "Fluxo Inicial DESLIGADO"}
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)", marginTop: 4 }}>
            {draft.enabled
              ? "Usuário novo recebe as mensagens abaixo, com \"digitando…\" antes de cada uma."
              : "Usuário novo vê direto a tela de boas-vindas (Textos → Boas-vindas)."}
          </div>
        </div>
        <label className="switch">
          <input type="checkbox" checked={draft.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
          <span className="track" />
        </label>
      </div>

      <div className="flow-layout">
        <div className="flex-col" style={{ gap: 16, minWidth: 0 }}>
          {/* Mensagens */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                MENSAGENS · {draft.messages.length}/{limits.messages}
              </div>
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)", marginBottom: 12, lineHeight: 1.7 }}>
              {VARS.map((x) => (
                <div key={x.v}>
                  <code>{x.v}</code> {x.hint}
                </div>
              ))}
              Formatação: <code>&lt;b&gt;</code> <code>&lt;i&gt;</code> <code>&lt;u&gt;</code>{" "}
              <code>&lt;s&gt;</code> <code>&lt;code&gt;</code> <code>&lt;a href="…"&gt;</code>
            </div>

            <div className="flex-col" style={{ gap: 10 }}>
              {draft.messages.map((m, i) => (
                <div className="btn-editor" key={i}>
                  <div className="btn-editor-head">
                    <span className="label-caps">
                      MENSAGEM {i + 1}
                      {i === draft.messages.length - 1 ? " · COM OS BOTÕES" : ""}
                    </span>
                    <span className="row gap-sm">
                      <button type="button" className="icon-btn" title="Subir" disabled={i === 0}
                        onClick={() => set({ messages: move(draft.messages, i, -1) })}>
                        <ArrowUp size={13} />
                      </button>
                      <button type="button" className="icon-btn" title="Descer" disabled={i === draft.messages.length - 1}
                        onClick={() => set({ messages: move(draft.messages, i, 1) })}>
                        <ArrowDown size={13} />
                      </button>
                      <button type="button" className="icon-btn danger" title="Remover" disabled={draft.messages.length <= 1}
                        onClick={() => set({ messages: draft.messages.filter((_, j) => j !== i) })}>
                        <Trash2 size={13} />
                      </button>
                    </span>
                  </div>
                  <div className="input-group">
                    <label className="input-label">"Digitando…" antes (segundos, 0 a {limits.typing})</label>
                    <input
                      className="input num"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={limits.typing}
                      step={0.5}
                      style={{ width: 110 }}
                      value={m.typing}
                      onChange={(e) => patchMsg(i, { typing: Number(e.target.value) })}
                    />
                  </div>
                  <textarea
                    className="textarea"
                    value={m.text}
                    maxLength={limits.text}
                    onChange={(e) => patchMsg(i, { text: e.target.value })}
                  />
                  <div className="label-caps" style={{ marginTop: 6 }}>
                    {m.text.length} / {limits.text} CHARS
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-sm"
              style={{ marginTop: 12 }}
              disabled={draft.messages.length >= limits.messages}
              onClick={() => set({ messages: [...draft.messages, { typing: 1.5, text: "" }] })}
            >
              <Plus size={12} /> ADICIONAR MENSAGEM
            </button>
          </div>

          {/* Frase do teste grátis */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">FRASE DO TESTE GRÁTIS</div>
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)", marginBottom: 10, lineHeight: 1.6 }}>
              {trialDays
                ? <>Trial ligado ({trialDays} dias): a frase entra onde houver <code>{"{teste}"}</code>. Use <code>{"{dias}"}</code> para o número de dias.</>
                : <>Trial desligado: <code>{"{teste}"}</code> fica vazio.</>}
            </div>
            <textarea
              className="textarea"
              style={{ minHeight: 70 }}
              value={draft.trial_text}
              maxLength={limits.text}
              onChange={(e) => set({ trial_text: e.target.value })}
            />
          </div>

          {/* Botões da última mensagem */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                BOTÕES DA ÚLTIMA MENSAGEM · {draft.buttons.length}/{limits.buttons}
              </div>
            </div>
            <div className="flex-col" style={{ gap: 10 }}>
              {draft.buttons.map((b, i) => (
                <div className="btn-editor" key={i}>
                  <div className="btn-editor-head">
                    <span className="label-caps">BOTÃO {i + 1}</span>
                    <span className="row gap-sm">
                      <button type="button" className="icon-btn" title="Subir" disabled={i === 0}
                        onClick={() => set({ buttons: move(draft.buttons, i, -1) })}>
                        <ArrowUp size={13} />
                      </button>
                      <button type="button" className="icon-btn" title="Descer" disabled={i === draft.buttons.length - 1}
                        onClick={() => set({ buttons: move(draft.buttons, i, 1) })}>
                        <ArrowDown size={13} />
                      </button>
                      <button type="button" className="icon-btn danger" title="Remover" disabled={draft.buttons.length <= 1}
                        onClick={() => set({ buttons: draft.buttons.filter((_, j) => j !== i) })}>
                        <Trash2 size={13} />
                      </button>
                    </span>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Texto do botão</label>
                    <input
                      className="input"
                      value={b.label}
                      maxLength={limits.label}
                      onChange={(e) => patchBtn(i, { label: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">O que faz</label>
                    <div className="seg" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                      {(Object.keys(ACTION_UI) as StartFlowAction[]).map((a) => {
                        const Icon = ACTION_UI[a].icon;
                        return (
                          <button
                            key={a}
                            type="button"
                            className={"seg-item" + (b.action === a ? " on" : "")}
                            onClick={() => patchBtn(i, { action: a })}
                          >
                            <Icon size={12} /> {ACTION_UI[a].label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="label-caps" style={{ color: "var(--text-dimmer)", marginTop: 6 }}>
                      {ACTION_UI[b.action].hint}
                    </div>
                  </div>
                  {b.action === "url" && (
                    <div className="input-group">
                      <label className="input-label">Link</label>
                      <input
                        className="input"
                        placeholder="https://"
                        value={b.url}
                        onChange={(e) => patchBtn(i, { url: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Cor</label>
                    <div className="swatches">
                      {COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className={`swatch ${c.id}` + (b.color === c.id ? " on" : "")}
                          title={c.label}
                          aria-label={c.label}
                          aria-pressed={b.color === c.id}
                          onClick={() => patchBtn(i, { color: c.id })}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-sm"
              style={{ marginTop: 12 }}
              disabled={draft.buttons.length >= limits.buttons}
              onClick={() =>
                set({ buttons: [...draft.buttons, { label: "", action: "url", url: "", color: "default" }] })
              }
            >
              <Plus size={12} /> ADICIONAR BOTÃO
            </button>
          </div>

          <div className="row gap-sm" style={{ flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={doTest} disabled={test.isPending}>
              <FlaskConical size={14} /> ENVIAR TESTE PARA MIM
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setDraft(clone(q.data!.defaults));
                toast("ok", "Padrão carregado — salve para aplicar");
              }}
            >
              <RotateCcw size={14} /> RESTAURAR PADRÃO
            </button>
          </div>
        </div>

        <div className="flow-preview-col">
          <Preview cfg={draft} trialDays={trialDays} />
        </div>
      </div>

      {dirty && (
        <div className="flow-savebar">
          <span className="label-caps">alterações não salvas</span>
          <span className="spacer" />
          <button type="button" className="btn btn-sm" onClick={() => setDraft(clone(q.data!.config))}>
            DESCARTAR
          </button>
          <button type="button" className="btn btn-sm primary" onClick={doSave} disabled={save.isPending}>
            <Save size={12} /> SALVAR
          </button>
        </div>
      )}
    </div>
  );
}

/** Conversa como o usuário novo vê; "Reproduzir" simula os tempos de digitando. */
function Preview({ cfg, trialDays }: { cfg: StartFlowConfig; trialDays: number | null }) {
  const msgs = cfg.messages
    .map((m) => ({ typing: m.typing, text: fillVars(m.text, cfg, trialDays) }))
    .filter((m) => m.text);
  // shown = quantas mensagens já aparecem; typing = mostrando "digitando…" da próxima
  const [shown, setShown] = useState(msgs.length);
  const [typing, setTyping] = useState(false);
  const timers = useRef<number[]>([]);

  const stop = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setTyping(false);
  };
  useEffect(() => stop, []);
  // editou durante a reprodução: mostra tudo de novo
  useEffect(() => {
    stop();
    setShown(msgs.length);
  }, [JSON.stringify(cfg), trialDays]);

  function play() {
    stop();
    setShown(0);
    let at = 0;
    msgs.forEach((m, i) => {
      timers.current.push(window.setTimeout(() => setTyping(true), at));
      at += Math.max(m.typing, 0.3) * 1000;
      timers.current.push(window.setTimeout(() => { setTyping(false); setShown(i + 1); }, at));
      at += 250;
    });
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">PREVIEW</div>
        <button type="button" className="btn btn-sm" onClick={play}>
          <Play size={12} /> REPRODUZIR
        </button>
      </div>
      <div className="tg-preview">
        <div className="tg-bubble user">/start</div>
        {msgs.slice(0, shown).map((m, i) => (
          <div key={i} className="flex-col" style={{ gap: 4 }}>
            <div className="tg-note">digitando… {m.typing.toLocaleString("pt-BR")}s</div>
            <div className="tg-bubble">
              <div className="tg-text" dangerouslySetInnerHTML={{ __html: renderTelegramPreview(m.text, "html") }} />
            </div>
            {i === msgs.length - 1 && (
              <div className="tg-kb">
                {cfg.buttons.map((b, j) => (
                  <div key={j} className={`tg-key ${b.color}`}>
                    {b.label || "…"}
                    {b.action === "url" ? " ↗" : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && <div className="tg-note">TelePulse está digitando…</div>}
      </div>
      {!cfg.enabled && (
        <div className="tg-note" style={{ marginTop: 8 }}>
          desligado: o usuário novo não recebe isto
        </div>
      )}
    </div>
  );
}
