import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { RotateCcw } from "lucide-react";
import type { Flow, FlowStep, FlowOption } from "@/lib/queries";

/*
 * Simulador de conversa: renderiza o draft do fluxo como o lead veria no
 * Telegram. Clicar numa opção avança a simulação; o passo de IA mostra o
 * texto de fallback (a IA só roda em produção). Snapshot das bolhas já
 * respondidas fica no transcript — editar um passo antigo não reescreve a
 * história, só o passo atual (reiniciar re-sincroniza tudo).
 */

const CODE_STYLE: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  background: "rgba(255,255,255,0.08)",
  padding: "0 4px",
};

/** Mini-renderer do subset de HTML do Telegram (<b>, <i>, <code>).
 *  Tudo passa como texto React (escapado); só as 3 tags viram elementos. */
function renderTgHtml(text: string): ReactNode {
  const parts = text.split(/(<\/?(?:b|strong|i|em|code)>)/gi);
  type Frame = { tag: string | null; children: ReactNode[] };
  const stack: Frame[] = [{ tag: null, children: [] }];
  let k = 0;

  const wrap = (tag: string, children: ReactNode[]): ReactNode => {
    if (tag === "b" || tag === "strong") return <strong key={k++}>{children}</strong>;
    if (tag === "i" || tag === "em") return <em key={k++}>{children}</em>;
    return <code key={k++} style={CODE_STYLE}>{children}</code>;
  };

  for (const part of parts) {
    if (!part) continue;
    const m = part.match(/^<(\/?)(b|strong|i|em|code)>$/i);
    if (!m) {
      stack[stack.length - 1].children.push(part);
      continue;
    }
    const closing = m[1] === "/";
    const tag = m[2].toLowerCase();
    if (!closing) {
      stack.push({ tag, children: [] });
    } else if (stack.length > 1 && stack[stack.length - 1].tag === tag) {
      const frame = stack.pop()!;
      stack[stack.length - 1].children.push(wrap(tag, frame.children));
    } else {
      // fechamento sem abertura — mostra literal em vez de quebrar
      stack[stack.length - 1].children.push(part);
    }
  }
  // tags abertas sem fechamento: estiliza o que ficou dentro mesmo assim
  while (stack.length > 1) {
    const frame = stack.pop()!;
    stack[stack.length - 1].children.push(wrap(frame.tag!, frame.children));
  }
  return <>{stack[0].children}</>;
}

type Entry = { from: "bot" | "user"; node: ReactNode; key: string };

function resolveFallback(step: FlowStep, answers: Record<string, string>): string {
  const key = step.fallback_step ? (answers[step.fallback_step] ?? "") : "";
  const fallbacks = step.fallbacks ?? {};
  const direct = fallbacks[key];
  if (direct && direct.trim()) return direct;
  for (const v of Object.values(fallbacks)) {
    if (v && v.trim()) return v;
  }
  return "";
}

export function FlowPreview({ flow }: { flow: Flow }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState<Entry[]>([]);
  const [idx, setIdx] = useState(0);
  const [skipped, setSkipped] = useState(false);

  function restart() {
    setAnswers({});
    setTranscript([]);
    setIdx(0);
    setSkipped(false);
  }

  // se o roteiro encolheu abaixo do ponto da simulação, recomeça
  useEffect(() => {
    if (idx > flow.steps.length) restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.steps.length]);

  const current: FlowStep | undefined = skipped ? undefined : flow.steps[idx];

  function answer(step: FlowStep, opt: FlowOption) {
    setTranscript((t) => [
      ...t,
      { from: "bot", node: renderTgHtml(step.text ?? ""), key: `b${t.length}` },
      { from: "user", node: opt.label || opt.value, key: `u${t.length}` },
    ]);
    setAnswers((a) => ({ ...a, [step.id]: opt.value }));
    setIdx((i) => i + 1);
  }

  function skip(step: FlowStep) {
    setTranscript((t) => [
      ...t,
      { from: "bot", node: renderTgHtml(step.text ?? ""), key: `b${t.length}` },
      { from: "user", node: flow.skip_label || "⏭ Pular", key: `u${t.length}` },
      { from: "bot", node: "👍 Combinado, sem problema.", key: `s${t.length}` },
    ]);
    setSkipped(true);
  }

  const ended = skipped || (flow.steps.length > 0 && idx >= flow.steps.length);

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Preview · como o lead vê</div>
        <button className="btn btn-sm icon-only" onClick={restart} title="Reiniciar simulação">
          <RotateCcw size={12} />
        </button>
      </div>

      <div className="tg-preview">
        {flow.steps.length === 0 && (
          <div className="tg-note" style={{ margin: "auto", textAlign: "center" }}>
            — adicione um passo pra ver o preview —
          </div>
        )}

        {transcript.map((e) => (
          <div key={e.key} className={`tg-bubble${e.from === "user" ? " user" : ""}`}>
            {e.node}
          </div>
        ))}

        {current && current.type === "question" && (
          <>
            <div className="tg-bubble">
              {(current.text ?? "").trim()
                ? renderTgHtml(current.text ?? "")
                : <span style={{ opacity: 0.5 }}>…texto da pergunta…</span>}
            </div>
            <div className="tg-btns">
              {(current.options ?? []).map((opt, i) => (
                <button key={i} className="tg-btn" onClick={() => answer(current, opt)}>
                  {opt.label || <span style={{ opacity: 0.5 }}>…opção {i + 1}…</span>}
                </button>
              ))}
              {(current.skip_ends_flow ?? true) && (
                <button className="tg-btn" onClick={() => skip(current)}>
                  {flow.skip_label || "⏭ Pular"}
                </button>
              )}
            </div>
          </>
        )}

        {current && current.type === "ai_message" && (
          <>
            <div className="tg-bubble">
              {resolveFallback(current, answers).trim()
                ? renderTgHtml(resolveFallback(current, answers))
                : <span style={{ opacity: 0.5 }}>…orientação gerada pela IA…</span>}
            </div>
            {(current.buttons ?? []).length > 0 && (
              <div className="tg-btns">
                {(current.buttons ?? []).map((btn, i) => (
                  <button key={i} className="tg-btn" disabled title={`Abre: ${btn.action}`}>
                    {btn.label || <span style={{ opacity: 0.5 }}>…botão {i + 1}…</span>}
                  </button>
                ))}
              </div>
            )}
            <div className="tg-note">
              // em produção a IA escreve um texto personalizado — este é o fallback
            </div>
          </>
        )}

        {ended && flow.steps.length > 0 && (
          <div className="tg-note" style={{ textAlign: "center", marginTop: 6 }}>
            — fim da simulação —
          </div>
        )}
      </div>

      <div className="flow-hint" style={{ marginTop: 8 }}>
        // clique nos botões azuis pra simular a conversa do lead
      </div>
    </div>
  );
}
