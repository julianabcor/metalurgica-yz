import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      login(email.trim(), password);
      navigate({ to: "/" });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold leading-tight">Metalúrgica YZ</div>
            <div className="text-xs text-muted-foreground">Portal interno</div>
          </div>
        </div>
        <h1 className="text-xl font-bold mb-1">Entrar</h1>
        <p className="text-sm text-muted-foreground mb-5">Acesse sua conta</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="voce@metalurgicayz.com.br"
            />
          </div>
          <div>
            <label className="text-xs font-medium">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90"
          >
            Entrar
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-5 text-center">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-primary font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
