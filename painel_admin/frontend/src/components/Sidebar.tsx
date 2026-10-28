import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { usePref } from "@/hooks/usePref";
import {
  Activity,
  Filter,
  CircleSlash as CrownIcon,
  Users,
  Crown,
  Zap,
  Gift,
  FileText,
  ListChecks,
  CreditCard,
  Megaphone,
  Workflow,
  Rocket,
  Settings as SettingsIcon,
  ChevronDown,
} from "lucide-react";

const items = [
  { to: "/", label: "DASHBOARD", icon: Activity, end: true },
  { to: "/funil", label: "FUNIL", icon: Filter },
  { to: "/users", label: "USUÁRIOS", icon: Users, group: true },
  { to: "/trial", label: "TRIAL", icon: Gift },
  { to: "/tasks", label: "TAREFAS", icon: ListChecks },
  { to: "/clones", label: "CLONES", icon: Rocket },
  { to: "/payments", label: "PAGAMENTOS", icon: CreditCard },
  { to: "/broadcast", label: "BROADCAST", icon: Megaphone },
  { to: "/texts", label: "TEXTOS", icon: FileText },
  { to: "/flows", label: "AUTOMAÇÕES", icon: Workflow },
  { to: "/settings", label: "SETTINGS", icon: SettingsIcon },
];

// Subabas de USUÁRIOS (recolhíveis)
const userSubItems = [
  { to: "/vips", label: "VIPS", icon: Crown },
  { to: "/testers", label: "TRIAL (TESTERS)", icon: Zap },
  { to: "/vips-expirados", label: "VIPS EXPIRADOS", icon: CrownIcon },
];

export function Sidebar() {
  const location = useLocation();
  const [usersOpen, setUsersOpen] = usePref<boolean>("nav.usersOpen", false);
  const subActive = userSubItems.some((i) => location.pathname.startsWith(i.to));
  // abriu numa subaba (link direto, reload): o grupo aparece aberto
  useEffect(() => {
    if (subActive) setUsersOpen(true);
  }, [subActive, setUsersOpen]);

  return (
    <aside className="shell-aside" id="app-nav">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 32 32" fill="none">
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

      <nav className="nav">
        <div className="nav-section label-caps">// nav</div>
        {items.map(({ to, label, icon: Icon, end, group }) =>
          group ? (
            <div key={to} className="nav-group">
              <div className="nav-group-row">
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
                <button
                  type="button"
                  className={"nav-caret" + (usersOpen ? " open" : "")}
                  aria-expanded={usersOpen}
                  aria-controls="nav-users-sub"
                  title={usersOpen ? "Recolher" : "Expandir"}
                  onClick={() => setUsersOpen(!usersOpen)}
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <div id="nav-users-sub" className={"nav-sub" + (usersOpen ? "" : " closed")}>
                {userSubItems.map(({ to: subTo, label: subLabel, icon: SubIcon }) => (
                  <NavLink
                    key={subTo}
                    to={subTo}
                    className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                  >
                    <SubIcon size={14} />
                    <span>{subLabel}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ),
        )}
      </nav>

      <div className="aside-footer">
        <span>v1.0.0</span>
        <span>·</span>
        <span>online</span>
      </div>
    </aside>
  );
}
