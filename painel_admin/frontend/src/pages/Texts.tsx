import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { useSettings, useSetSettingsBulk } from "@/lib/queries";
import { toast } from "@/hooks/useToast";

// Lista CURADA de textos editáveis (não expõe configs como bot_mode/lockdown/preços).
type TextField = {
  key: string;
  label: string;
  group: string;
  multiline: boolean;
  hint?: string;
  requires?: string[]; // placeholders obrigatórios
};

const FIELDS: TextField[] = [
  // Mensagens principais
  { key: "welcome_text", label: "Boas-vindas (/start deslogado)", group: "Mensagens principais", multiline: true },
  { key: "start_text", label: "Painel conectado (template)", group: "Mensagens principais", multiline: true, hint: "Suporta {name}, {user_id}, {phone}, {total_clones}, {active_forwards}" },
  { key: "info_text", label: "Como o bot funciona (info)", group: "Mensagens principais", multiline: true },
  // Menus das funções
  { key: "clone_menu_text", label: "Menu de Clone", group: "Menus das funções", multiline: true },
  { key: "clone_help_text", label: "Ajuda detalhada do /clone", group: "Menus das funções", multiline: true },
  { key: "forward_menu_text", label: "Menu de Mirror", group: "Menus das funções", multiline: true },
  { key: "replace_menu_text", label: "Menu de Substituições", group: "Menus das funções", multiline: true },
  // Botões
  { key: "btn_clone", label: "Botão: Clonar", group: "Botões", multiline: false },
  { key: "btn_clone_active", label: "Botão: Clone em andamento", group: "Botões", multiline: false },
  { key: "btn_history", label: "Botão: Histórico", group: "Botões", multiline: false },
  { key: "btn_replace", label: "Botão: Substituir Textos", group: "Botões", multiline: false },
  { key: "btn_back", label: "Botão: Voltar", group: "Botões", multiline: false },
  // Bloqueios & Avisos
  { key: "trial_banner_text", label: "Banner de trial (novo usuário)", group: "Bloqueios & Avisos", multiline: true, hint: "Use {dias} para a duração", requires: ["{dias}"] },
  { key: "lockdown_block_text", label: "Aviso de bot trancado", group: "Bloqueios & Avisos", multiline: true },
  { key: "paid_block_text", label: "Aviso de recurso exclusivo VIP", group: "Bloqueios & Avisos", multiline: true, hint: "Use {recurso} e {whatsapp}", requires: ["{recurso}"] },
  { key: "tester_clone_block_text", label: "Aviso: Clone bloqueado no teste", group: "Bloqueios & Avisos", multiline: true },
];

const GROUPS = ["Mensagens principais", "Menus das funções", "Botões", "Bloqueios & Avisos"];

export function Texts() {
  const q = useSettings();
  const bulk = useSetSettingsBulk();
  const [edited, setEdited] = useState<Record<string, string>>({});

  // limpa edições locais quando os dados do servidor mudam (após salvar)
  useEffect(() => {
    setEdited({});
  }, [q.dataUpdatedAt]);

  const dirtyKeys = useMemo(
    () => Object.keys(edited).filter((k) => edited[k] !== (q.data?.[k] ?? "")),
    [edited, q.data]
  );

  if (q.isLoading) {
    return (
      <div>
        <div className="page-header"><h1 className="page-title">Textos</h1></div>
        <div className="skeleton" style={{ height: 60, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 60, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 60 }} />
      </div>
    );
  }

  function val(f: TextField): string {
    return edited[f.key] ?? q.data?.[f.key] ?? "";
  }

  function missingPlaceholders(): { key: string; label: string; ph: string }[] {
    const out: { key: string; label: string; ph: string }[] = [];
    for (const f of FIELDS) {
      if (!f.requires) continue;
      const v = val(f);
      for (const ph of f.requires) {
        if (!v.includes(ph)) out.push({ key: f.key, label: f.label, ph });
      }
    }
    return out;
  }

  async function saveAll() {
    if (!dirtyKeys.length) return;
    const miss = missingPlaceholders();
    if (miss.length) {
      const m = miss.map((x) => `“${x.label}” precisa conter ${x.ph}`).join("; ");
      toast("err", `Placeholder obrigatório ausente: ${m}`);
      return;
    }
    const items: Record<string, string> = {};
    for (const k of dirtyKeys) items[k] = edited[k];
    try {
      await bulk.mutateAsync(items);
      toast("ok", `${dirtyKeys.length} texto(s) salvo(s)`);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  return (
    <div>
      <div
        className="page-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
      >
        <div>
          <h1 className="page-title">Textos</h1>
          <div className="page-sub">
            // textos do bot · {dirtyKeys.length > 0 ? `${dirtyKeys.length} alteração(ões) não salva(s)` : "tudo salvo"}
          </div>
        </div>
        <button
          className={`btn ${dirtyKeys.length ? "primary" : ""}`}
          onClick={saveAll}
          disabled={!dirtyKeys.length || bulk.isPending}
        >
          <Save size={14} /> Salvar tudo
        </button>
      </div>

      {GROUPS.map((group) => (
        <div key={group} style={{ marginBottom: 24 }}>
          <div className="label-caps" style={{ margin: "8px 0", color: "var(--text-dim)" }}>{group}</div>
          <div className="flex-col" style={{ gap: 14 }}>
            {FIELDS.filter((f) => f.group === group).map((f) => {
              const isDirty = edited[f.key] !== undefined && edited[f.key] !== (q.data?.[f.key] ?? "");
              return (
                <div
                  key={f.key}
                  className="card"
                  style={{
                    padding: 12, borderRadius: 8,
                    border: `1px solid ${isDirty ? "var(--accent, #b8ff3d)" : "var(--border)"}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>{f.label}</span>
                    <span style={{ color: "var(--text-dimmer)", fontSize: "var(--fz-xs)", fontFamily: "var(--font-mono)" }}>{f.key}</span>
                  </div>
                  {f.hint && (
                    <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)", marginBottom: 6 }}>{f.hint}</div>
                  )}
                  {f.multiline ? (
                    <textarea
                      className="textarea"
                      style={{ minHeight: 90, width: "100%" }}
                      value={val(f)}
                      onChange={(e) => setEdited({ ...edited, [f.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      className="input"
                      style={{ width: "100%" }}
                      value={val(f)}
                      onChange={(e) => setEdited({ ...edited, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className={`btn ${dirtyKeys.length ? "primary" : ""}`}
          onClick={saveAll}
          disabled={!dirtyKeys.length || bulk.isPending}
        >
          <Save size={14} /> Salvar tudo
        </button>
      </div>
    </div>
  );
}
