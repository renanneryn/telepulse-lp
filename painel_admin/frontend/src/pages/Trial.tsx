import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTable, type Column } from "@/components/DataTable";
import { IdChip } from "@/components/IdChip";
import { fmtDaysRemaining } from "@/lib/format";
import { Save, Gift } from "lucide-react";
import { useSettings, useSetSetting, useUsers, type User } from "@/lib/queries";
import { ErrorBanner } from "@/components/ErrorBanner";
import { TrialLimitsEditor } from "@/components/TrialLimitsEditor";
import { toast } from "@/hooks/useToast";

export function Trial() {
  const q = useSettings();
  const setter = useSetSetting();
  const testers = useUsers({ page: 0, per_page: 1, plan: "trial" });
  const testerList = useUsers({ page: 0, per_page: 25, plan: "trial" });
  const navigate = useNavigate();

  // dias: input controlado, inicializado com o valor do servidor
  const [days, setDays] = useState("");
  useEffect(() => {
    if (q.data?.["trial_days"] !== undefined) setDays(q.data["trial_days"]);
  }, [q.dataUpdatedAt]);

  if (q.isLoading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Trial</h1>
        </div>
        <div className="skeleton" style={{ height: 120 }} />
      </div>
    );
  }

  // M13: nunca renderizar "Trial LIGADO" (default falso-saudável) quando a
  // request falhou.
  if (q.isError) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Trial</h1>
        </div>
        <ErrorBanner
          message={`Falha ao carregar configuração de trial: ${(q.error as Error)?.message || "erro desconhecido"}`}
          onRetry={() => q.refetch()}
        />
      </div>
    );
  }

  // Default "0", igual ao DEFAULTS do backend — com a chave ausente o painel
  // mostrava "LIGADO" sem nada estar ligado.
  const trialOn = (q.data?.["trial_enabled"] ?? "0") === "1";
  const serverDays = q.data?.["trial_days"] ?? "7";
  const daysDirty = days !== "" && days !== serverDays;

  async function toggleTrial() {
    const next = trialOn ? "0" : "1";
    try {
      await setter.mutateAsync({ key: "trial_enabled", value: next });
      toast("ok", next === "1" ? "🎁 Trial LIGADO" : "🚫 Trial DESLIGADO");
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function saveDays() {
    const n = parseInt(days, 10);
    if (!Number.isFinite(n) || n < 1 || n > 90) {
      toast("err", "Informe um número de dias entre 1 e 90.");
      return;
    }
    try {
      await setter.mutateAsync({ key: "trial_days", value: String(n) });
      toast("ok", `Trial definido para ${n} dias`);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Trial</h1>
          <div className="page-sub">
            // trial automático no 1º /start · {testers.data?.total ?? "..."} em trial agora
          </div>
        </div>
      </div>

      {/* Interruptor LIGA/DESLIGA */}
      <div
        className="card split-card"
        style={{
          marginBottom: 16, padding: 16, borderRadius: 10,
          border: `1px solid ${trialOn ? "var(--accent, #b8ff3d)" : "var(--border)"}`,
        }}
      >
        <div>
          <div style={{ color: "var(--text)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <Gift size={16} /> {trialOn ? "Trial LIGADO" : "Trial DESLIGADO"}
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)", marginTop: 4 }}>
            {trialOn
              ? "Usuário novo, no primeiro acesso, ganha Premium grátis pelo período configurado abaixo."
              : "Usuário novo entra como FREE (cai no bloqueio do bot até assinar)."}
          </div>
        </div>
        <button
          className={`btn ${trialOn ? "" : "primary"}`}
          onClick={toggleTrial}
          disabled={setter.isPending}
        >
          {trialOn ? "🚫 Desligar trial" : "🎁 Ligar trial"}
        </button>
      </div>

      {/* Duração em dias */}
      <div
        className="card split-card"
        style={{
          padding: 16, borderRadius: 10, border: "1px solid var(--border)",
        }}
      >
        <div>
          <div style={{ color: "var(--text)", fontWeight: 600 }}>Duração do teste (dias)</div>
          <div style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)", marginTop: 4 }}>
            Quantos dias de Premium o usuário novo recebe. Entre 1 e 90.
          </div>
        </div>
        <div className="row gap-sm trial-days-row" style={{ alignItems: "center" }}>
          <input
            className="input"
            type="number"
            min={1}
            max={90}
            style={{ width: 90 }}
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
          <button
            className={`btn btn-sm ${daysDirty ? "primary" : ""}`}
            onClick={saveDays}
            disabled={!daysDirty || setter.isPending}
          >
            <Save size={12} /> SALVAR
          </button>
        </div>
      </div>

      {/* O que o teste libera e até onde (core/trial_limits.py) */}
      <TrialLimitsEditor />

      {/* Quem está em trial agora — a página falava de trial sem nunca mostrar
          um usuário sequer. */}
      <div className="table-wrap" style={{ marginTop: 18 }}>
        <div className="table-toolbar">
          <span className="label-caps">EM TRIAL AGORA</span>
          <Link to="/testers" className="btn btn-sm" style={{ marginLeft: "auto" }}>
            VER TODOS
          </Link>
        </div>
        <DataTable
          rows={testerList.data?.items ?? []}
          cols={([
            {
              key: "user_id",
              header: "USER",
              render: (u) => <IdChip value={u.user_id} />,
              width: "160px",
            },
            {
              key: "nome",
              header: "USERNAME / NOME",
              render: (u) => u.username ? `@${u.username}` : (u.first_name || "—"),
            },
            {
              key: "expira",
              header: "EXPIRA",
              render: (u) => (
                <span className="num">{fmtDaysRemaining(u.plan_expires)}</span>
              ),
              width: "140px",
            },
          ] as Column<User>[])}
          loading={testerList.isLoading}
          rowKey={(u) => u.user_id}
          onRowClick={(u) => navigate(`/users/${u.user_id}`)}
          empty="Ninguém em trial no momento."
        />
      </div>
    </div>
  );
}
