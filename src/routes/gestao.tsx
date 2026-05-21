import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  LogOut,
  Package,
  LifeBuoy,
  HardHat,
  ShieldAlert,
  RefreshCw,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/gestao")({ component: GestaoPage });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type TabKey = "pedidos" | "chamados" | "epis" | "denuncias" | "powerbi";

type Row = Record<string, unknown> & {
  id: string;
  user_id: string;
  status?: string;
  created_at: string;
  _autor?: string;
};

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; statuses?: string[] }[] = [
  { key: "pedidos", label: "Pedidos", icon: Package, statuses: ["Em produção", "Separação", "Enviado", "Entregue"] },
  { key: "chamados", label: "Chamados", icon: LifeBuoy, statuses: ["Aberto", "Em análise", "Resolvido"] },
  { key: "epis", label: "EPI", icon: HardHat, statuses: ["Pendente", "Aprovado", "Entregue"] },
  { key: "denuncias", label: "Denúncias", icon: ShieldAlert },
  { key: "powerbi", label: "Power BI", icon: BarChart3 },
];

const POWER_BI_PANELS: { title: string; subtitle: string; url: string }[] = [
  { title: "Produção", subtitle: "Volume, OEE e paradas", url: "" },
  { title: "Vendas & Pedidos", subtitle: "Carteira, faturamento e mix", url: "" },
  { title: "Qualidade", subtitle: "Refugo, retrabalho e PPM", url: "" },
  { title: "RH & Segurança", subtitle: "Absenteísmo, acidentes e EPI", url: "" },
];

function GestaoPage() {
  const { user, role, ready, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("pedidos");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/login" });
    else if (role && role !== "gestor") navigate({ to: "/dashboard" });
  }, [ready, user, role, navigate]);

  const load = useCallback(async () => {
    if (role !== "gestor") return;
    if (tab === "powerbi") { setRows([]); return; }
    setLoading(true);
    const { data, error } = await db.from(tab).select("*").order("created_at", { ascending: false });
    if (error) { console.error(error); setLoading(false); return; }
    const list = (data ?? []) as Row[];
    const ids = Array.from(new Set(list.map((r) => r.user_id)));
    let names: Record<string, string> = {};
    if (ids.length) {
      const { data: profs } = await db.from("profiles").select("id,nome").in("id", ids);
      names = Object.fromEntries(((profs ?? []) as { id: string; nome: string }[]).map((p) => [p.id, p.nome]));
    }
    setRows(list.map((r) => ({ ...r, _autor: names[r.user_id] ?? "Usuário" })));
    setLoading(false);
  }, [tab, role]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await db.from(tab).update({ status }).eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  };

  if (!ready || role !== "gestor") {
    return <div className="min-h-screen" style={{ background: "#061a4a" }} />;
  }

  const currentTab = TABS.find((t) => t.key === tab)!;
  const counts: Record<TabKey, number> = { pedidos: 0, chamados: 0, epis: 0, denuncias: 0, powerbi: 0 };
  counts[tab] = rows.length;

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(180deg, #061a4a 0%, #0a2a6c 60%, #0b1d52 100%)",
      }}
    >
      {/* Topbar */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/15 grid place-items-center font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Diretoria · Metalúrgica YZ</div>
              <div className="text-[11px] text-white/60 uppercase tracking-wider">Painel de gestão</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-white/60">{user?.email}</div>
            </div>
            <button
              onClick={async () => { await logout(); navigate({ to: "/login" }); }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-white/10 hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Solicitações dos operadores</h1>
        <p className="text-sm text-white/70 mt-1">
          Acompanhe e responda às solicitações enviadas pela operação.
        </p>

        {/* Tabs */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? "bg-white text-[#0a2a6c] border-white"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-semibold">{t.label}</span>
                </div>
                <div className={`mt-2 text-2xl font-bold ${active ? "text-[#0a2a6c]" : "text-white"}`}>
                  {active ? counts[t.key] : ""}
                </div>
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="text-sm font-semibold flex items-center gap-2">
              <currentTab.icon className="h-4 w-4" /> {currentTab.label}
              <span className="ml-2 text-xs text-white/60">{rows.length} registro(s)</span>
            </div>
            <button
              onClick={load}
              className="flex items-center gap-2 text-xs rounded-md px-3 py-1.5 bg-white/10 hover:bg-white/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Atualizar
            </button>
          </div>

          {rows.length === 0 ? (
            <div className="py-16 text-center text-white/60 text-sm">
              {loading ? "Carregando..." : "Nenhuma solicitação registrada."}
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {rows.map((r) => (
                <li key={r.id} className="px-5 py-4 flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <RowSummary tab={tab} row={r} />
                    <div className="mt-1 text-xs text-white/60">
                      {tab === "denuncias" && r.anonima
                        ? <>Solicitante: <span className="text-white/80">Anônimo</span></>
                        : <>Solicitante: <span className="text-white/80">{r._autor}</span></>}
                      {" · "}{new Date(r.created_at).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  {currentTab.statuses && (
                    <select
                      value={(r.status as string) ?? currentTab.statuses[0]}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="rounded-md bg-white text-[#0a2a6c] text-sm font-medium px-3 py-1.5 border-0"
                    >
                      {currentTab.statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function RowSummary({ tab, row }: { tab: TabKey; row: Row }) {
  if (tab === "pedidos") {
    return (
      <div>
        <div className="font-medium">{String(row.produto)}</div>
        <div className="text-xs text-white/70">
          {String(row.quantidade)}x · R$ {Number(row.total).toLocaleString("pt-BR")}
        </div>
      </div>
    );
  }
  if (tab === "chamados") {
    return (
      <div>
        <div className="font-medium">{String(row.assunto)}</div>
        <div className="text-xs text-white/70 line-clamp-2">{String(row.descricao)}</div>
        <div className="text-[11px] text-white/50 mt-0.5">
          Prioridade: {String(row.prioridade)}{row.maquina ? ` · Máquina: ${String(row.maquina)}` : ""}
        </div>
      </div>
    );
  }
  if (tab === "epis") {
    return (
      <div>
        <div className="font-medium">{String(row.tipo)} · Tam. {String(row.tamanho)}</div>
        <div className="text-xs text-white/70">
          Qtd: {String(row.quantidade)}{row.motivo ? ` · ${String(row.motivo)}` : ""}
        </div>
      </div>
    );
  }
  // denuncias
  return (
    <div>
      <div className="font-medium">
        {String(row.titulo)}{" "}
        {row.anonima ? <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-200">ANÔNIMA</span> : null}
      </div>
      <div className="text-xs text-white/70 line-clamp-2">{String(row.descricao)}</div>
      <div className="text-[11px] text-white/50 mt-0.5">Categoria: {String(row.categoria)}</div>
    </div>
  );
}
