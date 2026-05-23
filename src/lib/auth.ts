import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type Role = "operador" | "gestor";
export type User = { name: string; email: string; id: string };

function fromSession(session: Session | null): User | null {
  if (!session?.user) return null;
  const u = session.user;
  const nome = (u.user_metadata?.nome as string | undefined) ?? u.email ?? "";
  return { id: u.id, email: u.email ?? "", name: nome };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

async function fetchRole(userId: string): Promise<Role> {
  const { data } = await db.from("user_roles").select("role").eq("user_id", userId);
  const roles = ((data ?? []) as { role: Role }[]).map((item) => item.role);
  return roles.includes("gestor") ? "gestor" : "operador";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const apply = async (session: Session | null) => {
      const u = fromSession(session);
      setUser(u);
      if (u) {
        const r = await fetchRole(u.id);
        setRole(r);
      } else {
        setRole(null);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      // defer to avoid deadlock inside onAuthStateChange
      setTimeout(() => { apply(session); }, 0);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      await apply(data.session);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const uid = data.user?.id;
    return uid ? await fetchRole(uid) : ("operador" as Role);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome: name },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw new Error(error.message);
  }, []);

  const refreshRole = useCallback(async () => {
    const uid = user?.id ?? (await supabase.auth.getSession()).data.session?.user.id;
    if (!uid) return null;
    const r = await fetchRole(uid);
    setRole(r);
    return r;
  }, [user]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, role, ready, login, register, logout, refreshRole };
}
