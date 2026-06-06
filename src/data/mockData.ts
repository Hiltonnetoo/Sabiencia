// ============================================
// MOCK DATA - SISTEMA SABIENCIA
// Dados completos para apresentação ao cliente
// ============================================

import type {
  Aluno,
  Professor,
  Gestor,
  Curso,
  Disciplina,
  Turma,
  ProfessorTurmaDisciplina,
  Matricula,
  Frequencia,
  Nota,
  Material,
  Observacao,
  Pagamento,
  Comunicado,
  ComunicadoLeitura,
  LogAuditoria,
  StatusFrequencia,
  TipoObservacao,
  StatusPagamento
} from '../types';
import { generateDocThumbnail, getYouTubeThumbnail } from '../utils/mediaThumbnails';

// ============================================
// CURSOS (3)
// ============================================

export const cursos: Curso[] = [
  {
    id: 'curso-001',
    nome: 'Técnico em Enfermagem',
    descricao: 'Formação técnica completa em enfermagem com aulas 100% remotas e provas presenciais',
    carga_horaria: 1200,
    duracao_meses: 18,
    ativo: true,
    created_at: new Date('2024-01-10')
  },
  {
    id: 'curso-002',
    nome: 'Técnico em Administração',
    descricao: 'Curso técnico em administração com foco em gestão empresarial',
    carga_horaria: 800,
    duracao_meses: 12,
    ativo: true,
    created_at: new Date('2024-01-10')
  },
  {
    id: 'curso-003',
    nome: 'Técnico em Informática',
    descricao: 'Formação em informática com programação, redes e manutenção',
    carga_horaria: 1000,
    duracao_meses: 15,
    ativo: true,
    created_at: new Date('2024-01-10')
  }
];

// ============================================
// DISCIPLINAS (5 por curso = 15 total)
// ============================================

export const disciplinas: Disciplina[] = [
  // Enfermagem
  {
    id: 'disc-001',
    curso_id: 'curso-001',
    nome: 'Anatomia Humana',
    descricao: 'Estudo detalhado da estrutura do corpo humano',
    carga_horaria: 120,
    ordem: 1,
    ementa: 'Introdução à anatomia, sistemas do corpo humano, nomenclatura anatômica',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-002',
    curso_id: 'curso-001',
    nome: 'Fisiologia',
    descricao: 'Funcionamento dos sistemas do corpo humano',
    carga_horaria: 100,
    ordem: 2,
    ementa: 'Fisiologia celular, sistemas cardiovascular, respiratório, digestório',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-003',
    curso_id: 'curso-001',
    nome: 'Procedimentos de Enfermagem',
    descricao: 'Técnicas e procedimentos práticos de enfermagem',
    carga_horaria: 150,
    ordem: 3,
    ementa: 'Técnicas básicas, administração de medicamentos, curativos',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-004',
    curso_id: 'curso-001',
    nome: 'Ética e Legislação em Enfermagem',
    descricao: 'Aspectos éticos e legais da profissão',
    carga_horaria: 60,
    ordem: 4,
    ementa: 'Código de ética, legislação profissional, direitos do paciente',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-005',
    curso_id: 'curso-001',
    nome: 'Farmacologia',
    descricao: 'Estudo dos medicamentos e suas aplicações',
    carga_horaria: 80,
    ordem: 5,
    ementa: 'Classes de medicamentos, vias de administração, efeitos adversos',
    created_at: new Date('2024-01-15')
  },

  // Administração
  {
    id: 'disc-006',
    curso_id: 'curso-002',
    nome: 'Gestão Empresarial',
    descricao: 'Fundamentos da administração de empresas',
    carga_horaria: 80,
    ordem: 1,
    ementa: 'Planejamento, organização, direção e controle empresarial',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-007',
    curso_id: 'curso-002',
    nome: 'Contabilidade Básica',
    descricao: 'Princípios contábeis e demonstrações financeiras',
    carga_horaria: 100,
    ordem: 2,
    ementa: 'Balanço patrimonial, DRE, fluxo de caixa',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-008',
    curso_id: 'curso-002',
    nome: 'Recursos Humanos',
    descricao: 'Gestão de pessoas e relações trabalhistas',
    carga_horaria: 60,
    ordem: 3,
    ementa: 'Recrutamento, seleção, treinamento, legislação trabalhista',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-009',
    curso_id: 'curso-002',
    nome: 'Marketing',
    descricao: 'Estratégias de marketing e vendas',
    carga_horaria: 70,
    ordem: 4,
    ementa: 'Mix de marketing, pesquisa de mercado, marketing digital',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-010',
    curso_id: 'curso-002',
    nome: 'Matemática Financeira',
    descricao: 'Cálculos financeiros e análise de investimentos',
    carga_horaria: 50,
    ordem: 5,
    ementa: 'Juros simples e compostos, descontos, amortização',
    created_at: new Date('2024-01-15')
  },

  // Informática
  {
    id: 'disc-011',
    curso_id: 'curso-003',
    nome: 'Lógica de Programação',
    descricao: 'Fundamentos de programação de computadores',
    carga_horaria: 100,
    ordem: 1,
    ementa: 'Algoritmos, estruturas de dados, fluxogramas',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-012',
    curso_id: 'curso-003',
    nome: 'Programação Web',
    descricao: 'Desenvolvimento de sites e aplicações web',
    carga_horaria: 120,
    ordem: 2,
    ementa: 'HTML, CSS, JavaScript, frameworks modernos',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-013',
    curso_id: 'curso-003',
    nome: 'Banco de Dados',
    descricao: 'Modelagem e administração de bancos de dados',
    carga_horaria: 80,
    ordem: 3,
    ementa: 'SQL, modelagem relacional, normalização',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-014',
    curso_id: 'curso-003',
    nome: 'Redes de Computadores',
    descricao: 'Configuração e administração de redes',
    carga_horaria: 90,
    ordem: 4,
    ementa: 'Protocolos TCP/IP, configuração de roteadores, segurança',
    created_at: new Date('2024-01-15')
  },
  {
    id: 'disc-015',
    curso_id: 'curso-003',
    nome: 'Manutenção de Computadores',
    descricao: 'Hardware e troubleshooting',
    carga_horaria: 70,
    ordem: 5,
    ementa: 'Montagem de PCs, diagnóstico de problemas, manutenção preventiva',
    created_at: new Date('2024-01-15')
  }
];

