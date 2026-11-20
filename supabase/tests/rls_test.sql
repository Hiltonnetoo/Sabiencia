-- ============================================
-- TESTES DE RLS CONTRA POSTGRES REAL
-- Executado por scripts/test-db.sh após aplicar supabase/migrations/*.sql.
-- Cada asserção imprime "ok - ..." ou aborta o script com erro.
--
-- Simula a jornada completa com perfis distintos:
--   gestor cadastra aluno e matricula -> professor lança nota e frequência
--   -> aluno consulta somente os próprios dados
-- e verifica explicitamente os acessos negados.
-- ============================================
\set ON_ERROR_STOP 1
\set QUIET 1
SET client_min_messages = notice;

-- --------------------------------------------
-- Helpers de asserção (SECURITY INVOKER: executam com o papel corrente)
-- --------------------------------------------
CREATE SCHEMA tests;
GRANT USAGE ON SCHEMA tests TO anon, authenticated, service_role;

CREATE FUNCTION tests.ok(cond BOOLEAN, msg TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF cond IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'FALHOU - %', msg;
  END IF;
  RAISE NOTICE 'ok - %', msg;
END $$;

CREATE FUNCTION tests.eq(actual BIGINT, expected BIGINT, msg TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF actual IS DISTINCT FROM expected THEN
    RAISE EXCEPTION 'FALHOU - % (esperado %, obtido %)', msg, expected, actual;
  END IF;
  RAISE NOTICE 'ok - %', msg;
END $$;

-- Executa a instrução e exige que ela seja recusada (RLS ou gatilho)
CREATE FUNCTION tests.denied(stmt TEXT, msg TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE stmt;
  EXCEPTION
    WHEN insufficient_privilege OR raise_exception OR check_violation THEN
      RAISE NOTICE 'ok - %', msg;
      RETURN;
  END;
  RAISE EXCEPTION 'FALHOU - % (instrução foi aceita: %)', msg, stmt;
END $$;

-- Executa e confere quantas linhas foram afetadas (RLS filtra UPDATE/DELETE em silêncio)
CREATE FUNCTION tests.affects(stmt TEXT, expected BIGINT, msg TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE n BIGINT;
BEGIN
  EXECUTE stmt;
  GET DIAGNOSTICS n = ROW_COUNT;
  PERFORM tests.eq(n, expected, msg);
END $$;

-- Login simulado: define o claim "sub" lido por auth.uid()
CREATE FUNCTION tests.login(p_auth UUID) RETURNS VOID LANGUAGE sql AS $$
  SELECT set_config('request.jwt.claim.sub', COALESCE(p_auth::text, ''), false);
$$;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA tests TO anon, authenticated, service_role;

-- --------------------------------------------
-- Fixtures (como dono do banco)
-- --------------------------------------------
INSERT INTO auth.users (id, email) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'admin@britos.edu.br'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'professor@britos.edu.br'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'aluno@britos.edu.br'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'mariana@britos.edu.br'),
  ('aaaaaaaa-0000-0000-0000-000000000005', 'prof.b@britos.edu.br'),
  ('aaaaaaaa-0000-0000-0000-000000000006', 'novo.aluno@britos.edu.br'),
  ('aaaaaaaa-0000-0000-0000-000000000099', 'intruso@example.com');

-- Professor B leciona Farmacologia numa segunda turma
INSERT INTO public.usuarios (id, nome, email, cpf, role) VALUES
  ('b0000000-0000-0000-0000-000000000005', 'Professor B', 'prof.b@britos.edu.br', '55566677788', 'professor');
INSERT INTO public.turmas (id, curso_id, nome, codigo) VALUES
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Turma ENF-2025.2', 'ENF-2025.2');
INSERT INTO public.professor_disciplinas (professor_id, disciplina_id, turma_id) VALUES
  ('b0000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002');
INSERT INTO public.materiais (id, professor_id, disciplina_id, titulo, ativo) VALUES
  ('60000000-0000-0000-0000-0000000000b1', 'b0000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', 'Material do Prof B', true);

-- --------------------------------------------
-- 1. service_role vincula auth_id (gatilho não bloqueia backend confiável)
-- --------------------------------------------
SET ROLE service_role;
SELECT tests.affects($$
  UPDATE public.usuarios u SET auth_id = a.id
  FROM auth.users a
  WHERE lower(a.email) = lower(u.email) AND u.auth_id IS DISTINCT FROM a.id
$$, 5, 'service_role vincula auth_id dos 5 perfis existentes');
RESET ROLE;

-- --------------------------------------------
-- 2. JORNADA — Gestor cadastra aluno e matricula na turma 1
-- --------------------------------------------
SELECT tests.login('aaaaaaaa-0000-0000-0000-000000000001');
SET ROLE authenticated;
SELECT tests.ok(public.is_gestor(), 'gestor autenticado é reconhecido como gestor');
SELECT tests.affects($$
  INSERT INTO public.usuarios (id, nome, email, cpf, role)
  VALUES ('c0000000-0000-0000-0000-000000000006', 'Novo Aluno', 'novo.aluno@britos.edu.br', '33344455566', 'aluno')
$$, 1, 'gestor cadastra novo aluno');
SELECT tests.affects($$
  INSERT INTO public.matriculas (aluno_id, turma_id, curso_id)
  VALUES ('c0000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001')
$$, 1, 'gestor matricula o novo aluno na turma 1');
SELECT tests.eq((SELECT count(*) FROM public.usuarios), 6, 'gestor enxerga todos os usuários');
RESET ROLE;

-- Backend vincula a conta de login do novo aluno
SET ROLE service_role;
SELECT tests.affects($$
  UPDATE public.usuarios SET auth_id = 'aaaaaaaa-0000-0000-0000-000000000006'
  WHERE id = 'c0000000-0000-0000-0000-000000000006'
$$, 1, 'service_role vincula auth_id do novo aluno');
RESET ROLE;

-- --------------------------------------------
-- 3. JORNADA — Professor A lança nota e frequência
-- --------------------------------------------
SELECT tests.login('aaaaaaaa-0000-0000-0000-000000000002');
SET ROLE authenticated;
SELECT tests.affects($$
  INSERT INTO public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao, nota)
  VALUES ('c0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'prova1', 8.5)
$$, 1, 'professor lança nota na disciplina/turma que leciona');
SELECT tests.affects($$
  INSERT INTO public.frequencias (aluno_id, disciplina_id, turma_id, data, presente)
  VALUES ('c0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '2025-03-10', true)
$$, 1, 'professor registra frequência na disciplina/turma que leciona');
SELECT tests.eq((SELECT count(*) FROM public.matriculas), 3, 'professor vê só as matrículas da turma que leciona');
SELECT tests.eq((SELECT count(*) FROM public.usuarios WHERE role = 'aluno'), 3, 'professor vê só os alunos das suas turmas');
SELECT tests.eq((SELECT count(*) FROM public.usuarios WHERE role = 'professor'), 1, 'professor não vê outros professores');
SELECT tests.eq((SELECT count(*) FROM public.alunos), 3, 'view alunos respeita a RLS do professor');

-- Relançamento (upsert usado pela interface) substitui a nota da mesma avaliação
SELECT tests.affects($$
  INSERT INTO public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao, nota, professor_id)
  VALUES ('c0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'prova1', 8.5, 'b0000000-0000-0000-0000-000000000002')
  ON CONFLICT (aluno_id, disciplina_id, turma_id, tipo_avaliacao)
  DO UPDATE SET nota = EXCLUDED.nota, professor_id = EXCLUDED.professor_id
$$, 1, 'professor relança a nota da mesma avaliação (upsert)');

-- NEGATIVAS do professor
SELECT tests.denied($$
  INSERT INTO public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao, nota, professor_id)
  VALUES ('c0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'trabalho', 9, 'b0000000-0000-0000-0000-000000000005')
$$, 'NEGADO: professor registra nota em nome de outro professor');
SELECT tests.denied($$
  INSERT INTO public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao, nota)
  VALUES ('c0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'prova1', 10)
$$, 'NEGADO: professor lança nota em disciplina que não leciona');
SELECT tests.denied($$
  INSERT INTO public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao, nota)
  VALUES ('c0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'prova1', 10)
$$, 'NEGADO: professor lança nota em turma alheia');
SELECT tests.affects($$
  DELETE FROM public.materiais WHERE id = '60000000-0000-0000-0000-0000000000b1'
$$, 0, 'NEGADO: professor apaga material de outro professor');
SELECT tests.affects($$
  UPDATE public.materiais SET titulo = 'invadido' WHERE id = '60000000-0000-0000-0000-0000000000b1'
$$, 0, 'NEGADO: professor edita material de outro professor');
SELECT tests.eq((SELECT count(*) FROM public.pagamentos), 0, 'NEGADO: professor não lê pagamentos');
SELECT tests.affects($$
  UPDATE public.turmas SET nome = 'invadida' WHERE id = '30000000-0000-0000-0000-000000000002'
$$, 0, 'NEGADO: professor edita turma alheia');
RESET ROLE;

-- Professor B: dono da turma 2, mas o novo aluno não está matriculado nela
SELECT tests.login('aaaaaaaa-0000-0000-0000-000000000005');
SET ROLE authenticated;
SELECT tests.denied($$
  INSERT INTO public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao, nota)
  VALUES ('c0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'prova1', 10)
$$, 'NEGADO: professor lança nota para aluno não matriculado na turma');
SELECT tests.eq((SELECT count(*) FROM public.notas), 0, 'NEGADO: professor B não lê notas da turma 1');
RESET ROLE;

-- --------------------------------------------
-- 4. JORNADA — Novo aluno consulta os próprios dados
-- --------------------------------------------
SELECT tests.login('aaaaaaaa-0000-0000-0000-000000000006');
SET ROLE authenticated;
SELECT tests.eq((SELECT count(*) FROM public.notas), 1, 'aluno vê a nota lançada pelo professor');
SELECT tests.ok((SELECT nota FROM public.notas) = 8.5, 'valor da nota visto pelo aluno é o lançado');
SELECT tests.eq((SELECT count(*) FROM public.frequencias), 1, 'aluno vê a frequência registrada');
SELECT tests.eq((SELECT count(*) FROM public.turmas), 1, 'aluno vê só a própria turma');
RESET ROLE;

-- --------------------------------------------
-- 5. NEGATIVAS do aluno (aluno 1 da seed)
-- --------------------------------------------
SELECT tests.login('aaaaaaaa-0000-0000-0000-000000000003');
SET ROLE authenticated;
SELECT tests.eq((SELECT count(*) FROM public.notas WHERE aluno_id <> 'c0000000-0000-0000-0000-000000000003'), 0,
  'NEGADO: aluno lê notas de outros alunos');
SELECT tests.eq((SELECT count(*) FROM public.notas), 1, 'aluno lê a própria nota da seed');
SELECT tests.eq((SELECT count(*) FROM public.alunos), 1, 'NEGADO: view alunos não expõe outros alunos');
SELECT tests.eq((SELECT count(*) FROM public.pagamentos WHERE aluno_id <> 'c0000000-0000-0000-0000-000000000003'), 0,
  'NEGADO: aluno lê pagamentos de outros alunos');
SELECT tests.denied($$
  INSERT INTO public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao, nota)
  VALUES ('c0000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'prova9', 10)
$$, 'NEGADO: aluno lança a própria nota');
SELECT tests.affects($$
  UPDATE public.notas SET nota = 10
$$, 0, 'NEGADO: aluno altera notas');
SELECT tests.denied($$
  UPDATE public.usuarios SET role = 'gestor' WHERE auth_id = auth.uid()
$$, 'NEGADO: aluno promove a si mesmo a gestor');
SELECT tests.denied($$
  UPDATE public.usuarios SET auth_id = 'aaaaaaaa-0000-0000-0000-000000000099' WHERE auth_id = auth.uid()
$$, 'NEGADO: aluno troca o próprio auth_id');
SELECT tests.affects($$
  UPDATE public.usuarios SET telefone = '(98) 90000-0000' WHERE auth_id = auth.uid()
$$, 1, 'aluno atualiza dado não sensível do próprio perfil');
SELECT tests.affects($$
  UPDATE public.usuarios SET nome = 'invadido' WHERE id = 'c0000000-0000-0000-0000-000000000004'
$$, 0, 'NEGADO: aluno edita perfil de outro aluno');
RESET ROLE;

-- --------------------------------------------
-- 6. Usuário autenticado sem perfil e anônimo
-- --------------------------------------------
SELECT tests.login('aaaaaaaa-0000-0000-0000-000000000099');
SET ROLE authenticated;
SELECT tests.eq((SELECT count(*) FROM public.usuarios), 0, 'NEGADO: autenticado sem perfil não lê usuários');
SELECT tests.denied($$
  INSERT INTO public.usuarios (nome, email, cpf, role, auth_id)
  VALUES ('Intruso', 'intruso@example.com', '99988877766', 'gestor', 'aaaaaaaa-0000-0000-0000-000000000099')
$$, 'NEGADO: autenticado sem perfil cria a si mesmo como gestor');
RESET ROLE;

SELECT tests.login(NULL);
SET ROLE anon;
SELECT tests.eq((SELECT count(*) FROM public.usuarios), 0, 'NEGADO: anônimo lê usuários');
SELECT tests.eq((SELECT count(*) FROM public.notas), 0, 'NEGADO: anônimo lê notas');
SELECT tests.eq((SELECT count(*) FROM public.alunos), 0, 'NEGADO: anônimo lê a view alunos');
RESET ROLE;

-- --------------------------------------------
-- 7. Gestor enxerga o resultado da jornada
-- --------------------------------------------
SELECT tests.login('aaaaaaaa-0000-0000-0000-000000000001');
SET ROLE authenticated;
SELECT tests.eq((SELECT count(*) FROM public.notas WHERE aluno_id = 'c0000000-0000-0000-0000-000000000006'), 1,
  'gestor vê a nota lançada para o novo aluno');
RESET ROLE;
