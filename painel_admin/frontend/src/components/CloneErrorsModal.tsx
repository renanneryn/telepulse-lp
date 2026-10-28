import { X } from "lucide-react";
import { useCloneErrors } from "@/lib/queries";
import { fmtDate } from "@/lib/format";

/**
 * Modal de erros de mensagem de um clone. Extraído de Tasks.tsx (ErrorsModal)
 * para ser compartilhado entre Tasks.tsx e UserDetail.tsx.
 */
export function CloneErrorsModal({ taskId, onClose }: { taskId: number; onClose: () => void }) {
  const errs = useCloneErrors(taskId);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="between mb-md">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fz-lg)" }}>
            Erros · clone #{taskId}
          </h3>
          <button className="btn btn-sm icon-only" onClick={onClose}>
            <X size={12} />
          </button>
        </div>
        <div style={{ maxHeight: 360, overflowY: "auto", fontSize: "var(--fz-xs)" }}>
          {errs.isLoading && <div className="skeleton" style={{ height: 18, margin: "4px 0" }} />}
          {errs.data && errs.data.length === 0 && (
            <div className="label-caps" style={{ padding: 20, textAlign: "center" }}>
              — sem erros registrados —
            </div>
          )}
          {(errs.data ?? []).map((e, i) => (
            <div
              key={`${e.task_id}-${e.msg_id}-${i}`}
              className="between"
              style={{
                padding: "8px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span className="num td-id">msg #{e.msg_id}</span>
              <span className="num" style={{ color: "var(--text-dim)" }}>
                {fmtDate(e.created_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
