import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import {
  Building2,
  LogOut,
  BarChart3,
  Activity,
  ShieldAlert,
  HardHat,
} from "lucide-react";

export const Route = createFileRoute("/gestao")({ component: GestaoPage });

type Panel = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
};

const PANELS: Panel[] = [
  {
    key: "logins",
    title: "Registro de Logins",
    subtitle: "Acessos, horários e atividade na plataforma",
    description:
      "Histórico completo de entradas dos funcionários, picos de tráfego, dispositivos e sessões ativas em tempo real.",
    icon: Activity,
    url: "",
  },
  {
    key: "ouvidoria",
    title: "Canal de Reclamações & Ouvidoria",
    subtitle: "Denúncias anônimas e nominais",
    description:
      "Painel analítico das ocorrências enviadas pelos operadores — categorias, tendências e tempo médio de tratativa.",
    icon: ShieldAlert,
    url: "",
  },
  {
    key: "epis",
    title: "Controle de EPIs",
    subtitle: "Requisições, entregas e estoque",
    description:
      "Volume de pedidos por tipo, status de entrega, ranking de consumo por setor e nível de estoque simulado.",
    icon: HardHat,
    url: "",
  },
];

function GestaoPage() {
  const { user, role, cargo, ready, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/login" });
    else if (role && role !== "gestor") navigate({ to: "/dashboard" });
  }, [ready, user, role, navigate]);

  if (!ready || role !== "gestor") {
    return <div className="min-h-screen" style={{ background: "#0b1220" }} />;
  }

  const cargoLabel = cargo === "gestao" ? "Diretoria" : cargo === "chefia" ? "Chefia" : "Gestão";

  return (
    <div
      className="min-h-screen text-slate-100"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(20,84,184,0.25), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(99,102,241,0.18), transparent 60%), linear-gradient(180deg, #0b1220 0%, #0f1b3d 100%)",
      }}
    >
      {/* Topbar */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#1454b8] to-[#4f46e5] grid place-items-center font-bold shadow-lg shadow-indigo-900/40">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-[15px] tracking-tight">
                Painel de Direção Estratégica & Gestão
              </div>
              <div className="text-[11px] text-slate-300/70 uppercase tracking-[0.18em]">
                Metalúrgica YZ · {cargoLabel}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-[11px] text-slate-300/70">
                Matrícula {user?.matricula ?? "—"}
              </div>
            </div>
            <button
              onClick={async () => { await logout(); navigate({ to: "/login" }); }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/10"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Hero */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300/80">
            <BarChart3 className="h-3.5 w-3.5" /> Visão executiva
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Bem-vindo(a), {user?.name?.split(" ")[0]}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300/80">
            Indicadores operacionais e analíticos em tempo real. Use os painéis abaixo para
            acompanhar acessos, ouvidoria e fluxo de EPIs em toda a planta.
          </p>

          {/* KPIs rápidos */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Usuários ativos hoje", value: "—" },
              { label: "Denúncias em aberto", value: "—" },
              { label: "Pedidos de EPI pendentes", value: "—" },
              { label: "Status geral", value: "Operacional" },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3"
              >
                <div className="text-[11px] uppercase tracking-wider text-slate-300/60">
                  {k.label}
                </div>
                <div className="mt-1 text-lg font-semibold">{k.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Power BI panels */}
        <section className="space-y-6">
          {PANELS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <article
                key={p.key}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur overflow-hidden shadow-xl shadow-black/20"
              >
                <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-white/10 grid place-items-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-300/60">
                          Seção 0{idx + 1}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold truncate">{p.title}</h2>
                      <p className="text-xs text-slate-300/70">{p.subtitle}</p>
                    </div>
                  </div>
                  <span className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 text-amber-200 border border-amber-300/20 px-2.5 py-1 text-[11px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
                    Aguardando publicação
                  </span>
                </header>

                <div className="grid lg:grid-cols-[1fr_320px]">
                  {/* iframe / placeholder */}
                  <div className="relative aspect-video lg:aspect-auto lg:min-h-[420px] bg-[#0a1428] border-b lg:border-b-0 lg:border-r border-white/10">
                    {p.url ? (
                      <iframe
                        title={p.title}
                        src={p.url}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <PowerBIPlaceholder title={p.title} />
                    )}
                  </div>

                  {/* Descrição lateral */}
                  <aside className="p-6 flex flex-col gap-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300/60 mb-1">
                        Sobre este painel
                      </div>
                      <p className="text-sm text-slate-200/90 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-[11px] text-slate-300/80">
                      Para conectar, cole a URL "Publicar na Web" do Power BI no arquivo{" "}
                      <code className="text-slate-100">src/routes/gestao.tsx</code> (constante{" "}
                      <code className="text-slate-100">PANELS</code>).
                    </div>
                  </aside>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="mt-10 text-center text-[11px] text-slate-300/50">
          © 2026 Metalúrgica YZ · Painel restrito à direção e chefias.
        </footer>
      </main>
    </div>
  );
}

function PowerBIPlaceholder({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* fake toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-rose-400/70" />
          <div className="h-2 w-2 rounded-full bg-amber-400/70" />
          <div className="h-2 w-2 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-[11px] text-slate-300/60">
            powerbi.microsoft.com · {title}
          </span>
        </div>
        <span className="text-[11px] text-slate-300/40">Carregando dataset…</span>
      </div>

      {/* fake dashboard */}
      <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-3 p-4">
        <div className="col-span-2 row-span-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-white/5 p-4 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-slate-300/60">
            Tendência mensal
          </div>
          <div className="mt-1 text-2xl font-semibold text-white/90">—</div>
          <div className="mt-auto flex items-end gap-1 h-24">
            {[40, 55, 35, 70, 50, 80, 65, 90, 75, 95, 85, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-indigo-400/60 to-cyan-300/60"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-white/[0.04] border border-white/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-300/60">Total</div>
          <div className="mt-1 text-xl font-semibold">—</div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-3/4 bg-emerald-400/70" />
          </div>
        </div>
        <div className="rounded-lg bg-white/[0.04] border border-white/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-300/60">Categoria</div>
          <div className="mt-2 space-y-1.5">
            {[80, 55, 30].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-indigo-300/70" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3 rounded-lg bg-white/[0.04] border border-white/5 p-3 flex items-center gap-3">
          <div className="h-16 w-16 rounded-full border-4 border-indigo-400/60 border-t-transparent animate-spin" />
          <div className="text-xs text-slate-300/70">
            Aguardando incorporação do Power BI…
            <div className="text-[10px] text-slate-300/40 mt-0.5">
              O painel real aparecerá aqui assim que a URL for configurada.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
