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

const SESSION_KEY = "myz-session-v1";

function currentUserKey(): string {
  if (typeof window === "undefined") return "myz-portal-v1::anon";
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const email = raw ? (JSON.parse(raw)?.email as string | undefined) : undefined;
    return `myz-portal-v1::${email?.toLowerCase() || "anon"}`;
  } catch {
    return "myz-portal-v1::anon";
  }
}

function empty(): Schema {
  return { pedidos: [], chamados: [], epis: [], denuncias: [] };
}

function read(): Schema {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(currentUserKey());
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

function write(data: Schema) {
  localStorage.setItem(currentUserKey(), JSON.stringify(data));
  window.dispatchEvent(new Event("myz-store"));
}

function subscribe(cb: () => void) {
  window.addEventListener("myz-store", cb);
  window.addEventListener("storage", cb);
  window.addEventListener("myz-auth", cb);
  return () => {
    window.removeEventListener("myz-store", cb);
    window.removeEventListener("storage", cb);
    window.removeEventListener("myz-auth", cb);
  };
}

export function useStore<K extends keyof Schema>(key: K) {
  const [items, setItems] = useState<Schema[K]>(() => read()[key]);

  useEffect(() => {
    const sync = () => setItems(read()[key]);
    sync();
    return subscribe(sync);
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
  const compute = () => {
    const d = read();
    return {
      pedidos: d.pedidos.length,
      chamados: d.chamados.filter((c) => c.status !== "Resolvido").length,
      epis: d.epis.filter((e) => e.status === "Pendente").length,
      denuncias: d.denuncias.length,
    };
  };
  const [counts, setCounts] = useState(compute);

  useEffect(() => {
    const sync = () => setCounts(compute());
    sync();
    return subscribe(sync);
  }, []);

  return counts;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
