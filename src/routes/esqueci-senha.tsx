import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/esqueci-senha")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setMsg("Enviamos um link de redefinição para seu email. Verifique sua caixa de entrada e spam.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#0a2a6c]">Recuperar senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe seu email cadastrado e enviaremos um link para criar uma nova senha.
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
          {error && <p className="text-xs text-rose-600">{error}</p>}
          {msg && <p className="text-xs text-emerald-700">{msg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#0a2a6c] hover:bg-[#0a2a6c]/90 disabled:opacity-60 text-white py-2.5 text-sm font-medium"
          >
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </button>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          <Link to="/login" className="text-[#0a2a6c] font-semibold">Voltar para o login</Link>
        </p>
      </div>
    </div>
  );
}
