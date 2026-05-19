import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
    if (ready && user) navigate({ to: "/dashboard" });
  }, [ready, user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email.trim(), password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <aside
        className="relative hidden lg:flex flex-col justify-between p-10 text-white"
        style={{
          background:
            "linear-gradient(135deg, #061a4a 0%, #0a2a6c 50%, #1454b8 100%)",
        }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-white/15 grid place-items-center font-bold text-sm">
            YZ
          </div>
          <span className="font-semibold">Metalúrgica YZ</span>
        </Link>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Tudo o que sua operação industrial precisa, em um portal.
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Pedidos, chamados, máquinas, EPI, documentos e denúncias.
          </p>
        </div>

        <div className="text-xs text-white/50">© 2026 Metalúrgica YZ</div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#0a2a6c]">Entrar no portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use seu email e senha cadastrados.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
                placeholder="voce@empresa.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
              />
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-md bg-[#0a2a6c] hover:bg-[#0a2a6c]/90 text-white py-2.5 text-sm font-medium"
            >
              Entrar
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="text-[#0a2a6c] font-semibold">
              Criar conta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
