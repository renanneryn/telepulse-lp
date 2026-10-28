import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { TelegramAuthUser } from "../../vite-env";

/* ──────────────  Types ────────────── */

export interface AdminMe {
  user_id: number;
  username: string;
  first_name: string;
}

export interface Stats {
  total_users: number;
  connected_users: number;
  banned_users: number;
  total_tasks: number;
  running_tasks: number;
  clones_today: number;
  clones_week: number;
  msgs_total: number;
  msgs_today: number;
  msgs_week: number;
  total_forwards: number;
  active_forwards: number;
  total_rules: number;
  connected_with_tasks: number;
  total_active_tasks: number;
  vip_active: number;
  vip_expiring_7d: number;
  trial_active: number;
}

export interface User {
  user_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  plan: "free" | "vip" | string;
  plan_expires?: number;
  trial_started?: number;
  plan_paid_at?: number;
  connected: 0 | 1 | number;
  banned: 0 | 1 | number;
  has_session?: boolean;
  created_at?: number;
  first_login_at?: number;
  ref_source?: string;
  lead_usecase?: string;
  lead_qualified?: number;
  queued_plan?: string;
  queued_plan_days?: number;
  price_semanal?: number;
  price_mensal?: number;
  device_model?: string;
  system_version?: string;
  app_version?: string;
  lang_code?: string;
  plan_notified_expired?: number;
  admin_notes?: string;
  [k: string]: unknown;
}

export interface PaginatedUsers {
  page: number;
  per_page: number;
  total: number;
  items: User[];
}

export interface UserDetailResp {
  user: User;
  clone_tasks: Array<Record<string, unknown>>;
  forward_tasks: Array<Record<string, unknown>>;
  enc_tasks: Array<Record<string, unknown>>;
  ofertas: Array<Record<string, unknown>>;
  payments: Array<Record<string, unknown>>;
  replace_rules: Array<Record<string, unknown>>;
  counts: Record<string, number>;
}

export interface CloneTask {
  id: number;
  user_id: number;
  status: "pending" | "running" | "done" | "cancelled" | "error" | "paused" | string;
  label?: string;
  source_id?: number;
  target_id?: number;
  source_name?: string;
  target_name?: string;
  start_id?: number;
  limit_count?: number;
  delay?: number;
  progress_ok?: number;
  progress_fail?: number;
  progress_skip?: number;
  progress_total?: number;
  total?: number;
  created_at?: number;
  started_at?: number;
  finished_at?: number;
  [k: string]: unknown;
}

export interface ActiveCloneItem {
  id: number;
  user_id: number;
  username?: string;
  first_name?: string;
  status: string;
  source_id?: number;
  target_id?: number;
  source_name?: string;
  target_name?: string;
  progress_ok?: number;
  progress_fail?: number;
  progress_skip?: number;
  progress_total?: number;
  started_at?: number;
  queue_position: number;
  running: boolean;
  [k: string]: unknown;
}

export interface ActiveClonesResponse {
  summary: { max_concurrent: number; running: number; waiting: number };
  items: ActiveCloneItem[];
}

export interface ForwardTask {
  id: number;
  user_id: number;
  label: string;
  sources: number[];
  targets: number[];
  delay: number;
  active: 0 | 1 | number;
  native_forward?: number;
  button_text?: string;
  button_url?: string;
  button_caption?: string;
  created_at?: number;
  [k: string]: unknown;
}

export interface EncTask {
  id: number;
  user_id: number;
  name?: string;
  source_id?: number;
  dest_id?: number;
  interval_min?: number;
  legenda?: string;
  status?: "active" | "paused" | string;
  last_msg_id?: number;
  next_post_at?: number;
  [k: string]: unknown;
}

export interface Oferta {
  id: number;
  user_id: number;
  name?: string;
  source_id?: number;
  dest_id?: number;
  legenda?: string;
  last_msg_id?: number;
  ativo?: 0 | 1 | number;
  [k: string]: unknown;
}

export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  status: string;
  created_at?: number;
  paid_at?: number;
  [k: string]: unknown;
}

export interface ReplaceRule {
  id: number;
  user_id: number;
  task_label: string;
  task_type: string;
  rule_label: string;
  rule_type: string;
  original: string;
  replacement: string;
  created_at?: number;
}

/* ──────────────  Auth ────────────── */

