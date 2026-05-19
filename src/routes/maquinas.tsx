import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/maquinas")({ component: MaquinasPage });

const MAQUINAS = [
  { id: "TRN-014", nome: "Torno CNC Romi GL-240", setor: "Usinagem", status: "Operando", desde: "06:12" },
  { id: "FRS-007", nome: "Fresadora Diplomat 3001", setor: "Usinagem", status: "Operando", desde: "07:30" },
  { id: "SLD-003", nome: "Solda MIG Esab Smashweld", setor: "Soldagem", status: "Manutenção", desde: "ontem" },
  { id: "PRT-002", nome: "Prensa hidráulica 80T", setor: "Conformação", status: "Operando", desde: "06:00" },
  { id: "CMP-001", nome: "Compressor Schulz SRP 4030", setor: "Utilidades", status: "Atenção", desde: "05:45" },
];

const TONE: Record<string, string> = {
  Operando: "bg-emerald-50 text-emerald-700",
  Manutenção: "bg-amber-50 text-amber-700",
  Atenção: "bg-rose-50 text-rose-700",
};

function MaquinasPage() {
  return (
    <AppShell>
      <PageHeader title="Status de máquinas" subtitle="Equipamentos do seu setor com status operacional em tempo real." />
      <div className="rounded-xl border bg-card divide-y">
        {MAQUINAS.map((m) => (
          <div key={m.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{m.nome}</div>
              <div className="text-xs text-muted-foreground">#{m.id} • {m.setor} • desde {m.desde}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${TONE[m.status]}`}>{m.status}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
