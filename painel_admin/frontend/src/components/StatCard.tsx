import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { fmtNum } from "@/lib/format";

interface Props {
  label: string;
  value: number | string;
  delta?: ReactNode;
  hint?: ReactNode;
  raw?: boolean;
  /** Se presente, o card inteiro vira link pra essa rota. */
  to?: string;
}

export function StatCard({ label, value, delta, hint, raw, to }: Props) {
  const display = typeof value === "number" && !raw ? fmtNum(value) : String(value);
  const inner = (
    <>
      <div className="stat-label">{label}</div>
      <div className={String(display).length > 8 ? "stat-value long" : "stat-value"}>{display}</div>
      {(delta || hint) && (
        <div className="stat-meta">
          {delta}
          {delta && hint ? "  ·  " : ""}
          {hint}
        </div>
      )}
    </>
  );

  // Sem `to` renderiza igual a antes — as chamadas existentes não mudam.
  if (!to) return <div className="stat">{inner}</div>;

  // <Link> em vez de <div onClick>: vira <a href> de verdade, então ganha
  // ordem de tab, Enter e ctrl+click sem handler de teclado na mão.
  return (
    <Link to={to} className="stat stat-link">
      {inner}
    </Link>
  );
}
