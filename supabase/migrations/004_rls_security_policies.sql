-- ============================================
-- 004_RLS_SECURITY_POLICIES.SQL
-- Políticas de Segurança em Nível de Linha (RLS) para as 18 Tabelas Canônicas
-- Resolução de Recursão Infinita, RBAC Multi-Papel e Proteção de Colunas Sensíveis
-- ============================================

-- ============================================
-- 1. FUNÇÕES AUXILIARES DE AUTORIZAÇÃO (SECURITY DEFINER)
-- Previvem recursão infinita na tabela public.usuarios ao consultar o auth.uid()
-- ============================================

CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.usuarios WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.usuarios WHERE auth_id = auth.uid() LIMIT 1;
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

CREATE OR REPLACE FUNCTION public.is_professor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE auth_id = auth.uid() AND role = 'professor'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_aluno()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE auth_id = auth.uid() AND role = 'aluno'
  );
$$;

-- Permitir uso das funções para usuários autenticados
GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_gestor() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_professor() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_aluno() TO authenticated, anon;

-- ============================================
-- 2. PROTEÇÃO DE COLUNAS SENSÍVEIS (ROLE, AUTH_ID, ATIVO)
-- Impede que alunos ou professores alterem privilégios próprios
-- ============================================

CREATE OR REPLACE FUNCTION public.protect_user_sensitive_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas gestor pode alterar role, auth_id ou status ativo
  IF NOT public.is_gestor() THEN
    IF NEW.role <> OLD.role THEN
      RAISE EXCEPTION 'Operação não permitida: alteração de role é restrita a gestores';
    END IF;
    IF NEW.auth_id IS DISTINCT FROM OLD.auth_id THEN
      RAISE EXCEPTION 'Operação não permitida: alteração de auth_id é restrita a gestores';
    END IF;
    IF NEW.ativo <> OLD.ativo THEN
      RAISE EXCEPTION 'Operação não permitida: alteração do status ativo é restrita a gestores';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_user_sensitive_fields ON public.usuarios;
CREATE TRIGGER trg_protect_user_sensitive_fields
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_user_sensitive_fields();

-- ============================================
-- 3. HABILITAÇÃO DO RLS EM TODAS AS 18 TABELAS
-- ============================================

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professor_disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frequencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videoaulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso_videoaulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_lives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. POLÍTICAS DE RLS GRANULARES
-- ============================================

-- --------------------------------------------
-- 4.1 TABELA: USUARIOS
-- --------------------------------------------
DROP POLICY IF EXISTS "usuarios_gestor_all" ON public.usuarios;
CREATE POLICY "usuarios_gestor_all"
  ON public.usuarios
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "usuarios_read_self" ON public.usuarios;
CREATE POLICY "usuarios_read_self"
  ON public.usuarios
  FOR SELECT
  TO authenticated
  USING (
    auth_id = auth.uid()
    OR (
      -- Professor pode visualizar alunos matriculados em suas turmas
      public.is_professor() AND EXISTS (
        SELECT 1 FROM public.matriculas m
        JOIN public.professor_disciplinas pd ON pd.turma_id = m.turma_id
        WHERE m.aluno_id = usuarios.id AND pd.professor_id = public.get_current_user_id()
      )
    )
    OR (
      -- Aluno pode visualizar professores de suas turmas
      public.is_aluno() AND EXISTS (
        SELECT 1 FROM public.professor_disciplinas pd
        JOIN public.matriculas m ON m.turma_id = pd.turma_id
        WHERE pd.professor_id = usuarios.id AND m.aluno_id = public.get_current_user_id()
      )
    )
  );

DROP POLICY IF EXISTS "usuarios_update_self" ON public.usuarios;
CREATE POLICY "usuarios_update_self"
  ON public.usuarios
  FOR UPDATE
  TO authenticated
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- --------------------------------------------
-- 4.2 TABELA: CURSOS
-- --------------------------------------------
DROP POLICY IF EXISTS "cursos_gestor_all" ON public.cursos;
CREATE POLICY "cursos_gestor_all"
  ON public.cursos
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "cursos_read_authenticated" ON public.cursos;
CREATE POLICY "cursos_read_authenticated"
  ON public.cursos
  FOR SELECT
  TO authenticated
  USING (ativo = true);

