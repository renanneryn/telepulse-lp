import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMe } from "@/lib/queries";

/**
 * Gate de auth. Em qualquer rota protegida:
 * - Se /api/auth/me retorna 200 → renderiza.
 * - Se 401 (sem cookie / token inválido / não-admin) → redireciona para /login.
 * Também escuta o evento 'tlp:unauthenticated' emitido pelo api.ts.
 */
export function useAuthGuard() {
  const me = useMe();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handler() {
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true, state: { from: location.pathname } });
      }
    }
    window.addEventListener("tlp:unauthenticated", handler);
    return () => window.removeEventListener("tlp:unauthenticated", handler);
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (me.isError && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [me.isError, navigate, location.pathname]);

  return {
    me: me.data,
    loading: me.isLoading,
    authenticated: !!me.data,
  };
}
