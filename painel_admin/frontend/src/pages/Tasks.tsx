import { useState } from "react";
import { usePref } from "@/hooks/usePref";
import { useNavigate } from "react-router-dom";
import { Play, Square, XCircle, AlertTriangle } from "lucide-react";
import {
  useCancelClone,
  useClones,
  useEncTasks,
  useForwards,
  useOfertas,
  useStartForward,
  useStopForward,
  type CloneTask,
  type ForwardTask,
} from "@/lib/queries";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusTag } from "@/components/Tag";
import { PulseDot } from "@/components/PulseDot";
import { IdChip } from "@/components/IdChip";
import { CloneErrorsModal } from "@/components/CloneErrorsModal";
import { fmtDate, fmtNum } from "@/lib/format";
import { toast } from "@/hooks/useToast";

/** Rotulo do dono: @username, senao o nome, senao o id cru. */
function userLabel(r: { username?: unknown; first_name?: unknown; user_id?: unknown }): string {
  const un = typeof r.username === "string" ? r.username.trim() : "";
  if (un) return `@${un}`;
  const fn = typeof r.first_name === "string" ? r.first_name.trim() : "";
  if (fn) return fn;
  return String(r.user_id ?? "—");
}

/** Coluna USER clicavel — leva pra ficha completa da conta. */
function userColumn<T extends Record<string, unknown>>(
  navigate: (to: string) => void,
): Column<T> {
  return {
    key: "user",
    primary: true,
    header: "USER",
    width: "220px",
    render: (r) => {
      const uid = Number(r.user_id);
      if (!uid) return <span style={{ color: "var(--text-dimmer)" }}>—</span>;
      return (
        <button
          className="link-btn"
          title={`Abrir ${uid}`}
          onClick={(e) => { e.stopPropagation(); navigate(`/users/${uid}`); }}
        >
          {userLabel(r as never)}
        </button>
      );
    },
  };
}

/** Ativas primeiro; dentro de cada grupo mantem a ordem que veio do backend. */
function sortActiveFirst<T>(rows: T[], isActive: (r: T) => boolean, on: boolean): T[] {
  if (!on) return rows;
  return [...rows].sort((a, b) => Number(isActive(b)) - Number(isActive(a)));
}

type Tab = "forwards" | "enc" | "ofertas" | "clones";

const TAB_LABELS: Record<Tab, string> = {
  forwards: "Mirror",
  enc: "Agendar Posts",
  ofertas: "Ofertas Rotativas",
  clones: "Clone",
};

export function Tasks() {
  const [tab, setTab] = usePref<Tab>("tasks.tab", "enc");
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tarefas</h1>
          <div className="page-sub">// monitor de execução · auto-refresh ativo</div>
        </div>
      </div>

      <div className="tabs">
        {(["enc", "forwards", "ofertas", "clones"] as Tab[]).map((t) => (
          <div
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </div>
        ))}
      </div>

      {tab === "enc" && <EncPanel />}
      {tab === "forwards" && <ForwardsPanel />}
      {tab === "ofertas" && <OfertasPanel />}
      {tab === "clones" && <ClonesPanel />}
    </div>
  );
}

