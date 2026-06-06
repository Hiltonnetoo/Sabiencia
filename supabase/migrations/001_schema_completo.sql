-- ============================================
-- SCHEMA COMPLETO - BRITOS EDUCAÇÃO
-- ============================================

-- 1. ENUMS (Tipos customizados)
CREATE TYPE user_role AS ENUM ('gestor', 'professor', 'aluno');
CREATE TYPE status_geral AS ENUM ('ativo', 'inativo', 'trancado', 'concluido');
CREATE TYPE status_pagamento AS ENUM ('pendente', 'pago', 'atrasado', 'cancelado');
CREATE TYPE tipo_material AS ENUM ('pdf', 'video', 'link', 'imagem');
CREATE TYPE prioridade AS ENUM ('baixa', 'normal', 'alta', 'urgente');

-- ============================================
-- 2. TABELAS PRINCIPAIS
-- ============================================

-- 2.1 Usuários (estende auth.users do Supabase)
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  role user_role NOT NULL,
  avatar_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.2 Cursos
CREATE TABLE public.cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  carga_horaria INTEGER,
  duracao_meses INTEGER,
  valor_mensalidade DECIMAL(10,2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.3 Disciplinas
CREATE TABLE public.disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE,
  carga_horaria INTEGER,
  ordem INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.4 Turmas
CREATE TABLE public.turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE,
  periodo VARCHAR(10), -- 2025.1, 2025.2
  turno VARCHAR(20), -- manha, tarde, noite
  data_inicio DATE,
  data_fim DATE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.5 Matrículas (Alunos)
CREATE TABLE public.matriculas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
  status status_geral DEFAULT 'ativo',
  data_matricula DATE DEFAULT CURRENT_DATE,
  data_conclusao DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, turma_id)
);

-- 2.6 Professores x Disciplinas
CREATE TABLE public.professor_disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  disciplina_id UUID REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(professor_id, disciplina_id, turma_id)
);

-- 2.7 Frequência
CREATE TABLE public.frequencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  disciplina_id UUID REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  presente BOOLEAN DEFAULT false,
  justificado BOOLEAN DEFAULT false,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.8 Notas
CREATE TABLE public.notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  disciplina_id UUID REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  tipo_avaliacao VARCHAR(50), -- prova1, prova2, trabalho
  nota DECIMAL(4,2),
  peso DECIMAL(3,2) DEFAULT 1.0,
  data_avaliacao DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.9 Materiais (Biblioteca)
CREATE TABLE public.materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  disciplina_id UUID REFERENCES public.disciplinas(id),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo tipo_material,
  url TEXT,
  arquivo_url TEXT,
  tags TEXT[],
  visualizacoes INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.10 Tópicos de Videoaulas
CREATE TABLE public.topicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disciplina_id UUID REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.11 Videoaulas
CREATE TABLE public.videoaulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topico_id UUID REFERENCES public.topicos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  youtube_url TEXT NOT NULL,
  duracao INTEGER, -- em segundos
  ordem INTEGER DEFAULT 0,
  professor_id UUID REFERENCES public.usuarios(id),
  materiais_url TEXT[], -- links para PDFs, slides
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.12 Progresso de Videoaulas
CREATE TABLE public.progresso_videoaulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  videoaula_id UUID REFERENCES public.videoaulas(id) ON DELETE CASCADE,
  tempo_assistido INTEGER DEFAULT 0, -- em segundos
  completo BOOLEAN DEFAULT false,
  ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, videoaula_id)
);

