import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePayments, usePaymentsSummary, type Payment } from "@/lib/queries";
import { DataTable, type Column } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { StatusTag } from "@/components/Tag";
import { IdChip } from "@/components/IdChip";
import { Pagination } from "@/components/Pagination";
import { fmtReais, fmtDate } from "@/lib/format";

const PER_PAGE = 50;

// plan_key do banco -> o que o cliente comprou (engines/payment.py: get_plans)
const PLAN_LABELS: Record<string, string> = { semanal: "15 dias", mensal: "30 dias" };
function planLabel(key?: string): string {
  if (!key) return "—";
  return PLAN_LABELS[key] ?? key;
}

/** Quanto tempo o cliente levou entre gerar o PIX e pagar. */
function timeToPay(created?: number, paid?: number): string {
  if (!created || !paid || paid < created) return "—";
  const s = paid - created;
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  if (s < 86400) return `${Math.round(s / 3600)} h`;
  return `${Math.round(s / 86400)} d`;
}

export function Payments() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const summary = usePaymentsSummary();
  const q = usePayments({ status: status || undefined, page, per_page: PER_PAGE });

  const cols: Column<Payment>[] = [
    {
      key: "user",
      primary: true,
      header: "USER",
      render: (p) => (
        <div className="flex-col" style={{ gap: 6 }}>
          {(p.first_name || p.username) && (
            <span style={{ color: "var(--text)" }}>
              {p.first_name || ""}
              {p.username ? <span style={{ color: "var(--text-dim)" }}> @{p.username}</span> : null}
            </span>
          )}
          <div className="row gap-sm">
            <IdChip value={p.user_id} />
            <button
              className="btn btn-sm"
              onClick={(e) => { e.stopPropagation(); navigate(`/users/${p.user_id}`); }}
            >
              ABRIR
            </button>
          </div>
        </div>
      ),
    },
    { key: "id", header: "ID", render: (p) => <span className="num td-id">#{p.id}</span>, width: "70px" },
    { key: "status", header: "STATUS", render: (p) => <StatusTag status={p.status} /> },
    { key: "amount", header: "VALOR", render: (p) => <span className="num">{fmtReais(p.amount)}</span>, numeric: true },
    { key: "plan", header: "PLANO", render: (p) => <span>{planLabel(p.plan_key)}</span> },
    {
      key: "created",
      header: "CRIADO",
      render: (p) => <span className="num">{fmtDate(p.created_at)}</span>,
      width: "140px",
    },
    {
      key: "paid",
      header: "PAGO",
      render: (p) => <span className="num">{p.paid_at ? fmtDate(p.paid_at) : "—"}</span>,
      width: "140px",
    },
    {
      key: "took",
      header: "TEMPO P/ PAGAR",
      render: (p) => <span className="num">{timeToPay(p.created_at, p.paid_at)}</span>,
    },
    {
      key: "identifier",
      wide: true,
      header: "ID SYNCPAY",
      render: (p) =>
        p.identifier ? <IdChip value={p.identifier} /> : <span style={{ color: "var(--text-dimmer)" }}>—</span>,
    },
  ];

  const sum = summary.data;
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pagamentos</h1>
          <div className="page-sub">// SyncPay · status sincronizado a cada 30s</div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="PAGOS"
          value={sum ? fmtReais(sum.paid?.total ?? 0) : "—"}
          hint={sum ? `${sum.paid?.count ?? 0} pagamentos` : "..."}
          raw
        />
        <StatCard
          label="PENDENTES"
          value={sum ? fmtReais(sum.pending?.total ?? 0) : "—"}
          hint={sum ? `${sum.pending?.count ?? 0} aguardando` : "..."}
          raw
        />
        <StatCard
          label="EXPIRADOS"
          value={sum ? fmtReais(sum.expired?.total ?? 0) : "—"}
          hint={sum ? `${sum.expired?.count ?? 0} expirados` : "..."}
          raw
        />
        <StatCard
          label="CANCELADOS"
          value={sum ? fmtReais(sum.cancelled?.total ?? 0) : "—"}
          hint={sum ? `${sum.cancelled?.count ?? 0} cancelados` : "..."}
          raw
        />
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <select
            className="select"
            value={status}
            onChange={(e) => { setPage(0); setStatus(e.target.value); }}
          >
            <option value="">STATUS · ALL</option>
            <option value="pending">PENDING</option>
            <option value="paid">PAID</option>
            <option value="expired">EXPIRED</option>
            <option value="cancelled">CANCELLED</option>
          </select>
        </div>
        <DataTable
          rows={q.data?.items ?? []}
          cols={cols}
          loading={q.isLoading}
          rowKey={(p) => p.id}
          cardFieldColumns={2}
          empty="Nenhum pagamento."
        />
        <Pagination page={page} perPage={PER_PAGE} total={q.data?.total ?? 0} onPage={setPage} />
      </div>
    </div>
  );
}
