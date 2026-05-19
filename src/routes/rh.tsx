import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useState } from "react";
import {
  Bell,
  Receipt,
  Wallet,
  BadgePercent,
  FileSignature,
  Gift,
  Clock,
  CalendarClock,
  UtensilsCrossed,
  Download,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/rh")({ component: RhPage });

type ItemKey =
  | "avisos"
  | "recibos"
  | "saldo"
  | "decimo"
  | "folha"
  | "plr"
  | "banco"
  | "horarios"
  | "cardapio";

const GROUPS: { title: string; items: { key: ItemKey; label: string; icon: any }[] }[] = [
  {
    title: "Férias",
    items: [
      { key: "avisos", label: "Avisos", icon: Bell },
      { key: "recibos", label: "Recibos", icon: Receipt },
      { key: "saldo", label: "Saldo", icon: Wallet },
    ],
  },
  {
    title: "Folhas",
    items: [
      { key: "decimo", label: "13º salário", icon: BadgePercent },
      { key: "folha", label: "Folha de pagamento", icon: FileSignature },
      { key: "plr", label: "PLR", icon: Gift },
    ],
  },
  {
    title: "Ponto",
    items: [
      { key: "banco", label: "Banco de horas", icon: Clock },
      { key: "horarios", label: "Horários da jornada", icon: CalendarClock },
    ],
  },
  {
    title: "Restaurante",
    items: [{ key: "cardapio", label: "Cardápios", icon: UtensilsCrossed }],
  },
];

function RhPage() {
  const [active, setActive] = useState<ItemKey>("cardapio");

  return (
    <AppShell>
      <PageHeader title="Meu RH" subtitle="Acompanhe férias, folhas de pagamento, ponto e benefícios." />
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <aside className="rounded-xl border bg-card p-3 h-fit">
          {GROUPS.map((g) => (
            <div key={g.title} className="mb-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                {g.title}
              </div>
              <div className="space-y-0.5">
                {g.items.map((it) => {
                  const Icon = it.icon;
                  const isActive = active === it.key;
                  return (
                    <button
                      key={it.key}
                      onClick={() => setActive(it.key)}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${
                        isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {it.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>
        <section className="rounded-xl border bg-card p-6">{renderContent(active)}</section>
      </div>
    </AppShell>
  );
}

function renderContent(key: ItemKey) {
  switch (key) {
    case "avisos":
      return (
        <Section title="Avisos de férias">
          <Card>
            <Row label="Próximo período aquisitivo" value="04/2025 — 03/2026" />
            <Row label="Início programado" value="22/09/2025" />
            <Row label="Duração" value="20 dias corridos + 10 dias de abono" />
            <Row label="Status" value="Aprovado pelo gestor" tone="text-emerald-600" />
          </Card>
          <p className="text-sm text-muted-foreground mt-3">
            Confirme com o RH até 15 dias antes do início. Em caso de alteração, abra um chamado em Suporte.
          </p>
        </Section>
      );
    case "recibos":
      return (
        <Section title="Recibos de férias">
          <List
            items={[
              { titulo: "Recibo de férias 2024", desc: "Período: 09/2024 — emitido em 28/08/2024", size: "PDF • 142 KB" },
              { titulo: "Recibo de férias 2023", desc: "Período: 11/2023 — emitido em 30/10/2023", size: "PDF • 138 KB" },
              { titulo: "Recibo de férias 2022", desc: "Período: 07/2022 — emitido em 28/06/2022", size: "PDF • 135 KB" },
            ]}
          />
        </Section>
      );
    case "saldo":
      return (
        <Section title="Saldo de férias">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Stat big="30" label="dias disponíveis" />
            <Stat big="10" label="dias vendidos (abono)" />
            <Stat big="20" label="dias a usufruir" />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Período aquisitivo atual encerra em 03/2026. Programe-se com antecedência para evitar acúmulo.
          </p>
        </Section>
      );
    case "decimo":
      return (
        <Section title="13º salário">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Stat big="R$ 2.140,00" label="1ª parcela • paga em 30/11/2024" />
            <Stat big="R$ 1.860,00" label="2ª parcela • paga em 20/12/2024" />
          </div>
          <List
            items={[
              { titulo: "Demonstrativo 13º — 2024", desc: "Integral", size: "PDF • 96 KB" },
              { titulo: "Demonstrativo 13º — 2023", desc: "Integral", size: "PDF • 94 KB" },
            ]}
          />
        </Section>
      );
    case "folha":
      return (
        <Section title="Folha de pagamento">
          <List
            items={[
              { titulo: "Holerite — Abril/2025", desc: "Líquido: R$ 3.847,21", size: "PDF • 88 KB" },
              { titulo: "Holerite — Março/2025", desc: "Líquido: R$ 3.802,40", size: "PDF • 86 KB" },
              { titulo: "Holerite — Fevereiro/2025", desc: "Líquido: R$ 3.795,10", size: "PDF • 86 KB" },
              { titulo: "Holerite — Janeiro/2025", desc: "Líquido: R$ 3.780,55", size: "PDF • 85 KB" },
            ]}
          />
        </Section>
      );
    case "plr":
      return (
        <Section title="Participação nos Lucros e Resultados (PLR)">
          <Card>
            <Row label="Ciclo vigente" value="2024 — pago em 03/2025" />
            <Row label="Meta da empresa" value="92% atingida" tone="text-emerald-600" />
            <Row label="Meta individual" value="A" />
            <Row label="Valor recebido" value="R$ 4.260,00" />
          </Card>
        </Section>
      );
    case "banco":
      return (
        <Section title="Banco de horas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Stat big="+12h 30min" label="saldo atual" />
            <Stat big="+4h 10min" label="entradas no mês" />
            <Stat big="-2h 00min" label="compensações no mês" />
          </div>
          <List
            items={[
              { titulo: "12/05 — entrada", desc: "Hora extra autorizada • turno 2", size: "+1h 30min" },
              { titulo: "08/05 — compensação", desc: "Saída antecipada autorizada", size: "-2h 00min" },
              { titulo: "02/05 — entrada", desc: "Reposição feriado", size: "+2h 40min" },
            ]}
          />
        </Section>
      );
    case "horarios":
      return (
        <Section title="Horários da jornada">
          <Card>
            <Row label="Turno" value="Turno 1 — diurno" />
            <Row label="Entrada" value="07:00" />
            <Row label="Intervalo" value="11:30 — 12:30" />
            <Row label="Saída" value="16:48" />
            <Row label="Carga semanal" value="44h" />
          </Card>
          <p className="text-sm text-muted-foreground mt-3">
            Tolerância de 5 minutos na entrada e saída. Atrasos acima disso são descontados do banco de horas.
          </p>
        </Section>
      );
    case "cardapio":
      return (
        <Section title="Cardápio da semana — Restaurante interno">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { dia: "Segunda 19/05", prato: "Frango grelhado, arroz, feijão preto, farofa de cenoura, salada de alface e tomate", sobremesa: "Maçã" },
              { dia: "Terça 20/05", prato: "Bife acebolado, arroz, feijão carioca, batata sauté, salada de repolho", sobremesa: "Gelatina" },
              { dia: "Quarta 21/05", prato: "Lasanha à bolonhesa, arroz branco, salada caesar", sobremesa: "Banana" },
              { dia: "Quinta 22/05", prato: "Peixe assado ao molho de ervas, purê de batata, brócolis no vapor", sobremesa: "Pudim" },
              { dia: "Sexta 23/05", prato: "Costela suína, polenta cremosa, feijão preto, salada mista", sobremesa: "Mousse de maracujá" },
              { dia: "Sábado 24/05", prato: "Feijoada light, arroz, couve refogada, farofa, laranja", sobremesa: "Doce de leite" },
            ].map((d) => (
              <div key={d.dia} className="rounded-lg border p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{d.dia}</div>
                <div className="font-medium mt-1">{d.prato}</div>
                <div className="text-xs text-muted-foreground mt-2">Sobremesa: {d.sobremesa}</div>
              </div>
            ))}
          </div>
        </Section>
      );
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border divide-y">{children}</div>;
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`text-sm font-medium ${tone ?? ""}`}>{value}</div>
    </div>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-2xl font-bold">{big}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function List({ items }: { items: { titulo: string; desc: string; size: string }[] }) {
  return (
    <div className="rounded-lg border divide-y mt-2">
      {items.map((i) => (
        <div key={i.titulo} className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{i.titulo}</div>
            <div className="text-xs text-muted-foreground">{i.desc}</div>
          </div>
          <div className="text-xs text-muted-foreground">{i.size}</div>
          <button className="text-muted-foreground hover:text-foreground">
            <Download className="h-4 w-4" />
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </div>
      ))}
    </div>
  );
}
