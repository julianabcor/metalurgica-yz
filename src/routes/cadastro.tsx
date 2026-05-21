import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth";
import { claimGestorRole } from "@/lib/roles.functions";

export const Route = createFileRoute("/cadastro")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register, refreshRole, user, ready } = useAuth();
  const claimGestor = useServerFn(claimGestorRole);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard" });
  }, [ready, user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      let target: "/gestao" | "/dashboard" = "/dashboard";
      if (inviteCode.trim()) {
        try {
          await claimGestor({ data: { code: inviteCode.trim() } });
          const r = await refreshRole();
          if (r === "gestor") target = "/gestao";
        } catch (err) {
          setError(`Cadastro criado, mas código de gestor inválido: ${(err as Error).message}`);
          setSubmitting(false);
          return;
        }
      }
      navigate({ to: target });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  void company;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
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
            Junte-se ao time que opera com a Metalúrgica YZ.
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Cadastro gratuito. Sem cartão de crédito.
          </p>
        </div>

        <div className="text-xs text-white/50">© 2026 Metalúrgica YZ</div>
      </aside>

      <main className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#0a2a6c]">Criar sua conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesso completo ao portal industrial.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">Nome completo</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">Empresa (opcional)</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">Senha (mín. 6 caracteres)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">
                Código de gestor <span className="font-normal text-muted-foreground">(opcional)</span>
              </label>
              <input
                type="password"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Deixe em branco para conta de operador"
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Somente quem possui o código fornecido pela diretoria pode criar contas de gestão.
              </p>
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-[#0a2a6c] hover:bg-[#0a2a6c]/90 disabled:opacity-60 text-white py-2.5 text-sm font-medium"
            >
              {submitting ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Já tem conta?{" "}
            <Link to="/login" className="text-[#0a2a6c] font-semibold">
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
