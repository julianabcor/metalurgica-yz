import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  LifeBuoy,
  Activity,
  HardHat,
  FileText,
  ShieldAlert,
  LogOut,
  Building2,
  Info,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pedidos", label: "Pedidos", icon: Package },
  { to: "/suporte", label: "Suporte", icon: LifeBuoy },
  { to: "/maquinas", label: "Máquinas", icon: Activity },
  { to: "/epi", label: "EPI", icon: HardHat },
  { to: "/documentos", label: "Documentos", icon: FileText },
  { to: "/denuncias", label: "Denúncias", icon: ShieldAlert },
  { to: "/sobre", label: "Sobre", icon: Info },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="w-60 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold">Metalúrgica YZ</div>
            <div className="text-[11px] text-sidebar-foreground/60">Portal interno</div>
          </div>
        </div>
        <nav className="px-3 py-2 flex-1 space-y-1">
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3 space-y-2">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent grid place-items-center text-xs">
              JB
            </div>
            <div className="text-xs truncate">julianabcor08@gmail.com</div>
          </div>
          <button className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyCard({
  icon: Icon,
  title,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border bg-card py-16 px-6 flex flex-col items-center justify-center text-center">
      <Icon className="h-8 w-8 text-muted-foreground/60 mb-3" />
      <p className="text-sm text-muted-foreground">{title}</p>
      {hint && <p className="text-xs text-muted-foreground/70 mt-1">{hint}</p>}
    </div>
  );
}
