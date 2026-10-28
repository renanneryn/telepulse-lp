import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Banner de erro visível — usar sempre que uma query falhar, para nunca
 * renderizar um estado padrão/vazio como se fosse saudável (M13/M14).
 */
export function ErrorBanner({
  message = "Falha ao carregar dados.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="panel"
      style={{
        borderColor: "var(--danger)",
        background: "var(--danger-soft)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
      }}
    >
      <AlertTriangle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: "var(--fz-sm)", color: "var(--text)" }}>{message}</div>
      {onRetry && (
        <button className="btn btn-sm" onClick={onRetry}>
          <RefreshCw size={12} /> TENTAR DE NOVO
        </button>
      )}
    </div>
  );
}