// ============================================
// TURMAS (4)
// ============================================

export const turmas: Turma[] = [
  {
    id: 'turma-001',
    curso_id: 'curso-001',
    nome: 'Enfermagem 2025.1 - Manhã',
    data_inicio: new Date('2025-02-01'),
    data_fim: new Date('2026-07-31'),
    periodo: 'manha',
    ativa: true,
    created_at: new Date('2025-01-15')
  },
  {
    id: 'turma-002',
    curso_id: 'curso-001',
    nome: 'Enfermagem 2025.1 - Noite',
    data_inicio: new Date('2025-02-01'),
    data_fim: new Date('2026-07-31'),
    periodo: 'noite',
    ativa: true,
    created_at: new Date('2025-01-15')
  },
  {
    id: 'turma-003',
    curso_id: 'curso-002',
    nome: 'Administração 2025.1',
    data_inicio: new Date('2025-02-15'),
    data_fim: new Date('2026-02-15'),
    periodo: 'noite',
    ativa: true,
    created_at: new Date('2025-02-01')
  },
  {
    id: 'turma-004',
    curso_id: 'curso-003',
    nome: 'Informática 2025.1',
    data_inicio: new Date('2025-03-01'),
    data_fim: new Date('2026-06-15'),
    periodo: 'tarde',
    ativa: true,
    created_at: new Date('2025-02-15')
  }
];

// ============================================
// GESTORES (1)
// ============================================

export const gestores: Gestor[] = [
  {
    id: 'gestor-001',
    cpf: '000.000.000-01',
    email: 'diretoria@sabiencia.com.br',
    role: 'gestor',
    nome_completo: 'Maria Clara Santos',
    telefone: '(99) 98510-4312',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaClara',
    ativo: true,
    cargo: 'Diretora Geral',
    created_at: new Date('2023-01-10')
  }
];

// ============================================
// PROFESSORES (5)
// ============================================

export const professores: Professor[] = [
  {
    id: 'prof-001',
    cpf: '111.111.111-11',
    email: 'carlos.souza@sabiencia.com.br',
    role: 'professor',
    nome_completo: 'Carlos Roberto Souza',
    telefone: '(99) 98765-4321',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosRoberto',
    ativo: true,
    especialidades: ['Enfermagem', 'Anatomia'],
    formacao: 'Enfermeiro, Mestre em Ciências da Saúde',
    registro_profissional: 'COREN-MA 123456',
    created_at: new Date('2023-06-15')
  },
  {
    id: 'prof-002',
    cpf: '222.222.222-22',
    email: 'marcos.silva@sabiencia.com.br',
    role: 'professor',
    nome_completo: 'Marcos Silva Santos',
    telefone: '(99) 98765-1234',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos',
    ativo: true,
    especialidades: ['Enfermagem', 'Farmacologia'],
    formacao: 'Farmacêutico, Especialista em Farmacologia Clínica',
    registro_profissional: 'CRF-MA 54321',
    created_at: new Date('2023-07-01')
  },
  {
    id: 'prof-003',
    cpf: '223.223.223-23',
    email: 'fernanda.lima@sabiencia.com.br',
    role: 'professor',
    nome_completo: 'Fernanda Lima Rodrigues',
    telefone: '(99) 98765-5678',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda',
    ativo: true,
    especialidades: ['Administração', 'Gestão'],
    formacao: 'Administradora, MBA em Gestão Estratégica',
    registro_profissional: 'CRA-MA 98765',
    created_at: new Date('2023-08-10')
  },
  {
    id: 'prof-004',
    cpf: '224.224.224-24',
    email: 'roberto.alves@sabiencia.com.br',
    role: 'professor',
    nome_completo: 'Roberto Alves Pereira',
    telefone: '(99) 98765-9012',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
    ativo: true,
    especialidades: ['Administração', 'Contabilidade'],
    formacao: 'Contador, Especialista em Controladoria',
    registro_profissional: 'CRC-MA 45678',
    created_at: new Date('2023-08-15')
  },
  {
    id: 'prof-005',
    cpf: '225.225.225-25',
    email: 'juliana.tech@sabiencia.com.br',
    role: 'professor',
    nome_completo: 'Juliana Tech Oliveira',
    telefone: '(99) 98765-3456',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana',
    ativo: true,
    especialidades: ['Informática', 'Programação'],
    formacao: 'Analista de Sistemas, Mestre em Ciência da Computação',
    created_at: new Date('2023-09-01')
  }
];

// ============================================
// ALUNOS (6 - 2 por curso)
// ============================================