export function useMe() {
  return useQuery<AdminMe>({
    queryKey: ["me"],
    queryFn: () => api<AdminMe>("/api/auth/me"),
    retry: false,
    staleTime: 60_000,
  });
}

export function useTelegramLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TelegramAuthUser) =>
      api<{ ok: boolean; user_id: number }>("/api/auth/telegram", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

/** Login do Mini App aberto pelo /adm: troca o initData assinado pelo cookie. */
export function useWebAppLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (initData: string) =>
      api<{ ok: boolean; user_id: number }>("/api/auth/webapp", {
        method: "POST",
        body: { init_data: initData },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

/**
 * Dev login — bypass do widget Telegram para rodar local.
 * O backend só responde com sucesso quando DEV_COOKIE=1; em prod retorna 403.
 */
export function useDevLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api<{ ok: boolean; user_id: number; mode: string }>("/api/auth/dev-login", {
        method: "POST",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api("/api/auth/logout", { method: "POST" }),
    onSuccess: () => qc.clear(),
  });
}

/* ──────────────  Stats ────────────── */

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: () => api<Stats>("/api/stats"),
    refetchInterval: 15_000,
  });
}

export function useTimeseries(metric: "signups" | "clones" | "payments", days = 30) {
  return useQuery<{ metric: string; days: number; start: number; buckets: number[] }>({
    queryKey: ["timeseries", metric, days],
    queryFn: () =>
      api("/api/stats/timeseries", { query: { metric, days } }),
  });
}

export function usePlanDist() {
  return useQuery<Record<string, number>>({
    queryKey: ["plan-dist"],
    queryFn: () => api<Record<string, number>>("/api/stats/plan-distribution"),
  });
}

export interface Funnel {
  started: number;
  connected: number;
  never_connected: number;
  trial_active: number;
  vip_active: number;
  free: number;
  connected_vip: number;
  connected_trial: number;
  banned: number;
  ever_trial: number;
  trial_expired: number;
  /** Linhas ainda marcadas vip mas ja vencidas — mede a varredura. */
  stale_vip_rows: number;
}

export function useFunnel() {
  return useQuery<Funnel>({
    queryKey: ["funnel"],
    queryFn: () => api<Funnel>("/api/stats/funnel"),
    refetchInterval: 30_000,
  });
}

export function useTopRefs(limit = 10) {
  return useQuery<Array<{ source: string; click_count: number; unique_users: number }>>({
    queryKey: ["top-refs", limit],
    queryFn: () => api("/api/stats/top-refs", { query: { limit } }),
  });
}

/* ──────────────  Users ────────────── */

export interface UserListParams {
  page?: number;
  per_page?: number;
  search?: string;
  plan?: string;
  connected?: number;
  banned?: number;
  expiring_days?: number;
  sort?: string;
}

export function useUsers(params: UserListParams) {
  return useQuery<PaginatedUsers>({
    queryKey: ["users", params],
    queryFn: () => api<PaginatedUsers>("/api/users", { query: params as Record<string, unknown> }),
  });
}

export function useUserDetail(userId: number | undefined) {
  return useQuery<UserDetailResp>({
    queryKey: ["user", userId],
    queryFn: () => api<UserDetailResp>(`/api/users/${userId}`),
    enabled: !!userId,
  });
}

