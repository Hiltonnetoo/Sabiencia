// ============================================
// CALCULATIONS - Cálculos acadêmicos
// ============================================

import type { Nota, Frequencia } from '../types';

/**
 * Calcula média ponderada das notas
 */
export const calculateMedia = (notas: Nota[]): number => {
  if (notas.length === 0) return 0;
  
  const somaPonderada = notas.reduce((acc, nota) => acc + (nota.nota * nota.peso), 0);
  const somaPesos = notas.reduce((acc, nota) => acc + nota.peso, 0);
  
  if (somaPesos === 0) return 0;
  
  return Number((somaPonderada / somaPesos).toFixed(1));
};

/**
 * Calcula média simples das notas
 */
export const calculateMediaSimples = (notas: number[]): number => {
  if (notas.length === 0) return 0;
  
  const soma = notas.reduce((acc, nota) => acc + nota, 0);
  return Number((soma / notas.length).toFixed(1));
};

/**
 * Calcula média de 3 notas (AV1, AV2, AV3)
 * Usado para cálculos em relatórios
 */
export const calcularMediaNotas = (
  av1: number | null,
  av2: number | null,
  av3: number | null
): number => {
  const notas = [av1, av2, av3].filter((n): n is number => n !== null);
  
  if (notas.length === 0) return 0;
  
  const soma = notas.reduce((acc, nota) => acc + nota, 0);
  return Number((soma / notas.length).toFixed(2));
};

/**
 * Calcula percentual de frequência (presencas / total_aulas)
 * Usado para cálculos em relatórios
 */
export const calcularPercentualFrequencia = (
  presencas: number,
  total_aulas: number
): number => {
  if (total_aulas === 0) return 0;
  
  return Number(((presencas / total_aulas) * 100).toFixed(1));
};

/**
 * Calcula percentual de frequência
 */
export const calculateFrequenciaPercentual = (
  frequencias: Frequencia[]
): number => {
  if (frequencias.length === 0) return 0;
  
  const presencas = frequencias.filter(
    f => f.status === 'presente' || f.status === 'justificado'
  ).length;
  
  return Number(((presencas / frequencias.length) * 100).toFixed(1));
};

/**
 * Calcula apenas presençs (sem justificativas)
 */
export const calculatePresencasEfetivas = (
  frequencias: Frequencia[]
): number => {
  if (frequencias.length === 0) return 0;
  
  const presencas = frequencias.filter(f => f.status === 'presente').length;
  
  return Number(((presencas / frequencias.length) * 100).toFixed(1));
};

/**
 * Determina situação do aluno baseado na média
 */
export const calculateSituacao = (
  media: number,
  notaMinima: number = 6.0
): 'aprovado' | 'recuperacao' | 'reprovado' => {
  if (media >= notaMinima) return 'aprovado';
  if (media >= notaMinima - 1) return 'recuperacao';
  return 'reprovado';
};

/**
 * Determina situação considerando frequência
 */
export const calculateSituacaoCompleta = (
  media: number,
  frequencia: number,
  notaMinima: number = 6.0,
  frequenciaMinima: number = 75
): 'aprovado' | 'recuperacao' | 'reprovado_nota' | 'reprovado_frequencia' => {
  if (frequencia < frequenciaMinima) return 'reprovado_frequencia';
  if (media >= notaMinima) return 'aprovado';
  if (media >= notaMinima - 1) return 'recuperacao';
  return 'reprovado_nota';
};

/**
 * Retorna cor baseada no status
 */
export const getStatusColor = (
  status: 'aprovado' | 'recuperacao' | 'reprovado' | 'reprovado_nota' | 'reprovado_frequencia' | string
): string => {
  const colors: Record<string, string> = {
    aprovado: 'text-green-600',
    recuperacao: 'text-yellow-600',
    reprovado: 'text-red-600',
    reprovado_nota: 'text-red-600',
    reprovado_frequencia: 'text-red-600',
    ativo: 'text-green-600',
    trancado: 'text-gray-600',
    concluido: 'text-blue-600',
    evadido: 'text-red-600',
    pendente: 'text-yellow-600',
    pago: 'text-green-600',
    vencido: 'text-red-600',
    cancelado: 'text-gray-600'
  };
  
  return colors[status] || 'text-gray-600';
};

/**
 * Retorna cor de fundo baseada no status
 */
