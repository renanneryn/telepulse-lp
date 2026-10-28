import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Download, Plug, ExternalLink, X } from "lucide-react";
import { useUsers, usePatchUserById, useDisconnectUserById, type User, type PaginatedUsers } from "@/lib/queries";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/DataTable";
import { PlanTag } from "@/components/Tag";
import { PulseDot } from "@/components/PulseDot";
import { Pagination } from "@/components/Pagination";
import { IdChip } from "@/components/IdChip";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { usePref } from "@/hooks/usePref";
import { fmtDate, daysRemaining, fmtDaysRemaining, isTrialUser, isVipPlan } from "@/lib/format";
import { toast } from "@/hooks/useToast";

type SortKey =
  | "created_desc" | "created_asc" | "last_active" | "last_active_asc"
  | "expired_recent" | "plan_desc" | "plan_asc" | "expires_desc" | "expires_asc";
type PendingAction = { type: "free" | "ban" | "disconnect"; user: User };

/** (coluna, direcao) -> chave de `sort` do backend. */
function sortKeyFor(col: string, dir: "asc" | "desc"): SortKey {
  if (col === "plan") return dir === "desc" ? "plan_desc" : "plan_asc";
  if (col === "expires") return dir === "desc" ? "expires_desc" : "expires_asc";
  if (col === "created") return dir === "desc" ? "created_desc" : "created_asc";
  if (col === "last_active") return dir === "desc" ? "last_active" : "last_active_asc";
  return "created_desc";
}

/** Inverso de sortKeyFor: diz qual seta acender no cabecalho. */
function sortState(sort: SortKey): { by: string; dir: "asc" | "desc" } {
  switch (sort) {
    case "plan_desc": return { by: "plan", dir: "desc" };
    case "plan_asc": return { by: "plan", dir: "asc" };
    case "expires_desc": return { by: "expires", dir: "desc" };
    case "expires_asc": return { by: "expires", dir: "asc" };
    case "created_asc": return { by: "created", dir: "asc" };
    case "last_active": return { by: "last_active", dir: "desc" };
    case "last_active_asc": return { by: "last_active", dir: "asc" };
    case "expired_recent": return { by: "expires", dir: "desc" };
    default: return { by: "created", dir: "desc" };
  }
}

