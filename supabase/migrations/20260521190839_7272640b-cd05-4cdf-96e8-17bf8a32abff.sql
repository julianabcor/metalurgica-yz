
-- Enum de papéis
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('operador', 'gestor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tabela user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can view own roles" ON public.user_roles;
CREATE POLICY "users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Função has_role (security definer)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Atualiza handle_new_user para também criar role baseado em metadata (default operador)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, nome)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email));

  v_role := CASE
    WHEN COALESCE(NEW.raw_user_meta_data->>'role','operador') = 'gestor' THEN 'gestor'::public.app_role
    ELSE 'operador'::public.app_role
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, v_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Garante trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas: gestores podem ver/atualizar tudo
-- pedidos
DROP POLICY IF EXISTS "gestores view all pedidos" ON public.pedidos;
CREATE POLICY "gestores view all pedidos" ON public.pedidos
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'gestor'));
DROP POLICY IF EXISTS "gestores update all pedidos" ON public.pedidos;
CREATE POLICY "gestores update all pedidos" ON public.pedidos
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'gestor'));

-- chamados
DROP POLICY IF EXISTS "gestores view all chamados" ON public.chamados;
CREATE POLICY "gestores view all chamados" ON public.chamados
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'gestor'));
DROP POLICY IF EXISTS "gestores update all chamados" ON public.chamados;
CREATE POLICY "gestores update all chamados" ON public.chamados
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'gestor'));

-- epis
DROP POLICY IF EXISTS "gestores view all epis" ON public.epis;
CREATE POLICY "gestores view all epis" ON public.epis
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'gestor'));
DROP POLICY IF EXISTS "gestores update all epis" ON public.epis;
CREATE POLICY "gestores update all epis" ON public.epis
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'gestor'));

-- denuncias
DROP POLICY IF EXISTS "gestores view all denuncias" ON public.denuncias;
CREATE POLICY "gestores view all denuncias" ON public.denuncias
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'gestor'));

-- Permitir que gestores leiam nome dos solicitantes
DROP POLICY IF EXISTS "gestores view all profiles" ON public.profiles;
CREATE POLICY "gestores view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'gestor'));
