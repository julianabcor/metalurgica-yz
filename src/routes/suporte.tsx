import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EmptyCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LifeBuoy, Plus } from "lucide-react";
import { useState } from "react";
import { useStore, uid, type Chamado } from "@/lib/store";

export const Route = createFileRoute("/suporte")({ component: SuportePage });

function NewTicketDialog() {
  const { add } = useStore("chamados");
  const [open, setOpen] = useState(false);
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState<Chamado["prioridade"]>("Média");
  const [maquina, setMaquina] = useState("");

  const canSubmit = assunto.trim().length > 0 && descricao.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-1" /> Novo chamado</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Abrir chamado</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Assunto</Label>
            <Input value={assunto} onChange={(e) => setAssunto(e.target.value)} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Prioridade</Label>
              <select value={prioridade} onChange={(e) => setPrioridade(e.target.value as Chamado["prioridade"])} className="w-full h-10 border rounded-md px-3 mt-1 bg-background">
                <option>Baixa</option><option>Média</option><option>Alta</option>
              </select>
            </div>
            <div>
              <Label>Máquina (opcional)</Label>
              <Input value={maquina} onChange={(e) => setMaquina(e.target.value)} placeholder="—" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={!canSubmit} onClick={() => {
            add({ id: uid(), assunto, descricao, prioridade, maquina: maquina || undefined, status: "Aberto", createdAt: new Date().toISOString() });
            setOpen(false);
            setAssunto(""); setDescricao(""); setMaquina(""); setPrioridade("Média");
          }}>Abrir chamado</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SuportePage() {
  const { items, remove } = useStore("chamados");
  return (
    <AppShell>
      <PageHeader title="Suporte técnico" subtitle="Abra chamados e acompanhe o andamento do atendimento." action={<NewTicketDialog />} />
      {items.length === 0 ? (
        <EmptyCard icon={LifeBuoy} title="Nenhum chamado aberto." />
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          {items.map((c) => (
            <div key={c.id} className="p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium">{c.assunto}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{c.descricao}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  #{c.id} • Prioridade {c.prioridade}{c.maquina ? ` • ${c.maquina}` : ""} • {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">{c.status}</span>
                <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>Remover</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
