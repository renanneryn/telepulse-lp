export function fmtNum(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("pt-BR").format(n);
}

export function fmtBRL(cents: number | null | undefined): string {
  if (cents === null || cents === undefined || Number.isNaN(cents)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

// Valores de pagamento (tabela payments.amount) são gravados em REAIS, não centavos.
export function fmtReais(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function fmtDate(unix: number | null | undefined): string {
  if (!unix) return "—";
  return new Date(unix * 1000).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtDateShort(unix: number | null | undefined): string {
  if (!unix) return "—";
  return new Date(unix * 1000).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function fmtRelative(unix: number | null | undefined): string {
  if (!unix) return "—";
  const now = Date.now() / 1000;
  const diff = now - unix;
  if (diff < 60) return `${Math.floor(diff)}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

export function pct(num: number, denom: number): string {
  if (!denom) return "0%";
  return `${((num / denom) * 100).toFixed(1)}%`;
}

export function truncate(s: string | null | undefined, n = 40): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function shortId(id: number | string | null | undefined): string {
  if (id === null || id === undefined) return "—";
  const s = String(id);
  if (s.length <= 8) return s;
  return s.slice(0, 4) + "…" + s.slice(-3);
}

// M9: com sinal — negativo significa expirado há N dias. Callers que
// precisam de um rótulo pronto devem usar fmtDaysRemaining() abaixo.
export function daysRemaining(planExpires: number | null | undefined): number | null {
  if (!planExpires) return null;
  const secs = planExpires - Date.now() / 1000;
  // Para cima enquanto não expirou: 30 dias recém-concedidos = 30d (antes dava 29d).
  // Expirado segue negativo (-1 = venceu há menos de 1 dia).
  return secs > 0 ? Math.ceil(secs / 86400) : Math.floor(secs / 86400);
}

/** 'vip' é o único plano pago. 'paid' é o nome antigo (backend ainda não migrado). */
export function isVipPlan(plan?: string): boolean {
  const p = (plan || "").toLowerCase();
  return p === "vip" || p === "paid";
}

// Rótulo pronto: "EXPIRADO" (d < 0) / "hoje" (d === 0) / "Nd" (d > 0) / "—" (sem data).
export function fmtDaysRemaining(planExpires: number | null | undefined): string {
  const d = daysRemaining(planExpires);
  if (d === null) return "—";
  if (d < 0) return "EXPIRADO";
  if (d === 0) return "hoje";
  return `${d}d`;
}

// Espelha db.is_tester / get_stats.trial_active: usuário está em trial ativo quando
// já iniciou o trial (trial_started > 0), o plano é vip e ainda não expirou.
export function isTrialUser(u: {
  trial_started?: number;
  plan?: string;
  plan_expires?: number;
}): boolean {
  const now = Date.now() / 1000;
  return (u.trial_started ?? 0) > 0 && isVipPlan(u.plan) && (u.plan_expires ?? 0) > now;
}

export function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
