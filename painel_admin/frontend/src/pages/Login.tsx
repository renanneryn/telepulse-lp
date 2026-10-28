import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDevLogin, useMe, useTelegramLogin, useWebAppLogin } from "@/lib/queries";
import type { TelegramAuthUser } from "../../vite-env";

const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "";

// Mostra o botao "DEV LOGIN" apenas em ambientes locais
function isLocalDev(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h.endsWith(".local");
}

export function Login() {
  const navigate = useNavigate();
  const me = useMe();
  const login = useTelegramLogin();
  const devLogin = useDevLogin();
  const webAppLogin = useWebAppLogin();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const showDev = isLocalDev();

  // Se já está logado, redireciona pra home
  useEffect(() => {
    if (me.data) navigate("/", { replace: true });
  }, [me.data, navigate]);

  // Aberto pelo /adm dentro do Telegram (Mini App): entra sozinho com o initData
  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa?.initData) return;
    wa.ready();
    wa.expand();
    webAppLogin.mutate(wa.initData, {
      onSuccess: () => navigate("/", { replace: true }),
      onError: (e: unknown) => setError((e as Error)?.message || "Falha na autenticação"),
    });
    // roda uma vez, na abertura
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função global que o Telegram Widget chama
  useEffect(() => {
    window.onTelegramAuth = (user: TelegramAuthUser) => {
      setError(null);
      login.mutate(user, {
        onSuccess: () => navigate("/", { replace: true }),
        onError: (e: unknown) => {
          const msg = (e as Error)?.message || "Falha na autenticação";
          setError(msg);
        },
      });
    };
    return () => {
      delete window.onTelegramAuth;
    };
  }, [login, navigate]);

  // Injeta o script do widget
  useEffect(() => {
    if (!widgetRef.current || !BOT_USERNAME) return;
    widgetRef.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.async = true;
    s.setAttribute("data-telegram-login", BOT_USERNAME);
    s.setAttribute("data-size", "large");
    s.setAttribute("data-onauth", "onTelegramAuth(user)");
    s.setAttribute("data-request-access", "write");
    s.setAttribute("data-radius", "0");
    widgetRef.current.appendChild(s);
  }, []);

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="brand" style={{ padding: 0, border: "none", marginBottom: 18 }}>
          <svg viewBox="0 0 32 32" width={22} height={22} fill="none">
            <path
              d="M3 16 H8 L10 8 L14 24 L16 14 L18 18 H29"
              stroke="#b8ff3d"
              strokeWidth={2.4}
              strokeLinecap="square"
            />
            <circle cx="29" cy="18" r="1.6" fill="#b8ff3d" />
          </svg>
          <div className="brand-name">
            TELEPULSE<span className="brand-dot">.</span>
          </div>
        </div>

        <div className="login-title">Admin console</div>
        <div className="login-sub">
          Acesso restrito. Autentique com a conta Telegram registrada como administrador do bot.
        </div>

        {!BOT_USERNAME && (
          <div className="login-error">
            <strong>VITE_TELEGRAM_BOT_USERNAME</strong> não configurado. Defina o username do bot no
            <code style={{ padding: "0 4px" }}>.env</code> e rode o build novamente.
          </div>
        )}

        <div className="login-widget-host" ref={widgetRef} />

        {showDev && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              devLogin.mutate(undefined, {
                onSuccess: () => navigate("/", { replace: true }),
                onError: (e: unknown) => {
                  const msg = (e as Error)?.message || "dev login falhou";
                  setError(msg);
                },
              });
            }}
            disabled={devLogin.isPending}
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background: "transparent",
              border: "1px dashed #b8ff3d",
              color: "#b8ff3d",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: devLogin.isPending ? "wait" : "pointer",
              width: "100%",
            }}
            title="Bypass do Telegram (apenas em localhost)"
          >
            {devLogin.isPending ? "// authenticating..." : "// dev login (localhost only)"}
          </button>
        )}

        {(login.isPending || devLogin.isPending || webAppLogin.isPending) && (
          <div className="login-help" style={{ textAlign: "center" }}>
            [ validando assinatura ... ]
          </div>
        )}

        {error && <div className="login-error">{error}</div>}

        <div className="login-help">
          // o domínio precisa estar registrado no BotFather via{" "}
          <code>/setdomain</code>. Sua sessão fica em cookie httpOnly e expira em 7 dias.
        </div>
      </div>
    </div>
  );
}
