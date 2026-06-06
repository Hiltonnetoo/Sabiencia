// ============================================
// NOTIFICAÇÃO SCHEMAS - Validações de notificações
// ============================================

import { z } from 'zod';

/**
 * Schema para filtros de notificações
 */
export const filtrosNotificacaoSchema = z.object({
  tipo: z.enum(['todos', 'academico', 'financeiro', 'sistema', 'comunicado', 'frequencia', 'nota', 'material']).optional(),
  prioridade: z.enum(['todos', 'info', 'success', 'warning', 'error']).optional(),
  lida: z.enum(['todos', 'lidas', 'nao_lidas']).optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
});

export type FiltrosNotificacaoData = z.infer<typeof filtrosNotificacaoSchema>;

/**
 * Schema para preferências de notificações
 */
export const preferenciasNotificacaoSchema = z.object({
  email_comunicados: z.boolean().default(true),
  email_notas: z.boolean().default(true),
  email_frequencia: z.boolean().default(false),
  email_financeiro: z.boolean().default(true),
  email_materiais: z.boolean().default(false),
  push_comunicados: z.boolean().default(true),
  push_notas: z.boolean().default(true),
  push_frequencia: z.boolean().default(false),
  push_financeiro: z.boolean().default(true),
  push_materiais: z.boolean().default(true),
  resumo_diario: z.boolean().default(false),
  resumo_semanal: z.boolean().default(true),
});

export type PreferenciasNotificacaoData = z.infer<typeof preferenciasNotificacaoSchema>;
