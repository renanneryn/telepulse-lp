import { useEffect, useRef, useState } from "react";
import { Plus, Workflow } from "lucide-react";
import { useFlows, useCreateFlow, useFlowsMeta } from "@/lib/queries";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { PulseDot } from "@/components/PulseDot";
import { Tag } from "@/components/Tag";
import { toast } from "@/hooks/useToast";
import { FlowEditor } from "@/components/FlowEditor";

const KEY_RE = /^[a-z0-9_]{1,32}$/;

export function Flows() {
  const q = useFlows();
  const meta = useFlowsMeta();
  const create = useCreateFlow();
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // guarda de edição não salva ao trocar de fluxo
  const dirtyRef = useRef(false);
  const [pendingSwitch, setPendingSwitch] = useState<string | null>(null);

  useEffect(() => {
    if (!selected && q.data && q.data.length > 0) setSelected(q.data[0].flow_key);
  }, [q.data, selected]);

  if (q.isLoading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Automações</h1>
            <div className="page-sub">// roteiros de conversa do bot — perguntas por botão + orientação por IA</div>
          </div>
        </div>
        <div className="skeleton" style={{ height: 36, marginBottom: 16, maxWidth: 420 }} />
        <div className="skeleton" style={{ height: 240 }} />
      </div>
    );
  }

  if (q.isError) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Automações</h1>
            <div className="page-sub">// roteiros de conversa do bot</div>
          </div>
        </div>
        <ErrorBanner
          message={`Falha ao carregar fluxos: ${(q.error as Error)?.message || "erro desconhecido"}`}
          onRetry={() => q.refetch()}
        />
      </div>
    );
  }

  const flows = q.data ?? [];

  function requestSwitch(key: string) {
    if (key === selected) return;
    if (dirtyRef.current) {
      setPendingSwitch(key);
    } else {
      setSelected(key);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Automações</h1>
          <div className="page-sub">// roteiros de conversa do bot — perguntas por botão + orientação por IA</div>
        </div>
        <button className="btn" onClick={() => setCreating(true)}>
          <Plus size={14} /> Nova automação
        </button>
      </div>

      {flows.length === 0 ? (
        <div className="panel" style={{ textAlign: "center", padding: 48 }}>
          <Workflow size={22} style={{ color: "var(--text-dimmer)", marginBottom: 12 }} />
          <div className="label-caps" style={{ marginBottom: 8 }}>— nenhuma automação —</div>
          <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-sm)", marginBottom: 20 }}>
            Uma automação é um roteiro de conversa que o bot conduz sozinho: perguntas com botões e uma
            orientação final gerada por IA.
          </div>
          <button className="btn primary" onClick={() => setCreating(true)}>
            <Plus size={14} /> Criar a primeira
          </button>
        </div>
      ) : (
        <>
          <div className="flow-tabs">
            {flows.map((f) => (
              <button
                key={f.flow_key}
                className={`flow-tab${selected === f.flow_key ? " active" : ""}`}
                onClick={() => requestSwitch(f.flow_key)}
              >
                <PulseDot on={f.enabled} />
                {f.name || f.flow_key}
                <Tag>{f.step_count} {f.step_count === 1 ? "passo" : "passos"}</Tag>
              </button>
            ))}
          </div>

          {selected && (
            <FlowEditor
              flowKey={selected}
              onDeleted={() => setSelected(null)}
              onDirtyChange={(d) => { dirtyRef.current = d; }}
            />
          )}
        </>
      )}

      {creating && (
        <CreateFlowModal
          triggers={meta.data?.triggers ?? {}}
          busy={create.isPending}
          onCancel={() => setCreating(false)}
          onCreate={async (body) => {
            try {
              await create.mutateAsync(body);
              toast("ok", "Automação criada — monte o roteiro abaixo");
              setCreating(false);
              dirtyRef.current = false;
              setSelected(body.flow_key);
            } catch (e) {
              toast("err", (e as Error).message);
            }
          }}
        />
      )}

      <ConfirmDialog
        open={pendingSwitch !== null}
        title="Descartar alterações?"
        body={<>O fluxo atual tem <strong>alterações não salvas</strong>. Trocar de automação agora descarta essas mudanças.</>}
        confirmLabel="Descartar e trocar"
        danger
        onConfirm={() => {
          if (pendingSwitch) setSelected(pendingSwitch);
          dirtyRef.current = false;
          setPendingSwitch(null);
        }}
        onCancel={() => setPendingSwitch(null)}
      />
    </div>
  );
}

function CreateFlowModal({
  triggers, busy, onCancel, onCreate,
}: {
  triggers: Record<string, string>;
  busy: boolean;
  onCancel: () => void;
  onCreate: (body: { flow_key: string; name: string; trigger: string }) => void;
}) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [trigger, setTrigger] = useState("");
  const triggerOptions = Object.entries(triggers);
  const valid = name.trim().length > 0 && KEY_RE.test(key) && trigger !== "";

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--fz-lg)",
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}
        >
          Nova automação
        </h3>
        <div className="flow-hint" style={{ marginBottom: 18 }}>
          // um roteiro novo de conversa — as perguntas você monta depois
        </div>

        <div className="input-group">
          <label className="input-label">Nome</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Boas-vindas v2"
            autoFocus
          />
        </div>

        <div className="input-group">
          <label className="input-label">Chave</label>
          <input
            className="input"
            value={key}
            onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            placeholder="ex: onboarding_v2"
            maxLength={32}
          />
          <div className="flow-hint">// a-z, 0-9 e _ — identifica o fluxo internamente e não muda depois</div>
        </div>

        <div className="input-group">
          <label className="input-label">Gatilho</label>
          <select className="select" value={trigger} onChange={(e) => setTrigger(e.target.value)}>
            <option value="">Selecione quando o fluxo dispara...</option>
            {triggerOptions.map(([k, desc]) => (
              <option key={k} value={k}>{k} — {desc}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
          <button className="btn" onClick={onCancel} disabled={busy}>Cancelar</button>
          <button
            className="btn primary"
            disabled={!valid || busy}
            onClick={() => onCreate({ flow_key: key, name: name.trim(), trigger })}
          >
            {busy ? "Criando..." : "Criar automação"}
          </button>
        </div>
      </div>
    </div>
  );
}
