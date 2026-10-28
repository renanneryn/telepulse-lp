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

export function Payments() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const summary = usePaymentsSummary();
  const q = usePayments({ status: status || undefined, page, per_page: PER_PAGE });

  const cols: Column<Payment>[] = [
    { key: "id", header: "ID", render: (p) => <span className="num td-id">#{p.id}</span>, width: "80px" },
    {
      key: "user",
      primary: true,
      header: "USER",
      render: (p) => (
        <div className="row gap-sm">
          <IdChip value={p.user_id} />
          <button
            className="btn btn-sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/users/${p.user_id}`); }}
          >
            ABRIR
          </button>
        </div>
      ),
    },
    { key: "amount", header: "VALOR", render: (p) => <span className="num">{fmtReais(p.amount)}</span>, numeric: true },
    { key: "status", header: "STATUS", render: (p) => <StatusTag status={p.status} /> },
    {
      key: "created",
      hideOnMobile: true,
      header: "CRIADO",
      render: (p) => <span className="num">{fmtDate(p.created_at)}</span>,
      width: "150px",
    },
    {
      key: "paid",
      hideOnMobile: true,
      header: "PAGO",
      render: (p) => <span className="num">{p.paid_at ? fmtDate(p.paid_at) : "—"}</span>,
      width: "150px",
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
          empty="Nenhum pagamento."
        />
        <Pagination page={page} perPage={PER_PAGE} total={q.data?.total ?? 0} onPage={setPage} />
      </div>
    </div>
  );
}
