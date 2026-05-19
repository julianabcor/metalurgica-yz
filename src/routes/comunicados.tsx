import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Megaphone, Calendar, AlertCircle, PartyPopper } from "lucide-react";

export const Route = createFileRoute("/comunicados")({ component: ComunicadosPage });

const COMUNICADOS = [
  {
    icon: AlertCircle,
    tone: "bg-rose-50 text-rose-600",
    tag: "Urgente",
    titulo: "Manutenção elétrica programada — sábado 24/05",
    texto: "O setor de Usinagem ficará sem energia das 07h às 11h para troca do quadro principal. Planejem a produção da semana.",
    data: "há 2 horas",
  },
  {
    icon: PartyPopper,
    tone: "bg-emerald-50 text-emerald-600",
    tag: "Evento",
    titulo: "Confraternização de aniversário da Metalúrgica YZ — 18 anos",
    texto: "Convidamos todos os colaboradores e familiares para o churrasco no dia 14/06, a partir das 12h, no galpão da fábrica em Caxias do Sul.",
    data: "ontem",
  },
  {
    icon: Calendar,
    tone: "bg-blue-50 text-blue-600",
    tag: "Aviso",
    titulo: "Nova escala de turno do setor de Soldagem",
    texto: "A partir de 01/06 entra em vigor a nova escala 5x1. Procure o RH para retirar o documento assinado até 28/05.",
    data: "há 3 dias",
  },
  {
    icon: Megaphone,
    tone: "bg-amber-50 text-amber-700",
    tag: "Comunicado",
    titulo: "Reajuste do vale-alimentação",
    texto: "Conforme acordo coletivo, o vale-alimentação foi reajustado em 7,2% e já estará disponível no cartão a partir do dia 30/05.",
    data: "há 5 dias",
  },
];

function ComunicadosPage() {
  return (
    <AppShell>
      <PageHeader title="Informativos e comunicados" subtitle="Avisos oficiais da Metalúrgica YZ para todos os colaboradores." />
      <div className="space-y-3">
        {COMUNICADOS.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.titulo} className="rounded-xl border bg-card p-5 flex gap-4">
              <div className={`h-11 w-11 rounded-lg grid place-items-center shrink-0 ${c.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">{c.tag}</span>
                  <span className="text-xs text-muted-foreground">• {c.data}</span>
                </div>
                <div className="font-semibold">{c.titulo}</div>
                <p className="text-sm text-muted-foreground mt-1">{c.texto}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
