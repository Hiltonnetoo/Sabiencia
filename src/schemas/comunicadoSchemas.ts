// ============================================
// SCHEMAS - COMUNICADOS
// ============================================

import { z } from 'zod';

/**
 * Schema para criar/editar comunicado
 */
export const comunicadoSchema = z.object({
  titulo: z.string()
    .min(5, 'Título deve ter no mínimo 5 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  
  mensagem: z.string()
    .min(20, 'Mensagem deve ter no mínimo 20 caracteres')
    .max(2000, 'Mensagem deve ter no máximo 2000 caracteres'),
  
  destinatarios: z.enum(['todos_alunos', 'todos_professores', 'turma_especifica', 'individual'], {
    errorMap: () => ({ message: 'Tipo de destinatário inválido' })
  }),
  
  turma_id: z.string().optional(),
  aluno_id: z.string().optional(),
  
  prioridade: z.enum(['baixa', 'normal', 'alta', 'urgente']).default('normal'),
  
  permitir_resposta: z.boolean().default(false)
});

export type ComunicadoFormData = z.infer<typeof comunicadoSchema>;

/**
 * Validação personalizada para turma_especifica
 */
export const validateComunicadoForm = (data: ComunicadoFormData): { valid: boolean; error?: string } => {
  if (data.destinatarios === 'turma_especifica' && !data.turma_id) {
    return { valid: false, error: 'Selecione uma turma' };
  }
  
  if (data.destinatarios === 'individual' && !data.aluno_id) {
    return { valid: false, error: 'Selecione um aluno' };
  }
  
  return { valid: true };
};

/**
 * Schema para responder comunicado
 */
export const respostaComunicadoSchema = z.object({
  comunicado_id: z.string(),
  mensagem: z.string()
    .min(10, 'Resposta deve ter no mínimo 10 caracteres')
    .max(1000, 'Resposta deve ter no máximo 1000 caracteres')
});

export type RespostaComunicadoFormData = z.infer<typeof respostaComunicadoSchema>;

/**
 * Schema para marcar como lido
 */
export const leituraComunicadoSchema = z.object({
  comunicado_id: z.string(),
  usuario_id: z.string(),
  data_leitura: z.date()
});

export type LeituraComunicadoData = z.infer<typeof leituraComunicadoSchema>;

/**
 * Helper para contar destinatários
 */
export const calcularDestinatarios = (
  tipo: string,
  turmaId?: string,
  alunos?: any[],
  professores?: any[]
): number => {
  if (tipo === 'todos_alunos') {
    return alunos?.length || 0;
  }
  
  if (tipo === 'todos_professores') {
    return professores?.length || 0;
  }
  
  if (tipo === 'turma_especifica' && turmaId && alunos) {
    return alunos.filter(a => 
      a.matricula?.turma_id === turmaId && a.matricula?.status === 'ativo'
    ).length;
  }
  
  if (tipo === 'individual') {
    return 1;
  }
  
  return 0;
};

/**
 * Helper para verificar se usuário pode ver o comunicado
 */
export const podeVerComunicado = (
  comunicado: any,
  usuarioId: string,
  usuarioRole: string,
  turmaId?: string
): boolean => {
  // Gestor vê tudo
  if (usuarioRole === 'gestor') {
    return true;
  }
  
  // Remetente sempre vê o próprio comunicado
  if (comunicado.remetente_id === usuarioId) {
    return true;
  }
  
  // Professor vê comunicados para todos professores
  if (usuarioRole === 'professor' && comunicado.destinatarios === 'todos_professores') {
    return true;
  }
  
  // Aluno vê comunicados para todos alunos
  if (usuarioRole === 'aluno' && comunicado.destinatarios === 'todos_alunos') {
    return true;
  }
  
  // Comunicado para turma específica
  if (comunicado.destinatarios === 'turma_especifica') {
    return comunicado.turma_id === turmaId;
  }
  
  // Comunicado individual
  if (comunicado.destinatarios === 'individual') {
    return comunicado.aluno_id === usuarioId;
  }
  
  return false;
};

/**
 * Helper para formatar tipo de destinatário
 */
export const formatarDestinatarios = (tipo: string, turma?: any): string => {
  const tipos: Record<string, string> = {
    'todos_alunos': 'Todos os Alunos',
    'todos_professores': 'Todos os Professores',
    'turma_especifica': turma ? `Turma: ${turma.nome}` : 'Turma Específica',
    'individual': 'Aluno Específico'
  };
  
  return tipos[tipo] || tipo;
};

/**
 * Helper para cor do badge de prioridade
 */
export const getPrioridadeColor = (prioridade: string): string => {
  const cores: Record<string, string> = {
    'baixa': 'bg-gray-100 text-gray-800',
    'normal': 'bg-blue-100 text-blue-800',
    'alta': 'bg-orange-100 text-orange-800',
    'urgente': 'bg-red-100 text-red-800'
  };
  
  return cores[prioridade] || cores['normal'];
};

/**
 * Helper para ícone de prioridade
 */
export const getPrioridadeIcon = (prioridade: string): string => {
  const icones: Record<string, string> = {
    'baixa': 'MessageCircle',
    'normal': 'Mail',
    'alta': 'AlertCircle',
    'urgente': 'AlertTriangle'
  };
  
  return icones[prioridade] || icones['normal'];
};
