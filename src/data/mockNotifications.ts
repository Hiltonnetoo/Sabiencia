// ============================================
// MOCK NOTIFICATIONS - Notificações mockadas
// ============================================

import type { Notificacao } from '../types';

export const mockNotifications: Notificacao[] = [
  // Notificações para Aluno
  {
    id: 'notif-001',
    usuario_id: 'aluno-001',
    tipo: 'nota',
    prioridade: 'success',
    titulo: 'Nova nota lançada',
    mensagem: 'O professor lançou a nota da prova de Anatomia - 8.5',
    link: '/aluno/notas',
    lida: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
  },
  {
    id: 'notif-002',
    usuario_id: 'aluno-001',
    tipo: 'comunicado',
    prioridade: 'warning',
    titulo: 'Novo comunicado importante',
    mensagem: 'Atenção: Prova presencial agendada para 15/11/2025',
    link: '/aluno/comunicados',
    lida: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
  },
  {
    id: 'notif-003',
    usuario_id: 'aluno-001',
    tipo: 'financeiro',
    prioridade: 'error',
    titulo: 'Pagamento vencido',
    mensagem: 'Sua mensalidade de outubro está vencida. Regularize para evitar bloqueios',
    link: '/aluno/financeiro',
    lida: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
  },
  {
    id: 'notif-004',
    usuario_id: 'aluno-001',
    tipo: 'material',
    prioridade: 'info',
    titulo: 'Novo material disponível',
    mensagem: 'Apostila Módulo 3 - Farmacologia foi adicionada à biblioteca',
    link: '/aluno/materiais',
    lida: true,
    data_leitura: new Date(Date.now() - 1000 * 60 * 60 * 12),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
  },
  {
    id: 'notif-005',
    usuario_id: 'aluno-001',
    tipo: 'frequencia',
    prioridade: 'warning',
    titulo: 'Alerta de frequência',
    mensagem: 'Você tem 3 faltas em Primeiros Socorros. Atenção ao limite!',
    link: '/aluno/frequencia',
    lida: true,
    data_leitura: new Date(Date.now() - 1000 * 60 * 60 * 48),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 dias atrás
  },

  // Notificações para Professor
  {
    id: 'notif-101',
    usuario_id: 'prof-001',
    tipo: 'academico',
    prioridade: 'info',
    titulo: 'Prazo para lançamento de notas',
    mensagem: 'Você tem até 10/11/2025 para lançar as notas da Turma A - Manhã',
    link: '/professor/notas',
    lida: false,
    created_at: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos atrás
  },
  {
    id: 'notif-102',
    usuario_id: 'prof-001',
    tipo: 'comunicado',
    prioridade: 'info',
    titulo: 'Reunião pedagógica',
    mensagem: 'Reunião pedagógica agendada para 08/11/2025 às 14h',
    link: '/professor/comunicados',
    lida: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 horas atrás
  },
  {
    id: 'notif-103',
    usuario_id: 'prof-001',
    tipo: 'sistema',
    prioridade: 'success',
    titulo: 'Frequência registrada',
    mensagem: 'Frequência da aula de 05/11/2025 foi registrada com sucesso',
    link: '/professor/frequencia',
    lida: true,
    data_leitura: new Date(Date.now() - 1000 * 60 * 60 * 6),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
  },
  {
    id: 'notif-104',
    usuario_id: 'prof-001',
    tipo: 'material',
    prioridade: 'info',
    titulo: 'Material compartilhado',
    mensagem: 'Seu material "Apostila Módulo 3" foi compartilhado com a turma',
    link: '/professor/materiais',
    lida: true,
    data_leitura: new Date(Date.now() - 1000 * 60 * 60 * 30),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
  },

  // Notificações para Gestor
  {
    id: 'notif-201',
    usuario_id: 'gestor-001',
    tipo: 'financeiro',
    prioridade: 'warning',
    titulo: 'Pagamentos pendentes',
    mensagem: '15 alunos com mensalidades vencidas neste mês',
    link: '/gestor/financeiro',
    lida: false,
    created_at: new Date(Date.now() - 1000 * 60 * 20), // 20 minutos atrás
  },
  {
    id: 'notif-202',
    usuario_id: 'gestor-001',
    tipo: 'academico',
    prioridade: 'info',
    titulo: 'Novo aluno matriculado',
    mensagem: 'João Silva foi matriculado no curso de Enfermagem',
    link: '/gestor/alunos',
    lida: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 horas atrás
  },
  {
    id: 'notif-203',
    usuario_id: 'gestor-001',
    tipo: 'sistema',
    prioridade: 'error',
    titulo: 'Ação necessária',
    mensagem: 'Professor João Silva não lançou frequência há 5 dias',
    link: '/gestor/professores',
    lida: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 horas atrás
  },
  {
    id: 'notif-204',
    usuario_id: 'gestor-001',
    tipo: 'academico',
    prioridade: 'success',
    titulo: 'Relatório disponível',
    mensagem: 'Relatório de desempenho mensal está pronto para visualização',
    link: '/gestor/relatorios',
    lida: true,
    data_leitura: new Date(Date.now() - 1000 * 60 * 60 * 24),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
  },
  {
    id: 'notif-205',
    usuario_id: 'gestor-001',
    tipo: 'comunicado',
    prioridade: 'warning',
    titulo: 'Comunicado urgente pendente',
    mensagem: '1 comunicado urgente aguarda aprovação',
    link: '/gestor/comunicados',
    lida: true,
    data_leitura: new Date(Date.now() - 1000 * 60 * 60 * 36),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 dias atrás
  },
];
