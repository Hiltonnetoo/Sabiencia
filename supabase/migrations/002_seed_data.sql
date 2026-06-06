-- ============================================
-- SEED DATA - Dados de teste para desenvolvimento
-- ============================================

-- OBSERVAÇÃO: Os usuários devem ser criados via API de autenticação do Supabase
-- Este arquivo contém apenas dados de exemplo para as tabelas de negócio

-- Inserir gestor exemplo (será criado manualmente via interface)
INSERT INTO public.gestores (id, nome, email, cpf, telefone, cargo, departamento, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Administrador Teste',
  'admin@britos.edu.br',
  '123.456.789-09',
  '(11) 98765-4321',
  'Diretor Educacional',
  'Administração',
  true,
  NOW(),
  NOW()
);

-- Inserir professor exemplo
INSERT INTO public.professores (id, nome, email, cpf, telefone, especialidade, titulacao, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'Professor Teste',
  'professor@britos.edu.br',
  '987.654.321-00',
  '(11) 91234-5678',
  'Matemática',
  'Licenciatura',
  true,
  NOW(),
  NOW()
);

-- Inserir turma exemplo
INSERT INTO public.turmas (id, nome, serie, turno, ano_letivo, professor_id, sala, capacidade_maxima, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'Turma A - 1º Ano',
  '1º Ano',
  'Manhã',
  2024,
  '550e8400-e29b-41d4-a716-446655440002',
  'Sala 101',
  30,
  true,
  NOW(),
  NOW()
);

-- Inserir aluno exemplo
INSERT INTO public.alunos (id, nome, email, cpf, telefone, matricula, data_nascimento, nome_responsavel, telefone_responsavel, serie, turma_id, observacoes, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  'Aluno Teste',
  'aluno@britos.edu.br',
  '111.222.333-44',
  '(11) 99887-7665',
  'MAT2024001',
  '2010-01-15',
  'Pai do Aluno',
  '(11) 99887-7665',
  '1º Ano',
  '550e8400-e29b-41d4-a716-446655440003',
  'Aluno exemplar',
  true,
  NOW(),
  NOW()
);

-- Inserir disciplina exemplo
INSERT INTO public.disciplinas (id, nome, descricao, carga_horaria, professor_id, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440005',
  'Matemática Básica',
  'Disciplina de matemática do 1º ano',
  80,
  '550e8400-e29b-41d4-a716-446655440002',
  true,
  NOW(),
  NOW()
);

-- Inserir aula exemplo
INSERT INTO public.aulas (id, turma_id, disciplina_id, professor_id, data, hora_inicio, hora_fim, conteudo, observacoes, status, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440002',
  CURRENT_DATE + INTERVAL '1 day',
  '08:00:00',
  '09:30:00',
  'Introdução às operações matemáticas',
  'Aula inaugural',
  'confirmada',
  true,
  NOW(),
  NOW()
);

-- Inserir atividade exemplo
INSERT INTO public.atividades (id, titulo, descricao, turma_id, disciplina_id, professor_id, tipo, prazo_entrega, instrucoes, anexos, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440007',
  'Exercícios de Adição e Subtração',
  'Resolver lista de exercícios sobre operações básicas',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440002',
  'exercicio',
  CURRENT_DATE + INTERVAL '7 days',
  'Entregar resolução no caderno',
  '[]',
  true,
  NOW(),
  NOW()
);

-- Inserir comunicado exemplo
INSERT INTO public.comunicados (id, titulo, conteudo, autor_id, autor_tipo, turma_id, destinatario, prioridade, data_criacao, data_expiracao, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440008',
  'Boas Vindas - Ano Letivo 2024',
  'Sejam bem-vindos ao novo ano letivo! Desejamos a todos excelente desempenho acadêmico.',
  '550e8400-e29b-41d4-a716-446655440001',
  'gestor',
  '550e8400-e29b-41d4-a716-446655440003',
  'todos',
  'alta',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  true,
  NOW(),
  NOW()
);

-- Inserir evento exemplo
INSERT INTO public.eventos (id, titulo, descricao, data_evento, hora_inicio, hora_fim, local, tipo, turma_id, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440009',
  'Reunião de Pais',
  'Reunião para apresentação do calendário escolar',
  CURRENT_DATE + INTERVAL '15 days',
  '19:00:00',
  '20:30:00',
  'Auditório',
  'reuniao',
  '550e8400-e29b-41d4-a716-446655440003',
  true,
  NOW(),
  NOW()
);

-- Inserir material didático exemplo
INSERT INTO public.materiais_didaticos (id, titulo, descricao, tipo, arquivo_url, professor_id, disciplina_id, turma_id, visibilidade, ativo, criado_em, atualizado_em)
VALUES (
  '550e8400-e29b-41d4-a716-446655440010',
  'Apostila Matemática 1º Ano',
  'Material completo para o 1º ano',
  'apostila',
  'https://example.com/material.pdf',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440003',
  'turma',
  true,
  NOW(),
  NOW()
);