-- --------------------------------------------
-- 4.3 TABELA: DISCIPLINAS
-- --------------------------------------------
DROP POLICY IF EXISTS "disciplinas_gestor_all" ON public.disciplinas;
CREATE POLICY "disciplinas_gestor_all"
  ON public.disciplinas
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "disciplinas_read_authenticated" ON public.disciplinas;
CREATE POLICY "disciplinas_read_authenticated"
  ON public.disciplinas
  FOR SELECT
  TO authenticated
  USING (true);

-- --------------------------------------------
-- 4.4 TABELA: TURMAS
-- --------------------------------------------
DROP POLICY IF EXISTS "turmas_gestor_all" ON public.turmas;
CREATE POLICY "turmas_gestor_all"
  ON public.turmas
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "turmas_professor_read" ON public.turmas;
CREATE POLICY "turmas_professor_read"
  ON public.turmas
  FOR SELECT
  TO authenticated
  USING (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.professor_disciplinas pd
      WHERE pd.turma_id = turmas.id AND pd.professor_id = public.get_current_user_id()
    )
  );

DROP POLICY IF EXISTS "turmas_aluno_read" ON public.turmas;
CREATE POLICY "turmas_aluno_read"
  ON public.turmas
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND EXISTS (
      SELECT 1 FROM public.matriculas m
      WHERE m.turma_id = turmas.id AND m.aluno_id = public.get_current_user_id()
    )
  );

-- --------------------------------------------
-- 4.5 TABELA: MATRICULAS
-- --------------------------------------------
DROP POLICY IF EXISTS "matriculas_gestor_all" ON public.matriculas;
CREATE POLICY "matriculas_gestor_all"
  ON public.matriculas
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "matriculas_professor_read" ON public.matriculas;
CREATE POLICY "matriculas_professor_read"
  ON public.matriculas
  FOR SELECT
  TO authenticated
  USING (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.professor_disciplinas pd
      WHERE pd.turma_id = matriculas.turma_id AND pd.professor_id = public.get_current_user_id()
    )
  );

DROP POLICY IF EXISTS "matriculas_aluno_read" ON public.matriculas;
CREATE POLICY "matriculas_aluno_read"
  ON public.matriculas
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND aluno_id = public.get_current_user_id()
  );

-- --------------------------------------------
-- 4.6 TABELA: PROFESSOR_DISCIPLINAS
-- --------------------------------------------
DROP POLICY IF EXISTS "prof_disc_gestor_all" ON public.professor_disciplinas;
CREATE POLICY "prof_disc_gestor_all"
  ON public.professor_disciplinas
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "prof_disc_professor_read" ON public.professor_disciplinas;
CREATE POLICY "prof_disc_professor_read"
  ON public.professor_disciplinas
  FOR SELECT
  TO authenticated
  USING (
    public.is_professor() AND professor_id = public.get_current_user_id()
  );

DROP POLICY IF EXISTS "prof_disc_aluno_read" ON public.professor_disciplinas;
CREATE POLICY "prof_disc_aluno_read"
  ON public.professor_disciplinas
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND EXISTS (
      SELECT 1 FROM public.matriculas m
      WHERE m.turma_id = professor_disciplinas.turma_id AND m.aluno_id = public.get_current_user_id()
    )
  );

-- --------------------------------------------
-- 4.7 TABELA: FREQUENCIAS
-- --------------------------------------------
DROP POLICY IF EXISTS "frequencias_gestor_all" ON public.frequencias;
CREATE POLICY "frequencias_gestor_all"
  ON public.frequencias
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "frequencias_professor_manage" ON public.frequencias;
CREATE POLICY "frequencias_professor_manage"
  ON public.frequencias
  FOR ALL
  TO authenticated
  USING (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.professor_disciplinas pd
      WHERE pd.disciplina_id = frequencias.disciplina_id
        AND pd.turma_id = frequencias.turma_id
        AND pd.professor_id = public.get_current_user_id()
    )
  )
  WITH CHECK (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.professor_disciplinas pd
      WHERE pd.disciplina_id = frequencias.disciplina_id
        AND pd.turma_id = frequencias.turma_id
        AND pd.professor_id = public.get_current_user_id()
    )
  );

