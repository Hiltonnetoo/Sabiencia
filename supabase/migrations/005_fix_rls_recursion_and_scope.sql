-- ============================================
-- 005 — CORREÇÃO DE RLS: RECURSÃO, VIEWS E ESCOPO DE ESCRITA
--
-- Problemas reproduzidos em Postgres real após aplicar 001–004
-- (ver supabase/tests/rls_test.sql, executado na CI):
--
-- 1. Recursão infinita: as policies legadas de 001 ("Gestores têm acesso
--    total" etc.) consultavam public.usuarios dentro da policy de
--    public.usuarios; e matriculas <-> professor_disciplinas se consultavam
--    mutuamente. Qualquer SELECT em usuarios/notas/matriculas falhava.
-- 2. Views (alunos, professores, ...) rodavam com os privilégios do dono e
--    ignoravam a RLS: um aluno lia todos os alunos via public.alunos.
-- 3. Policies "FOR ALL" de professor usavam o USING de leitura também para
--    UPDATE/DELETE: professor podia editar/apagar materiais, comunicados,
--    videoaulas, lives e observações de outros professores.
-- 4. Professor podia lançar nota/frequência para aluno não matriculado na
--    turma.
-- 5. O gatilho de proteção de role/auth_id bloqueava também o service_role
--    (backend confiável), impedindo vincular auth_id de novos usuários.
--
-- Estratégia: toda verificação que cruza tabelas passa por funções
-- SECURITY DEFINER (executam como dono, sem reavaliar RLS), então nenhuma
-- policy consulta diretamente outra tabela com RLS.
-- ============================================

-- --------------------------------------------
-- 1. Remover policies legadas (001) que causam recursão
-- --------------------------------------------
DROP POLICY IF EXISTS "Gestores têm acesso total" ON public.usuarios;
DROP POLICY IF EXISTS "Professores veem seus alunos" ON public.matriculas;
DROP POLICY IF EXISTS "Alunos veem apenas seus dados" ON public.notas;
DROP POLICY IF EXISTS "Alunos veem apenas suas frequências" ON public.frequencias;

-- --------------------------------------------
-- 2. Funções auxiliares de vínculo (SECURITY DEFINER)
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.professor_leciona_turma(p_turma UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.professor_disciplinas
    WHERE professor_id = public.get_current_user_id() AND turma_id = p_turma
  );
$$;

CREATE OR REPLACE FUNCTION public.professor_leciona(p_disciplina UUID, p_turma UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.professor_disciplinas
    WHERE professor_id = public.get_current_user_id()
      AND disciplina_id = p_disciplina
      AND turma_id = p_turma
  );
$$;

CREATE OR REPLACE FUNCTION public.professor_leciona_disciplina(p_disciplina UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.professor_disciplinas
    WHERE professor_id = public.get_current_user_id() AND disciplina_id = p_disciplina
  );
$$;

CREATE OR REPLACE FUNCTION public.professor_tem_aluno(p_aluno UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.matriculas m
    JOIN public.professor_disciplinas pd ON pd.turma_id = m.turma_id
    WHERE m.aluno_id = p_aluno AND pd.professor_id = public.get_current_user_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.aluno_matriculado_turma(p_turma UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matriculas
    WHERE aluno_id = public.get_current_user_id() AND turma_id = p_turma
  );
$$;

CREATE OR REPLACE FUNCTION public.aluno_tem_professor(p_professor UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.professor_disciplinas pd
    JOIN public.matriculas m ON m.turma_id = pd.turma_id
    WHERE pd.professor_id = p_professor AND m.aluno_id = public.get_current_user_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.aluno_cursa_disciplina(p_disciplina UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.matriculas m
    JOIN public.turmas t ON t.id = m.turma_id
    JOIN public.disciplinas d ON d.curso_id = t.curso_id
    WHERE d.id = p_disciplina AND m.aluno_id = public.get_current_user_id()
  );
$$;

-- Matrícula de um aluno qualquer numa turma (usada no WITH CHECK de notas/frequência)
CREATE OR REPLACE FUNCTION public.aluno_esta_na_turma(p_aluno UUID, p_turma UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matriculas WHERE aluno_id = p_aluno AND turma_id = p_turma
  );
$$;

CREATE OR REPLACE FUNCTION public.aluno_destinatario(p_destinatarios TEXT[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matriculas
    WHERE aluno_id = public.get_current_user_id()
      AND turma_id::text = ANY (p_destinatarios)
  );
$$;

CREATE OR REPLACE FUNCTION public.pode_ver_live(p_live UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.lives l
    WHERE l.id = p_live
      AND (
        public.is_gestor()
        OR l.professor_id = public.get_current_user_id()
        OR EXISTS (
          SELECT 1 FROM public.matriculas m
          WHERE m.turma_id = l.turma_id AND m.aluno_id = public.get_current_user_id()
        )
      )
  );
$$;

DO $$
DECLARE fn TEXT;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'professor_leciona_turma(uuid)', 'professor_leciona(uuid, uuid)',
    'professor_leciona_disciplina(uuid)', 'professor_tem_aluno(uuid)',
    'aluno_matriculado_turma(uuid)', 'aluno_tem_professor(uuid)',
    'aluno_cursa_disciplina(uuid)', 'aluno_esta_na_turma(uuid, uuid)',
    'aluno_destinatario(text[])', 'pode_ver_live(uuid)'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO authenticated', fn);
  END LOOP;
END $$;

-- --------------------------------------------
-- 3. Gatilho de campos sensíveis: só restringe papéis de cliente
--    (anon/authenticated). service_role e o dono do banco continuam aptos
--    a vincular auth_id e administrar perfis.
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_user_sensitive_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') AND NOT public.is_gestor() THEN
    IF NEW.role <> OLD.role THEN
      RAISE EXCEPTION 'Operação não permitida: alteração de role é restrita a gestores';
    END IF;
    IF NEW.auth_id IS DISTINCT FROM OLD.auth_id THEN
      RAISE EXCEPTION 'Operação não permitida: alteração de auth_id é restrita a gestores';
    END IF;
    IF NEW.ativo IS DISTINCT FROM OLD.ativo THEN
      RAISE EXCEPTION 'Operação não permitida: alteração do status ativo é restrita a gestores';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- --------------------------------------------
-- 4. Views passam a respeitar a RLS de quem consulta (Postgres 15+)
-- --------------------------------------------
ALTER VIEW public.alunos SET (security_invoker = true);
ALTER VIEW public.professores SET (security_invoker = true);
ALTER VIEW public.gestores SET (security_invoker = true);
ALTER VIEW public.materiais_didaticos SET (security_invoker = true);
ALTER VIEW public.usuario_notificacoes SET (security_invoker = true);
ALTER VIEW public.chat_mensagens SET (security_invoker = true);

-- --------------------------------------------
-- 5. Recriar policies que cruzavam tabelas
-- --------------------------------------------

-- USUARIOS
DROP POLICY IF EXISTS usuarios_read_self ON public.usuarios;
CREATE POLICY usuarios_read_self ON public.usuarios
  FOR SELECT TO authenticated
  USING (
    auth_id = auth.uid()
    OR (public.is_professor() AND public.professor_tem_aluno(id))
    OR (public.is_aluno() AND public.aluno_tem_professor(id))
  );

-- MATRICULAS
DROP POLICY IF EXISTS matriculas_professor_read ON public.matriculas;
CREATE POLICY matriculas_professor_read ON public.matriculas
  FOR SELECT TO authenticated
  USING (public.is_professor() AND public.professor_leciona_turma(turma_id));

-- PROFESSOR_DISCIPLINAS
DROP POLICY IF EXISTS prof_disc_aluno_read ON public.professor_disciplinas;
CREATE POLICY prof_disc_aluno_read ON public.professor_disciplinas
  FOR SELECT TO authenticated
  USING (public.is_aluno() AND public.aluno_matriculado_turma(turma_id));

-- TURMAS
DROP POLICY IF EXISTS turmas_aluno_read ON public.turmas;
CREATE POLICY turmas_aluno_read ON public.turmas
  FOR SELECT TO authenticated
  USING (public.is_aluno() AND public.aluno_matriculado_turma(id));

DROP POLICY IF EXISTS turmas_professor_read ON public.turmas;
CREATE POLICY turmas_professor_read ON public.turmas
  FOR SELECT TO authenticated
  USING (public.is_professor() AND public.professor_leciona_turma(id));

-- NOTAS: professor só lança para disciplina/turma que leciona e aluno matriculado nela
DROP POLICY IF EXISTS notas_professor_manage ON public.notas;
CREATE POLICY notas_professor_manage ON public.notas
  FOR ALL TO authenticated
  USING (public.is_professor() AND public.professor_leciona(disciplina_id, turma_id))
  WITH CHECK (
    public.is_professor()
    AND public.professor_leciona(disciplina_id, turma_id)
    AND public.aluno_esta_na_turma(aluno_id, turma_id)
  );

-- FREQUENCIAS
DROP POLICY IF EXISTS frequencias_professor_manage ON public.frequencias;
CREATE POLICY frequencias_professor_manage ON public.frequencias
  FOR ALL TO authenticated
  USING (public.is_professor() AND public.professor_leciona(disciplina_id, turma_id))
  WITH CHECK (
    public.is_professor()
    AND public.professor_leciona(disciplina_id, turma_id)
    AND public.aluno_esta_na_turma(aluno_id, turma_id)
  );

-- MATERIAIS: leitura ampla para professores; escrita só do autor
DROP POLICY IF EXISTS materiais_professor_manage ON public.materiais;
CREATE POLICY materiais_professor_read ON public.materiais
  FOR SELECT TO authenticated
  USING (public.is_professor() AND (professor_id = public.get_current_user_id() OR ativo = true));
CREATE POLICY materiais_professor_write ON public.materiais
  FOR ALL TO authenticated
  USING (public.is_professor() AND professor_id = public.get_current_user_id())
  WITH CHECK (public.is_professor() AND professor_id = public.get_current_user_id());

DROP POLICY IF EXISTS materiais_aluno_read ON public.materiais;
CREATE POLICY materiais_aluno_read ON public.materiais
  FOR SELECT TO authenticated
  USING (
    public.is_aluno() AND ativo = true
    AND (disciplina_id IS NULL OR public.aluno_cursa_disciplina(disciplina_id))
  );

-- TOPICOS
DROP POLICY IF EXISTS topicos_professor_manage ON public.topicos;
CREATE POLICY topicos_professor_manage ON public.topicos
  FOR ALL TO authenticated
  USING (public.is_professor() AND public.professor_leciona_disciplina(disciplina_id))
  WITH CHECK (public.is_professor() AND public.professor_leciona_disciplina(disciplina_id));

-- VIDEOAULAS
DROP POLICY IF EXISTS videoaulas_professor_manage ON public.videoaulas;
CREATE POLICY videoaulas_professor_read ON public.videoaulas
  FOR SELECT TO authenticated
  USING (public.is_professor() AND (professor_id = public.get_current_user_id() OR ativo = true));
CREATE POLICY videoaulas_professor_write ON public.videoaulas
  FOR ALL TO authenticated
  USING (public.is_professor() AND professor_id = public.get_current_user_id())
  WITH CHECK (public.is_professor() AND professor_id = public.get_current_user_id());

-- PROGRESSO_VIDEOAULAS
DROP POLICY IF EXISTS progresso_professor_read ON public.progresso_videoaulas;
CREATE POLICY progresso_professor_read ON public.progresso_videoaulas
  FOR SELECT TO authenticated
  USING (public.is_professor() AND public.professor_tem_aluno(aluno_id));

-- LIVES
DROP POLICY IF EXISTS lives_professor_manage ON public.lives;
CREATE POLICY lives_professor_read ON public.lives
  FOR SELECT TO authenticated
  USING (
    public.is_professor()
    AND (professor_id = public.get_current_user_id() OR public.professor_leciona_turma(turma_id))
  );
CREATE POLICY lives_professor_write ON public.lives
  FOR ALL TO authenticated
  USING (public.is_professor() AND professor_id = public.get_current_user_id())
  WITH CHECK (public.is_professor() AND professor_id = public.get_current_user_id());

DROP POLICY IF EXISTS lives_aluno_read ON public.lives;
CREATE POLICY lives_aluno_read ON public.lives
  FOR SELECT TO authenticated
  USING (public.is_aluno() AND public.aluno_matriculado_turma(turma_id));

-- CHAT_LIVES
DROP POLICY IF EXISTS chat_lives_read_participants ON public.chat_lives;
CREATE POLICY chat_lives_read_participants ON public.chat_lives
  FOR SELECT TO authenticated
  USING (public.pode_ver_live(live_id));

DROP POLICY IF EXISTS chat_lives_insert_self ON public.chat_lives;
CREATE POLICY chat_lives_insert_self ON public.chat_lives
  FOR INSERT TO authenticated
  WITH CHECK (usuario_id = public.get_current_user_id() AND public.pode_ver_live(live_id));

-- COMUNICADOS
DROP POLICY IF EXISTS comunicados_professor_manage ON public.comunicados;
CREATE POLICY comunicados_professor_read ON public.comunicados
  FOR SELECT TO authenticated
  USING (public.is_professor() AND (autor_id = public.get_current_user_id() OR ativo = true));
CREATE POLICY comunicados_professor_write ON public.comunicados
  FOR ALL TO authenticated
  USING (public.is_professor() AND autor_id = public.get_current_user_id())
  WITH CHECK (public.is_professor() AND autor_id = public.get_current_user_id());

DROP POLICY IF EXISTS comunicados_aluno_read ON public.comunicados;
CREATE POLICY comunicados_aluno_read ON public.comunicados
  FOR SELECT TO authenticated
  USING (
    public.is_aluno() AND ativo = true
    AND (
      'todos' = ANY (destinatarios)
      OR 'alunos' = ANY (destinatarios)
      OR public.aluno_destinatario(destinatarios)
    )
  );

-- OBSERVACOES
DROP POLICY IF EXISTS observacoes_professor_manage ON public.observacoes;
CREATE POLICY observacoes_professor_read ON public.observacoes
  FOR SELECT TO authenticated
  USING (
    public.is_professor()
    AND (autor_id = public.get_current_user_id() OR public.professor_tem_aluno(aluno_id))
  );
CREATE POLICY observacoes_professor_write ON public.observacoes
  FOR ALL TO authenticated
  USING (public.is_professor() AND autor_id = public.get_current_user_id())
  WITH CHECK (
    public.is_professor()
    AND autor_id = public.get_current_user_id()
    AND public.professor_tem_aluno(aluno_id)
  );
