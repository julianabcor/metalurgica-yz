import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/redefinir-senha")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase parses recovery tokens from the URL hash automatically and
    // fires a PASSWORD_RECOVERY event. We just need to wait for the session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#0a2a6c]">Nova senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ready
            ? "Defina uma nova senha para sua conta."
            : "Validando link de recuperação..."}
        </p>
        {ready && (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">Nova senha</label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#0a2a6c] hover:bg-[#0a2a6c]/5"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0a2a6c]">Confirmar senha</label>
              <div className="relative mt-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2a6c]/30"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#0a2a6c] hover:bg-[#0a2a6c]/5"
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#0a2a6c] hover:bg-[#0a2a6c]/90 disabled:opacity-60 text-white py-2.5 text-sm font-medium"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
        <p className="text-sm text-muted-foreground mt-6 text-center">
          <Link to="/login" className="text-[#0a2a6c] font-semibold">Voltar para o login</Link>
        </p>
      </div>
    </div>
  );
}
