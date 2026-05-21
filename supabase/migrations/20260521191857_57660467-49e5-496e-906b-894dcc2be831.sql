CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, nome)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email));

  -- Always assign operador on signup. Gestor role can only be granted
  -- server-side via a verified invite code (see grant_gestor_role).
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'operador'::public.app_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;