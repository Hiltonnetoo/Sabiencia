// ============================================
// SCHEMAS DE VALIDAÇÃO - OBSERVAÇÕES
// ============================================

import { z } from 'zod';

export const observacaoSchema = z.object({
  aluno_id: z.string().min(1, 'Selecione um aluno'),
  professor_id: z.string().min(1, 'Professor é obrigatório'),
  disciplina_id: z.string().optional(),
  tipo: z.enum(['pedagogica', 'comportamental', 'administrativa'], {
    errorMap: () => ({ message: 'Selecione um tipo de observação' })
  }),
  conteudo: z
    .string()
    .min(10, 'A observação deve ter pelo menos 10 caracteres')
    .max(1000, 'A observação deve ter no máximo 1000 caracteres'),
  visivel_aluno: z.boolean().default(true)
});

export type ObservacaoFormData = z.infer<typeof observacaoSchema>;

export const observacaoFiltersSchema = z.object({
  busca: z.string().optional(),
  aluno_id: z.string().optional(),
  professor_id: z.string().optional(),
  disciplina_id: z.string().optional(),
  tipo: z.enum(['pedagogica', 'comportamental', 'administrativa']).optional()
});

export type ObservacaoFilters = z.infer<typeof observacaoFiltersSchema>;
