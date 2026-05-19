import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/documentos")({ component: DocumentosPage });

const DOCS = [
  { categoria: "Manual", titulo: "Manual Torno CNC GL-240", desc: "Operação, parâmetros e manutenção preventiva", size: "4.7 MB" },
  { categoria: "Manual", titulo: "Manual Fresadora Diplomat 3001", desc: "Guia de operação e calibração", size: "3.6 MB" },
  { categoria: "Datasheet", titulo: "Datasheet Aço SAE 1045", desc: "Propriedades mecânicas e composição", size: "1.2 MB" },
  { categoria: "Datasheet", titulo: "Catálogo de fluidos de corte", desc: "Família completa de óleos solúveis", size: "5.1 MB" },
  { categoria: "Certificado", titulo: "Certificado ISO 9001:2015", desc: "Certificado de qualidade vigente até 2027", size: "0.4 MB" },
  { categoria: "Norma", titulo: "NR-12 — Segurança em Máquinas", desc: "Norma regulamentadora atualizada", size: "2.1 MB" },
  { categoria: "Norma", titulo: "NR-06 — EPI", desc: "Requisitos de equipamentos de proteção", size: "1.5 MB" },
];

function DocumentosPage() {
  const groups = DOCS.reduce<Record<string, typeof DOCS>>((acc, d) => {
    (acc[d.categoria] ||= []).push(d);
    return acc;
  }, {});

  return (
    <AppShell>
      <PageHeader title="Documentos técnicos" subtitle="Manuais, datasheets, certificados e normas." />
      <div className="space-y-8">
        {Object.entries(groups).map(([cat, docs]) => (
          <div key={cat}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{cat}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map((d) => (
                <div key={d.titulo} className="rounded-xl border bg-card p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-blue-50 text-blue-600 grid place-items-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{d.titulo}</div>
                    <div className="text-xs text-muted-foreground truncate">{d.desc}</div>
                    <div className="text-xs text-muted-foreground/70">{d.size}</div>
                  </div>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