export const alunos: Aluno[] = [
  {
    id: 'aluno-001',
    cpf: '333.333.333-33',
    email: 'joao.santos@email.com',
    role: 'aluno',
    nome_completo: 'João Pedro Santos',
    telefone: '(99) 99123-4567',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
    ativo: true,
    data_nascimento: new Date('2000-05-15'),
    rg: '1234567',
    sexo: 'M',
    estado_civil: 'Solteiro',
    endereco: {
      cep: '65800-000',
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'Balsas',
      estado: 'MA'
    },
    created_at: new Date('2024-02-20')
  },
  {
    id: 'aluno-002',
    cpf: '444.444.444-44',
    email: 'maria.oliveira@email.com',
    role: 'aluno',
    nome_completo: 'Maria Oliveira Silva',
    telefone: '(99) 99234-5678',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    ativo: true,
    data_nascimento: new Date('1998-08-22'),
    rg: '2345678',
    sexo: 'F',
    estado_civil: 'Casada',
    endereco: {
      cep: '65800-100',
      rua: 'Avenida Balsas',
      numero: '456',
      complemento: 'Apto 201',
      bairro: 'Cajueiro',
      cidade: 'Balsas',
      estado: 'MA'
    },
    created_at: new Date('2024-02-22')
  },
  {
    id: 'aluno-003',
    cpf: '555.555.555-55',
    email: 'carlos.souza@email.com',
    role: 'aluno',
    nome_completo: 'Carlos Alberto Souza',
    telefone: '(99) 99345-6789',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    ativo: true,
    data_nascimento: new Date('2001-03-10'),
    rg: '3456789',
    sexo: 'M',
    estado_civil: 'Solteiro',
    endereco: {
      cep: '65800-200',
      rua: 'Rua São Paulo',
      numero: '789',
      bairro: 'Nova Balsas',
      cidade: 'Balsas',
      estado: 'MA'
    },
    created_at: new Date('2024-02-10')
  },
  {
    id: 'aluno-004',
    cpf: '666.666.666-66',
    email: 'ana.lima@email.com',
    role: 'aluno',
    nome_completo: 'Ana Clara Lima',
    telefone: '(99) 99456-7890',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaClara',
    ativo: true,
    data_nascimento: new Date('1999-11-30'),
    rg: '4567890',
    sexo: 'F',
    estado_civil: 'Solteira',
    endereco: {
      cep: '65800-300',
      rua: 'Rua da Paz',
      numero: '321',
      bairro: 'Jardim das Acácias',
      cidade: 'Balsas',
      estado: 'MA'
    },
    created_at: new Date('2024-02-12')
  },
  {
    id: 'aluno-005',
    cpf: '777.777.777-77',
    email: 'pedro.costa@email.com',
    role: 'aluno',
    nome_completo: 'Pedro Henrique Costa',
    telefone: '(99) 99567-8901',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
    ativo: true,
    data_nascimento: new Date('2002-01-18'),
    rg: '5678901',
    sexo: 'M',
    estado_civil: 'Solteiro',
    endereco: {
      cep: '65800-400',
      rua: 'Avenida Getúlio Vargas',
      numero: '654',
      bairro: 'Centro',
      cidade: 'Balsas',
      estado: 'MA'
    },
    created_at: new Date('2024-03-05')
  },
  {
    id: 'aluno-006',
    cpf: '888.888.888-88',
    email: 'juliana.martins@email.com',
    role: 'aluno',
    nome_completo: 'Juliana Martins Ferreira',
    telefone: '(99) 99678-9012',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JulianaM',
    ativo: true,
    data_nascimento: new Date('2000-07-25'),
    rg: '6789012',
    sexo: 'F',
    estado_civil: 'Solteira',
    endereco: {
      cep: '65800-500',
      rua: 'Rua Maranhão',
      numero: '987',
      bairro: 'São Francisco',
      cidade: 'Balsas',
      estado: 'MA'
    },
    created_at: new Date('2024-03-08')
  }
];

// ============================================
// MATRÍCULAS (6 - uma por aluno)
// ============================================

export const matriculas: Matricula[] = [
  {
    id: 'mat-001',
    aluno_id: 'aluno-001',
    turma_id: 'turma-001',
    data_matricula: new Date('2024-05-07'),
    status: 'ativo',
    created_at: new Date('2024-05-07')
  },
  {
    id: 'mat-002',
    aluno_id: 'aluno-002',
    turma_id: 'turma-002',
    data_matricula: new Date('2024-05-09'),
    status: 'ativo',
    created_at: new Date('2024-05-09')
  },
  {
    id: 'mat-003',
    aluno_id: 'aluno-003',
    turma_id: 'turma-003',
    data_matricula: new Date('2024-04-30'),
    status: 'ativo',
    created_at: new Date('2024-04-30')
  },
  {
    id: 'mat-004',
    aluno_id: 'aluno-004',
    turma_id: 'turma-003',
    data_matricula: new Date('2024-05-02'),
    status: 'ativo',
    created_at: new Date('2024-05-02')
  },
  {
    id: 'mat-005',
    aluno_id: 'aluno-005',
    turma_id: 'turma-004',
    data_matricula: new Date('2024-05-15'),
    status: 'ativo',
    created_at: new Date('2024-05-15')
  },
  {
    id: 'mat-006',
    aluno_id: 'aluno-006',
    turma_id: 'turma-004',
    data_matricula: new Date('2024-05-18'),
    status: 'ativo',
    created_at: new Date('2024-05-18')
  }
];

// ============================================
// PROFESSOR-TURMA-DISCIPLINA (atribuições)
// ============================================

