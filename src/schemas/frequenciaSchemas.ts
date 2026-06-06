// ============================================
// FREQUÊNCIA SCHEMAS - Validações com Zod
// ============================================

import { z } from 'zod';

// ============================================
// SCHEMA DE REGISTRO DE FREQUÊNCIA
// ============================================

export const registroFrequenciaSchema = z.object({
  aluno_id: z.string().min(1, 'Aluno é obrigatório'),
  disciplina_id: z.string().min(1, 'Disciplina é obrigatória'),
  turma_id: z.string().min(1, 'Turma é obrigatória'),
  professor_id: z.string().min(1, 'Professor é obrigatório'),
  data_aula: z.date({
    required_error: 'Data da aula é obrigatória',
    invalid_type_error: 'Data inválida',
  }),
  status: z.enum(['presente', 'ausente', 'justificado'], {
    required_error: 'Status é obrigatório',
    invalid_type_error: 'Status inválido',
  }),
  observacao: z.string().max(500, 'Observação muito longa (máximo 500 caracteres)').optional(),
});

export type RegistroFrequenciaFormData = z.infer<typeof registroFrequenciaSchema>;

// ============================================
// SCHEMA DE FREQUÊNCIA EM LOTE (LISTA DE PRESENÇA)
// ============================================

export const presencaAlunoSchema = z.object({
  aluno_id: z.string(),
  status: z.enum(['presente', 'ausente', 'justificado']),
  observacao: z.string().max(500).optional(),
});

export const listaPresencaSchema = z.object({
  disciplina_id: z.string().min(1, 'Disciplina é obrigatória'),
  turma_id: z.string().min(1, 'Turma é obrigatória'),
  data_aula: z.date({
    required_error: 'Data da aula é obrigatória',
    invalid_type_error: 'Data inválida',
  }),
  presencas: z.array(presencaAlunoSchema).min(1, 'Registre ao menos um aluno'),
});

export type ListaPresencaFormData = z.infer<typeof listaPresencaSchema>;

// ============================================
// SCHEMA DE JUSTIFICATIVA DE FALTA
// ============================================

export const justificativaFaltaSchema = z.object({
  frequencia_id: z.string().min(1, 'ID da frequência é obrigatório'),
  justificativa: z
    .string()
    .min(10, 'Justificativa muito curta (mínimo 10 caracteres)')
    .max(1000, 'Justificativa muito longa (máximo 1000 caracteres)'),
  comprovante_url: z.string().url('URL inválida').optional(),
});

export type JustificativaFaltaFormData = z.infer<typeof justificativaFaltaSchema>;

// ============================================
// HELPERS E VALIDAÇÕES
// ============================================

export const validarDataAula = (data: Date): boolean => {
  const hoje = new Date();
  const umAnoAtras = new Date();
  umAnoAtras.setFullYear(hoje.getFullYear() - 1);

  return data >= umAnoAtras && data <= hoje;
};

export const calcularPercentualPresenca = (
  total: number,
  presencas: number
): number => {
  if (total === 0) return 0;
  return Math.round((presencas / total) * 100);
};

export const obterStatusFrequencia = (percentual: number): {
  label: string;
  cor: 'green' | 'yellow' | 'red';
} => {
  if (percentual >= 75) {
    return { label: 'Adequada', cor: 'green' };
  } else if (percentual >= 60) {
    return { label: 'Atenção', cor: 'yellow' };
  } else {
    return { label: 'Crítica', cor: 'red' };
  }
};
