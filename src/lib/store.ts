import { useEffect, useState, useCallback } from "react";

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

const KEY = "myz-portal-v1";

function read(): Schema {
  if (typeof window === "undefined")
    return { pedidos: [], chamados: [], epis: [], denuncias: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { pedidos: [], chamados: [], epis: [], denuncias: [] };
    return JSON.parse(raw);
  } catch {
    return { pedidos: [], chamados: [], epis: [], denuncias: [] };
  }
}

function write(data: Schema) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("myz-store"));
}

export function useStore<K extends keyof Schema>(key: K) {
  const [items, setItems] = useState<Schema[K]>(() => read()[key]);

  useEffect(() => {
    const sync = () => setItems(read()[key]);
    sync();
    window.addEventListener("myz-store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("myz-store", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const add = useCallback(
    (item: Schema[K][number]) => {
      const data = read();
      data[key] = [item, ...data[key]] as Schema[K];
      write(data);
    },
    [key],
  );

  const remove = useCallback(
    (id: string) => {
      const data = read();
      data[key] = (data[key] as Array<{ id: string }>).filter(
        (i) => i.id !== id,
      ) as Schema[K];
      write(data);
    },
    [key],
  );

  return { items, add, remove };
}

export function useCounts() {
  const [counts, setCounts] = useState(() => {
    const d = read();
    return {
      pedidos: d.pedidos.length,
      chamados: d.chamados.filter((c) => c.status !== "Resolvido").length,
      epis: d.epis.filter((e) => e.status === "Pendente").length,
      denuncias: d.denuncias.length,
    };
  });

  useEffect(() => {
    const sync = () => {
      const d = read();
      setCounts({
        pedidos: d.pedidos.length,
        chamados: d.chamados.filter((c) => c.status !== "Resolvido").length,
        epis: d.epis.filter((e) => e.status === "Pendente").length,
        denuncias: d.denuncias.length,
      });
    };
    sync();
    window.addEventListener("myz-store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("myz-store", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return counts;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
