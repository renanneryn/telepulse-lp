import { useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { useSaveTrialLimits, useTrialLimits, type TrialLimits, type TrialRule } from "@/lib/queries";
import { ErrorBanner } from "@/components/ErrorBanner";
import { toast } from "@/hooks/useToast";

type NumField = "max_media" | "max_clones" | "max_media_per_topic" | "max_topics" | "max_tasks";

const FIELD_LABEL: Record<NumField, string> = {
  max_media: "Mídias por clone",
  max_clones: "Clones no teste",
  max_media_per_topic: "Mídias por tópico",
  max_topics: "Tópicos por clone",
  max_tasks: "Tarefas no máximo",
};

// ordem e textos da tela; as chaves espelham core/trial_limits.py
const GROUPS: { title: string; items: { key: string; label: string; hint: string }[] }[] = [
  {
    title: "CLONE",
    items: [
      { key: "clone_open", label: "Canal / grupo aberto", hint: "origem sem proteção de conteúdo" },
      { key: "clone_restricted", label: "Canal / grupo trancado", hint: "origem com proteção (encaminhar bloqueado)" },
      { key: "clone_topics", label: "Supergrupo com tópicos — aberto", hint: "tópicos específicos, tudo num destino ou recriar" },
      { key: "clone_topics_restricted", label: "Supergrupo com tópicos — trancado", hint: "mesmos modos, com proteção de conteúdo" },
      { key: "recreate_supergroup", label: "Recriar supergrupo", hint: "\"Recriar SuperGrupo do 0\" e \"Recriar no meu grupo\"" },
    ],
  },
  {
    title: "OUTROS RECURSOS",
    items: [
      { key: "forward_realtime", label: "Espelhar em tempo real", hint: "tarefas de espelhamento" },
      { key: "scheduled_posts", label: "Agendar posts", hint: "tarefas de postagem automática" },
      { key: "offers", label: "Ofertas rotativas", hint: "ofertas em rodízio" },
      { key: "text_rules", label: "Regras de texto", hint: "criar substituições de texto/links" },
      { key: "buttons", label: "Botões nas tarefas", hint: "botões em clone, espelhamento e posts" },
    ],
  },
];

/** Configuração completa do que o teste grátis libera e até onde. */
export function TrialLimitsEditor() {
  const q = useTrialLimits();
  const save = useSaveTrialLimits();
  const [draft, setDraft] = useState<TrialLimits | null>(null);

  useEffect(() => {
    if (q.data) setDraft(q.data.limits);
  }, [q.dataUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (q.isError) {
    return <ErrorBanner message={`Falha ao carregar limites: ${(q.error as Error).message}`} onRetry={() => q.refetch()} />;
  }
  if (!draft || !q.data) return <div className="skeleton" style={{ height: 200 }} />;

  const dirty = JSON.stringify(draft) !== JSON.stringify(q.data.limits);

  function patch(key: string, p: Partial<TrialRule>) {
    setDraft((d) => (d ? { ...d, [key]: { ...d[key], ...p } } : d));
  }

  async function submit() {
    if (!draft) return;
    try {
      await save.mutateAsync(draft);
      toast("ok", "Limites do trial salvos — já valem para quem está em teste");
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  return (
    <div className="trial-limits" style={{ marginTop: 18 }}>
      <div className="label-caps" style={{ margin: "0 0 4px", color: "var(--text-dim)" }}>
        LIMITES DO TESTE GRÁTIS
      </div>
      <div className="label-caps" style={{ margin: "0 0 14px", color: "var(--text-dimmer)" }}>
        // trial = VIP com trava: ligue o que o teste libera e defina até onde · 0 = sem limite
      </div>

      {GROUPS.map((g) => (
        <div key={g.title} style={{ marginBottom: 18 }}>
          <div className="label-caps" style={{ margin: "0 0 8px", color: "var(--text-dim)" }}>{g.title}</div>
          <div className="trial-rules">
            {g.items.map((it) => {
              const r = draft[it.key];
              if (!r) return null;
              const fields = (Object.keys(r) as (keyof TrialRule)[]).filter((f) => f !== "on") as NumField[];
              return (
                <div key={it.key} className={`trial-rule${r.on ? " on" : ""}`}>
                  <label className="trial-rule-head">
                    <span>
                      <span className="trial-rule-title">{it.label}</span>
                      <span className="trial-rule-hint">{it.hint}</span>
                    </span>
                    <span className="switch">
                      <input type="checkbox" checked={r.on} onChange={(e) => patch(it.key, { on: e.target.checked })} />
                      <span className="track" />
                    </span>
                  </label>
                  {r.on && fields.length > 0 && (
                    <div className="trial-rule-fields">
                      {fields.map((f) => (
                        <div key={f} className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">{FIELD_LABEL[f]}</label>
                          <input
                            className="input num"
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={String(r[f] ?? 0)}
                            onChange={(e) => {
                              const n = Math.max(0, Math.floor(Number(e.target.value) || 0));
                              patch(it.key, { [f]: n } as Partial<TrialRule>);
                            }}
                          />
                          <div className="trial-rule-unit">{(r[f] ?? 0) === 0 ? "sem limite" : ""}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!r.on && <div className="trial-rule-off">bloqueado no teste — oferece o VIP</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className={`texts-savebar${dirty ? " dirty" : ""}`} style={{ gap: 8 }}>
        <button
          type="button"
          className="btn"
          onClick={() => setDraft(q.data!.defaults)}
          disabled={save.isPending}
          title="Volta tudo ao padrão (não salva sozinho)"
        >
          <RotateCcw size={14} /> Padrão
        </button>
        <button className={`btn ${dirty ? "primary" : ""}`} onClick={submit} disabled={!dirty || save.isPending}>
          <Save size={14} /> {save.isPending ? "Salvando..." : "Salvar limites"}
        </button>
      </div>
    </div>
  );
}
