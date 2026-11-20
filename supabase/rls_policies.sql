-- ============================================
-- RLS E RPC PARA TABELA DE USUÁRIOS E DOMÍNIO
-- Consolidação canônica referenciando migrations/004_rls_security_policies.sql
-- ============================================

-- Habilitar RLS
ALTER TABLE IF EXISTS public.usuarios ENABLE ROW LEVEL SECURITY;

-- Funções de Autorização Seguras (Security Definer para prevenir recursão infinita)
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.usuarios WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_gestor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE auth_id = auth.uid() AND role = 'gestor'
  );
$$;

-- Políticas de Usuários
DROP POLICY IF EXISTS "select own profile" ON public.usuarios;
CREATE POLICY "select own profile"
ON public.usuarios
FOR SELECT
TO authenticated
USING (
  auth_id = auth.uid()
  OR public.is_gestor()
);

DROP POLICY IF EXISTS "update own profile" ON public.usuarios;
CREATE POLICY "update own profile"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (auth_id = auth.uid() OR public.is_gestor())
WITH CHECK (auth_id = auth.uid() OR public.is_gestor());

-- Função RPC segura para obter e-mail via CPF (apenas retorna e-mail do titular ativo)
CREATE OR REPLACE FUNCTION public.get_email_by_cpf(cpf text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_cleaned text;
  v_email text;
BEGIN
  v_cleaned := regexp_replace(cpf, '[^0-9]', '', 'g');
  IF length(v_cleaned) <> 11 THEN
    RETURN NULL;
  END IF;

  SELECT email INTO v_email
  FROM public.usuarios
  WHERE regexp_replace(public.usuarios.cpf, '[^0-9]', '', 'g') = v_cleaned
    AND ativo = true
  LIMIT 1;

  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_by_cpf(text) TO anon, authenticated;
