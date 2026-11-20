// ============================================
// academicRepository — o que é enviado ao Supabase e como as linhas voltam
// (a autorização em si é testada contra Postgres real: supabase/tests/rls_test.sql)
// ============================================

import { describe, it, expect } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  fetchAcademicSnapshot,
  insertAluno,
  insertMatricula,
  mapFrequencia,
  toSqlDate,
  upsertFrequencias,
  upsertNotas,
} from './academicRepository';

type Call = { table: string; op: string; payload?: unknown; options?: unknown; filters: unknown[] };

/** Cliente falso: registra as chamadas e devolve linhas pré-definidas por tabela */
function fakeClient(rows: Record<string, unknown[]>, error: string | null = null) {
  const calls: Call[] = [];
  const client = {
    from(table: string) {
      const call: Call = { table, op: 'select', filters: [] };
      calls.push(call);
      const result = () => ({
        data: error ? null : call.op === 'select' ? rows[table] ?? [] : (call.payload as unknown[] | undefined) ?? rows[table] ?? [],
        error: error ? { message: error } : null,
      });
      const builder: any = {
        select: () => builder,
        insert: (payload: unknown) => ((call.op = 'insert'), (call.payload = [payload].flat()), builder),
        update: (payload: unknown) => ((call.op = 'update'), (call.payload = [payload]), builder),
        upsert: (payload: unknown, options: unknown) => ((call.op = 'upsert'), (call.payload = payload), (call.options = options), builder),
        eq: (...args: unknown[]) => (call.filters.push(args), builder),
        single: () => Promise.resolve({ ...result(), data: error ? null : { id: 'novo-id', created_at: '2026-01-01T00:00:00Z', ...(result().data as any[])[0] } }),
        then: (resolve: (v: unknown) => void, reject: (e: unknown) => void) => Promise.resolve(result()).then(resolve, reject),
      };
      return builder;
    },
  };
  return { client: client as unknown as SupabaseClient, calls };
}

describe('academicRepository', () => {
  it('toSqlDate usa a data local, sem deslocamento de fuso', () => {
    expect(toSqlDate(new Date(2026, 4, 15, 23, 30))).toBe('2026-05-15');
  });

  it('fetchAcademicSnapshot separa alunos e professores e converte os tipos', async () => {
    const { client } = fakeClient({
      usuarios: [
        { id: 'a1', nome: 'Ana', email: 'a@x', cpf: '1', role: 'aluno', ativo: true, created_at: '2026-01-01' },
        { id: 'p1', nome: 'Prof', email: 'p@x', cpf: '2', role: 'professor', ativo: true, created_at: '2026-01-01' },
      ],
      notas: [{ id: 'n1', aluno_id: 'a1', disciplina_id: 'd1', turma_id: 't1', nota: '8.50', peso: '1.00', data_avaliacao: '2026-05-15', tipo_avaliacao: 'Prova 1' }],
      matriculas: [{ id: 'm1', aluno_id: 'a1', turma_id: 't1', status: 'inativo', data_matricula: '2026-02-01' }],
      turmas: [{ id: 't1', curso_id: 'c1', nome: 'T1', turno: 'manha', ativo: true }],
    });

    const snap = await fetchAcademicSnapshot(client);

    expect(snap.alunos.map(a => a.id)).toEqual(['a1']);
    expect(snap.alunos[0].nome_completo).toBe('Ana');
    expect(snap.professores.map(p => p.id)).toEqual(['p1']);
    expect(snap.notas[0].nota).toBe(8.5);
    expect(snap.notas[0].peso).toBe(1);
    expect(snap.notas[0].data_avaliacao.getDate()).toBe(15);
    expect(snap.matriculas[0].status).toBe('evadido');
    expect(snap.turmas[0].periodo).toBe('manha');
  });

  it('fetchAcademicSnapshot propaga erro do Supabase (ex.: RLS)', async () => {
    const { client } = fakeClient({}, 'permission denied');
    await expect(fetchAcademicSnapshot(client)).rejects.toThrow(/permission denied/);
  });

  it('insertAluno grava em usuarios com role aluno e CPF só com dígitos', async () => {
    const { client, calls } = fakeClient({});
    await insertAluno(client, {
      nome_completo: 'Novo Aluno',
      cpf: '529.982.247-25',
      email: 'novo@x.com',
      role: 'aluno',
      ativo: true,
      data_nascimento: new Date(2000, 0, 1),
    });
    expect(calls[0].table).toBe('usuarios');
    expect(calls[0].op).toBe('insert');
    expect(calls[0].payload).toEqual([
      expect.objectContaining({ nome: 'Novo Aluno', cpf: '52998224725', role: 'aluno', data_nascimento: '2000-01-01' }),
    ]);
  });

  it('insertMatricula envia curso da turma', async () => {
    const { client, calls } = fakeClient({});
    await insertMatricula(client, { aluno_id: 'a1', turma_id: 't1', curso_id: 'c1' });
    expect(calls[0].payload).toEqual([expect.objectContaining({ aluno_id: 'a1', turma_id: 't1', curso_id: 'c1', status: 'ativo' })]);
  });

  it('upsertNotas usa a chave natural da avaliação e registra o professor', async () => {
    const { client, calls } = fakeClient({});
    await upsertNotas(client, {
      turma_id: 't1',
      disciplina_id: 'd1',
      professor_id: 'p1',
      tipo_avaliacao: 'Prova 1',
      peso: 2,
      data_avaliacao: new Date(2026, 4, 15),
      notas: [{ aluno_id: 'a1', nota: 9 }],
    });
    expect(calls[0].table).toBe('notas');
    expect(calls[0].options).toEqual({ onConflict: 'aluno_id,disciplina_id,turma_id,tipo_avaliacao' });
    expect(calls[0].payload).toEqual([
      expect.objectContaining({ aluno_id: 'a1', professor_id: 'p1', nota: 9, peso: 2, data_avaliacao: '2026-05-15' }),
    ]);
  });

  it('upsertFrequencias converte status em presente/justificado', async () => {
    const { client, calls } = fakeClient({});
    await upsertFrequencias(client, {
      turma_id: 't1',
      disciplina_id: 'd1',
      professor_id: 'p1',
      data_aula: new Date(2026, 4, 15),
      presencas: [
        { aluno_id: 'a1', status: 'presente' },
        { aluno_id: 'a2', status: 'justificado' },
        { aluno_id: 'a3', status: 'ausente' },
      ],
    });
    expect(calls[0].options).toEqual({ onConflict: 'aluno_id,disciplina_id,turma_id,data' });
    const rows = calls[0].payload as Array<{ presente: boolean; justificado: boolean; data: string }>;
    expect(rows.map(r => [r.presente, r.justificado])).toEqual([[true, false], [false, true], [false, false]]);
    expect(rows[0].data).toBe('2026-05-15');
  });

  it('mapFrequencia reconstrói o status a partir das colunas booleanas', () => {
    const base = { id: 'f', aluno_id: 'a', disciplina_id: 'd', turma_id: 't', data: '2026-05-15' };
    expect(mapFrequencia({ ...base, presente: true }).status).toBe('presente');
    expect(mapFrequencia({ ...base, presente: false, justificado: true }).status).toBe('justificado');
    expect(mapFrequencia({ ...base, presente: false, justificado: false }).status).toBe('ausente');
  });
});