export const professorTurmaDisciplina: ProfessorTurmaDisciplina[] = [
  // Prof Ana - Anatomia e Fisiologia nas turmas de Enfermagem
  { id: 'ptd-001', professor_id: 'prof-001', turma_id: 'turma-001', disciplina_id: 'disc-001', created_at: new Date('2024-02-15') },
  { id: 'ptd-002', professor_id: 'prof-001', turma_id: 'turma-001', disciplina_id: 'disc-002', created_at: new Date('2024-02-15') },
  { id: 'ptd-003', professor_id: 'prof-001', turma_id: 'turma-002', disciplina_id: 'disc-001', created_at: new Date('2024-02-15') },
  { id: 'ptd-004', professor_id: 'prof-001', turma_id: 'turma-002', disciplina_id: 'disc-002', created_at: new Date('2024-02-15') },

  // Prof Marcos - Farmacologia e Procedimentos nas turmas de Enfermagem
  { id: 'ptd-005', professor_id: 'prof-002', turma_id: 'turma-001', disciplina_id: 'disc-003', created_at: new Date('2024-02-15') },
  { id: 'ptd-006', professor_id: 'prof-002', turma_id: 'turma-001', disciplina_id: 'disc-005', created_at: new Date('2024-02-15') },
  { id: 'ptd-007', professor_id: 'prof-002', turma_id: 'turma-002', disciplina_id: 'disc-003', created_at: new Date('2024-02-15') },

  // Prof Fernanda - Gestão e Marketing em Administração
  { id: 'ptd-008', professor_id: 'prof-003', turma_id: 'turma-003', disciplina_id: 'disc-006', created_at: new Date('2024-02-01') },
  { id: 'ptd-009', professor_id: 'prof-003', turma_id: 'turma-003', disciplina_id: 'disc-009', created_at: new Date('2024-02-01') },
  { id: 'ptd-010', professor_id: 'prof-003', turma_id: 'turma-003', disciplina_id: 'disc-008', created_at: new Date('2024-02-01') },

  // Prof Roberto - Contabilidade e Matemática Financeira em Administração
  { id: 'ptd-011', professor_id: 'prof-004', turma_id: 'turma-003', disciplina_id: 'disc-007', created_at: new Date('2024-02-01') },
  { id: 'ptd-012', professor_id: 'prof-004', turma_id: 'turma-003', disciplina_id: 'disc-010', created_at: new Date('2024-02-01') },

  // Prof Juliana - Todas disciplinas de Informática
  { id: 'ptd-013', professor_id: 'prof-005', turma_id: 'turma-004', disciplina_id: 'disc-011', created_at: new Date('2024-03-01') },
  { id: 'ptd-014', professor_id: 'prof-005', turma_id: 'turma-004', disciplina_id: 'disc-012', created_at: new Date('2024-03-01') },
  { id: 'ptd-015', professor_id: 'prof-005', turma_id: 'turma-004', disciplina_id: 'disc-013', created_at: new Date('2024-03-01') }
];

// ============================================
// FREQUÊNCIAS (últimos 2 meses - simplificado)
// Gerando frequências para todos alunos nas últimas 8 semanas
// ============================================

const generateFrequencias = (): Frequencia[] => {
  const frequencias: Frequencia[] = [];
  const hoje = new Date();
  let id = 1;

  // Para cada aluno
  alunos.forEach(aluno => {
    const matricula = matriculas.find(m => m.aluno_id === aluno.id);
    if (!matricula) return;

    // Encontrar disciplinas da turma do aluno (limitado a 3 para performance)
    const atribuicoes = professorTurmaDisciplina
      .filter(ptd => ptd.turma_id === matricula.turma_id)
      .slice(0, 3);

    // Para cada disciplina da turma
    atribuicoes.forEach(atrib => {
      // OTIMIZADO: Gerar frequências para últimas 4 semanas (1 mês) ao invés de 8
      for (let semana = 0; semana < 4; semana++) {
        const dataAula = new Date(hoje);
        dataAula.setDate(dataAula.getDate() - (semana * 7));

        // 85% de presença em média
        const status: StatusFrequencia = Math.random() > 0.15 ? 'presente' : 
                                        Math.random() > 0.3 ? 'ausente' : 'justificado';

        frequencias.push({
          id: `freq-${String(id).padStart(3, '0')}`,
          aluno_id: aluno.id,
          disciplina_id: atrib.disciplina_id,
          turma_id: matricula.turma_id,
          professor_id: atrib.professor_id,
          data_aula: dataAula,
          status,
          observacao: status === 'justificado' ? 'Atestado médico' : undefined,
          created_at: dataAula
        });
        id++;
      }
    });
  });

  return frequencias;
};

export const frequencias = generateFrequencias();

// ============================================
// NOTAS (3 avaliações por disciplina por aluno)
// ============================================

const generateNotas = (): Nota[] => {
  const notas: Nota[] = [];
  let id = 1;

  alunos.forEach(aluno => {
    const matricula = matriculas.find(m => m.aluno_id === aluno.id);
    if (!matricula) return;

    // OTIMIZADO: Limitar a 3 disciplinas para performance
    const atribuicoes = professorTurmaDisciplina
      .filter(ptd => ptd.turma_id === matricula.turma_id)
      .slice(0, 3);

    atribuicoes.forEach(atrib => {
      // 3 avaliações por disciplina
      const avaliacoes = ['Prova 1', 'Prova 2', 'Trabalho Final'];
      const pesos = [3, 3, 4];

      avaliacoes.forEach((tipo, index) => {
        // Notas aleatórias entre 5.0 e 10.0 (média boa)
        const nota = Number((Math.random() * 5 + 5).toFixed(1));

        notas.push({
          id: `nota-${String(id).padStart(3, '0')}`,
          aluno_id: aluno.id,
          disciplina_id: atrib.disciplina_id,
          turma_id: matricula.turma_id,
          professor_id: atrib.professor_id,
          tipo_avaliacao: tipo,
          nota,
          peso: pesos[index],
          data_avaliacao: new Date(2024, 9 - index, 15),
          created_at: new Date(2024, 9 - index, 15)
        });
        id++;
      }); });
  });

  return notas;
};

export const notas = generateNotas();

// ============================================
// MATERIAIS - Biblioteca Virtual (PDFs + Vídeos do YouTube)
// ============================================

