import { useEffect, useMemo, useRef, useState } from "react";
import { Save, Search, RotateCcw, ChevronDown, ChevronsDownUp, ChevronsUpDown, MessageSquare, RectangleHorizontal } from "lucide-react";
import { useSettings, useSetSettingsBulk } from "@/lib/queries";
import { usePref } from "@/hooks/usePref";
import { toast } from "@/hooks/useToast";
import { renderTelegramPreview } from "@/lib/tgFormat";
import { SAMPLE_VARS, TEXT_FIELDS, TEXT_GROUPS, type TextField } from "@/lib/textFields";

function fillSample(text: string): string {
  let out = text;
  for (const [k, v] of Object.entries(SAMPLE_VARS)) out = out.split(k).join(v);
  return out;
}

/** Primeira linha do texto, sem tags, para o resumo do item fechado. */
function snippet(text: string): string {
  const plain = text.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  const line = plain.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
  return line.length > 90 ? line.slice(0, 90) + "…" : line;
}

export function Texts() {
  const q = useSettings();
  const bulk = useSetSettingsBulk();
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  // partes abertas ficam guardadas: ao voltar, a tela está como foi deixada
  const [openGroups, setOpenGroups] = usePref<string[]>("texts.openGroups", [TEXT_GROUPS[0].id]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  // no celular cada texto mostra uma coluna por vez: editar ou prévia
  const [view, setView] = useState<Record<string, "edit" | "preview">>({});
  const areas = useRef<Record<string, HTMLTextAreaElement | HTMLInputElement | null>>({});

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

  function val(key: string): string {
    return edited[key] ?? q.data?.[key] ?? "";
  }

  function set(key: string, value: string) {
    setEdited((e) => ({ ...e, [key]: value }));
  }

  /** Insere a variável onde está o cursor (no celular digitar { } é chato). */
  function insertVar(key: string, v: string) {
    const el = areas.current[key];
    const cur = val(key);
    const start = el?.selectionStart ?? cur.length;
    const end = el?.selectionEnd ?? cur.length;
    set(key, cur.slice(0, start) + v + cur.slice(end));
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + v.length, start + v.length);
    });
  }

  function missingPlaceholders(): { label: string; ph: string }[] {
    const out: { label: string; ph: string }[] = [];
    for (const f of TEXT_FIELDS) {
      for (const ph of f.requires ?? []) {
        if (!val(f.key).includes(ph)) out.push({ label: f.label, ph });
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

  const term = search.trim().toLowerCase();
  const matches = (f: TextField) =>
    !term || f.label.toLowerCase().includes(term) || f.key.includes(term) || val(f.key).toLowerCase().includes(term);
  const isDirty = (key: string) => dirtyKeys.includes(key) || (key === "start_text" && dirtyKeys.includes("start_text_mode"));
  // buscando, as partes e itens com resultado abrem sozinhos
  const groupOpen = (id: string) => (term ? true : openGroups.includes(id));
  const itemOpen = (key: string) => (term ? true : openItems.has(key));
  const allOpen = TEXT_GROUPS.every((g) => openGroups.includes(g.id));

  function toggleGroup(id: string) {
    setOpenGroups(openGroups.includes(id) ? openGroups.filter((g) => g !== id) : [...openGroups, id]);
  }
  function toggleItem(key: string) {
    setOpenItems((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }
  function toggleAll() {
    if (allOpen) {
      setOpenGroups([]);
      setOpenItems(new Set());
    } else {
      setOpenGroups(TEXT_GROUPS.map((g) => g.id));
    }
  }

  const customStart = val("start_text_mode") === "custom";
  const anyMatch = TEXT_FIELDS.some(matches);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Textos</h1>
          <div className="page-sub">
            // mensagens e botões do bot · {dirtyKeys.length > 0 ? `${dirtyKeys.length} alteração(ões) não salva(s)` : "tudo salvo"}
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

      <div className="texts-filters">
        <label className="texts-search">
          <Search size={14} />
          <input
            className="input"
            placeholder="Buscar texto ou palavra"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button type="button" className="btn btn-sm" onClick={toggleAll} disabled={!!term}>
          {allOpen ? <ChevronsDownUp size={14} /> : <ChevronsUpDown size={14} />}
          {allOpen ? "RECOLHER TUDO" : "EXPANDIR TUDO"}
        </button>
      </div>

      {TEXT_GROUPS.map((g) => {
        const fields = TEXT_FIELDS.filter((f) => f.group === g.id && matches(f));
        if (!fields.length) return null;
        const all = TEXT_FIELDS.filter((f) => f.group === g.id);
        const nText = all.filter((f) => f.multiline).length;
        const nBtn = all.length - nText;
        const nDirty = all.filter((f) => isDirty(f.key)).length;
        const open = groupOpen(g.id);
        const bodyId = `texts-group-${g.id}`;
        return (
          <section key={g.id} className={`texts-group${open ? " open" : ""}`}>
            <button
              type="button"
              className="texts-group-head"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => toggleGroup(g.id)}
              disabled={!!term}
            >
              <ChevronDown size={16} className="texts-caret" />
              <span className="texts-group-titles">
                <span className="texts-group-title">{g.title}</span>
                <span className="texts-group-desc">{g.desc}</span>
              </span>
              <span className="texts-group-meta">
                {nDirty > 0 && <span className="texts-badge dirty">{nDirty} alterado{nDirty > 1 ? "s" : ""}</span>}
                <span className="texts-badge">
                  {nText > 0 && `${nText} texto${nText > 1 ? "s" : ""}`}
                  {nText > 0 && nBtn > 0 && " · "}
                  {nBtn > 0 && `${nBtn} ${nBtn > 1 ? "botões" : "botão"}`}
                </span>
              </span>
            </button>

            {open && (
              <div id={bodyId} className="texts-group-body">
                {fields.map((f) => {
                  const dirty = isDirty(f.key);
                  const iOpen = itemOpen(f.key);
                  const mode = view[f.key] ?? "edit";
                  const Icon = f.multiline ? MessageSquare : RectangleHorizontal;
                  return (
                    <div key={f.key} className={`text-item${dirty ? " dirty" : ""}${iOpen ? " open" : ""}`}>
                      <button
                        type="button"
                        className="text-item-head"
                        aria-expanded={iOpen}
                        onClick={() => toggleItem(f.key)}
                        disabled={!!term}
                      >
                        <Icon size={14} className="text-item-icon" />
                        <span className="text-item-titles">
                          <span className="text-item-title">
                            {f.label}
                            {dirty && <span className="text-item-dot" aria-label="alterado" />}
                          </span>
                          {!iOpen && <span className="text-item-snippet">{snippet(val(f.key)) || "—"}</span>}
                        </span>
                        <span className="text-item-kind">{f.multiline ? "TEXTO" : "BOTÃO"}</span>
                        <ChevronDown size={14} className="texts-caret" />
                      </button>

                      {iOpen && (
                        <div className="text-card" data-view={mode}>
                          <div className="text-card-bar">
                            <span className="text-card-key">{f.key}</span>
                            <div className="seg text-card-seg">
                              <button type="button" className={"seg-item" + (mode === "edit" ? " on" : "")}
                                onClick={() => setView({ ...view, [f.key]: "edit" })}>EDITAR</button>
                              <button type="button" className={"seg-item" + (mode === "preview" ? " on" : "")}
                                onClick={() => setView({ ...view, [f.key]: "preview" })}>PRÉVIA</button>
                            </div>
                          </div>
                          <div className="text-card-cols">
                            <div className="text-card-edit">
                              {f.key === "start_text" && (
                                <label className="text-card-toggle">
                                  <span className="switch">
                                    <input
                                      type="checkbox"
                                      checked={customStart}
                                      onChange={(e) => set("start_text_mode", e.target.checked ? "custom" : "")}
                                    />
                                    <span className="track" />
                                  </span>
                                  Usar este texto
                                </label>
                              )}
                              {f.hint && <div className="text-card-hint">{f.hint}</div>}
                              {f.vars && (
                                <div className="text-card-vars">
                                  {f.vars.map((v) => (
                                    <button key={v} type="button" className="text-var" onClick={() => insertVar(f.key, v)}
                                      title="Inserir no cursor">
                                      {v}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {f.multiline ? (
                                <textarea
                                  ref={(el) => { areas.current[f.key] = el; }}
                                  className="textarea"
                                  style={{ minHeight: 160, width: "100%" }}
                                  value={val(f.key)}
                                  onChange={(e) => set(f.key, e.target.value)}
                                />
                              ) : (
                                <input
                                  ref={(el) => { areas.current[f.key] = el; }}
                                  className="input"
                                  style={{ width: "100%" }}
                                  value={val(f.key)}
                                  onChange={(e) => set(f.key, e.target.value)}
                                />
                              )}
                              {dirty && (
                                <button type="button" className="link-btn text-card-undo"
                                  onClick={() => setEdited((e) => {
                                    const c = { ...e };
                                    delete c[f.key];
                                    if (f.key === "start_text") delete c.start_text_mode;
                                    return c;
                                  })}>
                                  <RotateCcw size={12} /> desfazer alteração
                                </button>
                              )}
                            </div>
                            <div className="text-card-preview">
                              <div className="tg-chat">
                                {f.multiline ? (
                                  <div className="tg-bubble">
                                    <div className="tg-text"
                                      dangerouslySetInnerHTML={{ __html: renderTelegramPreview(fillSample(val(f.key)), "html") || "…" }} />
                                  </div>
                                ) : (
                                  <div className="tg-kb">
                                    <div className="tg-key default">{val(f.key) || "…"}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {!anyMatch && (
        <div className="label-caps" style={{ padding: 24, textAlign: "center" }}>nenhum texto encontrado</div>
      )}

      {/* com alteração pendente a barra gruda no rodapé: a página é longa e no
          celular o botão do topo some de vista enquanto se edita */}
      <div className={`texts-savebar${dirtyKeys.length ? " dirty" : ""}`}>
        <button
          className={`btn ${dirtyKeys.length ? "primary" : ""}`}
          onClick={saveAll}
          disabled={!dirtyKeys.length || bulk.isPending}
        >
          <Save size={14} /> Salvar tudo{dirtyKeys.length ? ` (${dirtyKeys.length})` : ""}
        </button>
      </div>
    </div>
  );
}