export const getStatusBgColor = (status: string): string => {
  const colors: Record<string, string> = {
    aprovado: 'bg-green-100',
    recuperacao: 'bg-yellow-100',
    reprovado: 'bg-red-100',
    reprovado_nota: 'bg-red-100',
    reprovado_frequencia: 'bg-red-100',
    ativo: 'bg-green-100',
    trancado: 'bg-gray-100',
    concluido: 'bg-blue-100',
    evadido: 'bg-red-100',
    pendente: 'bg-yellow-100',
    pago: 'bg-green-100',
    vencido: 'bg-red-100',
    cancelado: 'bg-gray-100',
    presente: 'bg-green-100',
    ausente: 'bg-red-100',
    justificado: 'bg-yellow-100'
  };
  
  return colors[status] || 'bg-gray-100';
};

/**
 * Calcula pontos necessários para aprovação
 */
export const calculatePontosNecessarios = (
  notasAtuais: Nota[],
  notaMinima: number = 6.0,
  pesoRestante: number
): number => {
  if (pesoRestante === 0) return 0;
  
  const mediaAtual = calculateMedia(notasAtuais);
  const somaPesos = notasAtuais.reduce((acc, nota) => acc + nota.peso, 0);
  const pesoTotal = somaPesos + pesoRestante;
  
  const pontosNecessarios = (notaMinima * pesoTotal) - (mediaAtual * somaPesos);
  
  return Math.max(0, Number((pontosNecessarios / pesoRestante).toFixed(1)));
};

/**
 * Calcula dias entre duas datas
 */
export const calculateDaysBetween = (
  date1: Date | string,
  date2: Date | string
): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Calcula progresso percentual entre duas datas
 */
export const calculateProgressBetweenDates = (
  startDate: Date | string,
  endDate: Date | string,
  currentDate: Date | string = new Date()
): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const current = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;
  
  const total = end.getTime() - start.getTime();
  const elapsed = current.getTime() - start.getTime();
  
  if (total <= 0) return 0;
  if (elapsed <= 0) return 0;
  if (elapsed >= total) return 100;
  
  return Number(((elapsed / total) * 100).toFixed(1));
};

/**
 * Verifica se data está vencida
 */
export const isOverdue = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
};

/**
 * Calcula total de faltas
 */
export const calculateTotalFaltas = (frequencias: Frequencia[]): number => {
  return frequencias.filter(f => f.status === 'ausente').length;
};

/**
 * Calcula total de presenças
 */
export const calculateTotalPresencas = (frequencias: Frequencia[]): number => {
  return frequencias.filter(f => f.status === 'presente').length;
};

/**
 * Calcula quantas faltas o aluno ainda pode ter
 */
export const calculateFaltasPermitidas = (
  totalAulas: number,
  frequenciaMinima: number = 75
): number => {
  return Math.floor(totalAulas * (1 - frequenciaMinima / 100));
};

/**
 * Verifica se aluno está em risco de reprovação por frequência
 */
export const isFrequenciaEmRisco = (
  frequencias: Frequencia[],
  frequenciaMinima: number = 75
): boolean => {
  const percentual = calculateFrequenciaPercentual(frequencias);
  return percentual < frequenciaMinima + 5; // Margem de segurança de 5%
};

/**
 * Calcula ranking de alunos por média
 */
export const calculateRanking = (
  alunos: Array<{ id: string; media: number }>
): Array<{ id: string; media: number; posicao: number }> => {
  const sorted = [...alunos].sort((a, b) => b.media - a.media);
  
  return sorted.map((aluno, index) => ({
    ...aluno,
    posicao: index + 1
  }));
};

/**
 * Calcula distribuição de notas (para gráficos)
 */
export const calculateNotasDistribution = (
  notas: number[]
): { faixa: string; quantidade: number }[] => {
  const distribution = [
    { faixa: '0-2', quantidade: 0 },
    { faixa: '2-4', quantidade: 0 },
    { faixa: '4-6', quantidade: 0 },
    { faixa: '6-8', quantidade: 0 },
    { faixa: '8-10', quantidade: 0 }
  ];
  
  notas.forEach(nota => {
    if (nota >= 0 && nota < 2) distribution[0].quantidade++;
    else if (nota >= 2 && nota < 4) distribution[1].quantidade++;
    else if (nota >= 4 && nota < 6) distribution[2].quantidade++;
    else if (nota >= 6 && nota < 8) distribution[3].quantidade++;
    else if (nota >= 8 && nota <= 10) distribution[4].quantidade++;
  });
  
  return distribution;
};
