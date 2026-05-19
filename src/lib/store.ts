import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Pedido = {
  id: string;
  produto: string;
  quantidade: number;
  total: number;
  status: "Em produção" | "Separação" | "Enviado" | "Entregue";
  createdAt: string;
};

export type Chamado = {
  id: string;
  assunto: string;
  descricao: string;
  prioridade: "Baixa" | "Média" | "Alta";
  maquina?: string;
  status: "Aberto" | "Em análise" | "Resolvido";
  createdAt: string;
};

export type EpiSolicitacao = {
  id: string;
  tipo: string;
  tamanho: string;
  quantidade: number;
  motivo: string;
  status: "Pendente" | "Aprovado" | "Entregue";
  createdAt: string;
};

export type Denuncia = {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  anonima: boolean;
  autor?: string;
  createdAt: string;
};

type Schema = {
  pedidos: Pedido[];
  chamados: Chamado[];
  epis: EpiSolicitacao[];
  denuncias: Denuncia[];
};

const TABLES: Record<keyof Schema, string> = {
  pedidos: "pedidos",
  chamados: "chamados",
  epis: "epis",
  denuncias: "denuncias",
};

// Map row from DB (snake_case) -> our camelCase shape
function fromRow<K extends keyof Schema>(key: K, row: Record<string, unknown>): Schema[K][number] {
  const base = {
    id: row.id as string,
    createdAt: row.created_at as string,
  };
  switch (key) {
    case "pedidos":
      return { ...base, produto: row.produto, quantidade: row.quantidade, total: Number(row.total), status: row.status } as Schema[K][number];
    case "chamados":
      return { ...base, assunto: row.assunto, descricao: row.descricao, prioridade: row.prioridade, maquina: row.maquina ?? undefined, status: row.status } as Schema[K][number];
    case "epis":
      return { ...base, tipo: row.tipo, tamanho: row.tamanho, quantidade: row.quantidade, motivo: row.motivo ?? "", status: row.status } as Schema[K][number];
    case "denuncias":
      return { ...base, titulo: row.titulo, categoria: row.categoria, descricao: row.descricao, anonima: row.anonima } as Schema[K][number];
  }
  return base as Schema[K][number];
}

// Map our shape -> DB insert (snake_case), ignoring id/createdAt
function toInsert<K extends keyof Schema>(key: K, item: Schema[K][number], userId: string): Record<string, unknown> {
  const i = item as Record<string, unknown>;
  const base = { user_id: userId };
  switch (key) {
    case "pedidos":
      return { ...base, produto: i.produto, quantidade: i.quantidade, total: i.total, status: i.status };
    case "chamados":
      return { ...base, assunto: i.assunto, descricao: i.descricao, prioridade: i.prioridade, maquina: i.maquina ?? null, status: i.status };
    case "epis":
      return { ...base, tipo: i.tipo, tamanho: i.tamanho, quantidade: i.quantidade, motivo: i.motivo ?? null, status: i.status };
    case "denuncias":
      return { ...base, titulo: i.titulo, categoria: i.categoria, descricao: i.descricao, anonima: i.anonima };
  }
  return base;
}

const REFRESH_EVT = "myz-refresh";
function emitRefresh() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(REFRESH_EVT));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function useStore<K extends keyof Schema>(key: K) {
  const [items, setItems] = useState<Schema[K]>([] as unknown as Schema[K]);

  const load = useCallback(async () => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) { setItems([] as unknown as Schema[K]); return; }
    const { data, error } = await db
      .from(TABLES[key])
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setItems((data ?? []).map((r) => fromRow(key, r as Record<string, unknown>)) as Schema[K]);
  }, [key]);

  useEffect(() => {
    load();
    const onChange = () => load();
    window.addEventListener(REFRESH_EVT, onChange);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      window.removeEventListener(REFRESH_EVT, onChange);
      subscription.unsubscribe();
    };
  }, [load]);

  const add = useCallback(
    async (item: Schema[K][number]) => {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user?.id;
      if (!uid) { console.error("Não autenticado"); return; }
      const { error } = await supabase.from(TABLES[key]).insert(toInsert(key, item, uid));
      if (error) { console.error(error); return; }
      emitRefresh();
    },
    [key],
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from(TABLES[key]).delete().eq("id", id);
      if (error) { console.error(error); return; }
      emitRefresh();
    },
    [key],
  );

  return { items, add, remove };
}

export function useCounts() {
  const [counts, setCounts] = useState({ pedidos: 0, chamados: 0, epis: 0, denuncias: 0 });

  useEffect(() => {
    const load = async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { setCounts({ pedidos: 0, chamados: 0, epis: 0, denuncias: 0 }); return; }
      const [p, c, e, d] = await Promise.all([
        supabase.from("pedidos").select("id", { count: "exact", head: true }),
        supabase.from("chamados").select("id", { count: "exact", head: true }).neq("status", "Resolvido"),
        supabase.from("epis").select("id", { count: "exact", head: true }).eq("status", "Pendente"),
        supabase.from("denuncias").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        pedidos: p.count ?? 0,
        chamados: c.count ?? 0,
        epis: e.count ?? 0,
        denuncias: d.count ?? 0,
      });
    };
    load();
    const onChange = () => load();
    window.addEventListener(REFRESH_EVT, onChange);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      window.removeEventListener(REFRESH_EVT, onChange);
      subscription.unsubscribe();
    };
  }, []);

  return counts;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
