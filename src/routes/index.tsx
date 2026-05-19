import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useCounts } from "@/lib/store";
import { Package, LifeBuoy, HardHat, Activity, FileText, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Stat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className={`h-9 w-9 rounded-lg grid place-items-center mb-4 ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Dashboard() {
  const counts = useCounts();
  return (
    <AppShell>
      <p className="text-sm text-muted-foreground">Bem-vindo de volta,</p>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Juliana Branco Cordeiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat icon={Package} value={counts.pedidos} label="Pedidos" tone="bg-blue-50 text-blue-600" />
        <Stat icon={LifeBuoy} value={counts.chamados} label="Chamados abertos" tone="bg-amber-50 text-amber-600" />
        <Stat icon={HardHat} value={counts.epis} label="EPI pendentes" tone="bg-emerald-50 text-emerald-600" />
        <Stat icon={Activity} value={counts.denuncias} label="Denúncias registradas" tone="bg-rose-50 text-rose-600" />
      </div>

      <h2 className="text-lg font-semibold mb-3">Atalhos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/documentos" className="rounded-xl border bg-card p-5 flex items-center gap-4 hover:border-primary/40 transition-colors">
          <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 grid place-items-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Documentos técnicos</div>
            <div className="text-sm text-muted-foreground">Manuais, datasheets, certificados</div>
          </div>
        </Link>
        <Link to="/denuncias" className="rounded-xl border bg-card p-5 flex items-center gap-4 hover:border-primary/40 transition-colors">
          <div className="h-11 w-11 rounded-lg bg-rose-50 text-rose-600 grid place-items-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">Canal de denúncias</div>
            <div className="text-sm text-muted-foreground">Reporte ocorrências com sigilo</div>
          </div>
        </Link>
      </div>
    </AppShell>
  );
}
