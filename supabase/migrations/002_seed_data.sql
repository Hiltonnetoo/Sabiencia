-- ============================================
-- SEED DATA - Dados canônicos para ambiente de desenvolvimento e testes
-- Alinhado com as 18 tabelas relacionais do schema canônico
-- ============================================

-- 1. Usuários do Sistema (Gestor, Professor, Alunos)
INSERT INTO public.usuarios (id, nome, email, cpf, telefone, role, avatar_url, ativo)
VALUES 
  (
    'a0000000-0000-0000-0000-000000000001',
    'Administrador Geral',
    'admin@britos.edu.br',
    '12345678909',
    '(11) 98765-4321',
    'gestor',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'Prof. Carlos Eduardo',
    'professor@britos.edu.br',
    '98765432100',
    '(11) 91234-5678',
    'professor',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'Lucas Silva',
    'aluno@britos.edu.br',
    '11122233344',
    '(11) 99887-7665',
    'aluno',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    true
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'Mariana Santos',
    'mariana@britos.edu.br',
    '22233344455',
    '(11) 97766-5544',
    'aluno',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  email = EXCLUDED.email,
  cpf = EXCLUDED.cpf,
  role = EXCLUDED.role;

-- 2. Cursos
INSERT INTO public.cursos (id, nome, descricao, carga_horaria, duracao_meses, valor_mensalidade, ativo)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Técnico em Enfermagem',
    'Formação técnica em enfermagem com foco hospitalar e clínico.',
    1200,
    18,
    299.90,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Técnico em Informática',
    'Desenvolvimento de software, redes e bancos de dados.',
    1000,
    15,
    279.90,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Disciplinas
INSERT INTO public.disciplinas (id, curso_id, nome, codigo, carga_horaria, ordem)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Anatomia e Fisiologia Humana',
    'ENF-101',
    80,
    1
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Farmacologia Básica',
    'ENF-102',
    60,
    2
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Turmas
INSERT INTO public.turmas (id, curso_id, nome, codigo, periodo, turno, data_inicio, data_fim, ativo)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Turma ENF-2025.1',
    'ENF-2025-1M',
    '2025.1',
    'manha',
    '2025-02-01',
    '2026-07-31',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Matrículas
INSERT INTO public.matriculas (id, aluno_id, turma_id, curso_id, status, data_matricula)
VALUES
  (
    '40000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'ativo',
    '2025-01-15'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'ativo',
    '2025-01-16'
  )
ON CONFLICT (aluno_id, turma_id) DO NOTHING;

-- 6. Professor x Disciplinas
INSERT INTO public.professor_disciplinas (id, professor_id, disciplina_id, turma_id)
VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001'
  )
ON CONFLICT (professor_id, disciplina_id, turma_id) DO NOTHING;

-- 7. Frequências
INSERT INTO public.frequencias (aluno_id, disciplina_id, turma_id, data, presente, justificado, observacao)
VALUES
  (
    'c0000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    CURRENT_DATE,
    true,
    false,
    'Presença confirmada'
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    CURRENT_DATE,
    true,
    false,
    'Presença confirmada'
  )
ON CONFLICT (aluno_id, disciplina_id, turma_id, data) DO NOTHING;

-- 8. Notas
INSERT INTO public.notas (aluno_id, disciplina_id, turma_id, tipo_avaliacao, nota, peso, data_avaliacao)
VALUES
  (
    'c0000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Prova 1 - Sistema Esquelético',
    9.0,
    1.0,
    CURRENT_DATE - INTERVAL '10 days'
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Prova 1 - Sistema Esquelético',
    8.0,
    1.0,
    CURRENT_DATE - INTERVAL '10 days'
  );

-- 9. Materiais
INSERT INTO public.materiais (id, professor_id, disciplina_id, titulo, descricao, tipo, url, tags, ativo)
VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    'Atlas de Anatomia Humana (Resumo Ilustrado)',
    'Material complementar com esquemas e terminologia clínica.',
    'pdf',
    'https://example.com/materiais/atlas-anatomia.pdf',
    ARRAY['anatomia', 'guia', 'pdf'],
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 10. Tópicos de Videoaulas
INSERT INTO public.topicos (id, disciplina_id, titulo, descricao, ordem, ativo)
VALUES
  (
    '70000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Módulo 1: Introdução à Anatomia',
    'Conceitos fundamentais de planos anatômicos e tecidos.',
    1,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 11. Videoaulas
INSERT INTO public.videoaulas (id, topico_id, titulo, descricao, youtube_url, duracao, ordem, professor_id, ativo)
VALUES
  (
    '80000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000001',
    'Aula 1: Planos e Eixos Anatômicos',
    'Visão geral das posições anatômicas padronizadas.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    1800,
    1,
    'b0000000-0000-0000-0000-000000000002',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 12. Progresso de Videoaulas
INSERT INTO public.progresso_videoaulas (aluno_id, videoaula_id, tempo_assistido, completo)
VALUES
  (
    'c0000000-0000-0000-0000-000000000003',
    '80000000-0000-0000-0000-000000000001',
    1800,
    true
  )
ON CONFLICT (aluno_id, videoaula_id) DO NOTHING;

-- 13. Aulas ao Vivo (Lives)
INSERT INTO public.lives (id, professor_id, disciplina_id, turma_id, titulo, descricao, status, data_inicio)
VALUES
  (
    '90000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Plantão Semanal de Anatomia',
    'Tire suas dúvidas antes da prova prática.',
    'agendada',
    NOW() + INTERVAL '2 days'
  )
ON CONFLICT (id) DO NOTHING;

-- 14. Chat de Lives
INSERT INTO public.chat_lives (live_id, usuario_id, mensagem)
VALUES
  (
    '90000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'Olá professor, teremos foco no sistema cardiovascular?'
  );

-- 15. Pagamentos
INSERT INTO public.pagamentos (id, aluno_id, matricula_id, valor, status, forma_pagamento, data_vencimento, data_pagamento, numero_parcela, total_parcelas)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000001',
    299.90,
    'pago',
    'pix',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE - INTERVAL '6 days',
    1,
    18
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000002',
    299.90,
    'pago',
    'boleto',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE - INTERVAL '5 days',
    1,
    18
  )
ON CONFLICT (id) DO NOTHING;

-- 16. Comunicados
INSERT INTO public.comunicados (id, autor_id, titulo, conteudo, prioridade, destinatarios, fixado, ativo)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Boas-vindas ao Semestre Letivo 2025.1',
    'Prezados alunos e docentes, desejamos um excelente início de semestre!',
    'alta',
    ARRAY['todos'],
    true,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 17. Observações
INSERT INTO public.observacoes (id, aluno_id, autor_id, tipo, prioridade, texto, visivel_para)
VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000002',
    'academica',
    'normal',
    'Aluno muito participativo nas discussões e práticas laboratoriais.',
    'equipe'
  )
ON CONFLICT (id) DO NOTHING;

-- 18. Notificações
INSERT INTO public.notificacoes (id, usuario_id, tipo, titulo, mensagem, lida, link)
VALUES
  (
    'd1000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'academico',
    'Nova nota cadastrada',
    'Sua nota da Prova 1 de Anatomia foi lançada: 9.0',
    false,
    '/aluno/notas'
  )
ON CONFLICT (id) DO NOTHING;