const generateMateriais = (): Material[] => {
  // OTIMIZADO: Reduzido para performance
  const materiais: Material[] = [];
  let id = 1;

  // Vídeos educacionais do YouTube (conteúdo TED-Ed — estável e apropriado)
  const videosEducacionais = [
    { url: 'https://www.youtube.com/watch?v=FfJ5XG5i2aw', duracao: 180 },
    { url: 'https://www.youtube.com/watch?v=W6aL9YyRx1A', duracao: 300 },
  ];

  // OTIMIZADO: Processar apenas primeiras 10 disciplinas para performance
  disciplinas.slice(0, 10).forEach(disc => {
    // Encontrar professor que leciona esta disciplina
    const atribuicao = professorTurmaDisciplina.find(ptd => ptd.disciplina_id === disc.id);
    if (!atribuicao) return;

    // OTIMIZADO: 1 PDF por disciplina ao invés de 2
    materiais.push({
      id: `mat-${String(id).padStart(3, '0')}`,
      disciplina_id: disc.id,
      professor_id: atribuicao.professor_id,
      titulo: `Apostila Completa - ${disc.nome}`,
      descricao: `Material de estudo sobre ${disc.nome}. Contém teoria, exemplos práticos e exercícios resolvidos.`,
      tipo: 'pdf',
      url: `https://drive.google.com/file/d/exemplo-${disc.id}/view`,
      thumbnail_url: generateDocThumbnail(disc.nome, 'PDF'),
      tamanho_kb: Math.floor(Math.random() * 5000) + 1000,
      modulo: 'Módulo 1 - Introdução',
      tags: ['apostila', 'teoria', 'completo'],
      visivel_para_alunos: true,
      permite_download: true,
      data_upload: new Date(2024, 2, 10)
    });
    id++;

    // 1 vídeo por disciplina
    const video = videosEducacionais[id % videosEducacionais.length];
    materiais.push({
      id: `mat-${String(id).padStart(3, '0')}`,
      disciplina_id: disc.id,
      professor_id: atribuicao.professor_id,
      titulo: `Videoaula - ${disc.nome}`,
      descricao: `Aula completa sobre ${disc.nome} ministrada pelo professor. Inclui demonstrações práticas e exemplos do dia a dia.`,
      tipo: 'video',
      url: video.url,
      thumbnail_url: getYouTubeThumbnail(video.url),
      duracao_segundos: video.duracao,
      modulo: 'Módulo 1 - Introdução',
      tags: ['videoaula', 'introdução', disc.nome.toLowerCase()],
      visivel_para_alunos: true,
      permite_download: false,
      data_upload: new Date(2024, 2, 20)
    });
    id++;
  });

  return materiais;
};

export const materiais = generateMateriais();

// ============================================
// OBSERVAÇÕES (3 por aluno = 18 total)
// ============================================

const generateObservacoes = (): Observacao[] => {
  const observacoes: Observacao[] = [];
  let id = 1;

  const tiposObs: TipoObservacao[] = ['pedagogica', 'comportamental', 'administrativa'];
  const conteudosExemplo = {
    pedagogica: [
      'Aluno demonstra ótimo desempenho nas atividades práticas',
      'Necessita reforço em conceitos teóricos',
      'Participa ativamente das discussões em aula'
    ],
    comportamental: [
      'Aluno colaborativo e respeitoso com colegas',
      'Pontual e assíduo nas aulas',
      'Demonstra proatividade em atividades em grupo'
    ],
    administrativa: [
      'Documentação em dia',
      'Solicitou declaração de matrícula',
      'Entregou atestado médico'
    ]
  };

  alunos.forEach(aluno => {
    const matricula = matriculas.find(m => m.aluno_id === aluno.id);
    if (!matricula) return;

    const atribuicoes = professorTurmaDisciplina.filter(ptd => ptd.turma_id === matricula.turma_id);
    if (atribuicoes.length === 0) return;

    tiposObs.forEach((tipo, index) => {
      const atrib = atribuicoes[index % atribuicoes.length];

      observacoes.push({
        id: `obs-${String(id).padStart(3, '0')}`,
        aluno_id: aluno.id,
        professor_id: atrib.professor_id,
        disciplina_id: atrib.disciplina_id,
        tipo,
        conteudo: conteudosExemplo[tipo][index % 3],
        visivel_aluno: tipo !== 'administrativa',
        created_at: new Date(2024, 8 + index, 10)
      });
      id++;
    });
  });

  return observacoes;
};

export const observacoes = generateObservacoes();

// ============================================
// PAGAMENTOS (6 meses por aluno = 36 total)
// ============================================

const generatePagamentos = (): Pagamento[] => {
  const pagamentos: Pagamento[] = [];
  let id = 1;

  alunos.forEach(aluno => {
    // OTIMIZADO: 4 parcelas mensais ao invés de 6 para performance
    for (let mes = 0; mes < 4; mes++) {
      const vencimento = new Date(2024, 4 + mes, 10); // Mai a Ago
      const status: StatusPagamento = mes < 2 ? 'pago' : mes === 2 ? 'pendente' : 'vencido';

      pagamentos.push({
        id: `pag-${String(id).padStart(3, '0')}`,
        aluno_id: aluno.id,
        valor: 350.00,
        data_vencimento: vencimento,
        data_pagamento: status === 'pago' ? new Date(vencimento.getTime() - 86400000 * 2) : undefined,
        status,
        metodo_pagamento: status === 'pago' ? ['Boleto', 'PIX', 'Cartão'][mes % 3] : undefined,
        created_at: new Date(2024, 4 + mes, 1)
      });
      id++;
    }
  });

  return pagamentos;
};

export const pagamentos = generatePagamentos();

// ============================================
// COMUNICADOS (7)
// ============================================

