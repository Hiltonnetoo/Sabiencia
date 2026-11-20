// ============================================
// INTEGRATION TEST: Jornada Persistente (Fase 2)
// Testa fluxo completo: Gestor matricula -> Professor lança notas/presença -> Aluno consulta
// E valida a persistência no localStorage com capacidade de restore
// ============================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockDataProvider, useMockData, MOCK_DATA_STORAGE_KEY } from '../../contexts/MockDataContext';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { isDemoMode, getAppMode } from '../../config/appMode';

// Mock localStorage para ambiente de teste
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <MockDataProvider>{children}</MockDataProvider>
  </AuthProvider>
);

describe('Fase 2: Modo Demo e Jornada Persistente', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve confirmar que o modo demo está ativo por padrão sem backend', () => {
    expect(isDemoMode()).toBe(true);
    expect(getAppMode()).toBe('demo');
  });

  it('deve realizar login demo local sem chamadas remotas de rede', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult: { success: boolean; error?: string } = { success: false };
    await act(async () => {
      loginResult = await result.current.login('000.000.000-01', 'gestor123');
    });

    expect(loginResult.success).toBe(true);
    expect(result.current.user).toBeDefined();
    expect(result.current.user?.role).toBe('gestor');
    expect(result.current.user?.nome_completo).toBe('Gestor Demo');
  });

  it('deve executar a jornada completa conectada: Gestor matricula -> Professor avalia -> Aluno consulta', () => {
    const { result } = renderHook(() => useMockData(), { wrapper });

    // 1. GESTOR: Cadastra novo aluno
    let novoAlunoId = '';
    act(() => {
      const aluno = result.current.createAluno({
        nome_completo: 'Carlos Eduardo Teste',
        cpf: '12345678909',
        email: 'carlos.eduardo@teste.com',
        telefone: '(11) 98888-7777',
        role: 'aluno',
        ativo: true,
      });
      novoAlunoId = aluno.id;
    });

    expect(novoAlunoId).toBeTruthy();
    expect(result.current.getAlunoById(novoAlunoId)?.nome_completo).toBe('Carlos Eduardo Teste');

    // 2. GESTOR: Matricula aluno na turma 'turma-001' (Técnico em Enfermagem - Manhã)
    let novaMatriculaId = '';
    act(() => {
      const matricula = result.current.createMatricula({
        aluno_id: novoAlunoId,
        turma_id: 'turma-001',
        status: 'ativo',
      });
      novaMatriculaId = matricula.id;
    });

    expect(novaMatriculaId).toBeTruthy();
    const matriculasAluno = result.current.getMatriculasByAlunoId(novoAlunoId);
    expect(matriculasAluno).toHaveLength(1);
    expect(matriculasAluno[0].turma_id).toBe('turma-001');

    // 3. PROFESSOR: Lança nota em lote para a turma-001 / disc-001
    act(() => {
      result.current.lancarNotasEmLote({
        turma_id: 'turma-001',
        disciplina_id: 'disc-001',
        professor_id: 'prof-001',
        tipo_avaliacao: 'AV1',
        peso: 1,
        data_avaliacao: new Date('2026-05-15'),
        notas: [
          { aluno_id: novoAlunoId, nota: 9.5, observacao: 'Excelente desempenho prático' },
        ],
      });
    });

    // 4. PROFESSOR: Lança presença em lote
    act(() => {
      result.current.registrarFrequenciasEmLote({
        turma_id: 'turma-001',
        disciplina_id: 'disc-001',
        professor_id: 'prof-001',
        data_aula: new Date('2026-05-15'),
        presencas: [
          { aluno_id: novoAlunoId, status: 'presente' },
        ],
      });
    });

    // 5. ALUNO: Consulta notas e presença lançadas
    const notasDoAluno = result.current.notas.filter(n => n.aluno_id === novoAlunoId);
    expect(notasDoAluno).toHaveLength(1);
    expect(notasDoAluno[0].nota).toBe(9.5);
    expect(notasDoAluno[0].tipo_avaliacao).toBe('AV1');
    expect(notasDoAluno[0].disciplina_id).toBe('disc-001');

    const frequenciasDoAluno = result.current.frequencias.filter(f => f.aluno_id === novoAlunoId);
    expect(frequenciasDoAluno).toHaveLength(1);
    expect(frequenciasDoAluno[0].status).toBe('presente');

    // 6. PERSISTÊNCIA: Verifica que os dados foram serializados no localStorage
    const savedRaw = localStorage.getItem(MOCK_DATA_STORAGE_KEY);
    expect(savedRaw).toBeTruthy();
    const savedParsed = JSON.parse(savedRaw!);
    expect(savedParsed.version).toBe(1);
    expect(savedParsed.data.alunos.some((a: any) => a.id === novoAlunoId)).toBe(true);
    expect(savedParsed.data.matriculas.some((m: any) => m.aluno_id === novoAlunoId)).toBe(true);
    expect(savedParsed.data.notas.some((n: any) => n.aluno_id === novoAlunoId && n.nota === 9.5)).toBe(true);
  });

  it('deve restaurar dados no reload do MockDataProvider com instâncias de Date válidas', () => {
    // Primeiro salva dados no storage
    const customAluno = {
      id: 'aluno-custom-persisted',
      nome_completo: 'Aluno Persistido',
      cpf: '99988877766',
      email: 'persistido@demo.local',
      role: 'aluno',
      ativo: true,
      created_at: new Date('2026-01-10T10:00:00.000Z'),
    };

    const customMatricula = {
      id: 'matr-custom-persisted',
      aluno_id: 'aluno-custom-persisted',
      turma_id: 'turma-001',
      data_matricula: new Date('2026-01-15T08:00:00.000Z'),
      status: 'ativo' as const,
      created_at: new Date('2026-01-15T08:00:00.000Z'),
    };

    localStorage.setItem(
      MOCK_DATA_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        timestamp: Date.now(),
        data: {
          alunos: [customAluno],
          matriculas: [customMatricula],
          notas: [],
          frequencias: [],
        },
      })
    );

    // Monta o provider novamente
    const { result } = renderHook(() => useMockData(), { wrapper });

    const alunoCarregado = result.current.getAlunoById('aluno-custom-persisted');
    expect(alunoCarregado).toBeDefined();
    expect(alunoCarregado?.nome_completo).toBe('Aluno Persistido');
    expect(alunoCarregado?.created_at).toBeInstanceOf(Date);

    const matriculaCarregada = result.current.matriculas.find(m => m.id === 'matr-custom-persisted');
    expect(matriculaCarregada).toBeDefined();
    expect(matriculaCarregada?.data_matricula).toBeInstanceOf(Date);
  });

  it('deve restaurar para o estado inicial padrão ao chamar resetMockData()', () => {
    const { result } = renderHook(() => useMockData(), { wrapper });

    // Cria um aluno temporário
    act(() => {
      result.current.createAluno({
        nome_completo: 'Temporário Para Excluir',
        cpf: '00011122233',
        email: 'temp@demo.local',
        role: 'aluno',
        ativo: true,
      });
    });

    expect(result.current.alunos.some(a => a.nome_completo === 'Temporário Para Excluir')).toBe(true);

    // Executa reset
    act(() => {
      result.current.resetMockData();
    });

    // O aluno temporário não deve mais existir
    expect(result.current.alunos.some(a => a.nome_completo === 'Temporário Para Excluir')).toBe(false);
  });
});
