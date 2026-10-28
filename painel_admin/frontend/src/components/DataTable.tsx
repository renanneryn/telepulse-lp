import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  numeric?: boolean;
  width?: string;
  /** Chave de ordenacao. Presente = cabecalho vira botao com setinha. */
  sortKey?: string;
  /** Titulo do cartao no modo celular. Uma coluna por tabela deveria marcar. */
  primary?: boolean;
  /** Nao entra no cartao do celular (dado secundario, vive no detalhe). */
  hideOnMobile?: boolean;
  /** Bloco de acoes: vai por ultimo no cartao, em largura total. */
  actions?: boolean;
  /** Com cardFieldColumns=2: o campo ocupa a linha inteira do cartao. */
  wide?: boolean;
}

interface Props<T> {
  rows: T[];
  cols: Column<T>[];
  empty?: string;
  loading?: boolean;
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  /** Coluna ordenada agora, e em que sentido. */
  sortBy?: string;
  sortDir?: "asc" | "desc";
  /** Clique num cabecalho ordenavel. */
  onSort?: (sortKey: string, dir: "asc" | "desc") => void;
  /** Cartoes por linha no celular (1 = padrao). Com 2+ o cartao fica compacto
   *  (rotulo em cima do valor); com 3 as acoes saem e ficam no detalhe. */
  cardColumns?: number;
  /** Campos do cartao em 2 colunas (rotulo em cima do valor) — mais dado por tela. */
  cardFieldColumns?: 1 | 2;
}

export function DataTable<T>({
  rows, cols, empty, loading, rowKey, onRowClick, sortBy, sortDir, onSort, cardColumns = 1, cardFieldColumns = 1,
}: Props<T>) {
  const isMobile = useIsMobile();

  // No celular a tabela deixa de ser tabela: 11 colunas nao cabem em 390px, e
  // rolar de lado pra achar o botao de acao e um pessimo gesto primario.
  // Cada linha vira um cartao com titulo, pares rotulo/valor e as acoes embaixo.
  if (isMobile) {
    const visible = cols.filter((c) => !c.hideOnMobile);
    const title = visible.find((c) => c.primary) ?? visible[0];
    const actions = cardColumns >= 3 ? [] : visible.filter((c) => c.actions);
    const listClass = cardColumns > 1 ? "card-list grid" : "card-list";
    const listStyle = cardColumns > 1 ? { gridTemplateColumns: `repeat(${cardColumns}, minmax(0, 1fr))` } : undefined;
    const fields = visible.filter((c) => c !== title && !c.actions);

    if (loading && rows.length === 0) {
      return (
        <div className={listClass} style={listStyle}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: 92 }} />
          ))}
        </div>
      );
    }
    if (rows.length === 0) {
      return <div className="table-empty">{empty || "— sem registros —"}</div>;
    }
    return (
      <div className={listClass} style={listStyle}>
        {rows.map((row) => (
          <div
            key={rowKey(row)}
            className={onRowClick ? "data-card row-clickable" : "data-card"}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {title && <div className="data-card-title">{title.render(row)}</div>}
            {fields.length > 0 && (
              <dl className={cardFieldColumns === 2 ? "data-card-fields two" : "data-card-fields"}>
                {fields.map((c) => (
                  <div key={c.key} className={c.wide ? "data-card-field wide" : "data-card-field"}>
                    <dt>{c.header}</dt>
                    <dd>{c.render(row)}</dd>
                  </div>
                ))}
              </dl>
            )}
            {actions.map((c) => (
              <div key={c.key} className="data-card-actions">
                {c.render(row)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {cols.map((c) => {
              const sortable = !!(c.sortKey && onSort);
              const active = sortable && sortBy === c.sortKey;
              // Primeiro clique desce (maior primeiro), que e o que se quer em
              // quase toda coluna; clicar de novo inverte.
              const next: "asc" | "desc" = active && sortDir === "desc" ? "asc" : "desc";
              return (
                <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                  {sortable ? (
                    <button
                      className={active ? "th-sort active" : "th-sort"}
                      onClick={() => onSort!(c.sortKey!, next)}
                      title={`Ordenar por ${c.header}`}
                    >
                      <span>{c.header}</span>
                      {active
                        ? (sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />)
                        : <ChevronsUpDown size={12} className="th-sort-idle" />}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading && rows.length === 0 && (
            <tr>
              <td colSpan={cols.length}>
                <div className="skeleton" style={{ height: 18, margin: "8px 0" }} />
                <div className="skeleton" style={{ height: 18, margin: "8px 0" }} />
                <div className="skeleton" style={{ height: 18, margin: "8px 0" }} />
              </td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={cols.length}>
                <div className="table-empty">{empty || "— sem registros —"}</div>
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={onRowClick ? "row-clickable" : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {cols.map((c) => (
                <td key={c.key} className={c.numeric ? "td-num" : undefined}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