export const comunicados: Comunicado[] = [
  {
    id: 'com-001',
    remetente_id: 'gestor-001',
    titulo: 'Bem-vindos ao semestre 2024.1',
    mensagem: 'Prezados alunos, é com grande satisfação que damos início ao semestre letivo 2024.1. Desejamos a todos um excelente aproveitamento!',
    destinatarios: 'todos_alunos',
    prioridade: 'normal',
    permitir_resposta: false,
    data_envio: new Date('2024-02-15T10:00:00'),
    created_at: new Date('2024-02-15T09:30:00')
  },
  {
    id: 'com-002',
    remetente_id: 'gestor-001',
    titulo: 'Calendário de Provas - 1º Bimestre',
    mensagem: 'Informamos que as provas do primeiro bimestre ocorrerão de 15 a 25 de abril. Compareçam com documento de identificação.',
    destinatarios: 'todos_alunos',
    prioridade: 'alta',
    permitir_resposta: true,
    data_envio: new Date('2024-04-01T14:00:00'),
    created_at: new Date('2024-04-01T13:00:00')
  },
  {
    id: 'com-003',
    remetente_id: 'prof-001',
    titulo: 'Material complementar disponível',
    mensagem: 'Turma de Enfermagem Manhã, disponibilizei novos exercícios de Anatomia na biblioteca virtual. Bons estudos!',
    destinatarios: 'turma_especifica',
    turma_id: 'turma-001',
    prioridade: 'normal',
    permitir_resposta: true,
    data_envio: new Date('2024-09-10T16:00:00'),
    created_at: new Date('2024-09-10T15:30:00')
  },
  {
    id: 'com-004',
    remetente_id: 'gestor-001',
    titulo: 'Reunião Pedagógica',
    mensagem: 'Prezados professores, haverá reunião pedagógica no dia 20/09 às 18h para alinhamento do calendário do próximo bimestre.',
    destinatarios: 'todos_professores',
    prioridade: 'alta',
    permitir_resposta: false,
    data_envio: new Date('2024-09-15T09:00:00'),
    created_at: new Date('2024-09-15T08:00:00')
  },
  {
    id: 'com-005',
    remetente_id: 'gestor-001',
    titulo: 'Boletos de Outubro disponíveis',
    mensagem: 'Os boletos referentes à mensalidade de outubro já estão disponíveis para download. Vencimento: 10/10/2024.',
    destinatarios: 'todos_alunos',
    prioridade: 'normal',
    permitir_resposta: false,
    data_envio: new Date('2024-09-25T10:00:00'),
    created_at: new Date('2024-09-25T09:00:00')
  },
  {
    id: 'com-006',
    remetente_id: 'prof-005',
    titulo: 'Aula prática de Programação Web',
    mensagem: 'Turma de Informática, a aula prática de sábado será sobre desenvolvimento de sites responsivos. Tragam notebooks!',
    destinatarios: 'turma_especifica',
    turma_id: 'turma-004',
    prioridade: 'alta',
    permitir_resposta: true,
    data_envio: new Date('2024-11-04T11:00:00'),
    created_at: new Date('2024-11-04T10:00:00')
  },
  {
    id: 'com-007',
    remetente_id: 'gestor-001',
    titulo: 'Feriado Prolongado - 15 de Novembro',
    mensagem: 'Informamos que não haverá aulas nos dias 15 e 16 de novembro devido ao feriado da Proclamação da República. Retornamos dia 18/11.',
    destinatarios: 'todos_alunos',
    prioridade: 'urgente',
    permitir_resposta: false,
    data_envio: new Date('2024-11-06T08:00:00'),
    created_at: new Date('2024-11-06T07:30:00')
  },
  {
    id: 'com-008',
    remetente_id: 'gestor-001',
    titulo: 'Novos materiais no Portal',
    mensagem: 'Foram adicionados novos materiais didáticos no portal. Acesse a biblioteca virtual e confira!',
    destinatarios: 'todos_alunos',
    prioridade: 'baixa',
    permitir_resposta: false,
    data_envio: new Date('2024-11-05T10:00:00'),
    created_at: new Date('2024-11-05T09:30:00')
  }
];

// ============================================
// LEITURAS DE COMUNICADOS
// ============================================

