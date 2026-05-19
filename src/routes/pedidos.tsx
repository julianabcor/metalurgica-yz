import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, EmptyCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus } from "lucide-react";
import { useState } from "react";
import { useStore, uid, type Pedido } from "@/lib/store";

export const Route = createFileRoute("/pedidos")({ component: PedidosPage });

const CATALOGO: Record<string, number> = {
  "Motor W22 5cv": 2890,
  "Motor W22 10cv": 4750,
  "Inversor CFW500": 3200,
  "Soft-Starter SSW900": 5400,
  "Redutor W Série A": 2100,
};

function NewOrderDialog() {
  const { add } = useStore("pedidos");
  const [open, setOpen] = useState(false);
  const [produto, setProduto] = useState("Motor W22 5cv");
  const [qtd, setQtd] = useState(1);

  const total = (CATALOGO[produto] ?? 0) * qtd;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-1" /> Novo pedido</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo pedido</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Produto</Label>
            <select value={produto} onChange={(e) => setProduto(e.target.value)} className="w-full h-10 border rounded-md px-3 mt-1 bg-background">
              {Object.keys(CATALOGO).map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Quantidade</Label>
              <Input type="number" min={1} value={qtd} onChange={(e) => setQtd(Math.max(1, Number(e.target.value)))} />
            </div>
            <div>
              <Label>Total (R$)</Label>
              <Input value={total.toLocaleString("pt-BR")} readOnly />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => {
            const p: Pedido = { id: uid(), produto, quantidade: qtd, total, status: "Em produção", createdAt: new Date().toISOString() };
            add(p);
            setOpen(false);
            setQtd(1);
          }}>Criar pedido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PedidosPage() {
  const { items, remove } = useStore("pedidos");
  return (
    <AppShell>
      <PageHeader
        title="Pedidos e rastreamento"
        subtitle="Acompanhe o ciclo de vida de cada pedido."
        action={<NewOrderDialog />}
      />
      {items.length === 0 ? (
        <EmptyCard icon={Package} title="Você ainda não tem pedidos." />
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          {items.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{p.produto}</div>
                <div className="text-xs text-muted-foreground">
                  #{p.id} • {p.quantidade}x • R$ {p.total.toLocaleString("pt-BR")} • {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">{p.status}</span>
                <Button variant="ghost" size="sm" onClick={() => remove(p.id)}>Remover</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
