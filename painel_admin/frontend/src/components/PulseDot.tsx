export function PulseDot({ on, tone = "green" }: { on: boolean; tone?: "green" | "amber" }) {
  if (!on) return <span className="pulse dim" aria-label="inativo" />;
  return <span className={`pulse${tone === "amber" ? " amber" : ""}`} aria-label="ativo" />;
}
