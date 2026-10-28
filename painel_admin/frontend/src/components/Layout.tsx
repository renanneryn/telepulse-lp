import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuthGuard } from "@/hooks/useAuth";
import { useToasts } from "@/hooks/useToast";
import { CheckCircle, XCircle } from "lucide-react";

export function Layout() {
  const { me, loading } = useAuthGuard();
  const toasts = useToasts();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  // Fecha ao navegar. O Layout não desmonta entre rotas, então sem isto a
  // gaveta ficaria aberta por cima da página nova. `search` entra na lista
  // porque /users?plan=free -> /users?connected=1 não muda o pathname.
  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  if (loading) {
    return (
      <div className="login-shell">
        <div className="label-caps">[ verificando sessão ... ]</div>
      </div>
    );
  }

  if (!me) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={navOpen ? "shell nav-open" : "shell"}>
      <Sidebar />
      <TopBar me={me} navOpen={navOpen} onToggleNav={() => setNavOpen((v) => !v)} />
      <main className="shell-main">
        <Outlet />
      </main>
      <div
        className="nav-backdrop"
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`}>
            {t.kind === "ok" ? (
              <CheckCircle size={14} color="var(--accent)" />
            ) : (
              <XCircle size={14} color="var(--danger)" />
            )}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
