-- ============================================
-- Correção Segura de RLS em Usuarios (Sem USING (true))
-- Previne recursão infinita via Security Definer is_gestor()
-- ============================================

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Permitir leitura de usuários para login" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_read_policy" ON public.usuarios;
CREATE POLICY "usuarios_read_policy" ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = auth_id
    OR public.is_gestor()
  );

DROP POLICY IF EXISTS "Permitir atualização próprio usuário" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_policy" ON public.usuarios;
CREATE POLICY "usuarios_update_policy" ON public.usuarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_id OR public.is_gestor())
  WITH CHECK (auth.uid() = auth_id OR public.is_gestor());

DROP POLICY IF EXISTS "Permitir inserção para usuários autenticados" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insert_policy" ON public.usuarios;
CREATE POLICY "usuarios_insert_policy" ON public.usuarios
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_id OR public.is_gestor());
