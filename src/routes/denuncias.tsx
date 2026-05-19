import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EmptyCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShieldAlert, Plus } from "lucide-react";
import { useState } from "react";
import { useStore, uid } from "@/lib/store";

export const Route = createFileRoute("/denuncias")({ component: DenunciasPage });

const CATEGORIAS = ["Segurança no trabalho", "Assédio", "Fraude", "Conduta inadequada", "Meio ambiente", "Outros"];

function NewDenunciaDialog() {
  const { add } = useStore("denuncias");
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [descricao, setDescricao] = useState("");
  const [anonima, setAnonima] = useState(true);

  const canSubmit = titulo.trim().length > 0 && descricao.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-1" /> Nova denúncia</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nova denúncia</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Título</Label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div>
            <Label>Categoria</Label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full h-10 border rounded-md px-3 mt-1 bg-background">
              {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} placeholder="Descreva a ocorrência com o máximo de detalhes." />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={anonima} onChange={(e) => setAnonima(e.target.checked)} />
            Enviar como anônima
          </label>
        </div>
        <DialogFooter>
          <Button disabled={!canSubmit} onClick={() => {
            add({ id: uid(), titulo, categoria, descricao, anonima, autor: anonima ? undefined : "Juliana Branco Cordeiro", createdAt: new Date().toISOString() });
            setOpen(false);
            setTitulo(""); setDescricao(""); setCategoria(CATEGORIAS[0]); setAnonima(true);
          }}>Enviar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DenunciasPage() {
  const { items, remove } = useStore("denuncias");
  return (
    <AppShell>
      <PageHeader title="Canal de denúncias" subtitle="Reporte ocorrências com sigilo. Anônimo opcional. Apenas o autor e os administradores têm acesso." action={<NewDenunciaDialog />} />
      {items.length === 0 ? (
        <EmptyCard icon={ShieldAlert} title="Nenhuma denúncia visível para você." hint="Denúncias anônimas não aparecem aqui — apenas administradores as visualizam." />
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          {items.map((d) => (
            <div key={d.id} className="p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium">{d.titulo}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{d.descricao}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  #{d.id} • {d.categoria} • {d.anonima ? "Anônima" : d.autor} • {new Date(d.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(d.id)}>Remover</Button>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
