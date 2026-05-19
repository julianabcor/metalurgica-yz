import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/maquinas")({ component: MaquinasPage });

type Maquina = {
  id: string;
  nome: string;
  setor: string;
  status: "Operando" | "Manutenção" | "Atenção";
  desde: string;
  utilizacao: number[]; // últimos 12 pontos, 0-100
};

const MAQUINAS: Maquina[] = [
  { id: "TRN-014", nome: "Torno CNC Romi GL-240", setor: "Usinagem", status: "Operando", desde: "06:12", utilizacao: [62, 70, 74, 80, 78, 84, 88, 86, 90, 92, 88, 91] },
  { id: "FRS-007", nome: "Fresadora Diplomat 3001", setor: "Usinagem", status: "Operando", desde: "07:30", utilizacao: [40, 55, 62, 68, 72, 70, 74, 78, 80, 76, 82, 85] },
  { id: "SLD-003", nome: "Solda MIG Esab Smashweld", setor: "Soldagem", status: "Manutenção", desde: "ontem", utilizacao: [80, 78, 60, 30, 10, 0, 0, 0, 0, 0, 0, 0] },
  { id: "PRT-002", nome: "Prensa hidráulica 80T", setor: "Conformação", status: "Operando", desde: "06:00", utilizacao: [55, 58, 60, 65, 70, 68, 66, 70, 72, 74, 70, 72] },
  { id: "CMP-001", nome: "Compressor Schulz SRP 4030", setor: "Utilidades", status: "Atenção", desde: "05:45", utilizacao: [70, 72, 68, 64, 60, 55, 50, 48, 45, 50, 42, 38] },
];

const TONE: Record<Maquina["status"], string> = {
  Operando: "bg-emerald-50 text-emerald-700",
  Manutenção: "bg-amber-50 text-amber-700",
  Atenção: "bg-rose-50 text-rose-700",
};

const STROKE: Record<Maquina["status"], string> = {
  Operando: "stroke-emerald-500",
  Manutenção: "stroke-amber-500",
  Atenção: "stroke-rose-500",
};

const FILL: Record<Maquina["status"], string> = {
  Operando: "fill-emerald-500/15",
  Manutenção: "fill-amber-500/15",
  Atenção: "fill-rose-500/15",
};

function Sparkline({ data, status }: { data: number[]; status: Maquina["status"] }) {
  const w = 120;
  const h = 40;
  const max = 100;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  const avg = Math.round(data.reduce((s, n) => s + n, 0) / data.length);
  return (
    <div className="flex items-center gap-3">
      <svg width={w} height={h} className="overflow-visible">
        <polygon points={area} className={FILL[status]} />
        <polyline points={points} fill="none" strokeWidth="1.6" className={STROKE[status]} />
      </svg>
      <div className="text-right">
        <div className="text-sm font-semibold">{avg}%</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">uso</div>
      </div>
    </div>
  );
}

function MaquinasPage() {
  return (
    <AppShell>
      <PageHeader title="Status de máquinas" subtitle="Equipamentos do seu setor com status operacional em tempo real." />
      <div className="rounded-xl border bg-card divide-y">
        {MAQUINAS.map((m) => (
          <div key={m.id} className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium">{m.nome}</div>
              <div className="text-xs text-muted-foreground">#{m.id} • {m.setor} • desde {m.desde}</div>
            </div>
            <Sparkline data={m.utilizacao} status={m.status} />
            <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${TONE[m.status]}`}>{m.status}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
