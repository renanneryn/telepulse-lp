import { Link } from "react-router-dom";
import { useFunnel } from "@/lib/queries";
import { StatCard } from "@/components/StatCard";
import { ErrorBanner } from "@/components/ErrorBanner";
import { fmtNum } from "@/lib/format";

/** Uma etapa do funil: barra proporcional ao topo + link pra lista filtrada. */
function Step({
  label, value, total, prev, to, tone,
}: {
  label: string;
  value: number;
  total: number;
  prev?: number;
  to: string;
  tone?: string;
}) {
  const pctTotal = total ? (value / total) * 100 : 0;
  // % da etapa anterior — e aqui que mora o insight (ex.: 12,5% de ativação)
  const pctPrev = prev && prev > 0 ? (value / prev) * 100 : null;
  return (
    <Link to={to} className="plan-row" style={{ display: "block", marginBottom: 14 }}>
      <div
        className="between"
        style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fz-xs)" }}
      >
        <span className="label-caps">{label}</span>
        <span style={{ color: "var(--text-dim)" }}>
          <span className="num" style={{ color: tone || "var(--text)" }}>
            {fmtNum(value)}
          </span>
          {"  ·  "}
          {pctTotal.toFixed(1)}% do total
          {pctPrev !== null && (
            <>
              {"  ·  "}
              <span style={{ color: "var(--accent)" }}>
                {pctPrev.toFixed(1)}% da etapa anterior
              </span>
            </>
          )}
        </span>
      </div>
      <div className="progress" style={{ marginTop: 5 }}>
        <div
          className="progress-bar"
          style={{ width: `${pctTotal}%`, background: tone || undefined }}
        />
      </div>
    </Link>
  );
}

export function Funnel() {
  const q = useFunnel();
  const f = q.data;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Funil de aquisição</h1>
          <div className="page-sub">
            Do /start ao plano pago — clique em qualquer etapa para ver quem é.
          </div>
        </div>
      </div>

      {q.isError && (
        <ErrorBanner
          message={`Falha ao carregar o funil: ${(q.error as Error)?.message || "erro desconhecido"}`}
          onRetry={() => q.refetch()}
        />
      )}

      {q.isLoading && <div className="skeleton" style={{ height: 220 }} />}

      {f && (
        <>
          <div className="panel" style={{ marginBottom: 18 }}>
            <div className="panel-head">
              <div className="panel-title">JORNADA</div>
            </div>
            <div style={{ padding: "16px 18px 6px" }}>
              <Step
                label="DERAM /START"
                value={f.started}
                total={f.started}
                to="/users?connected="
              />
              <Step
                label="CONECTARAM A CONTA"
                value={f.connected}
                total={f.started}
                prev={f.started}
                to="/users?connected=1"
              />
              <Step
                label="EM TRIAL"
                value={f.trial_active}
                total={f.started}
                prev={f.connected}
                to="/testers"
              />
              <Step
                label="PAGANTES"
                value={f.vip_active}
                total={f.started}
                prev={f.connected}
                to="/vips"
              />
            </div>
          </div>

          {/* Maior publico de reativacao e ate agora invisivel no painel. */}
          <div className="stats-grid" style={{ marginBottom: 18 }}>
            <StatCard
              label="NUNCA CONECTARAM"
              value={f.never_connected}
              to="/users?connected=0"
              hint={
                f.started
                  ? `${((f.never_connected / f.started) * 100).toFixed(1)}% de quem deu /start`
                  : "—"
              }
            />
            <StatCard
              label="CONECTADOS SEM PLANO"
              value={Math.max(0, f.connected - f.connected_vip - f.connected_trial)}
              to="/users?connected=1&plan=free"
              hint="usaram, mas não pagam"
            />
            <StatCard label="BANIDOS" value={f.banned} to="/users?banned=1" hint="bloqueados" />
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">SAÚDE DO TRIAL</div>
            </div>
            <div className="stats-grid">
              <StatCard
                label="JÁ TIVERAM TRIAL"
                value={f.ever_trial}
                to="/users?plan=trial"
                hint="histórico completo"
              />
              <StatCard label="TRIAL EXPIRADO" value={f.trial_expired} hint="não renovaram" />
              <StatCard
                label="LINHAS VIP VENCIDAS"
                value={f.stale_vip_rows}
                hint={
                  f.stale_vip_rows > 0 ? "pendentes de varredura" : "banco limpo"
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
