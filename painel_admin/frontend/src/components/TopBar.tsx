import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useLogout, type AdminMe } from "@/lib/queries";

const CRUMBS: Record<string, string> = {
  "/": "DASHBOARD",
  "/funil": "FUNIL",
  "/users": "USUÁRIOS",
  "/vips": "USUÁRIOS VIPS",
  "/testers": "USUÁRIOS TESTERS",
  "/vips-expirados": "VIPS EXPIRADOS",
  "/trial": "TRIAL",
  "/tasks": "TAREFAS",
  "/payments": "PAGAMENTOS",
  "/broadcast": "BROADCAST",
  "/texts": "TEXTOS",
  "/fluxo-inicial": "FLUXO INICIAL",
  "/settings": "SETTINGS",
};

export function TopBar({
  me,
  navOpen,
  onToggleNav,
}: {
  me?: AdminMe;
  navOpen?: boolean;
  onToggleNav?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const parts = location.pathname.split("/").filter(Boolean);
  const top = "/" + (parts[0] || "");
  const topLabel = CRUMBS[top] ?? CRUMBS["/"] ?? "—";

  return (
    <header className="shell-top">
      {onToggleNav && (
        <button
          className="nav-toggle"
          onClick={onToggleNav}
          aria-label={navOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={!!navOpen}
          aria-controls="app-nav"
        >
          {navOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}
      <div className="crumbs">
        <span className="sep">[</span>
        <strong>TLP.ADMIN</strong>
        <span className="sep">/</span>
        <strong>{topLabel}</strong>
        {parts.length > 1 && (
          <>
            <span className="sep">/</span>
            <strong>{parts.slice(1).join(" / ").toUpperCase()}</strong>
          </>
        )}
        <span className="sep">]</span>
      </div>

      <div className="topbar-meta">
        <span>
          {now.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
        <span className="sep">·</span>
        <span>
          {now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
        </span>
      </div>

      <div
        className="topbar-user"
        onClick={async () => {
          await logout.mutateAsync().catch(() => null);
          navigate("/login", { replace: true });
        }}
        title="Sair"
      >
        <span className="topbar-user-name">
          @{me?.username || me?.first_name || `id:${me?.user_id ?? "?"}`}
        </span>
        <LogOut size={14} color="var(--text-dim)" />
      </div>
    </header>
  );
}