export const comunicadosLeituras: ComunicadoLeitura[] = [
  // Comunicado 1 - Lido por alguns alunos
  {
    id: 'leit-001',
    comunicado_id: 'com-001',
    usuario_id: 'aluno-001',
    data_leitura: new Date('2024-02-15T11:00:00'),
    created_at: new Date('2024-02-15T11:00:00')
  },
  {
    id: 'leit-002',
    comunicado_id: 'com-001',
    usuario_id: 'aluno-002',
    data_leitura: new Date('2024-02-15T14:30:00'),
    created_at: new Date('2024-02-15T14:30:00')
  },
  {
    id: 'leit-003',
    comunicado_id: 'com-001',
    usuario_id: 'aluno-003',
    data_leitura: new Date('2024-02-16T09:00:00'),
    created_at: new Date('2024-02-16T09:00:00')
  },
  
  // Comunicado 2 - Lido por todos
  {
    id: 'leit-004',
    comunicado_id: 'com-002',
    usuario_id: 'aluno-001',
    data_leitura: new Date('2024-04-01T15:00:00'),
    created_at: new Date('2024-04-01T15:00:00')
  },
  {
    id: 'leit-005',
    comunicado_id: 'com-002',
    usuario_id: 'aluno-002',
    data_leitura: new Date('2024-04-01T16:00:00'),
    created_at: new Date('2024-04-01T16:00:00')
  },
  {
    id: 'leit-006',
    comunicado_id: 'com-002',
    usuario_id: 'aluno-003',
    data_leitura: new Date('2024-04-02T08:00:00'),
    created_at: new Date('2024-04-02T08:00:00')
  },
  
  // ✅ SPRINT 3: Removidas leituras leit-007,008,009 para otimização
  // Comunicado 3 - Lido apenas pela turma específica
  {
    id: 'leit-010',
    comunicado_id: 'com-003',
    usuario_id: 'aluno-001',
    data_leitura: new Date('2024-09-10T17:00:00'),
    created_at: new Date('2024-09-10T17:00:00')
  },
  {
    id: 'leit-011',
    comunicado_id: 'com-003',
    usuario_id: 'aluno-002',
    data_leitura: new Date('2024-09-11T09:00:00'),
    created_at: new Date('2024-09-11T09:00:00')
  },
  
  // Comunicado 4 - Lido por professores
  {
    id: 'leit-012',
    comunicado_id: 'com-004',
    usuario_id: 'prof-001',
    data_leitura: new Date('2024-09-15T10:00:00'),
    created_at: new Date('2024-09-15T10:00:00')
  },
  {
    id: 'leit-013',
    comunicado_id: 'com-004',
    usuario_id: 'prof-002',
    data_leitura: new Date('2024-09-15T11:00:00'),
    created_at: new Date('2024-09-15T11:00:00')
  },
  {
    id: 'leit-014',
    comunicado_id: 'com-004',
    usuario_id: 'prof-003',
    data_leitura: new Date('2024-09-15T14:00:00'),
    created_at: new Date('2024-09-15T14:00:00')
  },
  
  // Comunicado 5 - Lido por metade dos alunos
  {
    id: 'leit-015',
    comunicado_id: 'com-005',
    usuario_id: 'aluno-001',
    data_leitura: new Date('2024-09-25T11:00:00'),
    created_at: new Date('2024-09-25T11:00:00')
  },
  {
    id: 'leit-016',
    comunicado_id: 'com-005',
    usuario_id: 'aluno-003',
    data_leitura: new Date('2024-09-25T15:00:00'),
    created_at: new Date('2024-09-25T15:00:00')
  },
  {
    id: 'leit-017',
    comunicado_id: 'com-005',
    usuario_id: 'aluno-005',
    data_leitura: new Date('2024-09-26T09:00:00'),
    created_at: new Date('2024-09-26T09:00:00')
  },
  
  // Comunicado 7 - Urgente, lido por quase todos
  {
    id: 'leit-018',
    comunicado_id: 'com-007',
    usuario_id: 'aluno-001',
    data_leitura: new Date('2024-11-01T09:00:00'),
    created_at: new Date('2024-11-01T09:00:00')
  },
  {
    id: 'leit-019',
    comunicado_id: 'com-007',
    usuario_id: 'aluno-002',
    data_leitura: new Date('2024-11-01T10:00:00'),
    created_at: new Date('2024-11-01T10:00:00')
  },
  {
    id: 'leit-020',
    comunicado_id: 'com-007',
    usuario_id: 'aluno-003',
    data_leitura: new Date('2024-11-01T11:00:00'),
    created_at: new Date('2024-11-01T11:00:00')
  },
  {
    id: 'leit-021',
    comunicado_id: 'com-007',
    usuario_id: 'aluno-004',
    data_leitura: new Date('2024-11-01T14:00:00'),
    created_at: new Date('2024-11-01T14:00:00')
  }
  // ✅ SPRINT 3: Removida leit-022 para otimização (redução de ~18% nas leituras)
  // Comunicado 6 e 8 - Não lidos por ninguém
];

// ============================================
// LOGS DE AUDITORIA (20 exemplos)
// ============================================

