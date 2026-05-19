import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { MapPin, Users, Calendar, Factory } from "lucide-react";

export const Route = createFileRoute("/sobre")({ component: SobrePage });

function SobrePage() {
  return (
    <AppShell>
      <PageHeader title="Sobre a Metalúrgica YZ" subtitle="Pequena, técnica, e feita por quem está no chão de fábrica." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-4">
          <Calendar className="h-5 w-5 text-blue-600 mb-2" />
          <div className="text-2xl font-bold">2007</div>
          <div className="text-xs text-muted-foreground">Fundação</div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <Users className="h-5 w-5 text-emerald-600 mb-2" />
          <div className="text-2xl font-bold">18</div>
          <div className="text-xs text-muted-foreground">Colaboradores</div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <MapPin className="h-5 w-5 text-rose-600 mb-2" />
          <div className="text-2xl font-bold">Joinville/SC</div>
          <div className="text-xs text-muted-foreground">Distrito Industrial Norte</div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <Factory className="h-5 w-5 text-amber-600 mb-2" />
          <div className="text-2xl font-bold">1.200 m²</div>
          <div className="text-xs text-muted-foreground">Galpão produtivo</div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4 text-sm leading-relaxed">
        <p>
          A <strong>Metalúrgica YZ</strong> nasceu em 2007 na garagem dos irmãos Yago e
          Zélio Cordeiro, dois torneiros mecânicos formados pelo SENAI de Joinville
          que decidiram largar o turno da noite numa grande indústria para tentar
          algo próprio. O nome veio do jeito mais simples possível: as iniciais dos
          dois fundadores.
        </p>
        <p>
          Os primeiros anos foram de usinagem sob encomenda para vizinhas do bairro
          industrial — eixos, buchas, flanges, pequenos lotes que ninguém grande
          queria atender. Em 2012, com a compra do primeiro torno CNC usado, a YZ
          passou a fornecer peças seriadas para fabricantes de motores elétricos da
          região e nunca mais parou de crescer — devagar, do jeito que dá pra
          sustentar.
        </p>
        <p>
          Hoje somos <strong>18 colaboradores</strong> num galpão de 1.200 m² no
          Distrito Industrial Norte de Joinville, com células de usinagem,
          soldagem e conformação leve. A YZ continua familiar: o Zélio toca a
          produção, o Yago cuida do comercial, e a Juliana — filha do Yago —
          coordena o administrativo e o portal interno que você está usando agora.
        </p>
        <p className="text-muted-foreground">
          <em>"Pequena o suficiente pra te conhecer pelo nome, técnica o suficiente
          pra entregar no prazo."</em>
        </p>
      </div>
    </AppShell>
  );
}
