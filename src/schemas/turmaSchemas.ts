import { z } from 'zod';

// ============================================
// SCHEMA DE TURMA
// ============================================

export const turmaSchema = z.object({
  curso_id: z.string().min(1, 'Selecione um curso'),
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  data_inicio: z.date({
    required_error: 'Data de início é obrigatória',
  }),
  data_fim: z.date({
    required_error: 'Data de término é obrigatória',
  }),
  periodo: z.enum(['manha', 'tarde', 'noite', 'integral'], {
    required_error: 'Selecione um período',
  }),
  ativa: z.boolean().default(true),
}).refine((data) => data.data_fim > data.data_inicio, {
  message: 'Data de término deve ser posterior à data de início',
  path: ['data_fim'],
});

export type TurmaFormData = z.infer<typeof turmaSchema>;

// ============================================
// SCHEMA DE FILTROS
// ============================================

export const turmaFiltersSchema = z.object({
  busca: z.string().optional(),
  curso_id: z.string().optional(),
  periodo: z.enum(['todos', 'manha', 'tarde', 'noite', 'integral']).optional(),
  status: z.enum(['todos', 'ativa', 'inativa']).optional(),
  ano: z.number().min(2020).max(2030).optional(),
});

export type TurmaFiltersData = z.infer<typeof turmaFiltersSchema>;
