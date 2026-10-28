import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmtNum } from "@/lib/format";

interface Props {
  page: number;
  perPage: number;
  total: number;
  onPage: (p: number) => void;
}

export function Pagination({ page, perPage, total, onPage }: Props) {
  const start = page * perPage + 1;
  const end = Math.min((page + 1) * perPage, total);
  const last = Math.max(0, Math.ceil(total / perPage) - 1);
  return (
    <div className="pagination">
      <div>
        {total === 0
          ? "0 RESULTADOS"
          : `${fmtNum(start)}–${fmtNum(end)} DE ${fmtNum(total)}`}
      </div>
      <div className="pagination-actions">
        <button
          className="btn btn-sm icon-only"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
          aria-label="anterior"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          className="btn btn-sm icon-only"
          disabled={page >= last}
          onClick={() => onPage(page + 1)}
          aria-label="próxima"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
