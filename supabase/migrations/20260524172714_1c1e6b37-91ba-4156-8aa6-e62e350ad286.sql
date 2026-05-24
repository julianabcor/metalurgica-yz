-- 1. Wipe existing users (cascades to profiles, user_roles, and all user-owned data)
DELETE FROM auth.users;

-- 2. Add matricula + cargo columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS matricula text UNIQUE,
  ADD COLUMN IF NOT EXISTS cargo text NOT NULL DEFAULT 'operador'
    CHECK (cargo IN ('operador','chefia','gestao'));

-- 3. Recreate signup handler to persist matricula + cargo and map to user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_cargo text := COALESCE(NEW.raw_user_meta_data->>'cargo', 'operador');
BEGIN
  INSERT INTO public.profiles (id, nome, matricula, cargo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.raw_user_meta_data->>'matricula',
    v_cargo
  );

  IF v_cargo IN ('chefia','gestao') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'gestor'::public.app_role)
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'operador'::public.app_role)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 4. Make sure the trigger is wired (re-create defensively)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();