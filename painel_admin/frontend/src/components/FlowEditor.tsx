import { useEffect, useState } from "react";
import {
  Save, Trash2, Plus, ArrowUp, ArrowDown, MessageSquareText, Sparkles,
} from "lucide-react";
import {
  useFlow, useSaveFlow, useDeleteFlow, useFlowsMeta,
  type Flow, type FlowStep, type FlowOption, type FlowButton,
} from "@/lib/queries";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Tag } from "@/components/Tag";
import { PulseDot } from "@/components/PulseDot";
import { toast } from "@/hooks/useToast";
import { FlowPreview } from "@/components/FlowPreview";

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

function Switch({
  checked, onChange, label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      {label && (
        <span className="label-caps" style={checked ? { color: "var(--text)" } : undefined}>
          {label}
        </span>
      )}
    </label>
  );
}

interface Problem {
  key: string;
  msg: string;
}

function validateFlow(draft: Flow): Problem[] {
  const problems: Problem[] = [];
  if (!draft.name.trim()) problems.push({ key: "name", msg: "Dê um nome ao fluxo" });
  if (draft.steps.length === 0) problems.push({ key: "steps", msg: "Adicione pelo menos um passo ao fluxo" });

  const questionIdsSoFar = new Set<string>();
  draft.steps.forEach((step, idx) => {
    const n = idx + 1;
    if (step.type === "question") {
      if (!(step.text ?? "").trim()) {
        problems.push({ key: `step:${idx}:text`, msg: `Passo ${n}: a pergunta precisa de um texto` });
      }
      const options = step.options ?? [];
      if (options.length === 0) {
        problems.push({ key: `step:${idx}:options`, msg: `Passo ${n}: adicione pelo menos uma opção de resposta` });
      }
      const seen = new Set<string>();
      options.forEach((opt, i) => {
        if (!opt.label.trim()) {
          problems.push({ key: `step:${idx}:opt:${i}:label`, msg: `Passo ${n}, opção ${i + 1}: falta o texto do botão` });
        }
        if (!opt.value.trim()) {
          problems.push({ key: `step:${idx}:opt:${i}:value`, msg: `Passo ${n}, opção ${i + 1}: falta o valor interno` });
        } else if (seen.has(opt.value)) {
          problems.push({ key: `step:${idx}:opt:${i}:value`, msg: `Passo ${n}: valor interno duplicado (${opt.value})` });
        }
        seen.add(opt.value);
      });
      questionIdsSoFar.add(step.id);
    } else {
      const hasPrompt = (step.system_prompt ?? "").trim().length > 0;
      const hasFallback = Object.values(step.fallbacks ?? {}).some((v) => v.trim().length > 0);
      if (!hasPrompt && !hasFallback) {
        problems.push({
          key: `step:${idx}:prompt`,
          msg: `Passo ${n}: o passo de IA precisa de instruções ou de pelo menos um texto de fallback`,
        });
      }
      if (step.fallback_step && !questionIdsSoFar.has(step.fallback_step)) {
        problems.push({
          key: `step:${idx}:fallback_step`,
          msg: `Passo ${n}: o fallback aponta pra uma pergunta que não existe antes dele`,
        });
      }
    }
  });
  return problems;
}

