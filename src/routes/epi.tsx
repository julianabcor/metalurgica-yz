import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EmptyCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HardHat, Plus } from "lucide-react";
import { useState } from "react";
import { useStore, uid } from "@/lib/store";

export const Route = createFileRoute("/epi")({ component: EpiPage });

const TIPOS = ["Capacete", "Luva de raspa", "Óculos de proteção", "Protetor auricular", "Botina de segurança", "Avental de raspa"];

function NewEpiDialog() {
  const { add } = useStore("epis");
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [tamanho, setTamanho] = useState("");
  const [qtd, setQtd] = useState(1);
  const [motivo, setMotivo] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-1" /> Solicitar EPI</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova solicitação de EPI</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Tipo de EPI</Label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full h-10 border rounded-md px-3 mt-1 bg-background">
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tamanho</Label>
              <Input value={tamanho} onChange={(e) => setTamanho(e.target.value)} placeholder="M, 42, etc." />
            </div>
            <div>
              <Label>Quantidade</Label>
              <Input type="number" min={1} value={qtd} onChange={(e) => setQtd(Math.max(1, Number(e.target.value)))} />
            </div>
          </div>
          <div>
            <Label>Motivo</Label>
            <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3} placeholder="Substituição, desgaste, novo colaborador..." />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => {
            add({ id: uid(), tipo, tamanho, quantidade: qtd, motivo, status: "Pendente", createdAt: new Date().toISOString() });
            setOpen(false);
            setTamanho(""); setQtd(1); setMotivo("");
          }}>Enviar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EpiPage() {
  const { items, remove } = useStore("epis");
  return (
    <AppShell>
      <PageHeader title="Retirada de EPI" subtitle="Solicite equipamentos de proteção individual e acompanhe a aprovação." action={<NewEpiDialog />} />
      {items.length === 0 ? (
        <EmptyCard icon={HardHat} title="Nenhuma solicitação ainda." />
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          {items.map((e) => (
            <div key={e.id} className="p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{e.tipo} <span className="text-muted-foreground font-normal">• {e.quantidade}x {e.tamanho && `• ${e.tamanho}`}</span></div>
                {e.motivo && <div className="text-sm text-muted-foreground">{e.motivo}</div>}
                <div className="text-xs text-muted-foreground mt-1">#{e.id} • {new Date(e.createdAt).toLocaleDateString("pt-BR")}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{e.status}</span>
                <Button variant="ghost" size="sm" onClick={() => remove(e.id)}>Remover</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
