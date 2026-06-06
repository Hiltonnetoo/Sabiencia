import { z } from 'zod';

// ============================================
// SCHEMA DE PAGAMENTO
// ============================================

export const pagamentoSchema = z.object({
  aluno_id: z.string().min(1, 'Selecione um aluno'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  data_vencimento: z.date({
    required_error: 'Data de vencimento é obrigatória',
  }),
  data_pagamento: z.date().optional(),
  status: z.enum(['pendente', 'pago', 'vencido', 'cancelado'], {
    required_error: 'Status é obrigatório',
  }),
  metodo_pagamento: z.string().optional(),
  comprovante_url: z.string().url('URL inválida').optional().or(z.literal('')),
  observacao: z.string().max(500, 'Observação muito longa').optional(),
});

export type PagamentoFormData = z.infer<typeof pagamentoSchema>;

// ============================================
// SCHEMA DE FILTROS
// ============================================

export const pagamentoFiltersSchema = z.object({
  busca: z.string().optional(),
  status: z.enum(['todos', 'pendente', 'pago', 'vencido', 'cancelado']).optional(),
  aluno_id: z.string().optional(),
  metodo_pagamento: z.string().optional(),
  mes: z.number().min(1).max(12).optional(),
  ano: z.number().min(2020).max(2030).optional(),
});

export type PagamentoFiltersData = z.infer<typeof pagamentoFiltersSchema>;

// ============================================
// SCHEMA DE REGISTRO DE PAGAMENTO
// ============================================

export const registroPagamentoSchema = z.object({
  pagamento_id: z.string().min(1, 'ID do pagamento é obrigatório'),
  data_pagamento: z.date({
    required_error: 'Data do pagamento é obrigatória',
  }),
  metodo_pagamento: z.string().min(1, 'Método de pagamento é obrigatório'),
  comprovante_url: z.string().url('URL inválida').optional().or(z.literal('')),
  observacao: z.string().max(500, 'Observação muito longa').optional(),
});

export type RegistroPagamentoFormData = z.infer<typeof registroPagamentoSchema>;
