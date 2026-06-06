// ============================================
// ALUNO HELPERS - Funções auxiliares para alunos
// ============================================

import type { Aluno, Matricula, Turma, Curso } from '../types';

/**
 * Obtém detalhes completos de um aluno incluindo matrícula, turma e curso
 * @param alunoId - ID do aluno
 * @param matriculas - Array de matrículas
 * @param turmas - Array de turmas
 * @param cursos - Array de cursos
 * @returns Objeto com curso, turma e status do aluno
 */
export const getAlunoDetails = (
  alunoId: string,
  matriculas: Matricula[],
  turmas: Turma[],
  cursos: Curso[]
) => {
  const matricula = matriculas.find(m => m.aluno_id === alunoId);
  
  if (!matricula) {
    return { 
      curso: null, 
      turma: null, 
      status: 'inativo' as const 
    };
  }

  const turma = turmas.find(t => t.id === matricula.turma_id);
  const curso = turma ? cursos.find(c => c.id === turma.curso_id) : null;

  return {
    curso,
    turma,
    status: matricula.status,
  };
};

/**
 * Obtém matrícula ativa de um aluno
 * @param alunoId - ID do aluno
 * @param matriculas - Array de matrículas
 * @returns Matrícula ativa ou null
 */
export const getMatriculaAtiva = (
  alunoId: string,
  matriculas: Matricula[]
): Matricula | null => {
  return matriculas.find(
    m => m.aluno_id === alunoId && m.status === 'ativo'
  ) || null;
};

/**
 * Verifica se um aluno está ativo
 * @param alunoId - ID do aluno
 * @param matriculas - Array de matrículas
 * @returns true se o aluno tem matrícula ativa
 */
export const isAlunoAtivo = (
  alunoId: string,
  matriculas: Matricula[]
): boolean => {
  const matricula = getMatriculaAtiva(alunoId, matriculas);
  return matricula !== null;
};

/**
 * Obtém todos os alunos de uma turma
 * @param turmaId - ID da turma
 * @param alunos - Array de alunos
 * @param matriculas - Array de matrículas
 * @returns Array de alunos da turma
 */
export const getAlunosDaTurma = (
  turmaId: string,
  alunos: Aluno[],
  matriculas: Matricula[]
): Aluno[] => {
  const alunosIds = matriculas
    .filter(m => m.turma_id === turmaId)
    .map(m => m.aluno_id);

  return alunos.filter(a => alunosIds.includes(a.id));
};

/**
 * Conta alunos ativos
 * @param alunos - Array de alunos
 * @param matriculas - Array de matrículas
 * @returns Número de alunos ativos
 */
export const countAlunosAtivos = (
  alunos: Aluno[],
  matriculas: Matricula[]
): number => {
  return alunos.filter(a => isAlunoAtivo(a.id, matriculas)).length;
};