DROP POLICY IF EXISTS "frequencias_aluno_read_self" ON public.frequencias;
CREATE POLICY "frequencias_aluno_read_self"
  ON public.frequencias
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND aluno_id = public.get_current_user_id()
  );

-- --------------------------------------------
-- 4.8 TABELA: NOTAS
-- --------------------------------------------
DROP POLICY IF EXISTS "notas_gestor_all" ON public.notas;
CREATE POLICY "notas_gestor_all"
  ON public.notas
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "notas_professor_manage" ON public.notas;
CREATE POLICY "notas_professor_manage"
  ON public.notas
  FOR ALL
  TO authenticated
  USING (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.professor_disciplinas pd
      WHERE pd.disciplina_id = notas.disciplina_id
        AND pd.turma_id = notas.turma_id
        AND pd.professor_id = public.get_current_user_id()
    )
  )
  WITH CHECK (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.professor_disciplinas pd
      WHERE pd.disciplina_id = notas.disciplina_id
        AND pd.turma_id = notas.turma_id
        AND pd.professor_id = public.get_current_user_id()
    )
  );

DROP POLICY IF EXISTS "notas_aluno_read_self" ON public.notas;
CREATE POLICY "notas_aluno_read_self"
  ON public.notas
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND aluno_id = public.get_current_user_id()
  );

-- --------------------------------------------
-- 4.9 TABELA: MATERIAIS
-- --------------------------------------------
DROP POLICY IF EXISTS "materiais_gestor_all" ON public.materiais;
CREATE POLICY "materiais_gestor_all"
  ON public.materiais
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "materiais_professor_manage" ON public.materiais;
CREATE POLICY "materiais_professor_manage"
  ON public.materiais
  FOR ALL
  TO authenticated
  USING (
    public.is_professor() AND (professor_id = public.get_current_user_id() OR ativo = true)
  )
  WITH CHECK (
    public.is_professor() AND professor_id = public.get_current_user_id()
  );

DROP POLICY IF EXISTS "materiais_aluno_read" ON public.materiais;
CREATE POLICY "materiais_aluno_read"
  ON public.materiais
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND ativo = true AND (
      disciplina_id IS NULL OR EXISTS (
        SELECT 1 FROM public.matriculas m
        JOIN public.turmas t ON t.id = m.turma_id
        JOIN public.disciplinas d ON d.curso_id = t.curso_id
        WHERE d.id = materiais.disciplina_id AND m.aluno_id = public.get_current_user_id()
      )
    )
  );

-- --------------------------------------------
-- 4.10 TABELA: TOPICOS
-- --------------------------------------------
DROP POLICY IF EXISTS "topicos_gestor_all" ON public.topicos;
CREATE POLICY "topicos_gestor_all"
  ON public.topicos
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "topicos_professor_manage" ON public.topicos;
CREATE POLICY "topicos_professor_manage"
  ON public.topicos
  FOR ALL
  TO authenticated
  USING (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.professor_disciplinas pd
      WHERE pd.disciplina_id = topicos.disciplina_id AND pd.professor_id = public.get_current_user_id()
    )
  )
  WITH CHECK (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.professor_disciplinas pd
      WHERE pd.disciplina_id = topicos.disciplina_id AND pd.professor_id = public.get_current_user_id()
    )
  );

DROP POLICY IF EXISTS "topicos_aluno_read" ON public.topicos;
CREATE POLICY "topicos_aluno_read"
  ON public.topicos
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND ativo = true
  );

-- --------------------------------------------
-- 4.11 TABELA: VIDEOAULAS
-- --------------------------------------------
DROP POLICY IF EXISTS "videoaulas_gestor_all" ON public.videoaulas;
CREATE POLICY "videoaulas_gestor_all"
  ON public.videoaulas
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "videoaulas_professor_manage" ON public.videoaulas;
CREATE POLICY "videoaulas_professor_manage"
  ON public.videoaulas
  FOR ALL
  TO authenticated
  USING (
    public.is_professor() AND (professor_id = public.get_current_user_id() OR ativo = true)
  )
  WITH CHECK (
    public.is_professor() AND professor_id = public.get_current_user_id()
  );

DROP POLICY IF EXISTS "videoaulas_aluno_read" ON public.videoaulas;
CREATE POLICY "videoaulas_aluno_read"
  ON public.videoaulas
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND ativo = true
  );

