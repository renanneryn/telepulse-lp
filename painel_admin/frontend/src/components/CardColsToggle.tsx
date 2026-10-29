import { LayoutGrid } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

/** Seletor de cartões por linha (1/2/3) das listas no celular. No desktop some
 *  (lá a lista é tabela). O valor fica com quem usa (usePref por tela). */
export function CardColsToggle({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const isMobile = useIsMobile();
  if (!isMobile) return null;
  return (
    <div className="cols-toggle" role="group" aria-label="Cartões por linha">
      <LayoutGrid size={12} />
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          type="button"
          className={value === n ? "on" : ""}
          aria-pressed={value === n}
          title={`${n} por linha`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
