-- ============================================
-- 006 — COLUNAS DA JORNADA ACADÊMICA
--
-- A interface (src/services/academicRepository.ts) grava quem lançou cada
-- nota/frequência e a observação da nota, e faz upsert por avaliação.
-- ============================================

-- Dados do formulário de cadastro de aluno
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS data_nascimento DATE,
  ADD COLUMN IF NOT EXISTS endereco JSONB;

ALTER TABLE public.notas
  ADD COLUMN IF NOT EXISTS professor_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS observacao TEXT;

ALTER TABLE public.frequencias
  ADD COLUMN IF NOT EXISTS professor_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL;

-- Uma nota por aluno/disciplina/turma/avaliação: permite relançar (upsert)
CREATE UNIQUE INDEX IF NOT EXISTS notas_avaliacao_unica
  ON public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao);

-- O professor só pode registrar a si mesmo como autor do lançamento
DROP POLICY IF EXISTS notas_professor_manage ON public.notas;
CREATE POLICY notas_professor_manage ON public.notas
  FOR ALL TO authenticated
  USING (public.is_professor() AND public.professor_leciona(disciplina_id, turma_id))
  WITH CHECK (
    public.is_professor()
    AND public.professor_leciona(disciplina_id, turma_id)
    AND public.aluno_esta_na_turma(aluno_id, turma_id)
    AND (professor_id IS NULL OR professor_id = public.get_current_user_id())
  );

DROP POLICY IF EXISTS frequencias_professor_manage ON public.frequencias;
CREATE POLICY frequencias_professor_manage ON public.frequencias
  FOR ALL TO authenticated
  USING (public.is_professor() AND public.professor_leciona(disciplina_id, turma_id))
  WITH CHECK (
    public.is_professor()
    AND public.professor_leciona(disciplina_id, turma_id)
    AND public.aluno_esta_na_turma(aluno_id, turma_id)
    AND (professor_id IS NULL OR professor_id = public.get_current_user_id())
  );
