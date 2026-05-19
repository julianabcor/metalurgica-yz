import { useEffect, useState, useCallback } from "react";

export type User = { name: string; email: string };
type StoredUser = User & { password: string };

const USERS_KEY = "myz-users-v1";
const SESSION_KEY = "myz-session-v1";
const EVT = "myz-auth";

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(list: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

function readSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => readSession());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readSession());
    setReady(true);
    const sync = () => setUser(readSession());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const login = useCallback((email: string, password: string) => {
    const u = readUsers().find(
      (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password,
    );
    if (!u) throw new Error("E-mail ou senha incorretos.");
    const sess: User = { name: u.name, email: u.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
    window.dispatchEvent(new Event(EVT));
    return sess;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Este e-mail já está cadastrado.");
    }
    users.push({ name, email, password });
    writeUsers(users);
    const sess: User = { name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
    window.dispatchEvent(new Event(EVT));
    return sess;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(EVT));
  }, []);

  return { user, ready, login, register, logout };
}
