import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useStats, useTimeseries, usePlanDist, useTopRefs, usePaymentsSummary } from "@/lib/queries";
import { StatCard } from "@/components/StatCard";
import { ErrorBanner } from "@/components/ErrorBanner";
import { fmtNum, fmtReais } from "@/lib/format";
import { PulseDot } from "@/components/PulseDot";

const METRICS: Array<{ key: "signups" | "clones" | "payments"; label: string }> = [
  { key: "signups", label: "SIGNUPS" },
  { key: "clones", label: "CLONES" },
  { key: "payments", label: "PAGAMENTOS" },
];

export function Dashboard() {
  const stats = useStats();
  const [metric, setMetric] = useState<"signups" | "clones" | "payments">("signups");
  const [days, setDays] = useState(30);
  const ts = useTimeseries(metric, days);
  const planDist = usePlanDist();
  const topRefs = useTopRefs(8);
  const paySummary = usePaymentsSummary();

  const s = stats.data;
  const pay = paySummary.data;
  const tsData = (ts.data?.buckets ?? []).map((v, i) => {
    const d = new Date((ts.data!.start + i * 86400) * 1000);
    return {
      day: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: v,
    };
  });

  // M13: nunca renderizar zero como se fosse um valor real quando a request
  // falhou — mostra "—" em vez de um card "saudável" com dado falso.
  function statVal(v: number | undefined): number | string {
    if (stats.isError) return "—";
    return v ?? 0;
  }
  // taxa de ativação: de quem deu /start, quantos chegaram a conectar
  const pctConn = s && s.total_users
    ? ((s.connected_users / s.total_users) * 100).toFixed(1)
    : "0";
  function payVal(v: number | undefined): number | string {
    if (paySummary.isError) return "—";
    if (paySummary.isLoading) return "...";
    return v ?? 0;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operational overview</h1>
          <div className="page-sub">// telemetria do TelePulse em tempo real</div>
        </div>
        <div className="row gap-sm" style={{ alignItems: "center" }}>
          <div className="label-caps">
            <PulseDot on={true} /> &nbsp; LIVE · refresh @ 15s
          </div>
          <a
            href="/admin/api/stats/download-db"
            download="bot_data.db"
            className="btn btn-sm"
            style={{ textDecoration: "none" }}
          >
            💾 Backup DB
          </a>
        </div>
      </div>

      {stats.isError && (
        <ErrorBanner
          message={`Falha ao carregar estatísticas: ${(stats.error as Error)?.message || "erro desconhecido"}`}
          onRetry={() => stats.refetch()}
        />
      )}

      <div className="stats-grid">
        <StatCard
          label="USUÁRIOS"
          value={statVal(s?.total_users)}
          raw={stats.isError}
          to="/users?connected="
          hint={s ? `${fmtNum(s.connected_users)} conectados · ${pctConn}% ativação` : "..."}
        />
        <StatCard
          label="CONECTADOS ATIVOS"
          value={statVal(s?.connected_with_tasks)}
          raw={stats.isError}
          to="/users?connected=1"
          hint={s ? `ver os ${fmtNum(s.connected_users)} conectados` : "..."}
        />
        <StatCard
          label="TAREFAS ATIVAS"
          value={statVal(s?.total_active_tasks)}
          raw={stats.isError}
          to="/tasks"
          hint={s ? `${fmtNum(s.active_forwards)} esp · ${fmtNum(s.total_forwards)} config` : "..."}
        />
        <StatCard
          label="MSGS HOJE"
          value={statVal(s?.msgs_today)}
          raw={stats.isError}
          hint={s ? `${fmtNum(s.msgs_week)} na semana` : "..."}
        />
      </div>

      <div className="stats-grid">
        <StatCard
          label="RECEITA TOTAL"
          value={paySummary.isError ? "—" : paySummary.isLoading ? "..." : fmtReais(pay?.paid?.total ?? 0)}
          raw
          to="/payments"
          hint={`${fmtNum(pay?.paid?.count ?? 0)} pagamentos pagos`}
        />
        <StatCard
          label="PENDENTES"
          value={payVal(pay?.pending?.count)}
          raw={paySummary.isError}
          to="/payments"
          hint="aguardando pagamento"
        />
        <StatCard
          label="VIP ATIVOS"
          value={statVal(s?.vip_active)}
          raw={stats.isError}
          to="/vips"
          hint={s ? `de ${fmtNum(s.total_users)} usuários` : "..."}
        />
        <StatCard
          label="TRIAL ATIVOS"
          value={statVal(s?.trial_active)}
          raw={stats.isError}
          to="/testers"
          hint={s ? `de ${fmtNum(s.total_users)} usuários` : "..."}
        />
        <StatCard
          label="EXPIRANDO 7D"
          value={statVal(s?.vip_expiring_7d)}
          raw={stats.isError}
          to="/users?expiring=7"
          hint="ver quem expira"
        />
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">SÉRIE TEMPORAL · {metric.toUpperCase()}</div>
            <div className="row gap-sm">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  className={`btn btn-sm ${metric === m.key ? "primary" : ""}`}
                  onClick={() => setMetric(m.key)}
                >
                  {m.label}
                </button>
              ))}
              <select
                className="select"
                style={{ width: 92, fontSize: "var(--fz-2xs)" }}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                <option value={7}>7D</option>
                <option value={30}>30D</option>
                <option value={90}>90D</option>
              </select>
            </div>
          </div>

          {ts.isError ? (
            <ErrorBanner
              message={`Falha ao carregar série temporal: ${(ts.error as Error)?.message || "erro desconhecido"}`}
              onRetry={() => ts.refetch()}
            />
          ) : (
            <div style={{ height: 280, marginLeft: -8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tsData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="acid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#b8ff3d" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#b8ff3d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#5a5a62", fontSize: 10, fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#5a5a62", fontSize: 10, fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                    width={32}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#17171c",
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontFamily: "JetBrains Mono",
                      fontSize: 11,
                      letterSpacing: "0.05em",
                    }}
                    cursor={{ stroke: "#b8ff3d", strokeWidth: 1, strokeDasharray: "2 3" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#b8ff3d"
                    strokeWidth={1.6}
                    fill="url(#acid)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="flex-col">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">DISTRIBUIÇÃO DE PLANOS</div>
            </div>
            {planDist.data ? (
              <div className="flex-col gap-sm">
                {Object.entries(planDist.data).map(([plan, count]) => {
                  const total = Object.values(planDist.data || {}).reduce(
                    (a, b) => a + b,
                    0,
                  ) || 1;
                  const pct = ((count / total) * 100).toFixed(1);
                  // free/trial/vip sao exatamente os valores aceitos pelo
                  // filtro `plan` de /api/users, entao da pra linkar direto.
                  const href = `/users?plan=${plan}`;
                  return (
                    <Link key={plan} to={href} className="plan-row">
                      <div className="between" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fz-xs)" }}>
                        <span className="label-caps">{plan}</span>
                        <span style={{ color: "var(--text-dim)" }}>
                          <span className="num" style={{ color: "var(--text)" }}>{fmtNum(count)}</span> · {pct}%
                        </span>
                      </div>
                      <div className="progress" style={{ marginTop: 4 }}>
                        <div className="progress-bar" style={{ width: `${pct}%` }} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="skeleton" />
            )}
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">TOP REFS</div>
            </div>
            {topRefs.data && topRefs.data.length > 0 ? (
              <div className="flex-col" style={{ gap: 8 }}>
                {topRefs.data.map((r) => (
                  <div
                    key={r.source}
                    className="between"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fz-xs)" }}
                  >
                    <span style={{ color: "var(--text)" }}>{r.source}</span>
                    <span className="num" style={{ color: "var(--text-dim)" }}>
                      {fmtNum(r.click_count)} clk · {fmtNum(r.unique_users)} uniq
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="label-caps" style={{ padding: 20, textAlign: "center" }}>
                — sem dados —
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