-- --------------------------------------------
-- 4.12 TABELA: PROGRESSO_VIDEOAULAS
-- --------------------------------------------
DROP POLICY IF EXISTS "progresso_gestor_all" ON public.progresso_videoaulas;
CREATE POLICY "progresso_gestor_all"
  ON public.progresso_videoaulas
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "progresso_aluno_manage_self" ON public.progresso_videoaulas;
CREATE POLICY "progresso_aluno_manage_self"
  ON public.progresso_videoaulas
  FOR ALL
  TO authenticated
  USING (
    public.is_aluno() AND aluno_id = public.get_current_user_id()
  )
  WITH CHECK (
    public.is_aluno() AND aluno_id = public.get_current_user_id()
  );

DROP POLICY IF EXISTS "progresso_professor_read" ON public.progresso_videoaulas;
CREATE POLICY "progresso_professor_read"
  ON public.progresso_videoaulas
  FOR SELECT
  TO authenticated
  USING (
    public.is_professor() AND EXISTS (
      SELECT 1 FROM public.matriculas m
      JOIN public.professor_disciplinas pd ON pd.turma_id = m.turma_id
      WHERE m.aluno_id = progresso_videoaulas.aluno_id AND pd.professor_id = public.get_current_user_id()
    )
  );

-- --------------------------------------------
-- 4.13 TABELA: LIVES
-- --------------------------------------------
DROP POLICY IF EXISTS "lives_gestor_all" ON public.lives;
CREATE POLICY "lives_gestor_all"
  ON public.lives
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "lives_professor_manage" ON public.lives;
CREATE POLICY "lives_professor_manage"
  ON public.lives
  FOR ALL
  TO authenticated
  USING (
    public.is_professor() AND (
      professor_id = public.get_current_user_id()
      OR EXISTS (
        SELECT 1 FROM public.professor_disciplinas pd
        WHERE pd.turma_id = lives.turma_id AND pd.professor_id = public.get_current_user_id()
      )
    )
  )
  WITH CHECK (
    public.is_professor() AND professor_id = public.get_current_user_id()
  );

DROP POLICY IF EXISTS "lives_aluno_read" ON public.lives;
CREATE POLICY "lives_aluno_read"
  ON public.lives
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND EXISTS (
      SELECT 1 FROM public.matriculas m
      WHERE m.turma_id = lives.turma_id AND m.aluno_id = public.get_current_user_id()
    )
  );

-- --------------------------------------------
-- 4.14 TABELA: CHAT_LIVES
-- --------------------------------------------
DROP POLICY IF EXISTS "chat_lives_gestor_all" ON public.chat_lives;
CREATE POLICY "chat_lives_gestor_all"
  ON public.chat_lives
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "chat_lives_read_participants" ON public.chat_lives;
CREATE POLICY "chat_lives_read_participants"
  ON public.chat_lives
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lives l
      WHERE l.id = chat_lives.live_id
      AND (
        public.is_gestor()
        OR l.professor_id = public.get_current_user_id()
        OR EXISTS (
          SELECT 1 FROM public.matriculas m
          WHERE m.turma_id = l.turma_id AND m.aluno_id = public.get_current_user_id()
        )
      )
    )
  );

DROP POLICY IF EXISTS "chat_lives_insert_self" ON public.chat_lives;
CREATE POLICY "chat_lives_insert_self"
  ON public.chat_lives
  FOR INSERT
  TO authenticated
  WITH CHECK (
    usuario_id = public.get_current_user_id()
  );

-- --------------------------------------------
-- 4.15 TABELA: PAGAMENTOS (Financeiro Estrito)
-- Professores NÃO POSSUEM acesso a pagamentos
-- Alunos acessam APENAS seus próprios pagamentos e NÃO podem alterá-los
-- --------------------------------------------
DROP POLICY IF EXISTS "pagamentos_gestor_all" ON public.pagamentos;
CREATE POLICY "pagamentos_gestor_all"
  ON public.pagamentos
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "pagamentos_aluno_read_self" ON public.pagamentos;
CREATE POLICY "pagamentos_aluno_read_self"
  ON public.pagamentos
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND aluno_id = public.get_current_user_id()
  );