export const logsAuditoria: LogAuditoria[] = [
  {
    id: 'log-001',
    user_id: 'gestor-001',
    acao: 'Criou',
    tabela: 'alunos',
    registro_id: 'aluno-001',
    dados_novos: { nome: 'João Pedro Santos', cpf: '333.333.333-33' },
    ip_address: '192.168.1.100',
    created_at: new Date('2024-02-20T10:30:00')
  },
  {
    id: 'log-002',
    user_id: 'gestor-001',
    acao: 'Criou',
    tabela: 'matriculas',
    registro_id: 'mat-001',
    dados_novos: { aluno_id: 'aluno-001', turma_id: 'turma-001' },
    ip_address: '192.168.1.100',
    created_at: new Date('2024-02-20T10:35:00')
  },
  {
    id: 'log-003',
    user_id: 'prof-001',
    acao: 'Lançou',
    tabela: 'notas',
    registro_id: 'nota-001',
    dados_novos: { aluno_id: 'aluno-001', nota: 8.5, tipo: 'Prova 1' },
    ip_address: '192.168.1.105',
    created_at: new Date('2024-09-15T14:20:00')
  },
  {
    id: 'log-004',
    user_id: 'prof-001',
    acao: 'Editou',
    tabela: 'notas',
    registro_id: 'nota-001',
    dados_anteriores: { nota: 8.5 },
    dados_novos: { nota: 9.0 },
    ip_address: '192.168.1.105',
    created_at: new Date('2024-09-15T16:00:00')
  },
  {
    id: 'log-005',
    user_id: 'prof-002',
    acao: 'Adicionou',
    tabela: 'materiais',
    registro_id: 'mat-001',
    dados_novos: { titulo: 'Apostila - Farmacologia', disciplina_id: 'disc-005' },
    ip_address: '192.168.1.110',
    created_at: new Date('2024-03-20T09:15:00')
  },
  {
    id: 'log-006',
    user_id: 'gestor-001',
    acao: 'Criou',
    tabela: 'comunicados',
    registro_id: 'com-001',
    dados_novos: { titulo: 'Bem-vindos ao semestre 2024.1' },
    ip_address: '192.168.1.100',
    created_at: new Date('2024-02-15T09:30:00')
  },
  {
    id: 'log-007',
    user_id: 'aluno-001',
    acao: 'Alterou',
    tabela: 'profiles',
    registro_id: 'aluno-001',
    dados_anteriores: { telefone: '(99) 99123-4567' },
    dados_novos: { telefone: '(99) 99123-4568' },
    ip_address: '192.168.1.200',
    created_at: new Date('2024-10-01T18:00:00')
  },
  {
    id: 'log-008',
    user_id: 'prof-003',
    acao: 'Lançou',
    tabela: 'frequencias',
    registro_id: 'freq-050',
    dados_novos: { data_aula: '2024-09-20', total_presentes: 12 },
    ip_address: '192.168.1.115',
    created_at: new Date('2024-09-20T20:30:00')
  },
  {
    id: 'log-009',
    user_id: 'gestor-001',
    acao: 'Criou',
    tabela: 'turmas',
    registro_id: 'turma-004',
    dados_novos: { nome: 'Informática 2024.1', curso: 'Informática' },
    ip_address: '192.168.1.100',
    created_at: new Date('2024-03-01T11:00:00')
  },
  {
    id: 'log-010',
    user_id: 'prof-005',
    acao: 'Adicionou',
    tabela: 'observacoes',
    registro_id: 'obs-015',
    dados_novos: { aluno_id: 'aluno-005', tipo: 'pedagogica' },
    ip_address: '192.168.1.120',
    created_at: new Date('2024-09-25T15:45:00')
  },
  {
    id: 'log-011',
    user_id: 'gestor-001',
    acao: 'Atualizou',
    tabela: 'pagamentos',
    registro_id: 'pag-010',
    dados_anteriores: { status: 'pendente' },
    dados_novos: { status: 'pago', data_pagamento: '2024-09-08' },
    ip_address: '192.168.1.100',
    created_at: new Date('2024-09-08T10:00:00')
  },
  {
    id: 'log-012',
    user_id: 'prof-001',
    acao: 'Excluiu',
    tabela: 'materiais',
    registro_id: 'mat-099',
    dados_anteriores: { titulo: 'Material antigo' },
    ip_address: '192.168.1.105',
    created_at: new Date('2024-10-02T13:20:00')
  },
  {
    id: 'log-013',
    user_id: 'gestor-001',
    acao: 'Criou',
    tabela: 'professores',
    registro_id: 'prof-005',
    dados_novos: { nome: 'Juliana Tech Oliveira', especialidade: 'Informática' },
    ip_address: '192.168.1.100',
    created_at: new Date('2023-09-01T09:00:00')
  },
  {
    id: 'log-014',
    user_id: 'prof-004',
    acao: 'Lançou',
    tabela: 'notas',
    registro_id: 'nota-045',
    dados_novos: { aluno_id: 'aluno-003', nota: 7.5, disciplina: 'Contabilidade' },
    ip_address: '192.168.1.118',
    created_at: new Date('2024-09-28T16:30:00')
  },
  {
    id: 'log-015',
    user_id: 'aluno-003',
    acao: 'Baixou',
    tabela: 'materiais',
    registro_id: 'mat-020',
    dados_novos: { material: 'Apostila Contabilidade Básica' },
    ip_address: '192.168.1.205',
    created_at: new Date('2024-10-01T21:15:00')
  },
  {
    id: 'log-016',
    user_id: 'gestor-001',
    acao: 'Enviou',
    tabela: 'comunicados',
    registro_id: 'com-005',
    dados_novos: { titulo: 'Boletos de Outubro disponíveis' },
    ip_address: '192.168.1.100',
    created_at: new Date('2024-09-25T09:00:00')
  },
  {
    id: 'log-017',
    user_id: 'prof-002',
    acao: 'Editou',
    tabela: 'frequencias',
    registro_id: 'freq-078',
    dados_anteriores: { status: 'ausente' },
    dados_novos: { status: 'justificado', observacao: 'Atestado médico' },
    ip_address: '192.168.1.110',
    created_at: new Date('2024-09-30T10:45:00')
  },
  {
    id: 'log-018',
    user_id: 'gestor-001',
    acao: 'Transferiu',
    tabela: 'matriculas',
    registro_id: 'mat-002',
    dados_anteriores: { turma_id: 'turma-001' },
    dados_novos: { turma_id: 'turma-002' },
    ip_address: '192.168.1.100',
    created_at: new Date('2024-03-15T14:00:00')
  },
  {
    id: 'log-019',
    user_id: 'prof-003',
    acao: 'Adicionou',
    tabela: 'materiais',
    registro_id: 'mat-025',
    dados_novos: { titulo: 'Exercícios - Gestão Empresarial', tipo: 'pdf' },
    ip_address: '192.168.1.115',
    created_at: new Date('2024-09-18T11:30:00')
  },
  {
    id: 'log-020',
    user_id: 'aluno-002',
    acao: 'Atualizou',
    tabela: 'profiles',
    registro_id: 'aluno-002',
    dados_anteriores: { email: 'maria.old@email.com' },
    dados_novos: { email: 'maria.oliveira@email.com' },
    ip_address: '192.168.1.202',
    created_at: new Date('2024-09-05T19:20:00')
  }
];

// ============================================
// EXPORTS CONSOLIDADOS
// ============================================

export const mockData = {
  cursos,
  disciplinas,
  turmas,
  gestores,
  professores,
  alunos,
  matriculas,
  professorTurmaDisciplina,
  frequencias,
  notas,
  materiais,
  observacoes,
  pagamentos,
  comunicados,
  comunicadosLeituras,
  logsAuditoria
};
