import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type User = { name: string; email: string; id: string };

function fromSession(session: Session | null): User | null {
  if (!session?.user) return null;
  const u = session.user;
  const nome = (u.user_metadata?.nome as string | undefined) ?? u.email ?? "";
  return { id: u.id, email: u.email ?? "", name: nome };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(fromSession(session));
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(fromSession(data.session));
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome: name },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw new Error(error.message);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, ready, login, register, logout };
}
