import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plug,
  Trash2,
  Plus,
  Play,
  Square,
  XCircle,
  Send,
  AlertTriangle,
} from "lucide-react";
import {
  useCreateRule,
  useDeleteRule,
  useDisconnectUser,
  usePatchUser,
  useRules,
  useUserDetail,
  useStartForward,
  useStopForward,
  useCancelClone,
  useGrantTrial,
  useExtendPlan,
  useSendUserMessage,
  useDeleteUser,
  useStartEnc,
  useStopEnc,
  useToggleOferta,
} from "@/lib/queries";
import { PlanTag, StatusTag, Tag } from "@/components/Tag";
import { PulseDot } from "@/components/PulseDot";
import { IdChip } from "@/components/IdChip";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CloneErrorsModal } from "@/components/CloneErrorsModal";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ApiError } from "@/lib/api";
import { fmtDate, fmtReais, daysRemaining, fmtDaysRemaining, isTrialUser } from "@/lib/format";
import { toast } from "@/hooks/useToast";

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();
  const detail = useUserDetail(userId);
  const patch = usePatchUser(userId);
  const disconnect = useDisconnectUser(userId);
  const rules = useRules(userId);
  const createRule = useCreateRule(userId);
  const deleteRule = useDeleteRule(userId);
  const startForward = useStartForward();
  const stopForward = useStopForward();
  const cancelClone = useCancelClone();
  const grantTrial = useGrantTrial(userId);
  const extendPlan = useExtendPlan(userId);
  const sendMessage = useSendUserMessage(userId);
  const deleteUser = useDeleteUser(userId);
  const startEnc = useStartEnc();
  const stopEnc = useStopEnc();
  const toggleOferta = useToggleOferta();

  async function taskAction(fn: () => Promise<unknown>, okMsg: string) {
    try {
      await fn();
      toast("ok", okMsg);
      detail.refetch?.();
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [confirmBan, setConfirmBan] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDM, setConfirmDM] = useState(false);
  const [dmText, setDmText] = useState("");
  const [dmParseMode, setDmParseMode] = useState<"html" | "markdown">("html");
  const [adminNotes, setAdminNotes] = useState<string | null>(null);
  const [errorsFor, setErrorsFor] = useState<number | null>(null);
  const [newRule, setNewRule] = useState({
    task_label: "",
    task_type: "forward",
    rule_label: "",
    rule_type: "basic",
    original: "",
    replacement: "",
  });

  if (detail.isLoading) {
    return (
      <div>
        <div className="skeleton" style={{ height: 38, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 120, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 200 }} />
      </div>
    );
  }

  // M14: distingue 404 real de erro de rede/500 — nunca mostra "não encontrado" pra um erro transitório.
  if (detail.isError) {
    const err = detail.error as ApiError | undefined;
    if (err?.status === 404) {
      return <div className="label-caps">USUÁRIO NÃO ENCONTRADO</div>;
    }
    return (
      <ErrorBanner
        message={`Falha ao carregar usuário: ${err?.message || "erro desconhecido"}`}
        onRetry={() => detail.refetch()}
      />
    );
  }

  if (!detail.data) return <div className="label-caps">USUÁRIO NÃO ENCONTRADO</div>;

  const { user, counts, payments, clone_tasks, forward_tasks, enc_tasks, ofertas } = detail.data;
  const notesValue = adminNotes ?? String(user.admin_notes ?? "");

  async function savePlanForm(payload: {
    plan: "free" | "paid";
    plan_paid_at?: number;
    plan_expires?: number;
  }) {
    try {
      await patch.mutateAsync(payload);
      toast("ok", `Plano atualizado para ${payload.plan.toUpperCase()}`);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  /** Trial → PAID real. Precisa de `plan_days`: é ele que faz o backend zerar
   *  `trial_started` (routes/users.py) e somar os dias a partir do que ainda
   *  resta. O /extend NÃO serve aqui — ele mantém a conta como trial. */
  async function handlePromote(days: number) {
    try {
      await patch.mutateAsync({ plan: "paid", plan_days: days });
      toast("ok", `Promovido a PAID (+${days} dias)`);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function handleDisconnect() {
    try {
      await disconnect.mutateAsync();
      toast("ok", "Sessão derrubada");
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setConfirmDisconnect(false);
    }
  }

  async function handleBanToggle() {
    try {
      await patch.mutateAsync({ banned: user.banned ? 0 : 1 });
      toast("ok", user.banned ? "Desbanido" : "Banido");
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setConfirmBan(false);
    }
  }

  async function handleGrantTrial(days: number) {
    try {
      await grantTrial.mutateAsync(days);
      toast("ok", `Trial de ${days} dia(s) concedido`);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function handleExtend(days: number) {
    try {
      await extendPlan.mutateAsync(days);
      toast("ok", `Plano estendido em +${days} dia(s)`);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function handleSendMessage() {
    try {
      await sendMessage.mutateAsync({ text: dmText, parse_mode: dmParseMode });
      toast("ok", "Mensagem enviada");
      setDmText("");
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setConfirmDM(false);
    }
  }

  async function handleDeleteUser() {
    try {
      await deleteUser.mutateAsync();
      toast("ok", "Usuário excluído");
      navigate("/users");
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setConfirmDelete(false);
    }
  }

  async function handleSaveNotes() {
    try {
      await patch.mutateAsync({ admin_notes: notesValue });
      toast("ok", "Notas salvas");
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function handleOfertaToggle(ofertaId: number) {
    try {
      const res = await toggleOferta.mutateAsync(ofertaId);
      toast("ok", `Oferta #${ofertaId} ${res.ativo ? "ativada" : "desativada"}`);
      if (res.ativo && !res.looper_running) {
        toast("err", "Looper está parado — a oferta não vai postar até o looper ser iniciado.");
      }
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  async function handleCreateRule(e: React.FormEvent) {
    e.preventDefault();
    if (!newRule.task_label || !newRule.rule_label) {
      toast("err", "Preencha task_label e rule_label");
      return;
    }
    try {
      await createRule.mutateAsync(newRule);
      toast("ok", "Regra salva");
      setNewRule({ ...newRule, rule_label: "", original: "", replacement: "" });
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <button
            className="btn btn-sm"
            onClick={() => navigate("/users")}
            style={{ marginBottom: 12 }}
          >
            <ArrowLeft size={12} />
            VOLTAR
          </button>
          <h1 className="page-title">
            {user.username ? "@" + user.username : user.first_name || `id:${user.user_id}`}
          </h1>
          <div className="page-sub row gap-sm" style={{ flexWrap: "wrap" }}>
            <span>//</span>
            <IdChip value={user.user_id} label="ID" />
            {user.phone && <IdChip value={user.phone} label="TEL" />}
            {user.plan_expires ? (
              <span>
                ·{" "}
                <span
                  className="num"
                  style={{ color: (daysRemaining(user.plan_expires) ?? 0) < 0 ? "var(--danger)" : "var(--text)" }}
                >
                  {fmtDaysRemaining(user.plan_expires)}
                </span>
              </span>
            ) : null}
          </div>
        </div>
        <div className="row gap-sm">
          <PlanTag plan={user.plan} isTrial={isTrialUser(user)} />
          <PulseDot on={!!user.connected} />
          <span className="label-caps">{user.connected ? "ONLINE" : "OFFLINE"}</span>
          {user.banned ? <Tag tone="danger">BANIDO</Tag> : null}
        </div>
      </div>

      {/* Plano */}
      <div className="panel mb-md">
        <div className="panel-header">
          <div className="panel-title">PLANO</div>
        </div>
        {/* key força remontar quando o plano muda no servidor. Sem isto o form
            mantinha o estado local: depois de "DAR TRIAL" ou "+30 DIAS" o
            cabeçalho mostrava a data nova e os campos a antiga — e um SALVAR
            em seguida regravava a data velha, desfazendo a concessão. */}
        <PlanEditor
          key={`plan-${user.user_id}-${user.plan}-${user.plan_expires ?? 0}-${user.plan_paid_at ?? 0}`}
          user={user}
          lastPaidAt={lastPaymentPaidAt(payments)}
          onSave={savePlanForm}
          saving={patch.isPending}
          onGrantTrial={handleGrantTrial}
          grantingTrial={grantTrial.isPending}
          onExtend={handleExtend}
          extending={extendPlan.isPending}
          onPromote={handlePromote}
        />
      </div>

      {/* Ações */}
      <div className="panel mb-md">
        <div className="panel-header">
          <div className="panel-title">AÇÕES</div>
        </div>
        <div className="row gap-sm mb-md" style={{ flexWrap: "wrap" }}>
          <button
            className="btn"
            disabled={!user.connected && !user.has_session}
            onClick={() => setConfirmDisconnect(true)}
          >
            <Plug size={12} /> DERRUBAR SESSÃO
          </button>
          <button
            className={`btn ${user.banned ? "" : "danger"}`}
            onClick={() => setConfirmBan(true)}
          >
            {user.banned ? "DESBANIR" : "BANIR"}
          </button>
          <button className="btn danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={12} /> EXCLUIR USUÁRIO
          </button>
        </div>

        <div>
          <label className="input-label">MENSAGEM DIRETA (DM)</label>
          <textarea
            className="input"
            rows={3}
            value={dmText}
            onChange={(e) => setDmText(e.target.value)}
            placeholder="Texto da mensagem (HTML permitido) — enviada pelo bot"
            style={{ width: "100%", resize: "vertical" }}
          />
          <div className="row gap-sm" style={{ marginTop: 8 }}>
            <select
              className="select"
              value={dmParseMode}
              onChange={(e) => setDmParseMode(e.target.value as "html" | "markdown")}
            >
              <option value="html">HTML</option>
              <option value="markdown">MARKDOWN</option>
            </select>
            <button
              className="btn primary"
              disabled={!dmText.trim() || sendMessage.isPending}
              onClick={() => setConfirmDM(true)}
            >
              <Send size={12} /> ENVIAR DM
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-md">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">PRECIFICAÇÃO</div>
          </div>
          <PriceEditor
            key={`price-${user.user_id}-${user.price_semanal ?? ""}-${user.price_mensal ?? ""}`}
            initial={{ semanal: user.price_semanal, mensal: user.price_mensal }}
            saving={patch.isPending}
            onSave={async (p) => {
              try {
                await patch.mutateAsync({
                  price_semanal: p.semanal,
                  price_mensal: p.mensal,
                });
                toast("ok", "Preços atualizados");
              } catch (e) {
                toast("err", (e as Error).message);
              }
            }}
          />
        </div>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">CONTADORES</div>
          </div>
          <div className="grid-3" style={{ gap: 12 }}>
            <Counter label="CLONES" value={counts.clone_tasks} />
            <Counter label="FORWARDS" value={counts.forward_tasks} />
            <Counter label="ENC" value={counts.enc_tasks} />
            <Counter label="OFERTAS" value={counts.ofertas} />
            <Counter label="PAGTOS" value={counts.payments} />
            <Counter label="REGRAS" value={counts.replace_rules} />
          </div>
        </div>
      </div>

      {/* Dados técnicos */}
      <div className="panel mb-md">
        <div className="panel-header">
          <div className="panel-title">DADOS TÉCNICOS</div>
        </div>
        <div className="grid-3" style={{ gap: 12, fontSize: "var(--fz-sm)" }}>
          <TechField label="DISPOSITIVO" value={String(user.device_model || "—")} />
          <TechField label="SISTEMA" value={String(user.system_version || "—")} />
          <TechField label="APP" value={String(user.app_version || "—")} />
          <TechField label="IDIOMA" value={String(user.lang_code || "—")} />
          <TechField label="1º LOGIN" value={fmtDate(user.first_login_at)} />
          <TechField label="SESSÃO" value={user.has_session ? "ATIVA" : "—"} />
          <TechField label="OBJETIVO (LEAD)" value={String(user.lead_usecase || "—")} />
          <TechField label="ORIGEM" value={String(user.ref_source || "—")} />
        </div>
      </div>

      {/* Clones + Forwards lado a lado (com ações) */}
      <div className="grid-2 mb-md">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">ÚLTIMOS CLONES</div>
          </div>
          <MiniList
            rows={clone_tasks.slice(0, 8).map((c) => ({
              left: <span className="num td-id">#{String(c.id)}</span>,
              mid: String(c.label ?? "—"),
              right: (
                <div className="row gap-sm">
                  <StatusTag status={String(c.status)} />
                  {(c.progress_fail as number) > 0 && (
                    <button
                      className="btn btn-sm icon-only"
                      title="ver erros"
                      onClick={() => setErrorsFor(Number(c.id))}
                    >
                      <AlertTriangle size={12} />
                    </button>
                  )}
                  {(c.status === "running" || c.status === "pending") && (
                    <button
                      className="btn btn-sm icon-only danger"
                      title="cancelar clone"
                      onClick={() => taskAction(() => cancelClone.mutateAsync(Number(c.id)), `Clone #${c.id} cancelado`)}
                    >
                      <XCircle size={12} />
                    </button>
                  )}
                </div>
              ),
            }))}
            empty="Sem clones"
          />
          {errorsFor && <CloneErrorsModal taskId={errorsFor} onClose={() => setErrorsFor(null)} />}
        </div>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">FORWARDS</div>
          </div>
          <MiniList
            rows={forward_tasks.map((f) => ({
              left: <span className="num td-id">#{String(f.id)}</span>,
              mid: String(f.label ?? "—"),
              right: (
                <div className="row gap-sm">
                  <PulseDot on={!!f.active} />
                  {f.active ? (
                    <button
                      className="btn btn-sm icon-only"
                      title="parar"
                      onClick={() => taskAction(() => stopForward.mutateAsync(Number(f.id)), `Forward #${f.id} parado`)}
                    >
                      <Square size={12} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm icon-only"
                      title="iniciar"
                      onClick={() => taskAction(() => startForward.mutateAsync(Number(f.id)), `Forward #${f.id} iniciado`)}
                    >
                      <Play size={12} />
                    </button>
                  )}
                </div>
              ),
            }))}
            empty="Sem forwards"
          />
        </div>
      </div>

      {/* Encaminhadora + Ofertas lado a lado (com ações) */}
      <div className="grid-2 mb-md">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">ENCAMINHADORA</div>
          </div>
          <MiniList
            rows={enc_tasks.map((t) => ({
              left: <span className="num td-id">#{String(t.id)}</span>,
              mid: String(t.name ?? "—"),
              right: (
                <div className="row gap-sm">
                  <PulseDot on={t.status === "active"} />
                  {t.status === "active" ? (
                    <button
                      className="btn btn-sm icon-only"
                      title="parar"
                      onClick={() =>
                        taskAction(() => stopEnc.mutateAsync(Number(t.id)), `Encaminhadora #${t.id} parada`)
                      }
                    >
                      <Square size={12} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm icon-only"
                      title="iniciar"
                      onClick={() =>
                        taskAction(() => startEnc.mutateAsync(Number(t.id)), `Encaminhadora #${t.id} iniciada`)
                      }
                    >
                      <Play size={12} />
                    </button>
                  )}
                </div>
              ),
            }))}
            empty="Sem tarefas de encaminhadora"
          />
        </div>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">OFERTAS ROTATIVAS</div>
          </div>
          <MiniList
            rows={ofertas.map((o) => ({
              left: <span className="num td-id">#{String(o.id)}</span>,
              mid: String(o.name ?? "—"),
              right: (
                <div className="row gap-sm">
                  <PulseDot on={!!o.ativo} />
                  <button
                    className="btn btn-sm icon-only"
                    title={o.ativo ? "desativar" : "ativar"}
                    onClick={() => handleOfertaToggle(Number(o.id))}
                  >
                    {o.ativo ? <Square size={12} /> : <Play size={12} />}
                  </button>
                </div>
              ),
            }))}
            empty="Sem ofertas"
          />
        </div>
      </div>

      {/* Pagamentos — histórico completo */}
      <div className="panel mb-md">
        <div className="panel-header">
          <div className="panel-title">PAGAMENTOS · HISTÓRICO ({(payments || []).length})</div>
        </div>
        <MiniList
          rows={(payments || []).map((p) => ({
            left: <span className="num td-id">#{String(p.id)}</span>,
            mid: (
              <span>
                {fmtDate(p.created_at as number)} ·{" "}
                <span className="num">{fmtReais(p.amount as number)}</span>
              </span>
            ),
            right: <StatusTag status={String(p.status)} />,
          }))}
          empty="Sem pagamentos"
        />
      </div>

      {/* Regras de Replace */}
      <div className="panel mb-md">
        <div className="panel-header">
          <div className="panel-title">REGRAS DE REPLACE</div>
        </div>

        <form onSubmit={handleCreateRule} className="mb-md">
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">TASK_LABEL</label>
              <input
                className="input"
                value={newRule.task_label}
                onChange={(e) => setNewRule({ ...newRule, task_label: e.target.value })}
                placeholder="ex: forward_principal"
              />
            </div>
            <div className="input-group">
              <label className="input-label">TASK_TYPE</label>
              <select
                className="select"
                value={newRule.task_type}
                onChange={(e) => setNewRule({ ...newRule, task_type: e.target.value })}
              >
                <option value="forward">forward</option>
                <option value="clone">clone</option>
              </select>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">RULE_LABEL</label>
              <input
                className="input"
                value={newRule.rule_label}
                onChange={(e) => setNewRule({ ...newRule, rule_label: e.target.value })}
                placeholder="identificador único"
              />
            </div>
            <div className="input-group">
              <label className="input-label">RULE_TYPE</label>
              <select
                className="select"
                value={newRule.rule_type}
                onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value })}
              >
                <option value="basic">basic</option>
                <option value="regex">regex</option>
                <option value="power">power</option>
                <option value="keepwith">keepwith</option>
                <option value="rmline">rmline</option>
                <option value="removelines">removelines</option>
              </select>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">ORIGINAL</label>
              <input
                className="input"
                value={newRule.original}
                onChange={(e) => setNewRule({ ...newRule, original: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">REPLACEMENT</label>
              <input
                className="input"
                value={newRule.replacement}
                onChange={(e) => setNewRule({ ...newRule, replacement: e.target.value })}
              />
            </div>
          </div>
          <button className="btn primary" type="submit" disabled={createRule.isPending}>
            <Plus size={12} />
            {createRule.isPending ? "SALVANDO..." : "ADICIONAR REGRA"}
          </button>
        </form>

        <div className="flex-col" style={{ gap: 6 }}>
          {(rules.data ?? []).map((r) => (
            <div
              key={r.id}
              className="between"
              style={{
                padding: "10px 12px",
                border: "1px solid var(--border)",
                fontSize: "var(--fz-sm)",
              }}
            >
              <div style={{ flex: 1, display: "flex", gap: 12, alignItems: "center" }}>
                <Tag>{r.rule_type.toUpperCase()}</Tag>
                <span style={{ color: "var(--text-dim)" }}>{r.task_label}</span>
                <span style={{ color: "var(--text)" }}>{r.rule_label}</span>
                <span style={{ color: "var(--text-dimmer)" }}>·</span>
                <span style={{ color: "var(--text-dim)" }}>
                  {r.original} → {r.replacement || <em>(vazio)</em>}
                </span>
              </div>
              <button
                className="btn btn-sm icon-only"
                onClick={() => deleteRule.mutate(r.id)}
                aria-label="excluir"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {rules.data && rules.data.length === 0 && (
            <div className="label-caps" style={{ padding: 20, textAlign: "center" }}>
              — sem regras —
            </div>
          )}
        </div>
      </div>

      {/* Notas do admin */}
      <div className="panel mb-md">
        <div className="panel-header">
          <div className="panel-title">NOTAS DO ADMIN</div>
        </div>
        <textarea
          className="input"
          rows={4}
          value={notesValue}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Notas internas — visíveis só pra admins"
          style={{ width: "100%", resize: "vertical" }}
        />
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn primary" onClick={handleSaveNotes} disabled={patch.isPending}>
            {patch.isPending ? "SALVANDO..." : "SALVAR NOTAS"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDisconnect}
        title="Derrubar sessão Telethon?"
        body={
          <>
            Vai desconectar o cliente em memória <strong>e</strong> apagar a session_string
            criptografada. O usuário terá que refazer login Telegram pra usar o bot.
          </>
        }
        confirmLabel="DERRUBAR"
        danger
        loading={disconnect.isPending}
        onConfirm={handleDisconnect}
        onCancel={() => setConfirmDisconnect(false)}
      />

      <ConfirmDialog
        open={confirmBan}
        title={user.banned ? "Desbanir usuário?" : "Banir usuário?"}
        body={
          user.banned ? (
            <>O usuário volta a poder usar o bot.</>
          ) : (
            <>
              O usuário <strong>não</strong> conseguirá mais usar o bot. Pode ser revertido a
              qualquer momento.
            </>
          )
        }
        confirmLabel={user.banned ? "DESBANIR" : "BANIR"}
        danger={!user.banned}
        loading={patch.isPending}
        onConfirm={handleBanToggle}
        onCancel={() => setConfirmBan(false)}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir usuário permanentemente?"
        body={
          <>
            Vai remover <strong>{counts.clone_tasks} clone(s)</strong>,{" "}
            <strong>{counts.forward_tasks} forward(s)</strong>,{" "}
            <strong>{counts.enc_tasks} tarefa(s) de encaminhadora</strong>,{" "}
            <strong>{counts.ofertas} oferta(s)</strong> e{" "}
            <strong>{counts.replace_rules} regra(s)</strong> deste usuário.{" "}
            <strong>Pagamentos são mantidos</strong> (histórico contábil). Se o usuário voltar a
            usar o bot, <strong>poderá ganhar um novo trial</strong>. Esta ação não pode ser
            desfeita.
          </>
        }
        confirmLabel="EXCLUIR"
        danger
        loading={deleteUser.isPending}
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={confirmDM}
        title="Enviar mensagem direta ao usuário?"
        body={
          <>
            <div style={{ marginBottom: 8 }}>
              O bot vai enviar esta mensagem (modo <strong>{dmParseMode.toUpperCase()}</strong>)
              diretamente ao usuário:
            </div>
            <div
              style={{
                padding: "8px 10px",
                border: "1px solid var(--border)",
                whiteSpace: "pre-wrap",
                fontSize: "var(--fz-xs)",
                color: "var(--text-dim)",
              }}
            >
              {dmText}
            </div>
          </>
        }
        confirmLabel="ENVIAR"
        loading={sendMessage.isPending}
        onConfirm={handleSendMessage}
        onCancel={() => setConfirmDM(false)}
      />
    </div>
  );
}

function TechField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label-caps">{label}</div>
      <div style={{ marginTop: 2, color: "var(--text)", wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="label-caps">{label}</div>
      <div className="num" style={{ fontSize: "var(--fz-xl)", marginTop: 2 }}>
        {value ?? 0}
      </div>
    </div>
  );
}

function MiniList({
  rows,
  empty,
}: {
  rows: Array<{ left: React.ReactNode; mid: React.ReactNode; right: React.ReactNode }>;
  empty: string;
}) {
  if (rows.length === 0)
    return <div className="label-caps" style={{ padding: 20, textAlign: "center" }}>— {empty} —</div>;
  return (
    <div className="flex-col" style={{ gap: 0 }}>
      {rows.map((r, i) => (
        <div
          key={i}
          className="between"
          style={{
            padding: "8px 0",
            borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
            fontSize: "var(--fz-sm)",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 60 }}>{r.left}</div>
          <div style={{ flex: 1, color: "var(--text-dim)" }}>{r.mid}</div>
          <div>{r.right}</div>
        </div>
      ))}
    </div>
  );
}

function PriceEditor({
  initial,
  onSave,
  saving,
}: {
  initial: { semanal?: number; mensal?: number };
  onSave: (p: { semanal: number; mensal: number }) => void;
  saving?: boolean;
}) {
  const [semanal, setSemanal] = useState(initial.semanal ?? 0);
  const [mensal, setMensal] = useState(initial.mensal ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ semanal, mensal });
      }}
    >
      <div className="input-row">
        <div className="input-group">
          <label className="input-label">SEMANAL (centavos)</label>
          <input
            className="input num"
            type="number"
            min={0}
            value={semanal}
            onChange={(e) => setSemanal(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label className="input-label">MENSAL (centavos)</label>
          <input
            className="input num"
            type="number"
            min={0}
            value={mensal}
            onChange={(e) => setMensal(Number(e.target.value))}
          />
        </div>
      </div>
      <button className="btn primary" type="submit" disabled={saving}>
        {saving ? "SALVANDO..." : "SALVAR PREÇOS"}
      </button>
    </form>
  );
}

// epoch (segundos) -> "YYYY-MM-DD" pro input[type=date]
/** Dias válidos para trial/extensão: inteiro entre 1 e 3650.
 *
 * `Number("")` é 0 e `Number("abc")` é NaN — ambos passavam direto para o
 * backend (NaN vira null no JSON) e voltavam como erro 422 cru para o admin.
 * Os atributos min/max do <input> não seguram, porque os botões são
 * type="button" fora de um <form>. */
function clampDays(raw: string): number {
  const n = Math.floor(Number(raw));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 3650);
}

function epochToDateInput(epoch: number | undefined | null): string {
  if (!epoch) return "";
  const d = new Date(epoch * 1000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// "YYYY-MM-DD" -> epoch (segundos), no início do dia local
function dateInputToEpoch(s: string): number | undefined {
  if (!s) return undefined;
  const d = new Date(s + "T00:00:00");
  if (Number.isNaN(d.getTime())) return undefined;
  return Math.floor(d.getTime() / 1000);
}

function lastPaymentPaidAt(payments: Array<Record<string, unknown>>): number | undefined {
  if (!payments || payments.length === 0) return undefined;
  const paid = payments
    .filter((p) => String(p.status) === "paid")
    .map((p) => Number(p.paid_at || 0))
    .filter((n) => n > 0);
  if (!paid.length) return undefined;
  return Math.max(...paid);
}

function PlanEditor({
  user,
  lastPaidAt,
  onSave,
  saving,
  onGrantTrial,
  grantingTrial,
  onExtend,
  extending,
  onPromote,
}: {
  user: import("@/lib/queries").User;
  lastPaidAt: number | undefined;
  onSave: (p: {
    plan: "free" | "paid";
    plan_paid_at?: number;
    plan_expires?: number;
  }) => void;
  saving: boolean;
  onGrantTrial: (days: number) => Promise<void>;
  grantingTrial: boolean;
  onExtend: (days: number) => Promise<void>;
  extending: boolean;
  onPromote: (days: number) => Promise<void>;
}) {
  const effectivePlan: "free" | "paid" =
    String(user.plan) === "paid" || String(user.plan) === "vip" ? "paid" : "free";
  const currentlyTrial = isTrialUser(user);

  const [plan, setPlan] = useState<"free" | "paid">(effectivePlan);
  const [paidAt, setPaidAt] = useState<string>(
    epochToDateInput(user.plan_paid_at || lastPaidAt),
  );
  const [expires, setExpires] = useState<string>(
    epochToDateInput(user.plan_expires),
  );
  const [trialDays, setTrialDays] = useState(7);
  const [extendDays, setExtendDays] = useState(30);
  const [confirmTrial, setConfirmTrial] = useState(false);
  const [confirmExtend, setConfirmExtend] = useState(false);
  const [confirmPromote, setConfirmPromote] = useState(false);
  // dias somados ao promover; reaproveita o mesmo campo de "estender"
  const promoteDays = extendDays;

  const expiresEpoch = dateInputToEpoch(expires);
  const daysLeft =
    expiresEpoch !== undefined
      ? Math.max(0, Math.floor((expiresEpoch - Date.now() / 1000) / 86400))
      : null;

  const previewExtendEpoch =
    Math.max(Math.floor(Date.now() / 1000), user.plan_expires || 0) + extendDays * 86400;
  const previewExtendDate = new Date(previewExtendEpoch * 1000).toLocaleDateString("pt-BR");

  function applyPreset(days: number) {
    setPlan("paid");
    const today = new Date();
    setPaidAt(epochToDateInput(Math.floor(today.getTime() / 1000)));
    const exp = new Date(today.getTime() + days * 86400 * 1000);
    setExpires(epochToDateInput(Math.floor(exp.getTime() / 1000)));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload: {
      plan: "free" | "paid";
      plan_paid_at?: number;
      plan_expires?: number;
    } = { plan };
    if (plan === "paid") {
      payload.plan_paid_at = dateInputToEpoch(paidAt);
      payload.plan_expires = dateInputToEpoch(expires);
      if (!payload.plan_expires) {
        toast("err", "Defina a data de expiração para o plano PAID.");
        return;
      }
    } else {
      payload.plan_expires = 0;
    }
    onSave(payload);
  }

  return (
    <>
    <form onSubmit={submit}>
      <div className="input-row">
        <div className="input-group">
          <label className="input-label">PLANO</label>
          <select
            className="select"
            value={plan}
            onChange={(e) => setPlan(e.target.value as "free" | "paid")}
          >
            <option value="free">FREE</option>
            <option value="paid">PAID</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">DIAS RESTANTES</label>
          <div
            className="num"
            style={{
              padding: "8px 12px",
              border: "1px solid var(--border)",
              fontSize: "var(--fz-sm)",
              color: daysLeft === null ? "var(--text-dim)" : "var(--text)",
            }}
          >
            {plan === "free" ? "—" : daysLeft === null ? "—" : `${daysLeft}d`}
          </div>
        </div>
      </div>

      <div
        className="input-row"
        style={{ opacity: plan === "free" ? 0.45 : 1 }}
      >
        <div className="input-group">
          <label className="input-label">DATA DO PAGAMENTO</label>
          <input
            className="input"
            type="date"
            value={paidAt}
            onChange={(e) => setPaidAt(e.target.value)}
            disabled={plan === "free"}
          />
          {lastPaidAt ? (
            <div className="label-caps" style={{ marginTop: 4, fontSize: 10 }}>
              último PIX: {epochToDateInput(lastPaidAt)}
            </div>
          ) : null}
        </div>
        <div className="input-group">
          <label className="input-label">DATA DE EXPIRAÇÃO</label>
          <input
            className="input"
            type="date"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
            disabled={plan === "free"}
          />
        </div>
      </div>

      <div className="row gap-sm" style={{ flexWrap: "wrap", marginTop: 8 }}>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => applyPreset(15)}
        >
          PRESET 15D
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => applyPreset(30)}
        >
          PRESET 30D
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            setPlan("free");
            setExpires("");
            setPaidAt("");
          }}
        >
          SET FREE
        </button>
        {/* Só em trial: o SALVAR do formulário não zera `trial_started`, então
            sem este botão não havia como transformar tester em pagante real —
            ele continuava aparecendo na aba Testers e fora dos VIPs. */}
        {currentlyTrial && (
          <button
            type="button"
            className="btn btn-sm primary"
            disabled={saving}
            onClick={() => setConfirmPromote(true)}
            title="Encerrar o trial e virar PAID real"
          >
            ⭐ PROMOVER A PAID
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? "SALVANDO..." : "SALVAR"}
        </button>
      </div>
    </form>

    <div
      className="row gap-sm"
      style={{ flexWrap: "wrap", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}
    >
      <div className="input-group" style={{ flex: "0 0 auto" }}>
        <label className="input-label">TRIAL (DIAS)</label>
        <div className="row gap-sm">
          <input
            className="input num"
            type="number"
            min={1}
            max={90}
            style={{ width: 70 }}
            value={trialDays}
            onChange={(e) => setTrialDays(clampDays(e.target.value))}
          />
          <button
            type="button"
            className="btn btn-sm"
            disabled={grantingTrial}
            onClick={() => setConfirmTrial(true)}
          >
            DAR TRIAL {trialDays}D
          </button>
        </div>
      </div>
      <div className="input-group" style={{ flex: "0 0 auto" }}>
        <label className="input-label">ESTENDER (DIAS)</label>
        <div className="row gap-sm">
          <input
            className="input num"
            type="number"
            min={1}
            max={365}
            style={{ width: 70 }}
            value={extendDays}
            onChange={(e) => setExtendDays(clampDays(e.target.value))}
          />
          <button
            type="button"
            className="btn btn-sm"
            disabled={extending}
            onClick={() => setConfirmExtend(true)}
          >
            +{extendDays} DIAS
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      open={confirmPromote}
      title={`Promover a PAID (+${promoteDays} dias)?`}
      body={
        <>
          O trial termina e a conta vira <strong>pagante de verdade</strong>. Os
          dias que ainda restam do trial <strong>somam</strong> aos{" "}
          {promoteDays} — nada se perde. O usuário sai da aba Testers e passa a
          contar como VIP.
        </>
      }
      confirmLabel="PROMOVER"
      loading={saving}
      onConfirm={async () => {
        await onPromote(promoteDays);
        setConfirmPromote(false);
      }}
      onCancel={() => setConfirmPromote(false)}
    />

    <ConfirmDialog
      open={confirmTrial}
      title={`Conceder trial de ${trialDays} dia(s)?`}
      body={
        effectivePlan === "paid" && !currentlyTrial ? (
          <>
            Este usuário já tem plano <strong>PAID real</strong>. Conceder trial vai{" "}
            <strong>sobrescrever a expiração atual</strong> e marcar a conta como trial (
            <code>trial_started</code>).
          </>
        ) : (
          <>
            O usuário ganha <strong>{trialDays} dia(s)</strong> de Premium a partir de agora.
          </>
        )
      }
      confirmLabel="CONCEDER TRIAL"
      loading={grantingTrial}
      onConfirm={async () => {
        await onGrantTrial(trialDays);
        setConfirmTrial(false);
      }}
      onCancel={() => setConfirmTrial(false)}
    />

    <ConfirmDialog
      open={confirmExtend}
      title={`Estender plano em +${extendDays} dia(s)?`}
      body={
        <>
          Nova expiração prevista: <strong>{previewExtendDate}</strong>.{" "}
          {effectivePlan === "free" ? <>O usuário vira PAID.</> : <>Continua com o plano atual (trial estende como trial).</>}
        </>
      }
      confirmLabel="ESTENDER"
      loading={extending}
      onConfirm={async () => {
        await onExtend(extendDays);
        setConfirmExtend(false);
      }}
      onCancel={() => setConfirmExtend(false)}
    />
    </>
  );
}