export function FlowEditor({
  flowKey, onDeleted, onDirtyChange,
}: {
  flowKey: string;
  onDeleted: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const q = useFlow(flowKey);
  const meta = useFlowsMeta();
  const save = useSaveFlow(flowKey);
  const del = useDeleteFlow();
  const [draft, setDraft] = useState<Flow | null>(null);
  const [dirty, setDirty] = useState(false);
  const [errKeys, setErrKeys] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setDraft(q.data ? structuredClone(q.data) : null);
    setDirty(false);
    setErrKeys(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.data, flowKey]);

  useEffect(() => {
    onDirtyChange?.(dirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  if (q.isError) {
    return (
      <ErrorBanner
        message={`Falha ao carregar fluxo: ${(q.error as Error)?.message || "erro desconhecido"}`}
        onRetry={() => q.refetch()}
      />
    );
  }
  if (q.isLoading || !draft) {
    return (
      <div className="flow-layout">
        <div>
          <div className="skeleton" style={{ height: 130, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 220 }} />
        </div>
        <div className="skeleton" style={{ height: 300 }} />
      </div>
    );
  }

  const triggerDesc = meta.data?.triggers?.[draft.trigger] ?? "";
  const buttonActions = meta.data?.button_actions ?? {};

  function errStyle(key: string) {
    return errKeys.has(key) ? { borderColor: "var(--danger)" } : undefined;
  }

  function patch(p: Partial<Flow>) {
    setDraft((d) => (d ? { ...d, ...p } : d));
    setDirty(true);
  }

  function patchStep(idx: number, p: Partial<FlowStep>) {
    setDraft((d) => {
      if (!d) return d;
      const steps = d.steps.slice();
      steps[idx] = { ...steps[idx], ...p };
      return { ...d, steps };
    });
    setDirty(true);
  }

  function moveStep(idx: number, dir: -1 | 1) {
    setDraft((d) => {
      if (!d) return d;
      const steps = d.steps.slice();
      const target = idx + dir;
      if (target < 0 || target >= steps.length) return d;
      [steps[idx], steps[target]] = [steps[target], steps[idx]];
      return { ...d, steps };
    });
    setDirty(true);
  }

  function removeStep(idx: number) {
    setDraft((d) => {
      if (!d) return d;
      const removed = d.steps[idx];
      const steps = d.steps
        .filter((_, i) => i !== idx)
        // limpa referências de fallback pro step removido (senão o save é rejeitado)
        .map((s) => (s.fallback_step === removed.id ? { ...s, fallback_step: "" } : s));
      return { ...d, steps };
    });
    setDirty(true);
  }

  function addQuestionStep() {
    setDraft((d) => {
      if (!d) return d;
      const step: FlowStep = { id: newId("q"), type: "question", text: "", skip_ends_flow: true, options: [] };
      return { ...d, steps: [...d.steps, step] };
    });
    setDirty(true);
  }

  function addAiMessageStep() {
    setDraft((d) => {
      if (!d) return d;
      const step: FlowStep = {
        id: newId("ai"), type: "ai_message", system_prompt: "", fallback_step: "", fallbacks: {}, buttons: [],
      };
      return { ...d, steps: [...d.steps, step] };
    });
    setDirty(true);
  }

  function discard() {
    setDraft(q.data ? structuredClone(q.data) : null);
    setDirty(false);
    setErrKeys(new Set());
  }

  async function doSave() {
    if (!draft) return;
    const problems = validateFlow(draft);
    if (problems.length > 0) {
      setErrKeys(new Set(problems.map((p) => p.key)));
      toast("err", problems[0].msg);
      return;
    }
    setErrKeys(new Set());
    try {
      await save.mutateAsync({
        name: draft.name,
        trigger: draft.trigger,
        enabled: draft.enabled,
        skip_label: draft.skip_label,
        steps: draft.steps,
      });
      toast("ok", "Fluxo salvo");
      setDirty(false);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function doDelete() {
    try {
      await del.mutateAsync(flowKey);
      toast("ok", "Automação removida");
      setConfirmDelete(false);
      onDeleted();
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  return (
    <div className="flow-layout">
      {/* ── coluna do editor ── */}
      <div>
        <div className="panel mb-md">
          <div className="panel-header">
            <div className="panel-title">Configuração</div>
            <button className="btn btn-sm danger" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={12} /> Apagar fluxo
            </button>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Nome</label>
              <input
                className="input"
                style={errStyle("name")}
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Texto do botão pular</label>
              <input
                className="input"
                value={draft.skip_label}
                onChange={(e) => patch({ skip_label: e.target.value })}
              />
            </div>
          </div>

          <div className="between" style={{ flexWrap: "wrap", gap: 12 }}>
            <div className="row gap-sm">
              <span className="input-label" style={{ marginBottom: 0 }}>Gatilho</span>
              <Tag tone="info">{draft.trigger}</Tag>
              {triggerDesc && <span className="flow-hint" style={{ marginTop: 0 }}>// {triggerDesc}</span>}
            </div>
            <Switch
              checked={draft.enabled}
              onChange={(v) => patch({ enabled: v })}
              label={draft.enabled ? "Habilitado" : "Desabilitado"}
            />
          </div>
        </div>

        <div className="step-thread">
          {draft.steps.map((step, idx) => {
            const isAi = step.type === "ai_message";
            return (
              <div className="step-item" key={step.id}>
                <div className={`step-node${isAi ? " ai" : ""}`}>{idx + 1}</div>
                <div className={`panel step-panel${isAi ? " ai" : ""}`}>
                  <div className="panel-header">
                    <div className="row gap-sm">
                      <div className="panel-title">Passo {idx + 1}</div>
                      {isAi ? (
                        <Tag tone="amber"><Sparkles size={10} /> orientação IA</Tag>
                      ) : (
                        <Tag>pergunta</Tag>
                      )}
                      <span className="step-id" title="Chave interna da resposta — não editável">
                        #{step.id}
                      </span>
                    </div>
                    <div className="row" style={{ gap: 4 }}>
                      <button
                        className="btn btn-sm icon-only"
                        onClick={() => moveStep(idx, -1)}
                        disabled={idx === 0}
                        title="Mover pra cima"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        className="btn btn-sm icon-only"
                        onClick={() => moveStep(idx, 1)}
                        disabled={idx === draft.steps.length - 1}
                        title="Mover pra baixo"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        className="btn btn-sm icon-only danger"
                        onClick={() => removeStep(idx)}
                        title="Remover passo"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {step.type === "question" ? (
                    <QuestionStepEditor
                      step={step}
                      idx={idx}
                      errStyle={errStyle}
                      onPatch={(p) => patchStep(idx, p)}
                    />
                  ) : (
                    <AiMessageStepEditor
                      step={step}
                      idx={idx}
                      questionStepsBefore={draft.steps.slice(0, idx).filter((s) => s.type === "question")}
                      buttonActions={buttonActions}
                      errStyle={errStyle}
                      onPatch={(p) => patchStep(idx, p)}
                    />
                  )}
                </div>
              </div>
            );
          })}

          <div className="step-item">
            <div className="step-node" style={{ color: "var(--text-dimmer)" }}>+</div>
            <div className="row gap-sm" style={{ paddingTop: 12, flexWrap: "wrap" }}>
              <button className="btn" onClick={addQuestionStep}>
                <MessageSquareText size={14} /> Pergunta
              </button>
              <button className="btn" onClick={addAiMessageStep}>
                <Sparkles size={14} /> Passo de IA
              </button>
            </div>
          </div>
        </div>

        {dirty && (
          <div className="flow-savebar">
            <PulseDot on tone="amber" />
            <span className="label-caps">alterações não salvas</span>
            <div className="spacer" />
            <button className="btn" onClick={discard} disabled={save.isPending}>
              Descartar
            </button>
            <button className="btn primary" onClick={doSave} disabled={save.isPending}>
              <Save size={14} /> {save.isPending ? "Salvando..." : "Salvar fluxo"}
            </button>
          </div>
        )}
      </div>

      {/* ── coluna do preview ── */}
      <div className="flow-preview-col">
        <FlowPreview flow={draft} />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Apagar automação?"
        body={
          <>
            A automação <strong>{draft.name || flowKey}</strong> e todo o roteiro dela serão removidos.
            Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Apagar"
        danger
        loading={del.isPending}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

/* ── editor de step: pergunta ── */
function QuestionStepEditor({
  step, idx, errStyle, onPatch,
}: {
  step: FlowStep;
  idx: number;
  errStyle: (key: string) => React.CSSProperties | undefined;
  onPatch: (p: Partial<FlowStep>) => void;
}) {
  const options = step.options ?? [];

  function patchOption(i: number, p: Partial<FlowOption>) {
    const next = options.slice();
    next[i] = { ...next[i], ...p };
    onPatch({ options: next });
  }
  function removeOption(i: number) {
    onPatch({ options: options.filter((_, j) => j !== i) });
  }
  function addOption() {
    onPatch({ options: [...options, { value: "", label: "" }] });
  }
  function moveOption(i: number, dir: -1 | 1) {
    const target = i + dir;
    if (target < 0 || target >= options.length) return;
    const next = options.slice();
    [next[i], next[target]] = [next[target], next[i]];
    onPatch({ options: next });
  }

  return (
    <div>
      <div className="input-group">
        <label className="input-label">Texto da pergunta</label>
        <textarea
          className="textarea"
          style={{ minHeight: 70, ...errStyle(`step:${idx}:text`) }}
          value={step.text ?? ""}
          onChange={(e) => onPatch({ text: e.target.value })}
          placeholder="O que o bot pergunta nesse passo"
        />
        <div className="flow-hint">// HTML do Telegram: &lt;b&gt; &lt;i&gt; — nunca Markdown (#, **)</div>
      </div>

      <div className="input-group">
        <Switch
          checked={step.skip_ends_flow ?? true}
          onChange={(v) => onPatch({ skip_ends_flow: v })}
          label="Botão de pular"
        />
        {(step.skip_ends_flow ?? true) && (
          <div className="flow-hint">// pular aqui encerra o fluxo inteiro — não pula só esta pergunta</div>
        )}
      </div>

      <label className="input-label">Opções de resposta</label>
      {options.length === 0 && (
        <div className="flow-hint" style={{ marginTop: 0, marginBottom: 8, ...(errStyle(`step:${idx}:options`) ? { color: "var(--danger)" } : {}) }}>
          — sem opções — a pergunta precisa de pelo menos uma
        </div>
      )}
      <div className="flex-col" style={{ gap: 6 }}>
        {options.map((opt, i) => (
          <div className="flow-optrow" key={i}>
            <input
              className="input opt-value"
              style={errStyle(`step:${idx}:opt:${i}:value`)}
              value={opt.value}
              onChange={(e) => patchOption(i, { value: e.target.value })}
              placeholder="valor_interno"
              title="Valor gravado como resposta (não aparece pro lead)"
            />
            <input
              className="input"
              style={{ flex: 1, ...errStyle(`step:${idx}:opt:${i}:label`) }}
              value={opt.label}
              onChange={(e) => patchOption(i, { label: e.target.value })}
              placeholder="Texto do botão (emoji vale)"
            />
            <button className="btn btn-sm icon-only" onClick={() => moveOption(i, -1)} disabled={i === 0} title="Mover pra cima">
              <ArrowUp size={12} />
            </button>
            <button className="btn btn-sm icon-only" onClick={() => moveOption(i, 1)} disabled={i === options.length - 1} title="Mover pra baixo">
              <ArrowDown size={12} />
            </button>
            <button className="btn btn-sm icon-only danger" onClick={() => removeOption(i)} title="Remover opção">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-sm" style={{ marginTop: 8 }} onClick={addOption}>
        <Plus size={12} /> Opção
      </button>
    </div>
  );
}

/* ── editor de step: orientação por IA ── */
function AiMessageStepEditor({
  step, idx, questionStepsBefore, buttonActions, errStyle, onPatch,
}: {
  step: FlowStep;
  idx: number;
  questionStepsBefore: FlowStep[];
  buttonActions: Record<string, string>;
  errStyle: (key: string) => React.CSSProperties | undefined;
  onPatch: (p: Partial<FlowStep>) => void;
}) {
  const fallbackStep = questionStepsBefore.find((s) => s.id === step.fallback_step);
  const fallbackOptions = fallbackStep?.options ?? [];
  const fallbacks = step.fallbacks ?? {};
  const buttons = step.buttons ?? [];

  function setFallback(value: string, text: string) {
    onPatch({ fallbacks: { ...fallbacks, [value]: text } });
  }
  function patchButton(i: number, p: Partial<FlowButton>) {
    const next = buttons.slice();
    next[i] = { ...next[i], ...p };
    onPatch({ buttons: next });
  }
  function removeButton(i: number) {
    onPatch({ buttons: buttons.filter((_, j) => j !== i) });
  }
  function addButton() {
    const firstAction = Object.keys(buttonActions)[0] ?? "";
    onPatch({ buttons: [...buttons, { label: "", action: firstAction }] });
  }

  return (
    <div>
      <div className="input-group">
        <label className="input-label">Instruções pra IA (system prompt)</label>
        <textarea
          className="textarea"
          style={{ minHeight: 110, ...errStyle(`step:${idx}:prompt`) }}
          value={step.system_prompt ?? ""}
          onChange={(e) => onPatch({ system_prompt: e.target.value })}
          placeholder="Como a IA deve escrever a orientação final pro lead"
        />
        <div className="flow-hint">
          // a resposta sai como HTML do Telegram — instrua a IA a nunca usar Markdown (#, **), só &lt;b&gt; e &lt;i&gt;
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Fallback baseado em</label>
        <select
          className="select"
          style={errStyle(`step:${idx}:fallback_step`)}
          value={step.fallback_step ?? ""}
          onChange={(e) => onPatch({ fallback_step: e.target.value })}
        >
          <option value="">— fallback único (sem variação) —</option>
          {questionStepsBefore.map((s) => (
            <option key={s.id} value={s.id}>#{s.id}</option>
          ))}
        </select>
        <div className="flow-hint">// se a IA falhar, o bot manda um texto fixo — que pode variar conforme a resposta escolhida</div>
      </div>

      {fallbackStep ? (
        fallbackOptions.map((opt) => (
          <div className="input-group" key={opt.value}>
            <label className="input-label">Se “{opt.label || opt.value}” e a IA falhar</label>
            <textarea
              className="textarea"
              style={{ minHeight: 56 }}
              value={fallbacks[opt.value] ?? ""}
              onChange={(e) => setFallback(opt.value, e.target.value)}
            />
          </div>
        ))
      ) : (
        <div className="input-group">
          <label className="input-label">Texto fixo se a IA falhar</label>
          <textarea
            className="textarea"
            style={{ minHeight: 56 }}
            value={fallbacks[""] ?? ""}
            onChange={(e) => setFallback("", e.target.value)}
          />
        </div>
      )}

      <label className="input-label">Botões finais</label>
      <div className="flex-col" style={{ gap: 6 }}>
        {buttons.map((btn, i) => (
          <div className="flow-optrow" key={i}>
            <input
              className="input"
              style={{ flex: 1 }}
              value={btn.label}
              onChange={(e) => patchButton(i, { label: e.target.value })}
              placeholder="Texto do botão"
            />
            <select
              className="select"
              style={{ width: 230, flex: "none" }}
              value={btn.action}
              onChange={(e) => patchButton(i, { action: e.target.value })}
            >
              {Object.entries(buttonActions).map(([action, label]) => (
                <option key={action} value={action}>{label}</option>
              ))}
            </select>
            <button className="btn btn-sm icon-only danger" onClick={() => removeButton(i)} title="Remover botão">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      <button className="btn btn-sm" style={{ marginTop: 8 }} onClick={addButton}>
        <Plus size={12} /> Botão
      </button>
      <div className="flow-hint">// cada botão abre uma função que já existe no bot — a lista é fixa pra evitar botão morto</div>
    </div>
  );
}
