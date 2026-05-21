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
  const { data } = await db.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
  return (data?.role as Role) ?? "operador";
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
        // defer to avoid deadlock in onAuthStateChange
        setTimeout(async () => setRole(await fetchRole(u.id)), 0);
      } else {
        setRole(null);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      apply(session);
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

  const register = useCallback(async (name: string, email: string, password: string, r: Role = "operador") => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome: name, role: r },
        emailRedirectTo: `${window.location.origin}/${r === "gestor" ? "gestao" : "dashboard"}`,
      },
    });
    if (error) throw new Error(error.message);
    return r;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, role, ready, login, register, logout };
}
