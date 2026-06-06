// ============================================
// CURSO SCHEMAS - Validação de dados de cursos
// ============================================

import { z } from 'zod';

export const cursoSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  
  descricao: z.string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim(),
  
  carga_horaria: z.number()
    .min(40, 'Carga horária mínima é 40 horas')
    .max(10000, 'Carga horária máxima é 10.000 horas'),
  
  duracao_meses: z.number()
    .min(1, 'Duração mínima é 1 mês')
    .max(60, 'Duração máxima é 60 meses'),
  
  ativo: z.boolean().default(true),
});

export type CursoFormData = z.infer<typeof cursoSchema>;

// Schema para filtros
export const cursoFiltersSchema = z.object({
  ativo: z.enum(['todos', 'ativo', 'inativo']).optional(),
  cargaHorariaMin: z.number().optional(),
  cargaHorariaMax: z.number().optional(),
  duracaoMin: z.number().optional(),
  duracaoMax: z.number().optional(),
});

export type CursoFilters = z.infer<typeof cursoFiltersSchema>;
