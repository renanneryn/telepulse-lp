import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  value: string | number;
  label?: string;
  full?: boolean;
}

/**
 * Chip de ID com copy-to-clipboard ao clicar.
 * Por padrão exibe o valor completo; mas pode ser usado em colunas estreitas
 * com `full={false}` para mostrar uma versão encurtada (4..3).
 */
export function IdChip({ value, label, full = true }: Props) {
  const [copied, setCopied] = useState(false);
  const s = String(value);
  const display = full ? s : s.length > 8 ? `${s.slice(0, 4)}…${s.slice(-3)}` : s;

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(s);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      /* ignore */
    }
  }

  return (
    <span
      className="id-chip"
      role="button"
      title={`Copiar ${s}`}
      onClick={handleClick}
    >
      {label && <span style={{ color: "var(--text-dimmer)" }}>{label}</span>}
      <span className="num">{copied ? "copied" : display}</span>
      {copied ? (
        <Check size={10} color="var(--accent)" />
      ) : (
        <Copy size={10} color="var(--text-dimmer)" />
      )}
    </span>
  );
}
