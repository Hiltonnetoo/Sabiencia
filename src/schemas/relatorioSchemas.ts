// ============================================
// RELATÓRIOS SCHEMAS - Validação e tipos
// ============================================

import { z } from 'zod';

// ============================================
// TIPOS DE RELATÓRIOS
// ============================================

export const tipoRelatorioEnum = z.enum([
  'desempenho_aluno',
  'desempenho_turma',
  'frequencia',
  'financeiro',
  'disciplina',
  'observacoes',
  'geral'
]);

export type TipoRelatorio = z.infer<typeof tipoRelatorioEnum>;

// ============================================
// SCHEMAS DE FILTROS
// ============================================

export const relatorioFiltrosSchema = z.object({
  tipo: tipoRelatorioEnum,
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  curso_id: z.string().optional(),
  turma_id: z.string().optional(),
  disciplina_id: z.string().optional(),
  aluno_id: z.string().optional(),
  professor_id: z.string().optional(),
  periodo: z.enum(['mensal', 'bimestral', 'semestral', 'anual', 'personalizado']).optional(),
});

export type RelatorioFiltros = z.infer<typeof relatorioFiltrosSchema>;

// ============================================
// TIPOS DE DADOS PARA RELATÓRIOS
// ============================================

export interface DadosDesempenhoAluno {
  aluno_id: string;
  aluno_nome: string;
  curso: string;
  turma: string;
  media_geral: number;
  total_disciplinas: number;
  disciplinas_aprovadas: number;
  disciplinas_reprovadas: number;
  frequencia_media: number;
  total_faltas: number;
  situacao: 'aprovado' | 'reprovado' | 'em_andamento';
  observacoes_count: number;
  notas_por_disciplina: {
    disciplina: string;
    av1: number | null;
    av2: number | null;
    av3: number | null;
    media: number;
    situacao: string;
  }[];
}

export interface DadosDesempenhoTurma {
  turma_id: string;
  turma_nome: string;
  curso: string;
  total_alunos: number;
  media_geral: number;
  frequencia_media: number;
  aprovados: number;
  reprovados: number;
  em_andamento: number;
  melhor_aluno: {
    nome: string;
    media: number;
  };
  pior_aluno: {
    nome: string;
    media: number;
  };
  disciplinas: {
    nome: string;
    media: number;
    aprovacao: number;
  }[];
}

export interface DadosFrequencia {
  periodo: string;
  total_aulas: number;
  total_presencas: number;
  total_faltas: number;
  percentual_presenca: number;
  por_disciplina: {
    disciplina: string;
    aulas: number;
    presencas: number;
    faltas: number;
    percentual: number;
  }[];
  por_mes: {
    mes: string;
    presencas: number;
    faltas: number;
    percentual: number;
  }[];
}

export interface DadosFinanceiro {
  periodo: string;
  total_receita: number;
  total_recebido: number;
  total_pendente: number;
  total_atrasado: number;
  taxa_inadimplencia: number;
  por_curso: {
    curso: string;
    receita: number;
    recebido: number;
    pendente: number;
  }[];
  por_mes: {
    mes: string;
    receita: number;
    recebido: number;
    pendente: number;
  }[];
}

export interface DadosDisciplina {
  disciplina_id: string;
  disciplina_nome: string;
  curso: string;
  total_alunos: number;
  media_geral: number;
  frequencia_media: number;
  aprovados: number;
  reprovados: number;
  em_andamento: number;
  distribuicao_notas: {
    faixa: string;
    quantidade: number;
  }[];
}

export interface DadosObservacoes {
  periodo: string;
  total_observacoes: number;
  pedagogicas: number;
  comportamentais: number;
  administrativas: number;
  por_aluno: {
    aluno: string;
    total: number;
    pedagogicas: number;
    comportamentais: number;
    administrativas: number;
  }[];
  por_professor: {
    professor: string;
    total: number;
  }[];
}

// ============================================
// TIPO UNIFICADO DE DADOS DO RELATÓRIO
// ============================================

export type DadosRelatorio =
  | DadosDesempenhoAluno
  | DadosDesempenhoTurma
  | DadosFrequencia
  | DadosFinanceiro
  | DadosDisciplina
  | DadosObservacoes;