-- --------------------------------------------
-- 4.16 TABELA: COMUNICADOS
-- --------------------------------------------
DROP POLICY IF EXISTS "comunicados_gestor_all" ON public.comunicados;
CREATE POLICY "comunicados_gestor_all"
  ON public.comunicados
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "comunicados_professor_manage" ON public.comunicados;
CREATE POLICY "comunicados_professor_manage"
  ON public.comunicados
  FOR ALL
  TO authenticated
  USING (
    public.is_professor() AND (autor_id = public.get_current_user_id() OR ativo = true)
  )
  WITH CHECK (
    public.is_professor() AND autor_id = public.get_current_user_id()
  );

DROP POLICY IF EXISTS "comunicados_aluno_read" ON public.comunicados;
CREATE POLICY "comunicados_aluno_read"
  ON public.comunicados
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() AND ativo = true AND (
      'todos' = ANY(destinatarios)
      OR 'alunos' = ANY(destinatarios)
      OR EXISTS (
        SELECT 1 FROM public.matriculas m
        WHERE m.aluno_id = public.get_current_user_id()
        AND m.turma_id::text = ANY(destinatarios)
      )
    )
  );

-- --------------------------------------------
-- 4.17 TABELA: OBSERVACOES
-- Aluno vê apenas observações com visibilidade 'todos'
-- --------------------------------------------
DROP POLICY IF EXISTS "observacoes_gestor_all" ON public.observacoes;
CREATE POLICY "observacoes_gestor_all"
  ON public.observacoes
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "observacoes_professor_manage" ON public.observacoes;
CREATE POLICY "observacoes_professor_manage"
  ON public.observacoes
  FOR ALL
  TO authenticated
  USING (
    public.is_professor() AND (
      autor_id = public.get_current_user_id()
      OR EXISTS (
        SELECT 1 FROM public.matriculas m
        JOIN public.professor_disciplinas pd ON pd.turma_id = m.turma_id
        WHERE m.aluno_id = observacoes.aluno_id AND pd.professor_id = public.get_current_user_id()
      )
    )
  )
  WITH CHECK (
    public.is_professor() AND autor_id = public.get_current_user_id()
  );

DROP POLICY IF EXISTS "observacoes_aluno_read_public" ON public.observacoes;
CREATE POLICY "observacoes_aluno_read_public"
  ON public.observacoes
  FOR SELECT
  TO authenticated
  USING (
    public.is_aluno() 
    AND aluno_id = public.get_current_user_id() 
    AND visivel_para = 'todos'
  );

-- --------------------------------------------
-- 4.18 TABELA: NOTIFICACOES
-- Usuário visualiza, marca como lida e remove apenas suas próprias notificações
-- --------------------------------------------
DROP POLICY IF EXISTS "notificacoes_gestor_all" ON public.notificacoes;
CREATE POLICY "notificacoes_gestor_all"
  ON public.notificacoes
  FOR ALL
  TO authenticated
  USING (public.is_gestor())
  WITH CHECK (public.is_gestor());

DROP POLICY IF EXISTS "notificacoes_user_manage_self" ON public.notificacoes;
CREATE POLICY "notificacoes_user_manage_self"
  ON public.notificacoes
  FOR ALL
  TO authenticated
  USING (
    usuario_id = public.get_current_user_id()
  )
  WITH CHECK (
    usuario_id = public.get_current_user_id()
  );

-- ============================================
-- 5. RPC SEGURA PARA LOGIN POR CPF (Zero Enumeração)
-- Substitui políticas abertas (USING true) e limita estritamente o retorno
-- ============================================

CREATE OR REPLACE FUNCTION public.get_email_by_cpf(cpf_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_cleaned_cpf text;
BEGIN
  -- Limpar pontuações de CPF mantendo apenas dígitos
  v_cleaned_cpf := regexp_replace(cpf_input, '[^0-9]', '', 'g');

  IF length(v_cleaned_cpf) <> 11 THEN
    RETURN NULL;
  END IF;

  SELECT email INTO v_email
  FROM public.usuarios
  WHERE regexp_replace(cpf, '[^0-9]', '', 'g') = v_cleaned_cpf
    AND ativo = true
  LIMIT 1;

  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_by_cpf(text) TO anon, authenticated;
