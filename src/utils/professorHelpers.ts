// ============================================
// PROFESSOR HELPERS - Funções auxiliares para professores
// ============================================

import type { Professor, Turma, ProfessorTurmaDisciplina } from '../types';

/**
 * Obtém turmas de um professor
 * @param professorId - ID do professor
 * @param turmas - Array de turmas
 * @param atribuicoes - Array de atribuições professor-turma-disciplina
 * @returns Array de turmas do professor
 */
export const getTurmasProfessor = (
  professorId: string,
  turmas: Turma[],
  atribuicoes: ProfessorTurmaDisciplina[]
): Turma[] => {
  const atribuicoesProfessor = atribuicoes.filter(
    a => a.professor_id === professorId
  );
  
  const turmasIds = [...new Set(atribuicoesProfessor.map(a => a.turma_id))];
  
  return turmas.filter(t => turmasIds.includes(t.id));
};

/**
 * Obtém disciplinas de um professor em uma turma específica
 * @param professorId - ID do professor
 * @param turmaId - ID da turma
 * @param atribuicoes - Array de atribuições professor-turma-disciplina
 * @returns Array de IDs de disciplinas
 */
export const getDisciplinasProfessorNaTurma = (
  professorId: string,
  turmaId: string,
  atribuicoes: ProfessorTurmaDisciplina[]
): string[] => {
  return atribuicoes
    .filter(a => a.professor_id === professorId && a.turma_id === turmaId)
    .map(a => a.disciplina_id);
};

/**
 * Verifica se um professor está ativo
 * @param professor - Professor
 * @returns true se o professor está ativo
 */
export const isProfessorAtivo = (professor: Professor): boolean => {
  return professor.ativo;
};

/**
 * Conta turmas de um professor
 * @param professorId - ID do professor
 * @param atribuicoes - Array de atribuições professor-turma-disciplina
 * @returns Número de turmas únicas
 */
export const countTurmasProfessor = (
  professorId: string,
  atribuicoes: ProfessorTurmaDisciplina[]
): number => {
  const atribuicoesProfessor = atribuicoes.filter(
    a => a.professor_id === professorId
  );
  
  const turmasIds = new Set(atribuicoesProfessor.map(a => a.turma_id));
  
  return turmasIds.size;
};

/**
 * Filtra professores por especialidade
 * @param professores - Array de professores
 * @param especialidade - Especialidade a filtrar
 * @returns Array de professores com a especialidade
 */
export const filterProfessoresByEspecialidade = (
  professores: Professor[],
  especialidade: string
): Professor[] => {
  return professores.filter(p => 
    p.especialidades.includes(especialidade)
  );
};

/**
 * Conta professores ativos
 * @param professores - Array de professores
 * @returns Número de professores ativos
 */
export const countProfessoresAtivos = (
  professores: Professor[]
): number => {
  return professores.filter(p => p.ativo).length;
};
