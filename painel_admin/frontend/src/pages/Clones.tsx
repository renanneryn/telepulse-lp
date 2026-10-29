import { useNavigate } from "react-router-dom";
import { useActiveClones, type ActiveCloneItem } from "@/lib/queries";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusTag } from "@/components/Tag";
import { IdChip } from "@/components/IdChip";
import { StatCard } from "@/components/StatCard";
import { fmtNum } from "@/lib/format";

/** Clones rodando/na fila agora (estado em memória do bot). Fica dentro de
 *  TAREFAS › CLONE, acima do histórico. */
export function LiveClones() {
  const navigate = useNavigate();
  const q = useActiveClones();
  const summary = q.data?.summary;

  const cols: Column<ActiveCloneItem>[] = [
    { key: "id", hideOnMobile: true, header: "ID", render: (r) => <span className="num td-id">#{r.id}</span>, width: "80px" },
    { key: "user", primary: true, header: "USER", render: (r) => (
        <div className="row gap-sm">
          <IdChip value={r.user_id} />
          <button
            className="btn btn-sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/users/${r.user_id}`); }}
          >
            ABRIR
          </button>
        </div>
      ), width: "200px" },
    { key: "route", header: "ORIGEM → DESTINO", render: (r) => {
        const src = r.source_name || String(r.source_id ?? "—");
        const dst = r.target_name || String(r.target_id ?? "—");
        return <span>{src} → {dst}</span>;
      } },
    { key: "progress", header: "PROGRESSO", render: (r) => {
        const ok = r.progress_ok || 0;
        const fail = r.progress_fail || 0;
        const skip = r.progress_skip || 0;
        const total = r.progress_total || 0;
        const pct = total ? ((ok + fail + skip) / total) * 100 : 0;
        return (
          <div style={{ minWidth: 160 }}>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${pct.toFixed(1)}%` }} />
            </div>
            <div style={{ marginTop: 4, fontSize: "var(--fz-2xs)", color: "var(--text-dim)" }} className="num">
              {fmtNum(ok)} ok · {fmtNum(fail)} fail · {fmtNum(skip)} skip / {fmtNum(total)}
            </div>
          </div>
        );
      } },
    { key: "status", header: "STATUS", render: (r) => <StatusTag status={r.status} />, width: "120px" },
    { key: "fila", hideOnMobile: true, header: "FILA", render: (r) => (
        <span className="num">{r.running ? "rodando" : `#${r.queue_position} na fila`}</span>
      ), width: "120px" },
  ];

  return (
    <div>
      <div className="label-caps" style={{ margin: "0 0 8px", color: "var(--text-dim)" }}>AO VIVO</div>
      <div className="stats-grid stats-grid-3" style={{ marginBottom: 12 }}>
        <StatCard label="RODANDO" value={summary?.running ?? 0} hint={summary ? `de ${summary.max_concurrent} (teto)` : undefined} />
        <StatCard label="AGUARDANDO" value={summary?.waiting ?? 0} hint="na fila" />
        <StatCard label="TETO GLOBAL" value={summary?.max_concurrent ?? 0} hint="clones ao mesmo tempo" />
      </div>

      <DataTable
        rows={q.data?.items ?? []}
        cols={cols}
        loading={q.isLoading}
        rowKey={(r) => r.id}
        empty="Nenhum clone rodando ou na fila agora."
      />
    </div>
  );
}
