import type { ReactNode } from "react";
import { useBotMode } from "@/lib/queries";

type Tone = "default" | "accent" | "amber" | "danger" | "info" | "solid";

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: Tone }) {
  const cls = tone === "default" ? "tag" : `tag ${tone}`;
  return <span className={cls}>{children}</span>;
}

export function PlanTag({ plan, isTrial = false }: { plan?: string; isTrial?: boolean }) {
  const botMode = useBotMode();
  // Em modo gratuito o bot trata todo mundo como paid (get_plan retorna "paid"
  // e is_tester retorna false). Mostrar FREE aqui faria o admin decidir sobre
  // uma base que ele acha que não tem acesso, quando na prática todos têm.
  if (botMode.data?.mode === "free") return <Tag tone="accent">PAID*</Tag>;
  if (isTrial) return <Tag tone="info">TRIAL</Tag>;
  const p = (plan || "free").toLowerCase();
  if (p === "paid") return <Tag tone="accent">PAID</Tag>;
  if (p === "vip") return <Tag tone="amber">VIP</Tag>;
  if (p === "expired") return <Tag tone="danger">EXPIRED</Tag>;
  return <Tag>FREE</Tag>;
}

export function StatusTag({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (s === "running") return <Tag tone="accent">RUNNING</Tag>;
  if (s === "done") return <Tag tone="info">DONE</Tag>;
  if (s === "pending") return <Tag tone="amber">PENDING</Tag>;
  if (s === "error") return <Tag tone="danger">ERROR</Tag>;
  if (s === "cancelled") return <Tag>CANCELLED</Tag>;
  if (s === "paused") return <Tag tone="amber">PAUSED</Tag>;
  if (s === "paid") return <Tag tone="accent">PAID</Tag>;
  if (s === "expired") return <Tag tone="danger">EXPIRED</Tag>;
  return <Tag>{s.toUpperCase() || "—"}</Tag>;
}