-- 2.13 Aulas ao Vivo
CREATE TABLE public.lives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  disciplina_id UUID REFERENCES public.disciplinas(id),
  turma_id UUID REFERENCES public.turmas(id),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  url_stream TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'agendada', -- agendada, ao_vivo, finalizada
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.14 Chat de Lives
CREATE TABLE public.chat_lives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_id UUID REFERENCES public.lives(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.15 Pagamentos
CREATE TABLE public.pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  matricula_id UUID REFERENCES public.matriculas(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  status status_pagamento DEFAULT 'pendente',
  forma_pagamento VARCHAR(50), -- boleto, pix, cartao
  data_vencimento DATE,
  data_pagamento DATE,
  numero_parcela INTEGER,
  total_parcelas INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.16 Comunicados
CREATE TABLE public.comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  prioridade prioridade DEFAULT 'normal',
  destinatarios TEXT[], -- 'todos', 'alunos', 'professores', 'turma_id'
  fixado BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.17 Observações
CREATE TABLE public.observacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50), -- comportamental, academica, saude
  prioridade prioridade DEFAULT 'normal',
  texto TEXT NOT NULL,
  visivel_para VARCHAR(20) DEFAULT 'equipe', -- equipe, todos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.18 Notificações
CREATE TABLE public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50),
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT,
  lida BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_usuarios_cpf ON public.usuarios(cpf);
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_role ON public.usuarios(role);
CREATE INDEX idx_matriculas_aluno ON public.matriculas(aluno_id);
CREATE INDEX idx_matriculas_turma ON public.matriculas(turma_id);
CREATE INDEX idx_frequencias_aluno ON public.frequencias(aluno_id);
CREATE INDEX idx_notas_aluno ON public.notas(aluno_id);
CREATE INDEX idx_pagamentos_aluno ON public.pagamentos(aluno_id);
CREATE INDEX idx_progresso_aluno ON public.progresso_videoaulas(aluno_id);
CREATE INDEX idx_notificacoes_usuario ON public.notificacoes(usuario_id);

-- ============================================
-- 4. FUNCTIONS E TRIGGERS
-- ============================================

-- 4.1 Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4.2 Calcular média do aluno (Function)
CREATE OR REPLACE FUNCTION calcular_media_aluno(
  p_aluno_id UUID,
  p_disciplina_id UUID
)
RETURNS DECIMAL(4,2) AS $$
DECLARE
  v_media DECIMAL(4,2);
BEGIN
  SELECT 
    ROUND(
      SUM(nota * peso) / NULLIF(SUM(peso), 0),
      2
    ) INTO v_media
  FROM public.notas
  WHERE aluno_id = p_aluno_id
    AND disciplina_id = p_disciplina_id;
  
  RETURN COALESCE(v_media, 0);
END;
$$ LANGUAGE plpgsql;

-- 4.3 Calcular frequência do aluno (Function)
CREATE OR REPLACE FUNCTION calcular_frequencia_aluno(
  p_aluno_id UUID,
  p_disciplina_id UUID
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_frequencia DECIMAL(5,2);
BEGIN
  SELECT 
    ROUND(
      (COUNT(*) FILTER (WHERE presente = true OR justificado = true)::DECIMAL / 
       NULLIF(COUNT(*), 0) * 100),
      2
    ) INTO v_frequencia
  FROM public.frequencias
  WHERE aluno_id = p_aluno_id
    AND disciplina_id = p_disciplina_id;
  
  RETURN COALESCE(v_frequencia, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
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

-- Políticas para GESTORES (acesso total)
CREATE POLICY "Gestores têm acesso total"
  ON public.usuarios
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.auth_id = auth.uid()
      AND u.role = 'gestor'
    )
  );

-- Políticas para PROFESSORES
CREATE POLICY "Professores veem seus alunos"
  ON public.matriculas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.auth_id = auth.uid()
      AND u.role = 'professor'
      AND EXISTS (
        SELECT 1 FROM public.professor_disciplinas pd
        WHERE pd.professor_id = u.id
        AND pd.turma_id = matriculas.turma_id
      )
    )
  );

-- Políticas para ALUNOS (veem apenas seus dados)
CREATE POLICY "Alunos veem apenas seus dados"
  ON public.notas
  FOR SELECT
  USING (
    aluno_id IN (
      SELECT id FROM public.usuarios
      WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Alunos veem apenas suas frequências"
  ON public.frequencias
  FOR SELECT
  USING (
    aluno_id IN (
      SELECT id FROM public.usuarios
      WHERE auth_id = auth.uid()
    )
  );

-- ============================================
-- 6. DADOS INICIAIS (SEED)
-- ============================================

-- Inserir curso exemplo
INSERT INTO public.cursos (nome, descricao, carga_horaria, duracao_meses, valor_mensalidade)
VALUES 
  ('Técnico em Enfermagem', 'Curso técnico completo de enfermagem EAD', 1200, 18, 299.90),
  ('Técnico em Administração', 'Gestão empresarial e administrativa', 800, 12, 249.90),
  ('Técnico em Informática', 'Desenvolvimento e suporte em TI', 1000, 15, 279.90);