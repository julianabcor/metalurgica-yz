import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type Role = "operador" | "gestor";
export type Cargo = "operador" | "chefia" | "gestao";
export type User = { name: string; email: string; id: string; matricula?: string };

const EMAIL_DOMAIN = "@yz.com";

export function matriculaToEmail(matricula: string): string {
  const m = matricula.trim().toLowerCase();
  return m.includes("@") ? m : `${m}${EMAIL_DOMAIN}`;
}

function fromSession(session: Session | null): User | null {
  if (!session?.user) return null;
  const u = session.user;
  const nome = (u.user_metadata?.nome as string | undefined) ?? u.email ?? "";
  const matricula = (u.user_metadata?.matricula as string | undefined) ?? "";
  return { id: u.id, email: u.email ?? "", name: nome, matricula };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

async function fetchProfile(userId: string): Promise<{ role: Role; cargo: Cargo; nome?: string; matricula?: string }> {
  const { data } = await db
    .from("profiles")
    .select("cargo,nome,matricula")
    .eq("id", userId)
    .maybeSingle();
  const cargo = ((data?.cargo as Cargo | undefined) ?? "operador") as Cargo;
  const role: Role = cargo === "operador" ? "operador" : "gestor";
  return { role, cargo, nome: data?.nome, matricula: data?.matricula };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [cargo, setCargo] = useState<Cargo | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const apply = async (session: Session | null) => {
      const u = fromSession(session);
      if (u) {
        const p = await fetchProfile(u.id);
        setUser({ ...u, name: p.nome ?? u.name, matricula: p.matricula ?? u.matricula });
        setRole(p.role);
        setCargo(p.cargo);
      } else {
        setUser(null);
        setRole(null);
        setCargo(null);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => { apply(session); }, 0);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      await apply(data.session);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (matricula: string, password: string) => {
    const email = matriculaToEmail(matricula);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const uid = data.user?.id;
    if (!uid) return { role: "operador" as Role, cargo: "operador" as Cargo };
    return await fetchProfile(uid);
  }, []);

  const register = useCallback(async (name: string, matricula: string, password: string) => {
    const email = matriculaToEmail(matricula);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome: name, matricula: matricula.trim() },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw new Error(error.message);
  }, []);

  const refreshRole = useCallback(async () => {
    const uid = user?.id ?? (await supabase.auth.getSession()).data.session?.user.id;
    if (!uid) return null;
    const p = await fetchProfile(uid);
    setRole(p.role);
    setCargo(p.cargo);
    return p.role;
  }, [user]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, role, cargo, ready, login, register, logout, refreshRole };
}
