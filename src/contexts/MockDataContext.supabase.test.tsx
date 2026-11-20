// ============================================
// MockDataProvider em VITE_APP_MODE=supabase
// Os dados vêm do banco (snapshot) e as escritas da jornada vão para o banco;
// nada de fixture demo e nada no localStorage.
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('../config/appMode', () => ({
  getAppMode: () => 'supabase',
  isDemoMode: () => false,
  isSupabaseMode: () => true,
}));

vi.mock('../lib/supabase', () => ({ supabase: {} }));

vi.mock('./AuthContext', () => ({
  useOptionalAuth: () => ({ user: { id: 'prof-uuid', role: 'professor' } }),
}));

const repo = vi.hoisted(() => ({
  fetchAcademicSnapshot: vi.fn(),
  insertAluno: vi.fn(),
  insertMatricula: vi.fn(),
  updateAlunoRow: vi.fn(),
  updateMatriculaTurma: vi.fn(),
  upsertNotas: vi.fn(),
  upsertFrequencias: vi.fn(),
}));
vi.mock('../services/academicRepository', () => repo);

import { MockDataProvider, useMockData, MOCK_DATA_STORAGE_KEY } from './MockDataContext';

const turma = {
  id: 't1', curso_id: 'c1', nome: 'Turma Real', periodo: 'manha', ativa: true,
  data_inicio: new Date(), data_fim: new Date(), created_at: new Date(),
};

const snapshot = {
  cursos: [], disciplinas: [], turmas: [turma], alunos: [], professores: [],
  matriculas: [], professorTurmaDisciplina: [], notas: [], frequencias: [],
};

const wrapper = ({ children }: { children: React.ReactNode }) => <MockDataProvider>{children}</MockDataProvider>;

describe('MockDataProvider (modo supabase)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    repo.fetchAcademicSnapshot.mockResolvedValue(snapshot);
  });

  it('carrega o snapshot do banco em vez das fixtures demo', async () => {
    const { result } = renderHook(() => useMockData(), { wrapper });
    expect(result.current.dataSource).toBe('supabase');
    await waitFor(() => expect(result.current.turmas.map(t => t.id)).toEqual(['t1']));
    expect(result.current.alunos).toEqual([]);
    expect(result.current.pagamentos).toEqual([]);
  });

  it('cadastrarAluno grava aluno e matrícula no banco', async () => {
    repo.insertAluno.mockResolvedValue({ id: 'a-uuid', nome_completo: 'Novo', role: 'aluno' });
    repo.insertMatricula.mockResolvedValue({ id: 'm-uuid', aluno_id: 'a-uuid', turma_id: 't1', status: 'ativo' });
    const { result } = renderHook(() => useMockData(), { wrapper });
    await waitFor(() => expect(result.current.turmas).toHaveLength(1));

    await act(async () => {
      await result.current.cadastrarAluno({ nome_completo: 'Novo' } as any, 't1');
    });

    expect(repo.insertMatricula).toHaveBeenCalledWith(expect.anything(), { aluno_id: 'a-uuid', turma_id: 't1', curso_id: 'c1' });
    expect(result.current.alunos.map(a => a.id)).toEqual(['a-uuid']);
    expect(result.current.matriculas.map(m => m.id)).toEqual(['m-uuid']);
    expect(localStorage.getItem(MOCK_DATA_STORAGE_KEY)).toBeNull();
  });

  it('salvarNotas só atualiza o estado com o que o banco confirmou', async () => {
    repo.upsertNotas.mockRejectedValue(new Error('new row violates row-level security policy'));
    const { result } = renderHook(() => useMockData(), { wrapper });
    await waitFor(() => expect(result.current.turmas).toHaveLength(1));

    const params = {
      turma_id: 't1', disciplina_id: 'd1', professor_id: 'prof-uuid', tipo_avaliacao: 'Prova 1',
      peso: 1, data_avaliacao: new Date(), notas: [{ aluno_id: 'a1', nota: 8 }],
    };
    await act(async () => {
      await expect(result.current.salvarNotas(params)).rejects.toThrow(/row-level security/);
    });
    expect(result.current.notas).toEqual([]);
  });
});
