// ============================================
// NOTA SCHEMAS - Validações com Zod
// ============================================

import { z } from 'zod';

// ============================================
// SCHEMA DE LANÇAMENTO DE NOTA
// ============================================

export const lancamentoNotaSchema = z.object({
  aluno_id: z.string().min(1, 'Aluno é obrigatório'),
  disciplina_id: z.string().min(1, 'Disciplina é obrigatória'),
  turma_id: z.string().min(1, 'Turma é obrigatória'),
  professor_id: z.string().min(1, 'Professor é obrigatório'),
  tipo_avaliacao: z.string().min(1, 'Tipo de avaliação é obrigatório'),
  nota: z
    .number({
      required_error: 'Nota é obrigatória',
      invalid_type_error: 'Nota deve ser um número',
    })
    .min(0, 'Nota não pode ser negativa')
    .max(10, 'Nota não pode ser maior que 10'),
  peso: z
    .number({
      required_error: 'Peso é obrigatório',
      invalid_type_error: 'Peso deve ser um número',
    })
    .min(0.1, 'Peso muito baixo')
    .max(10, 'Peso muito alto'),
  data_avaliacao: z.date({
    required_error: 'Data da avaliação é obrigatória',
    invalid_type_error: 'Data inválida',
  }),
  observacao: z.string().max(500, 'Observação muito longa (máximo 500 caracteres)').optional(),
});

export type LancamentoNotaFormData = z.infer<typeof lancamentoNotaSchema>;

// ============================================
// SCHEMA DE NOTA EM LOTE
// ============================================

export const notaAlunoSchema = z.object({
  aluno_id: z.string(),
  nota: z.number().min(0).max(10),
  observacao: z.string().max(500).optional(),
});

export const lancamentoNotasLoteSchema = z.object({
  disciplina_id: z.string().min(1, 'Disciplina é obrigatória'),
  turma_id: z.string().min(1, 'Turma é obrigatória'),
  tipo_avaliacao: z.string().min(1, 'Tipo de avaliação é obrigatório'),
  peso: z.number().min(0.1).max(10),
  data_avaliacao: z.date({
    required_error: 'Data da avaliação é obrigatória',
  }),
  notas: z.array(notaAlunoSchema).min(1, 'Lance ao menos uma nota'),
});

export type LancamentoNotasLoteFormData = z.infer<typeof lancamentoNotasLoteSchema>;

// ============================================
// SCHEMA DE EDIÇÃO DE NOTA
// ============================================

export const edicaoNotaSchema = z.object({
  nota: z.number().min(0, 'Nota não pode ser negativa').max(10, 'Nota não pode ser maior que 10'),
  observacao: z.string().max(500, 'Observação muito longa').optional(),
});

export type EdicaoNotaFormData = z.infer<typeof edicaoNotaSchema>;

// ============================================
// TIPOS DE AVALIAÇÃO (SUGESTÕES)
// ============================================

export const TIPOS_AVALIACAO = [
  'Prova 1',
  'Prova 2',
  'Prova Final',
  'Trabalho',
  'Seminário',
  'Atividade Prática',
  'Participação',
  'Projeto',
  'Exercícios',
  'Recuperação',
] as const;

export type TipoAvaliacao = typeof TIPOS_AVALIACAO[number];

// ============================================
// HELPERS E VALIDAÇÕES
// ============================================

export const calcularMedia = (notas: Array<{ nota: number; peso: number }>): number => {
  if (notas.length === 0) return 0;

  const somaNotasPonderadas = notas.reduce((acc, { nota, peso }) => acc + nota * peso, 0);
  const somaPesos = notas.reduce((acc, { peso }) => acc + peso, 0);

  if (somaPesos === 0) return 0;

  return Number((somaNotasPonderadas / somaPesos).toFixed(2));
};

export const calcularMediaSimples = (notas: number[]): number => {
  if (notas.length === 0) return 0;
  const soma = notas.reduce((acc, nota) => acc + nota, 0);
  return Number((soma / notas.length).toFixed(2));
};

export const obterSituacaoAluno = (media: number): {
  label: string;
  cor: 'green' | 'yellow' | 'red';
  status: 'aprovado' | 'recuperacao' | 'reprovado';
} => {
  if (media >= 7) {
    return { label: 'Aprovado', cor: 'green', status: 'aprovado' };
  } else if (media >= 5) {
    return { label: 'Recuperação', cor: 'yellow', status: 'recuperacao' };
  } else {
    return { label: 'Reprovado', cor: 'red', status: 'reprovado' };
  }
};

export const validarNotaDecimal = (nota: number): boolean => {
  // Permite até 2 casas decimais
  const decimal = nota.toString().split('.')[1];
  return !decimal || decimal.length <= 2;
};

export const formatarNota = (nota: number): string => {
  return nota.toFixed(1);
};

export const notaPorExtenso = (nota: number): string => {
  if (nota >= 9) return 'Excelente';
  if (nota >= 8) return 'Ótimo';
  if (nota >= 7) return 'Bom';
  if (nota >= 6) return 'Regular';
  if (nota >= 5) return 'Insuficiente';
  return 'Muito Insuficiente';
};