function ClonesPanel() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const q = useClones({ status: status || undefined, limit: 200 });
  const cancel = useCancelClone();
  const [errorsFor, setErrorsFor] = useState<number | null>(null);

  const cols: Column<CloneTask>[] = [
    { key: "id", hideOnMobile: true, header: "ID", render: (r) => <span className="num td-id">#{r.id}</span>, width: "80px" },
    userColumn<Record<string, unknown>>(navigate),
    { key: "label", header: "ORIGEM → DESTINO", render: (r) => String(r.label || [r.source_name, r.target_name].filter(Boolean).join(" → ") || "—") },
    { key: "progress", header: "PROGRESSO", render: (r) => {
        const ok = (r.progress_ok as number) || 0;
        const fail = (r.progress_fail as number) || 0;
        const skip = (r.progress_skip as number) || 0;
        const total = (r.progress_total as number) || (r.total as number) || 0;
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
    { key: "created", hideOnMobile: true, header: "CRIADO", render: (r) => <span className="num">{fmtDate(r.created_at)}</span>, width: "150px" },
    { key: "actions", actions: true, header: "", render: (r) => (
        <div className="row gap-sm">
          {(r.progress_fail as number) > 0 && (
            <button className="btn btn-sm icon-only" onClick={() => setErrorsFor(r.id)} title="ver erros">
              <AlertTriangle size={12} />
            </button>
          )}
          {(r.status === "running" || r.status === "pending") && (
            <button
              className="btn btn-sm icon-only danger"
              onClick={async () => {
                try {
                  await cancel.mutateAsync(r.id);
                  toast("ok", `Clone #${r.id} cancelado`);
                } catch (e) {
                  toast("err", (e as Error).message);
                }
              }}
              title="cancelar"
            >
              <XCircle size={12} />
            </button>
          )}
        </div>
      ), width: "100px" },
  ];

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">STATUS · ALL</option>
          <option value="pending">PENDING</option>
          <option value="running">RUNNING</option>
          <option value="done">DONE</option>
          <option value="error">ERROR</option>
          <option value="cancelled">CANCELLED</option>
          <option value="paused">PAUSED</option>
        </select>
      </div>
      <DataTable rows={q.data ?? []} cols={cols} loading={q.isLoading} rowKey={(r) => r.id} empty="Nenhum clone." />
      {errorsFor && <CloneErrorsModal taskId={errorsFor} onClose={() => setErrorsFor(null)} />}
    </div>
  );
}

function ForwardsPanel() {
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const q = useForwards({ active: active === "" ? undefined : Number(active) });
  const start = useStartForward();
  const stop = useStopForward();

  const cols: Column<ForwardTask>[] = [
    { key: "id", hideOnMobile: true, header: "ID", render: (r) => <span className="num td-id">#{r.id}</span>, width: "80px" },
    userColumn<Record<string, unknown>>(navigate),
    { key: "label", header: "LABEL", render: (r) => r.label },
    { key: "io", header: "I/O", render: (r) => (
        <span style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)" }} className="num">
          {(r.sources ?? []).length} → {(r.targets ?? []).length}
        </span>
      ) },
    { key: "delay", header: "DELAY", render: (r) => <span className="num">{r.delay}s</span>, width: "90px" },
    { key: "active", header: "STATUS", render: (r) => (
        <div className="row gap-sm">
          <PulseDot on={!!r.active} />
          <span style={{ color: r.active ? "var(--text)" : "var(--text-dimmer)" }}>
            {r.active ? "ATIVO" : "PARADO"}
          </span>
        </div>
      ), width: "130px" },
    { key: "actions", actions: true, header: "", render: (r) => (
        <div className="row gap-sm">
          {r.active ? (
            <button
              className="btn btn-sm icon-only"
              onClick={async () => {
                try {
                  await stop.mutateAsync(r.id);
                  toast("ok", `Forward #${r.id} parado`);
                } catch (e) {
                  toast("err", (e as Error).message);
                }
              }}
              title="parar"
            >
              <Square size={12} />
            </button>
          ) : (
            <button
              className="btn btn-sm icon-only"
              onClick={async () => {
                try {
                  const res = (await start.mutateAsync(r.id)) as { ok?: boolean } | undefined;
                  if (res && res.ok === false) {
                    toast("err", `Forward #${r.id} não iniciou — conta desconectada ou já rodando`);
                  } else {
                    toast("ok", `Forward #${r.id} iniciado`);
                  }
                } catch (e) {
                  toast("err", (e as Error).message);
                }
              }}
              title="iniciar"
            >
              <Play size={12} />
            </button>
          )}
        </div>
      ), width: "80px" },
  ];

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <select className="select" value={active} onChange={(e) => setActive(e.target.value)}>
          <option value="">STATUS · ALL</option>
          <option value="1">ATIVOS</option>
          <option value="0">PARADOS</option>
        </select>
      </div>
      <DataTable rows={q.data ?? []} cols={cols} loading={q.isLoading} rowKey={(r) => r.id} empty="Nenhum forward." />
    </div>
  );
}

function EncPanel() {
  const navigate = useNavigate();
  const q = useEncTasks({});
  const [activeFirst, setActiveFirst] = usePref("tasks.enc.activeFirst", true);
  const cols: Column<Record<string, unknown>>[] = [
    { key: "id", hideOnMobile: true, header: "ID", render: (r) => <span className="num td-id">#{String(r.id)}</span>, width: "80px" },
    userColumn<Record<string, unknown>>(navigate),
    { key: "label", header: "LABEL", render: (r) => String(r.name ?? "—") },
    { key: "active", header: "ATIVO", render: (r) => <PulseDot on={r.status === "active"} /> },
  ];
  const rows = sortActiveFirst(q.data ?? [], (r) => r.status === "active", activeFirst);
  return (
    <>
      <div className="table-toolbar">
        <select
          className="select"
          value={activeFirst ? "ativas" : "recentes"}
          onChange={(e) => setActiveFirst(e.target.value === "ativas")}
        >
          <option value="ativas">ATIVAS PRIMEIRO</option>
          <option value="recentes">MAIS RECENTES</option>
        </select>
      </div>
      <DataTable
        rows={rows}
        cols={cols}
        loading={q.isLoading}
        rowKey={(r) => Number(r.id)}
        empty="Nenhuma encartada."
      />
    </>
  );
}

function OfertasPanel() {
  const navigate = useNavigate();
  const q = useOfertas({});
  const [activeFirst, setActiveFirst] = usePref("tasks.ofertas.activeFirst", true);
  const cols: Column<Record<string, unknown>>[] = [
    { key: "id", hideOnMobile: true, header: "ID", render: (r) => <span className="num td-id">#{String(r.id)}</span>, width: "80px" },
    userColumn<Record<string, unknown>>(navigate),
    { key: "label", header: "LABEL", render: (r) => String(r.name ?? "—") },
    { key: "active", header: "ATIVO", render: (r) => <PulseDot on={!!r.ativo} /> },
  ];
  const rows = sortActiveFirst(q.data ?? [], (r) => !!r.ativo, activeFirst);
  return (
    <>
      <div className="table-toolbar">
        <select
          className="select"
          value={activeFirst ? "ativas" : "recentes"}
          onChange={(e) => setActiveFirst(e.target.value === "ativas")}
        >
          <option value="ativas">ATIVAS PRIMEIRO</option>
          <option value="recentes">MAIS RECENTES</option>
        </select>
      </div>
      <DataTable
        rows={rows}
        cols={cols}
        loading={q.isLoading}
        rowKey={(r) => Number(r.id)}
        empty="Nenhuma oferta."
      />
    </>
  );
}
