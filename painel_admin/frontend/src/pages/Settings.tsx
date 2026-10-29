import { useState } from "react";
import { Save } from "lucide-react";
import { useSettings, useSetSetting, useBotMode, useSetBotMode } from "@/lib/queries";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TEXT_SETTING_KEYS } from "@/lib/textFields";
import { toast } from "@/hooks/useToast";

export function Settings() {
  const q = useSettings();
  const setter = useSetSetting();
  const botMode = useBotMode();
  const setBotMode = useSetBotMode();
  const [edited, setEdited] = useState<Record<string, string>>({});
  // trancar/liberar e trocar o modo valem para todos os usuários: pede confirmação
  const [confirm, setConfirm] = useState<null | "lockdown" | "mode">(null);

  // M8: NÃO limpar `edited` a cada refetch (q.dataUpdatedAt) — isso apagava
  // edições pendentes de OUTROS campos sempre que qualquer save() disparava um
  // refetch. Cada save() já remove sua própria chave de `edited` (abaixo).

  if (q.isLoading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
        </div>
        <div className="skeleton" style={{ height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 36 }} />
      </div>
    );
  }

  // M13: nunca renderizar o default "LIGADO" (falso-saudável) quando a
  // request falhou — mostra o erro e deixa o admin decidir se tenta de novo.
  if (q.isError) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
        </div>
        <ErrorBanner
          message={`Falha ao carregar settings: ${(q.error as Error)?.message || "erro desconhecido"}`}
          onRetry={() => q.refetch()}
        />
      </div>
    );
  }

  // Settings que o backend recusa no PUT genérico (mudá-las exige lógica extra).
  // Sem filtrar, o admin via o campo, editava, salvava e levava um 400 cru.
  const PROTECTED = new Set(["bot_mode", "free_mode_since"]);
  // textos e nomes de botões ficam na tela Textos (com prévia), não aqui
  const entries = Object.entries(q.data ?? {})
    .filter(([k]) => !PROTECTED.has(k) && !TEXT_SETTING_KEYS.has(k))
    .sort(([a], [b]) => a.localeCompare(b));

  // Lockdown: bot trancado quando lockdown != "0" (default LIGADO, mesmo se ausente)
  const lockdownOn = (q.data?.["lockdown"] ?? "1") !== "0";

  const freeMode = botMode.data?.mode === "free";

  async function toggleBotMode() {
    const next = freeMode ? "paid" : "free";
    try {
      const res = await setBotMode.mutateAsync(next);
      toast(
        "ok",
        next === "free"
          ? "🎁 Modo gratuito ligado — todos funcionam como VIP"
          : `💎 Modo pago restaurado${res.extended ? ` — ${res.extended} plano(s) estendido(s)` : ""}`,
      );
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function toggleLockdown() {
    const next = lockdownOn ? "0" : "1";
    try {
      await setter.mutateAsync({ key: "lockdown", value: next });
      toast("ok", next === "1" ? "🔒 Bot TRANCADO (só VIP)" : "🔓 Bot LIBERADO");
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function save(key: string) {
    const value = edited[key];
    if (value === undefined) return;
    try {
      await setter.mutateAsync({ key, value });
      toast("ok", `${key} salvo`);
      setEdited((s) => {
        const copy = { ...s };
        delete copy[key];
        return copy;
      });
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-sub">// chave/valor da tabela `settings`</div>
        </div>
      </div>

      <div
        className="card split-card"
        style={{
          marginBottom: 16, padding: 16, borderRadius: 10,
          border: `1px solid ${lockdownOn ? "var(--danger)" : "var(--border)"}`,
        }}
      >
        <div>
          <div style={{ color: "var(--text)", fontWeight: 600 }}>
            {lockdownOn ? "🔒 Bot TRANCADO" : "🔓 Bot LIBERADO"}
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)", marginTop: 4 }}>
            {lockdownOn
              ? "Só assinantes VIP (e admins) usam o bot. Tarefas de FREE ficam pausadas."
              : "Qualquer usuário pode usar o bot normalmente."}
          </div>
        </div>
        <button
          className={`btn ${lockdownOn ? "" : "primary"}`}
          onClick={() => setConfirm("lockdown")}
          disabled={setter.isPending}
        >
          {lockdownOn ? "🔓 Liberar bot" : "🔒 Trancar bot"}
        </button>
      </div>

      {/* Modo gratuito — precisa de endpoint próprio: switch_bot_mode() congela
          e descongela os planos pagos, somando de volta o tempo em que o bot
          ficou liberado. Gravar a setting direto faria assinante perder dias. */}
      <div
        className="card split-card"
        style={{
          marginBottom: 16, padding: 16, borderRadius: 10,
          border: `1px solid ${freeMode ? "var(--accent)" : "var(--border)"}`,
        }}
      >
        <div>
          <div style={{ color: "var(--text)", fontWeight: 600 }}>
            {freeMode ? "🎁 MODO GRATUITO ativo" : "💎 Modo PAGO"}
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)", marginTop: 4 }}>
            {freeMode
              ? "Todos os usuários funcionam como VIP. Os planos pagos estão congelados — o tempo parado é devolvido ao voltar para o modo pago."
              : "Cada usuário depende do próprio plano."}
          </div>
        </div>
        <button
          className={`btn ${freeMode ? "" : "primary"}`}
          onClick={() => setConfirm("mode")}
          disabled={setBotMode.isPending || botMode.isLoading}
        >
          {freeMode ? "💎 Voltar ao modo pago" : "🎁 Liberar para todos"}
        </button>
      </div>

      <ConfirmDialog
        open={confirm === "lockdown"}
        title={lockdownOn ? "Liberar o bot para todos?" : "Trancar o bot?"}
        body={lockdownOn
          ? "Qualquer usuário volta a usar o bot normalmente."
          : "Só assinantes VIP, trial e admins vão usar o bot. As tarefas de quem é FREE são pausadas."}
        confirmLabel={lockdownOn ? "Liberar" : "Trancar"}
        danger={!lockdownOn}
        loading={setter.isPending}
        onConfirm={async () => { await toggleLockdown(); setConfirm(null); }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "mode"}
        title={freeMode ? "Voltar ao modo pago?" : "Liberar o bot de graça para todos?"}
        body={freeMode
          ? "Cada usuário volta a depender do próprio plano. Os planos ativos ganham de volta o tempo em que o bot ficou grátis."
          : "Todos os usuários passam a funcionar como VIP, e os planos pagos ficam congelados até você voltar ao modo pago."}
        confirmLabel={freeMode ? "Voltar ao modo pago" : "Liberar para todos"}
        danger
        loading={setBotMode.isPending}
        onConfirm={async () => { await toggleBotMode(); setConfirm(null); }}
        onCancel={() => setConfirm(null)}
      />

      <div className="table-wrap">
        <table className="table settings-table">
          <thead>
            <tr>
              <th style={{ width: "30%" }}>KEY</th>
              <th>VALUE</th>
              <th style={{ width: "120px" }}></th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={3}>
                  <div className="table-empty">Sem settings.</div>
                </td>
              </tr>
            )}
            {entries.map(([key, value]) => {
              const v = edited[key] ?? value;
              const dirty = edited[key] !== undefined && edited[key] !== value;
              // texto (não número/flag) ganha caixa de várias linhas: no celular um input de uma linha corta tudo.
              // Decide pelo valor SALVO: pelo digitado, o campo trocava de tipo no 25º caractere e o teclado fechava.
              const isLong = (value?.length ?? 0) > 24 || (value ?? "").includes("\n");
              return (
                <tr key={key}>
                  <td className="settings-key">
                    <span style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>{key}</span>
                  </td>
                  <td>
                    {isLong ? (
                      <textarea
                        className="textarea"
                        style={{ minHeight: 80 }}
                        value={v}
                        onChange={(e) => setEdited({ ...edited, [key]: e.target.value })}
                      />
                    ) : (
                      <input
                        className="input"
                        value={v}
                        onChange={(e) => setEdited({ ...edited, [key]: e.target.value })}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${dirty ? "primary" : ""}`}
                      onClick={() => save(key)}
                      disabled={!dirty || setter.isPending}
                    >
                      <Save size={12} /> SALVAR
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
