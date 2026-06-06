import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── mock do cliente Supabase ─────────────────────────────────────────────────

const mockSingle = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn();

// A cadeia retorna `this` para métodos intermediários e uma Promise nos terminais
const chain = {
  select: (...args: unknown[]) => { mockSelect(...args); return chain; },
  eq: (...args: unknown[]) => { mockEq(...args); return chain; },
  order: (...args: unknown[]) => { mockOrder(...args); return chain; },
  single: () => mockSingle(),
  insert: (...args: unknown[]) => { mockInsert(...args); return chain; },
  update: (...args: unknown[]) => { mockUpdate(...args); return chain; },
};

mockFrom.mockReturnValue(chain);

vi.mock('../../lib/supabase', () => ({
  supabase: { from: mockFrom },
}));

// ─── imports após o mock ──────────────────────────────────────────────────────

import {
  getAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno,
  getProfessores,
} from '../../services/supabaseData';

// ─── helpers ──────────────────────────────────────────────────────────────────

const mockAluno = {
  id: 'a1',
  cpf: '12345678901',
  email: 'joao@test.com',
  role: 'aluno',
  nome_completo: 'João Teste',
  ativo: true,
  data_nascimento: new Date('2000-01-01'),
  created_at: new Date(),
};

const mockProfessor = {
  id: 'p1',
  cpf: '11111111111',
  email: 'prof@test.com',
  role: 'professor',
  nome_completo: 'Prof. Teste',
  ativo: true,
  especialidades: ['Matemática'],
  formacao: 'Licenciatura em Matemática',
  created_at: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockFrom.mockReturnValue(chain);
});

// ─── getAlunos ────────────────────────────────────────────────────────────────

describe('getAlunos', () => {
  it('retorna lista de alunos quando Supabase responde com sucesso', async () => {
    mockOrder.mockResolvedValueOnce({ data: [mockAluno], error: null });

    const result = await getAlunos();

    expect(mockFrom).toHaveBeenCalledWith('alunos');
    expect(result).toHaveLength(1);
    expect(result[0].nome_completo).toBe('João Teste');
  });

  it('retorna lista vazia quando data é null', async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: null });

    const result = await getAlunos();
    expect(result).toEqual([]);
  });

  it('relança o erro do Supabase em vez de engolir', async () => {
    const supabaseError = { message: 'connection refused', code: '500' };
    mockOrder.mockResolvedValueOnce({ data: null, error: supabaseError });

    await expect(getAlunos()).rejects.toEqual(supabaseError);
  });

  it('relança erros de rede (exceções JS)', async () => {
    mockOrder.mockRejectedValueOnce(new Error('Network error'));

    await expect(getAlunos()).rejects.toThrow('Network error');
  });
});

// ─── getAlunoById ─────────────────────────────────────────────────────────────

describe('getAlunoById', () => {
  it('retorna aluno quando encontrado', async () => {
    mockSingle.mockResolvedValueOnce({ data: mockAluno, error: null });

    const result = await getAlunoById('a1');

    expect(mockFrom).toHaveBeenCalledWith('alunos');
    expect(result?.nome_completo).toBe('João Teste');
  });

  it('retorna null quando aluno não existe', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: null });

    const result = await getAlunoById('inexistente');
    expect(result).toBeNull();
  });

  it('relança erro do Supabase (não retorna null silenciosamente)', async () => {
    const supabaseError = { message: 'not found', code: 'PGRST116' };
    mockSingle.mockResolvedValueOnce({ data: null, error: supabaseError });

    await expect(getAlunoById('a1')).rejects.toEqual(supabaseError);
  });
});

// ─── createAluno ──────────────────────────────────────────────────────────────

describe('createAluno', () => {
  it('cria aluno e retorna o registro inserido', async () => {
    mockSingle.mockResolvedValueOnce({ data: mockAluno, error: null });

    const result = await createAluno({ nome_completo: 'João Teste', cpf: '12345678901' });

    expect(mockFrom).toHaveBeenCalledWith('alunos');
    expect(mockInsert).toHaveBeenCalled();
    expect(result?.nome_completo).toBe('João Teste');
  });

  it('relança erro de constraint único (CPF duplicado)', async () => {
    const uniqueError = { message: 'duplicate key value', code: '23505' };
    mockSingle.mockResolvedValueOnce({ data: null, error: uniqueError });

    await expect(createAluno({ cpf: '12345678901' })).rejects.toEqual(uniqueError);
  });
});

// ─── updateAluno ──────────────────────────────────────────────────────────────

describe('updateAluno', () => {
  it('atualiza aluno e retorna o registro atualizado', async () => {
    const updated = { ...mockAluno, nome_completo: 'João Atualizado' };
    mockSingle.mockResolvedValueOnce({ data: updated, error: null });

    const result = await updateAluno('a1', { nome_completo: 'João Atualizado' });

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 'a1');
    expect(result?.nome_completo).toBe('João Atualizado');
  });

  it('relança erro se registro não encontrado', async () => {
    const notFoundError = { message: 'no rows returned', code: 'PGRST116' };
    mockSingle.mockResolvedValueOnce({ data: null, error: notFoundError });

    await expect(updateAluno('inexistente', {})).rejects.toEqual(notFoundError);
  });
});

// ─── deleteAluno (soft-delete) ────────────────────────────────────────────────

describe('deleteAluno', () => {
  it('retorna true ao fazer soft-delete com sucesso', async () => {
    // deleteAluno usa update({ ativo: false }) sem .single(), portanto
    // a promise termina em .eq() que retorna uma Promise via chain
    mockEq.mockResolvedValueOnce({ error: null });

    const result = await deleteAluno('a1');

    expect(mockUpdate).toHaveBeenCalledWith({ ativo: false });
    expect(result).toBe(true);
  });

  it('relança erro quando Supabase falha', async () => {
    const deleteError = { message: 'permission denied', code: '42501' };
    mockEq.mockResolvedValueOnce({ error: deleteError });

    await expect(deleteAluno('a1')).rejects.toEqual(deleteError);
  });
});

// ─── getProfessores ───────────────────────────────────────────────────────────

describe('getProfessores', () => {
  it('retorna lista de professores', async () => {
    mockOrder.mockResolvedValueOnce({ data: [mockProfessor], error: null });

    const result = await getProfessores();

    expect(mockFrom).toHaveBeenCalledWith('professores');
    expect(result).toHaveLength(1);
    expect(result[0].especialidades).toEqual(['Matemática']);
  });

  it('retorna lista vazia quando não há professores', async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: null });

    const result = await getProfessores();
    expect(result).toEqual([]);
  });

  it('relança erros do Supabase', async () => {
    const err = { message: 'table not found', code: '42P01' };
    mockOrder.mockResolvedValueOnce({ data: null, error: err });

    await expect(getProfessores()).rejects.toEqual(err);
  });
});
