import { z } from 'zod';

// ============================================
// SCHEMA DE DISCIPLINA
// ============================================

export const disciplinaSchema = z.object({
  curso_id: z.string().min(1, 'Selecione um curso'),
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  descricao: z.string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição muito longa'),
  carga_horaria: z.number()
    .min(20, 'Carga horária mínima: 20 horas')
    .max(500, 'Carga horária máxima: 500 horas'),
  ordem: z.number()
    .min(1, 'Ordem deve ser maior que zero')
    .max(50, 'Ordem muito alta'),
  ementa: z.string()
    .min(20, 'Ementa deve ter no mínimo 20 caracteres')
    .max(1000, 'Ementa muito longa')
    .optional(),
});

export type DisciplinaFormData = z.infer<typeof disciplinaSchema>;

// ============================================
// SCHEMA DE FILTROS
// ============================================

export const disciplinaFiltersSchema = z.object({
  busca: z.string().optional(),
  curso_id: z.string().optional(),
  carga_horaria_min: z.number().optional(),
  carga_horaria_max: z.number().optional(),
});

export type DisciplinaFiltersData = z.infer<typeof disciplinaFiltersSchema>;