export function Users({ vipOnly = false, testersOnly = false, expiredOnly = false }: { vipOnly?: boolean; testersOnly?: boolean; expiredOnly?: boolean } = {}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const expiringParam = searchParams.get("expiring");
  const expiringDays = expiringParam ? Number(expiringParam) : undefined;

  // escopo das preferencias salvas: cada variante da tela lembra a sua
  const _prefScope = expiredOnly ? "expired" : testersOnly ? "testers" : vipOnly ? "vips" : "all";
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  // A URL SEMEIA o filtro (chegando de um card do dashboard), mas nao fica
  // sincronizada: se um useEffect reescrevesse o state a cada mudanca de
  // searchParams, mexer no select seria revertido no render seguinte.
  // Whitelist porque o backend valida com pattern e ?plan=lixo daria 422.
  const planParam = searchParams.get("plan") ?? "";
  const connParam = searchParams.get("connected");
  const [plan, setPlan] = usePref(
    `users.${_prefScope}.plan`,
    ["free", "vip", "trial"].includes(planParam) ? planParam : planParam === "paid" ? "vip" : "",
  );
  // VIPs/Testers: mostrar todos (conectados ou não) por padrão. Lista normal: só conectados.
  // `?connected=` (vazio) e intencional: mostra todos, sem o default de 1.
  const [connected, setConnected] = usePref(
    `users.${_prefScope}.connected`,
    connParam === "0" || connParam === "1" || connParam === ""
      ? connParam
      : (vipOnly || testersOnly || expiredOnly ? "" : "1"),
  );
  const bannedParam = searchParams.get("banned");
  const [banned, setBanned] = useState(
    bannedParam === "0" || bannedParam === "1" ? bannedParam : "",
  );
  const [sort, setSort] = usePref<SortKey>(`users.${_prefScope}.sort`, "created_desc");
  const [exporting, setExporting] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const patchUser = usePatchUserById();
  const disconnectUser = useDisconnectUserById();

  function clearExpiring() {
    searchParams.delete("expiring");
    setSearchParams(searchParams, { replace: true });
  }

  const queryParams = {
    page,
    per_page: 50,
    // VIP: plano sempre 'vip'. Modo "expirando" (vindo do dashboard) ignora conn/plan.
    search: debouncedSearch || undefined,
    plan: expiredOnly ? "expired_vip" : (testersOnly ? "trial" : (vipOnly ? "vip" : (expiringDays ? undefined : (plan || undefined)))),
    connected: expiringDays ? undefined : (connected === "" ? undefined : Number(connected)),
    banned: banned === "" ? undefined : Number(banned),
    expiring_days: expiringDays,
    // ex-VIP: quem caiu mais recentemente primeiro (janela de reconquista)
    sort: expiredOnly && sort === "created_desc" ? "expired_recent" : sort,
  };

  const query = useUsers(queryParams);
  const { by: sortBy, dir: sortDir } = sortState(sort);

  // Guard de reentrância por usuário. O `disabled` do botão só ativa no render
  // seguinte, então dois cliques rápidos em "VIP 30D" mandavam dois PATCH — e
  // como o backend agora SOMA os dias, isso virava 60 dias em vez de 30.
  const inFlight = useRef<Set<number>>(new Set());

  async function doPatch(userId: number, body: Record<string, unknown>, okMsg: string) {
    if (inFlight.current.has(userId)) return;
    inFlight.current.add(userId);
    try {
      await patchUser.mutateAsync({ userId, body });
      toast("ok", okMsg);
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      inFlight.current.delete(userId);
    }
  }

  async function doDisconnect(userId: number) {
    try {
      await disconnectUser.mutateAsync(userId);
      toast("ok", "Sessão derrubada");
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function runPendingAction() {
    if (!pendingAction) return;
    const { type, user } = pendingAction;
    if (type === "free") await doPatch(user.user_id, { plan: "free" }, `${user.user_id} rebaixado para FREE`);
    if (type === "ban") await doPatch(user.user_id, { banned: 1 }, "Usuário banido");
    if (type === "disconnect") await doDisconnect(user.user_id);
    setPendingAction(null);
  }

  function csvCell(v: unknown): string {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }

  async function exportCsv() {
    setExporting(true);
    try {
      // busca todos os usuários respeitando os filtros atuais — paginado em lotes
      // de 200 (cap do backend) até acabar o total. Trava de segurança em 500
      // páginas (100k registros) pra nunca entrar em loop infinito.
      const perPage = 200;
      const maxPages = 500;
      let items: User[] = [];
      let total = Infinity;
      let p = 0;
      while (items.length < total && p < maxPages) {
        const res = await api<PaginatedUsers>("/api/users", {
          query: { ...queryParams, page: p, per_page: perPage } as Record<string, unknown>,
        });
        total = res.total;
        if (res.items.length === 0) break;
        items = items.concat(res.items);
        p += 1;
      }
      const headers = [
        "user_id", "username", "first_name", "phone", "plan",
        "plan_expires_days", "connected", "banned", "ref_source", "created_at",
      ];
      const lines = [headers.join(",")];
      for (const u of items) {
        const exp = u.plan_expires ? daysRemaining(u.plan_expires) : "";
        lines.push([
          u.user_id, u.username ?? "", u.first_name ?? "", u.phone ?? "", u.plan,
          exp, u.connected ? 1 : 0, u.banned ? 1 : 0, u.ref_source ?? "",
          u.created_at ? new Date(u.created_at * 1000).toISOString() : "",
        ].map(csvCell).join(","));
      }
      const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `telepulse_usuarios_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast("ok", `${items.length} usuários exportados`);
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setExporting(false);
    }
  }

  const cols: Column<User>[] = [
    {
      key: "id",
      header: "USER_ID",
      render: (u) => <IdChip value={u.user_id} />,
      width: "160px",
    },
    {
      key: "name",
      primary: true,
      header: "USERNAME / NOME",
      render: (u) => (
        <div className="flex-col" style={{ gap: 2 }}>
          <span style={{ color: "var(--text)" }}>
            {u.username ? "@" + u.username : u.first_name || "—"}
          </span>
          {u.username && u.first_name && (
            <span style={{ color: "var(--text-dimmer)", fontSize: "var(--fz-xs)" }}>
              {u.first_name}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "phone",
      hideOnMobile: true,
      header: "TELEFONE",
      render: (u) => <span className="num" style={{ color: "var(--text-dim)" }}>{u.phone || "—"}</span>,
      width: "130px",
    },
    {
      key: "plan",
      sortKey: "plan",
      header: "PLANO",
      render: (u) => <PlanTag plan={u.plan} isTrial={isTrialUser(u)} expires={u.plan_expires} />,
      width: "100px",
    },
    {
      key: "expira",
      sortKey: "expires",
      header: expiredOnly ? "EXPIROU" : "EXPIRA",
      render: (u) => {
        // Na aba de ex-VIP a coluna e o dado principal: mostra ha quanto tempo
        // caiu. Fora dela o plano ja nao e 'vip', entao cairia no travessao.
        if (expiredOnly) {
          const t = u.plan_expires || u.plan_paid_at;
          if (!t) return <span style={{ color: "var(--text-dimmer)" }}>—</span>;
          return <span className="num" style={{ color: "var(--text-dim)" }}>{fmtDate(t)}</span>;
        }
        if (!isVipPlan(u.plan) || !u.plan_expires) return <span style={{ color: "var(--text-dimmer)" }}>—</span>;
        const d = daysRemaining(u.plan_expires) ?? 0;
        const cor = d < 0 ? "var(--danger)" : d <= 3 ? "var(--danger)" : d <= 7 ? "var(--warning, #e0a800)" : "var(--text)";
        return <span className="num" style={{ color: cor }}>{fmtDaysRemaining(u.plan_expires)}</span>;
      },
      width: "90px",
    },
    {
      key: "conn",
      header: "CONN",
      render: (u) => (
        <div className="row gap-sm">
          <PulseDot on={!!u.connected} />
          <span style={{ color: u.connected ? "var(--text)" : "var(--text-dimmer)" }}>
            {u.connected ? "ON" : "OFF"}
          </span>
        </div>
      ),
      width: "80px",
    },
    {
      key: "ban",
      hideOnMobile: true,
      header: "BAN",
      render: (u) =>
        u.banned ? (
          <span style={{ color: "var(--danger)" }}>BANIDO</span>
        ) : (
          <span style={{ color: "var(--text-dimmer)" }}>—</span>
        ),
      width: "80px",
    },
    {
      key: "ref",
      hideOnMobile: true,
      header: "ORIGEM",
      render: (u) => <span style={{ color: "var(--text-dim)", fontSize: "var(--fz-xs)" }}>{u.ref_source || "—"}</span>,
      width: "120px",
    },
    {
      key: "created",
      hideOnMobile: true,
      header: "CRIADO EM",
      sortKey: "created",
      render: (u) => <span className="num">{fmtDate(u.created_at)}</span>,
      width: "150px",
    },
    {
      // Dava pra ORDENAR por "último ativo" sem nunca ver o valor. O campo ja
      // vinha no payload; so faltava a coluna.
      key: "last_active",
      hideOnMobile: true,
      sortKey: "last_active",
      header: "ÚLTIMO ATIVO",
      render: (u) => {
        const t = u.first_login_at || u.created_at;
        if (!t) return <span style={{ color: "var(--text-dimmer)" }}>—</span>;
        return <span className="num">{fmtDate(t)}</span>;
      },
      width: "150px",
    },
    {
      key: "actions",
      actions: true,
      header: "AÇÕES",
      width: "320px",
      render: (u) => {
        const busy =
          (patchUser.isPending && patchUser.variables?.userId === u.user_id) ||
          (disconnectUser.isPending && disconnectUser.variables === u.user_id);
        return (
          <div
            className="row gap-sm actions-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm icon-only"
              onClick={() => navigate(`/users/${u.user_id}`)}
              title="Abrir detalhe"
            >
              <ExternalLink size={12} />
            </button>
            {/* Tester tem plan="vip" no banco (o que o distingue é
                trial_started > 0). Sem checar isTrialUser, a condição caía
                sempre no "→ FREE" e não havia como promover um trial a VIP.
                O PATCH abaixo remove o trial por completo (trial_started=0) e
                o VIP conta 30 dias a partir de agora — os dias do trial não
                somam (trial 13d + VIP 30 = VIP 30). */}
            {isTrialUser(u) ? (
              <>
                <button
                  className="btn btn-sm primary"
                  disabled={busy}
                  onClick={() => doPatch(u.user_id, { plan: "vip", plan_days: 30 }, "Trial encerrado — VIP por 30 dias")}
                  title="Encerra o trial e dá VIP por 30 dias"
                >
                  ⭐ VIP 30D
                </button>
                <button
                  className="btn btn-sm"
                  disabled={busy}
                  onClick={() => setPendingAction({ type: "free", user: u })}
                  title="Rebaixar para free"
                >
                  → FREE
                </button>
              </>
            ) : !isVipPlan(u.plan) ? (
              <button
                className="btn btn-sm primary"
                disabled={busy}
                onClick={() => doPatch(u.user_id, { plan: "vip", plan_days: 30 }, "VIP de 30 dias concedido")}
                title="Dar VIP por 30 dias"
              >
                VIP 30D
              </button>
            ) : (
              <button
                className="btn btn-sm"
                disabled={busy}
                onClick={() => setPendingAction({ type: "free", user: u })}
                title="Rebaixar para free"
              >
                → FREE
              </button>
            )}
            <button
              className={`btn btn-sm ${u.banned ? "" : "danger"}`}
              disabled={busy}
              onClick={() =>
                u.banned
                  ? doPatch(u.user_id, { banned: 0 }, "Desbanido")
                  : setPendingAction({ type: "ban", user: u })
              }
            >
              {u.banned ? "DESBANIR" : "BANIR"}
            </button>
            <button
              className="btn btn-sm icon-only"
              disabled={busy || (!u.connected && !u.has_session)}
              onClick={() => setPendingAction({ type: "disconnect", user: u })}
              title="Derrubar sessão"
            >
              <Plug size={12} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{expiredOnly ? "VIPs Expirados" : testersOnly ? "Usuários Testers" : vipOnly ? "Usuários VIPs" : "Usuários"}</h1>
          <div className="page-sub">
            // {query.data?.total ?? "..."} {expiredOnly ? "ex-assinantes · pagaram e perderam o plano" : testersOnly ? "em trial" : vipOnly ? "VIP ativos" : "registros"} · clique pra abrir
          </div>
        </div>
      </div>

      {expiringDays && (
        <div
          className="row gap-sm"
          style={{
            alignItems: "center",
            padding: "10px 14px",
            marginBottom: 12,
            border: "1px solid var(--warning, #e0a800)",
            borderRadius: 6,
            background: "rgba(224,168,0,0.08)",
          }}
        >
          <span style={{ color: "var(--warning, #e0a800)" }}>
            ⏳ Mostrando apenas VIP expirando nos próximos <b>{expiringDays} dias</b> (ordem: expira primeiro)
          </span>
          <div style={{ flex: 1 }} />
          <button className="btn btn-sm" onClick={clearExpiring}>
            <X size={12} /> LIMPAR FILTRO
          </button>
        </div>
      )}

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="row gap-sm" style={{ flex: 1, maxWidth: 320 }}>
            <Search size={14} color="var(--text-dim)" />
            <input
              className="input"
              placeholder="buscar id / @user / nome / telefone..."
              value={search}
              onChange={(e) => { setPage(0); setSearch(e.target.value); }}
            />
          </div>
          {!vipOnly && !testersOnly && (
            <select
              className="select"
              value={plan}
              disabled={!!expiringDays}
              title={expiringDays ? "Ignorado no modo expirando" : undefined}
              style={expiringDays ? { opacity: 0.45 } : undefined}
              onChange={(e) => { setPage(0); setPlan(e.target.value); }}
            >
              <option value="">PLANO · ALL</option>
              <option value="free">FREE</option>
              <option value="vip">VIP</option>
              <option value="trial">TRIAL</option>
            </select>
          )}
          <select
            className="select"
            value={connected}
            disabled={!!expiringDays}
            title={expiringDays ? "Ignorado no modo expirando" : undefined}
            style={expiringDays ? { opacity: 0.45 } : undefined}
            onChange={(e) => { setPage(0); setConnected(e.target.value); }}
          >
            <option value="">CONN · ALL</option>
            <option value="1">CONECTADO</option>
            <option value="0">DESCONECTADO</option>
          </select>
          <select className="select" value={banned} onChange={(e) => { setPage(0); setBanned(e.target.value); }}>
            <option value="">BAN · ALL</option>
            <option value="0">ATIVO</option>
            <option value="1">BANIDO</option>
          </select>
          <select className="select" value={sort} onChange={(e) => { setPage(0); setSort(e.target.value as SortKey); }}>
            <option value="created_desc">↓ MAIS RECENTES</option>
            <option value="created_asc">↑ MAIS ANTIGOS</option>
            <option value="last_active">⏱ ÚLTIMO ATIVO</option>
          </select>
          <button className="btn btn-sm" onClick={exportCsv} disabled={exporting} title="Exportar CSV (filtros atuais)">
            <Download size={12} /> {exporting ? "..." : "CSV"}
          </button>
        </div>

        <DataTable
          rows={query.data?.items ?? []}
          cols={cols}
          loading={query.isLoading}
          rowKey={(u) => u.user_id}
          onRowClick={(u) => navigate(`/users/${u.user_id}`)}
          empty="Nenhum usuário com esses filtros."
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={(key, dir) => {
            setPage(0);
            setSort(sortKeyFor(key, dir));
          }}
        />

        <Pagination
          page={page}
          perPage={50}
          total={query.data?.total ?? 0}
          onPage={setPage}
        />
      </div>

      <ConfirmDialog
        open={!!pendingAction}
        title={
          pendingAction?.type === "free"
            ? "Rebaixar usuário para FREE?"
            : pendingAction?.type === "ban"
              ? "Banir usuário?"
              : "Derrubar sessão Telethon?"
        }
        body={
          pendingAction?.type === "free" ? (
            <>
              Usuário <strong>{pendingAction.user.user_id}</strong> perde o plano VIP
              imediatamente (expiração zerada).
            </>
          ) : pendingAction?.type === "ban" ? (
            <>
              Usuário <strong>{pendingAction.user.user_id}</strong> <strong>não</strong>{" "}
              conseguirá mais usar o bot. Pode ser revertido a qualquer momento.
            </>
          ) : (
            <>
              Vai desconectar o cliente em memória <strong>e</strong> apagar a session_string
              criptografada do usuário <strong>{pendingAction?.user.user_id}</strong>.
            </>
          )
        }
        confirmLabel={
          pendingAction?.type === "free"
            ? "REBAIXAR"
            : pendingAction?.type === "ban"
              ? "BANIR"
              : "DERRUBAR"
        }
        danger
        loading={patchUser.isPending || disconnectUser.isPending}
        onConfirm={runPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}


// Ir de /users?connected=1 pra /users?plan=free NAO remonta o componente (mesma
// rota), entao o useState inicial nao rodaria de novo e o filtro nao mudaria.
// A key forca a remontagem e re-semeia os filtros a partir da URL.
export function UsersFromUrl() {
  const [sp] = useSearchParams();
  return <Users key={sp.toString()} />;
}