export function usePatchUser(userId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api(`/api/users/${userId}`, { method: "PATCH", body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", userId] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDisconnectUser(userId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api(`/api/users/${userId}/disconnect`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", userId] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function usePatchUserById() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, body }: { userId: number; body: Record<string, unknown> }) =>
      api(`/api/users/${userId}`, { method: "PATCH", body }),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ["user", userId] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDisconnectUserById() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => api(`/api/users/${userId}/disconnect`, { method: "POST" }),
    onSuccess: (_data, userId) => {
      qc.invalidateQueries({ queryKey: ["user", userId] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useGrantTrial(userId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (days: number) =>
      api(`/api/users/${userId}/grant-trial`, { method: "POST", body: { days } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", userId] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useExtendPlan(userId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (days: number) =>
      api(`/api/users/${userId}/extend`, { method: "POST", body: { days } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", userId] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useSendUserMessage(userId: number) {
  return useMutation({
    mutationFn: (body: { text: string; parse_mode?: string }) =>
      api(`/api/users/${userId}/message`, { method: "POST", body }),
  });
}

export function useDeleteUser(userId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api(`/api/users/${userId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["user", userId] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

/* ──────────────  Replace rules ────────────── */

export function useRules(userId: number) {
  return useQuery<ReplaceRule[]>({
    queryKey: ["rules", userId],
    queryFn: () => api<ReplaceRule[]>(`/api/users/${userId}/rules`),
    enabled: !!userId,
  });
}

export function useCreateRule(userId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<ReplaceRule, "id" | "user_id" | "created_at">) =>
      api(`/api/users/${userId}/rules`, { method: "POST", body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rules", userId] });
      qc.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}

export function useDeleteRule(userId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: number) =>
      api(`/api/users/${userId}/rules/${ruleId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rules", userId] });
      qc.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}

/* ──────────────  Tasks ────────────── */

export function useClones(params: { status?: string; user_id?: number; limit?: number }) {
  return useQuery<CloneTask[]>({
    queryKey: ["clones", params],
    queryFn: () => api<CloneTask[]>("/api/tasks/clones", { query: params as Record<string, unknown> }),
    refetchInterval: 5_000,
  });
}

export function useActiveClones() {
  return useQuery<ActiveClonesResponse>({
    queryKey: ["clones-active"],
    queryFn: () => api<ActiveClonesResponse>("/api/tasks/clones/active"),
    refetchInterval: 5_000,
  });
}

export function useForwards(params: { user_id?: number; active?: number }) {
  return useQuery<ForwardTask[]>({
    queryKey: ["forwards", params],
    queryFn: () => api<ForwardTask[]>("/api/tasks/forwards", { query: params as Record<string, unknown> }),
    refetchInterval: 10_000,
  });
}

export function useEncTasks(params: { user_id?: number }) {
  return useQuery<EncTask[]>({
    queryKey: ["enc", params],
    queryFn: () => api<EncTask[]>("/api/tasks/enc", { query: params as Record<string, unknown> }),
  });
}

export function useOfertas(params: { user_id?: number }) {
  return useQuery<Oferta[]>({
    queryKey: ["ofertas", params],
    queryFn: () => api<Oferta[]>("/api/tasks/ofertas", { query: params as Record<string, unknown> }),
  });
}

export function useCancelClone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) =>
      api(`/api/tasks/clones/${taskId}/cancel`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clones"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useStartForward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) =>
      api(`/api/tasks/forwards/${taskId}/start`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forwards"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useStopForward() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) =>
      api(`/api/tasks/forwards/${taskId}/stop`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forwards"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useStartEnc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => api(`/api/tasks/enc/${taskId}/start`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enc"] });
      qc.invalidateQueries({ queryKey: ["user"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useStopEnc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => api(`/api/tasks/enc/${taskId}/stop`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enc"] });
      qc.invalidateQueries({ queryKey: ["user"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useToggleOferta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ofertaId: number) =>
      api<{ ok: boolean; oferta_id: number; ativo: boolean; looper_running: boolean }>(
        `/api/tasks/ofertas/${ofertaId}/toggle`,
        { method: "POST" },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ofertas"] });
      qc.invalidateQueries({ queryKey: ["user"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useCloneErrors(taskId: number | undefined) {
  return useQuery<Array<{ task_id: number; msg_id: number; created_at: number }>>({
    queryKey: ["clone-errors", taskId],
    queryFn: () => api(`/api/tasks/clones/${taskId}/errors`, { query: { limit: 500 } }),
    enabled: !!taskId,
  });
}

/* ──────────────  Payments ────────────── */

export interface PaginatedPayments {
  page: number;
  per_page: number;
  total: number;
  items: Payment[];
}

// M12: paginado (padrão Users) consumindo o contrato novo de GET /api/payments
// — passar `page` faz o backend responder {page,per_page,total,items}.
export function usePayments(params: { status?: string; user_id?: number; page: number; per_page?: number }) {
  return useQuery<PaginatedPayments>({
    queryKey: ["payments", params],
    queryFn: () => api<PaginatedPayments>("/api/payments", { query: params as Record<string, unknown> }),
  });
}

export function usePaymentsSummary() {
  return useQuery<Record<string, { count: number; total: number }>>({
    queryKey: ["payments-summary"],
    queryFn: () => api("/api/payments/summary"),
    refetchInterval: 30_000,
    retry: 3,
    retryDelay: 1500,
  });
}

/* ──────────────  Settings ────────────── */

export function useSettings() {
  return useQuery<Record<string, string>>({
    queryKey: ["settings"],
    queryFn: () => api<Record<string, string>>("/api/settings"),
  });
}

export type BotMode = { mode: "free" | "paid"; free_mode_since: number };

/** Modo global do bot. Em "free" o bot trata TODO usuário como VIP — sem isto
 *  o painel mostrava a base inteira como FREE enquanto todos tinham acesso. */
export function useBotMode() {
  return useQuery<BotMode>({
    queryKey: ["bot-mode"],
    queryFn: () => api<BotMode>("/api/settings/bot-mode"),
    staleTime: 30_000,
  });
}

export function useSetBotMode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mode: "free" | "paid") =>
      api<{ ok: boolean; mode: string; extended: number }>("/api/settings/bot-mode", {
        method: "POST",
        body: { mode },   // api() já serializa — passar string aqui faria duplo stringify
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bot-mode"] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useSetSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      api(`/api/settings/${encodeURIComponent(key)}`, { method: "PUT", body: { value } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useSetSettingsBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: Record<string, string>) =>
      api(`/api/settings`, { method: "PUT", body: { items } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

/* ──────────────  Flows (motor de fluxos configuráveis) ────────────── */

export interface FlowOption {
  value: string;
  label: string;
}

export interface FlowButton {
  label: string;
  action: string;
}

export interface FlowStep {
  id: string;
  type: "question" | "ai_message";
  text?: string;
  skip_ends_flow?: boolean;
  options?: FlowOption[];
  system_prompt?: string;
  fallback_step?: string;
  fallbacks?: Record<string, string>;
  buttons?: FlowButton[];
}

export interface FlowSummary {
  flow_key: string;
  name: string;
  trigger: string;
  enabled: boolean;
  step_count: number;
}

export interface Flow {
  flow_key: string;
  name: string;
  trigger: string;
  enabled: boolean;
  skip_label: string;
  steps: FlowStep[];
}

export interface FlowsMeta {
  button_actions: Record<string, string>;
  triggers: Record<string, string>;
}

export function useFlows() {
  return useQuery<FlowSummary[]>({
    queryKey: ["flows"],
    queryFn: () => api<FlowSummary[]>("/api/flows"),
  });
}

export function useFlow(flowKey: string | null) {
  return useQuery<Flow>({
    queryKey: ["flows", flowKey],
    queryFn: () => api<Flow>(`/api/flows/${encodeURIComponent(flowKey as string)}`),
    enabled: !!flowKey,
  });
}

export function useFlowsMeta() {
  return useQuery<FlowsMeta>({
    queryKey: ["flows-meta"],
    queryFn: () => api<FlowsMeta>("/api/flows/meta"),
  });
}

export function useCreateFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { flow_key: string; name: string; trigger: string }) =>
      api("/api/flows", { method: "POST", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["flows"] }),
  });
}

export function useSaveFlow(flowKey: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Flow, "flow_key">) =>
      api(`/api/flows/${encodeURIComponent(flowKey)}`, { method: "PUT", body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flows"] });
      qc.invalidateQueries({ queryKey: ["flows", flowKey] });
    },
  });
}

export function useDeleteFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (flowKey: string) =>
      api(`/api/flows/${encodeURIComponent(flowKey)}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["flows"] }),
  });
}

/* ──────────────  Broadcast ────────────── */

/** vip30 = usuário resgata 30 dias de VIP · start = abre o menu do /start */
export type BroadcastAction = "vip30" | "start";
/** Cores que o Telegram suporta em botão inline (default = sem cor). */
export type BroadcastColor = "default" | "primary" | "success" | "danger";

export interface BroadcastButton {
  text: string;
  action: BroadcastAction;
  color: BroadcastColor;
}

export interface BroadcastBody {
  audience: "all" | "connected" | "never_connected";
  text: string;
  parse_mode?: "html" | "markdown";
  buttons?: BroadcastButton[];
}

/** Manda o broadcast (texto + botões) só pro admin logado. */
export function useBroadcastTest() {
  return useMutation({
    mutationFn: (body: BroadcastBody) =>
      api<{ ok: boolean }>("/api/broadcast/test", { method: "POST", body }),
  });
}

export function useBroadcastDryRun() {
  return useMutation({
    mutationFn: (body: BroadcastBody) =>
      api<{ audience: string; target_count: number }>("/api/broadcast/dry-run", {
        method: "POST",
        body,
      }),
  });
}
