-- Reabilitar RLS com políticas corretas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura de qualquer usuário (necessário para login)
CREATE POLICY "Permitir leitura de usuários para login" ON usuarios
  FOR SELECT
  USING (true);

-- Criar política para permitir atualização apenas do próprio usuário
CREATE POLICY "Permitir atualização próprio usuário" ON usuarios
  FOR UPDATE
  USING (auth.uid() = auth_id);

-- Criar política para permitir inserção apenas para usuários autenticados
CREATE POLICY "Permitir inserção para usuários autenticados" ON usuarios
  FOR INSERT
  WITH CHECK (auth.uid() = auth_id);