import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const claimGestorRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ code: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data, context }) => {
    const expected = process.env.GESTOR_INVITE_CODE;
    if (!expected) throw new Error("Código de gestor não configurado no servidor.");
    if (data.code !== expected) throw new Error("Código de gestor inválido.");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: context.userId, role: "gestor" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
