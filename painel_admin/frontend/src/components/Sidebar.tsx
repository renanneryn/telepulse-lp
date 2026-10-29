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
  Repeat,
  CalendarClock,
  BadgePercent,
  Palette,
} from "lucide-react";

type Item = { to: string; label: string; icon: typeof Users; end?: boolean; group?: string };

const items: Item[] = [
  { to: "/", label: "DASHBOARD", icon: Activity, end: true },
  { to: "/funil", label: "FUNIL", icon: Filter },
  { to: "/users", label: "USUÁRIOS", icon: Users, group: "users" },
  { to: "/personalizar", label: "PERSONALIZAR", icon: Palette, group: "custom" },
  { to: "/tasks", label: "TAREFAS", icon: ListChecks, group: "tasks" },
  { to: "/payments", label: "PAGAMENTOS", icon: CreditCard },
  { to: "/broadcast", label: "BROADCAST", icon: Megaphone },
  { to: "/settings", label: "SETTINGS", icon: SettingsIcon },
];

// Subabas recolhíveis de cada grupo. `link` = o título do grupo também abre
// uma tela (Usuários abre a lista geral); sem isso o título só abre/fecha.
const GROUPS: Record<string, { link: boolean; sub: { to: string; label: string; icon: typeof Users }[] }> = {
  users: {
    link: true,
    sub: [
      { to: "/vips", label: "VIPS", icon: Crown },
      { to: "/testers", label: "TRIAL (TESTERS)", icon: Zap },
      { to: "/vips-expirados", label: "VIPS EXPIRADOS", icon: CrownIcon },
      { to: "/trial", label: "TRIAL", icon: Gift },
    ],
  },
  custom: {
    link: false,
    sub: [
      { to: "/texts", label: "TEXTOS", icon: FileText },
      { to: "/fluxo-inicial", label: "FLUXO INICIAL", icon: Workflow },
    ],
  },
  tasks: {
    link: false,
    sub: [
      { to: "/tasks/clones", label: "CLONE", icon: Rocket },
      { to: "/tasks/espelhar", label: "ESPELHAR", icon: Repeat },
      { to: "/tasks/agendar", label: "AGENDAR POSTS", icon: CalendarClock },
      { to: "/tasks/ofertas", label: "OFERTAS ROTATIVAS", icon: BadgePercent },
    ],
  },
};

function NavGroup({ item }: { item: Item }) {
  const location = useLocation();
  const g = GROUPS[item.group as string];
  const [open, setOpen] = usePref<boolean>(`nav.${item.group}Open`, false);
  const subActive = g.sub.some((i) => location.pathname.startsWith(i.to));
  // abriu numa subaba (link direto, reload): o grupo aparece aberto
  useEffect(() => {
    if (subActive) setOpen(true);
  }, [subActive, setOpen]);
  const Icon = item.icon;
  const subId = `nav-${item.group}-sub`;

  return (
    <div className="nav-group">
      <div className="nav-group-row">
        {g.link ? (
          <NavLink to={item.to} end={item.end} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <Icon size={16} />
            <span>{item.label}</span>
          </NavLink>
        ) : (
          <button
            type="button"
            className={"nav-item nav-group-toggle" + (subActive && !open ? " active" : "")}
            aria-expanded={open}
            aria-controls={subId}
            onClick={() => setOpen(!open)}
          >
            <Icon size={16} />
            <span>{item.label}</span>
          </button>
        )}
        <button
          type="button"
          className={"nav-caret" + (open ? " open" : "")}
          aria-expanded={open}
          aria-controls={subId}
          title={open ? "Recolher" : "Expandir"}
          onClick={() => setOpen(!open)}
        >
          <ChevronDown size={14} />
        </button>
      </div>
      <div id={subId} className={"nav-sub" + (open ? "" : " closed")}>
        {g.sub.map(({ to, label, icon: SubIcon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <SubIcon size={14} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function Sidebar() {
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
        {items.map((item) =>
          item.group ? (
            <NavGroup key={item.to} item={item} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
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
