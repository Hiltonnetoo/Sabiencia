import { useCallback } from 'react';
import { useMockData } from '../contexts/MockDataContext';
import { getAlunoDetails } from '../utils/alunoHelpers';

export function useAlunosComMatricula() {
  const { alunos, matriculas, turmas, cursos } = useMockData();

  const getDetails = useCallback(
    (alunoId: string) => getAlunoDetails(alunoId, matriculas, turmas, cursos),
    [matriculas, turmas, cursos]
  );

  return { alunos, getDetails };
}
