import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useState } from "react";

export const Route = createFileRoute("/mapa")({ component: MapaPage });

type Tab = "empresa" | "risco";

const SETORES = [
  { id: "usi", nome: "Usinagem", x: 8, y: 18, w: 36, h: 30, cor: "fill-blue-200/70" },
  { id: "sld", nome: "Soldagem", x: 46, y: 18, w: 24, h: 30, cor: "fill-amber-200/70" },
  { id: "exp", nome: "Expedição", x: 72, y: 18, w: 20, h: 30, cor: "fill-emerald-200/70" },
  { id: "alm", nome: "Almoxarifado", x: 8, y: 52, w: 24, h: 22, cor: "fill-slate-200/70" },
  { id: "qua", nome: "Qualidade", x: 34, y: 52, w: 18, h: 22, cor: "fill-purple-200/70" },
  { id: "adm", nome: "Administrativo", x: 54, y: 52, w: 22, h: 22, cor: "fill-sky-200/70" },
  { id: "ref", nome: "Refeitório", x: 78, y: 52, w: 14, h: 22, cor: "fill-rose-200/70" },
  { id: "pat", nome: "Pátio / Estacionamento", x: 8, y: 78, w: 84, h: 14, cor: "fill-gray-200/70" },
];

// NR-5 cores do mapa de risco
const RISCOS = [
  { setor: "usi", grau: "Médio", tipo: "Físico (ruído, calor) e Mecânico", cor: "fill-amber-400/80" },
  { setor: "sld", grau: "Grave", tipo: "Físico (radiação), Químico (fumos) e Acidente", cor: "fill-red-500/80" },
  { setor: "exp", grau: "Leve", tipo: "Ergonômico (carregamento)", cor: "fill-green-400/80" },
  { setor: "alm", grau: "Leve", tipo: "Ergonômico", cor: "fill-green-400/80" },
  { setor: "qua", grau: "Leve", tipo: "Químico (reagentes em pequena quantidade)", cor: "fill-yellow-300/80" },
  { setor: "adm", grau: "Leve", tipo: "Ergonômico (postural)", cor: "fill-green-400/80" },
  { setor: "ref", grau: "Leve", tipo: "Biológico (manipulação de alimentos)", cor: "fill-brown-400/70 fill-amber-700/60" },
  { setor: "pat", grau: "Médio", tipo: "Acidente (circulação de veículos)", cor: "fill-amber-400/80" },
];

function MapaPage() {
  const [tab, setTab] = useState<Tab>("empresa");

  return (
    <AppShell>
      <PageHeader title="Mapa da empresa" subtitle="Layout dos setores e mapa de risco (NR-5)." />

      <div className="inline-flex rounded-lg border bg-card p-1 mb-5">
        <button
          onClick={() => setTab("empresa")}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
            tab === "empresa" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Mapa da empresa
        </button>
        <button
          onClick={() => setTab("risco")}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
            tab === "risco" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Mapa de risco
        </button>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <svg viewBox="0 0 100 100" className="w-full h-[480px] bg-muted/30 rounded-lg">
          <rect x="6" y="14" width="88" height="82" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.4" />
          {SETORES.map((s) => {
            const risco = RISCOS.find((r) => r.setor === s.id);
            const fill = tab === "empresa" ? s.cor : risco?.cor ?? "fill-gray-200";
            return (
              <g key={s.id}>
                <rect
                  x={s.x}
                  y={s.y}
                  width={s.w}
                  height={s.h}
                  className={fill}
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="0.3"
                  rx="0.8"
                />
                <text
                  x={s.x + s.w / 2}
                  y={s.y + s.h / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="2.2"
                  className="fill-foreground font-semibold"
                >
                  {s.nome}
                </text>
                {tab === "risco" && risco && (
                  <text
                    x={s.x + s.w / 2}
                    y={s.y + s.h / 2 + 3.2}
                    textAnchor="middle"
                    fontSize="1.6"
                    className="fill-foreground/70"
                  >
                    {risco.grau}
                  </text>
                )}
              </g>
            );
          })}
          <text x="50" y="10" textAnchor="middle" fontSize="2.4" className="fill-foreground font-bold">
            Metalúrgica YZ — Planta Caxias do Sul
          </text>
        </svg>

        {tab === "risco" ? (
          <div className="mt-5">
            <h3 className="font-semibold mb-3">Legenda (NR-5)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
              <Leg cor="bg-green-400" label="Risco leve" />
              <Leg cor="bg-yellow-300" label="Risco moderado" />
              <Leg cor="bg-amber-400" label="Risco médio" />
              <Leg cor="bg-red-500" label="Risco grave / iminente" />
            </div>
            <div className="rounded-lg border divide-y">
              {RISCOS.map((r) => {
                const s = SETORES.find((x) => x.id === r.setor)!;
                return (
                  <div key={r.setor} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <div>
                      <div className="font-medium">{s.nome}</div>
                      <div className="text-xs text-muted-foreground">{r.tipo}</div>
                    </div>
                    <span className="text-xs font-semibold">{r.grau}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">
            Layout simplificado da planta. Use a aba <strong>Mapa de risco</strong> para visualizar os agentes
            de risco por setor conforme a NR-5.
          </p>
        )}
      </div>
    </AppShell>
  );
}

function Leg({ cor, label }: { cor: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded ${cor}`} />
      <span>{label}</span>
    </div>
  );
}
