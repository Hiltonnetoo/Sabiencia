// ============================================
// ACADEMIC REPOSITORY — persistência real da jornada no Supabase
//
// Usado pelo MockDataProvider quando VITE_APP_MODE=supabase. Cobre a jornada
// gestor -> professor -> aluno: cursos, turmas, disciplinas, alunos,
// professores, matrículas, vínculos professor/turma/disciplina, notas e
// frequências. A autorização é da RLS (supabase/migrations/005 e 006),
// testada em supabase/tests/rls_test.sql.
// ============================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Aluno,
  Curso,
  Disciplina,
  Frequencia,
  Matricula,
  Nota,
  Periodo,
  Professor,
  ProfessorTurmaDisciplina,
  StatusFrequencia,
  StatusMatricula,
  Turma,
} from '../types';

// Linhas como o PostgREST as devolve (snake_case, datas ISO)
type Row = Record<string, any>;

export interface AcademicSnapshot {
  cursos: Curso[];
  disciplinas: Disciplina[];
  turmas: Turma[];
  alunos: Aluno[];
  professores: Professor[];
  matriculas: Matricula[];
  professorTurmaDisciplina: ProfessorTurmaDisciplina[];
  notas: Nota[];
  frequencias: Frequencia[];
}

export type NovoAluno = Omit<Aluno, 'id' | 'created_at'>;

export interface LancamentoNotas {
  turma_id: string;
  disciplina_id: string;
  professor_id: string;
  tipo_avaliacao: string;
  peso: number;
  data_avaliacao: Date;
  notas: Array<{ aluno_id: string; nota: number; observacao?: string }>;
}

export interface RegistroFrequencias {
  turma_id: string;
  disciplina_id: string;
  professor_id: string;
  data_aula: Date;
  presencas: Array<{ aluno_id: string; status: StatusFrequencia; observacao?: string }>;
}

// ---------- conversões ----------

const toDate = (value: unknown): Date => (value ? new Date(String(value)) : new Date(0));

/** Data local em YYYY-MM-DD (evita deslocamento de fuso ao gravar colunas DATE) */
export const toSqlDate = (d: Date): string => {
  const date = new Date(d);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mm}-${dd}`;
};

/** Converte DATE do banco (YYYY-MM-DD) em Date local à meia-noite */
const fromSqlDate = (value: unknown): Date => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return toDate(value);
};

const onlyDigits = (cpf: string): string => cpf.replace(/\D/g, '');

const STATUS_MATRICULA: Record<string, StatusMatricula> = {
  ativo: 'ativo',
  trancado: 'trancado',
  concluido: 'concluido',
  inativo: 'evadido',
};

export const mapCurso = (r: Row): Curso => ({
  id: r.id,
  nome: r.nome,
  descricao: r.descricao ?? '',
  carga_horaria: r.carga_horaria ?? 0,
  duracao_meses: r.duracao_meses ?? 0,
  ativo: r.ativo ?? true,
  created_at: toDate(r.created_at),
});

export const mapDisciplina = (r: Row): Disciplina => ({
  id: r.id,
  curso_id: r.curso_id,
  nome: r.nome,
  descricao: r.descricao ?? '',
  carga_horaria: r.carga_horaria ?? 0,
  ordem: r.ordem ?? 0,
  codigo: r.codigo ?? undefined,
  created_at: toDate(r.created_at),
});

export const mapTurma = (r: Row): Turma => ({
  id: r.id,
  curso_id: r.curso_id,
  nome: r.nome,
  codigo: r.codigo ?? undefined,
  data_inicio: fromSqlDate(r.data_inicio),
  data_fim: fromSqlDate(r.data_fim),
  periodo: (['manha', 'tarde', 'noite', 'integral'].includes(r.turno) ? r.turno : 'noite') as Periodo,
  turno: r.turno ?? undefined,
  ativa: r.ativo ?? true,
  ativo: r.ativo ?? true,
  created_at: toDate(r.created_at),
});

export const mapAluno = (r: Row): Aluno => ({
  id: r.id,
  cpf: r.cpf,
  email: r.email,
  role: 'aluno',
  nome_completo: r.nome,
  telefone: r.telefone ?? undefined,
  foto_url: r.avatar_url ?? undefined,
  ativo: r.ativo ?? true,
  created_at: toDate(r.created_at),
  data_nascimento: r.data_nascimento ? fromSqlDate(r.data_nascimento) : (undefined as unknown as Date),
  endereco: r.endereco ?? undefined,
});

export const mapProfessor = (r: Row): Professor => ({
  id: r.id,
  cpf: r.cpf,
  email: r.email,
  role: 'professor',
  nome_completo: r.nome,
  telefone: r.telefone ?? undefined,
  foto_url: r.avatar_url ?? undefined,
  ativo: r.ativo ?? true,
  created_at: toDate(r.created_at),
  especialidades: [],
  formacao: '',
});

export const mapMatricula = (r: Row): Matricula => ({
  id: r.id,
  aluno_id: r.aluno_id,
  turma_id: r.turma_id,
  data_matricula: fromSqlDate(r.data_matricula ?? r.created_at),
  status: STATUS_MATRICULA[r.status] ?? 'ativo',
  data_conclusao: r.data_conclusao ? fromSqlDate(r.data_conclusao) : undefined,
  created_at: toDate(r.created_at),
});

export const mapProfessorTurmaDisciplina = (r: Row): ProfessorTurmaDisciplina => ({
  id: r.id,
  professor_id: r.professor_id,
  turma_id: r.turma_id,
  disciplina_id: r.disciplina_id,
  created_at: toDate(r.created_at),
});

export const mapNota = (r: Row): Nota => ({
  id: r.id,
  aluno_id: r.aluno_id,
  disciplina_id: r.disciplina_id,
  turma_id: r.turma_id,
  professor_id: r.professor_id ?? '',
  tipo_avaliacao: r.tipo_avaliacao ?? '',
  nota: Number(r.nota),
  peso: Number(r.peso ?? 1),
  data_avaliacao: fromSqlDate(r.data_avaliacao ?? r.created_at),
  observacao: r.observacao ?? undefined,
  created_at: toDate(r.created_at),
});

export const statusFromRow = (r: Row): StatusFrequencia =>
  r.presente ? 'presente' : r.justificado ? 'justificado' : 'ausente';

export const mapFrequencia = (r: Row): Frequencia => ({
  id: r.id,
  aluno_id: r.aluno_id,
  disciplina_id: r.disciplina_id,
  turma_id: r.turma_id,
  professor_id: r.professor_id ?? '',
  data_aula: fromSqlDate(r.data),
  status: statusFromRow(r),
  observacao: r.observacao ?? undefined,
  created_at: toDate(r.created_at),
});

// ---------- consultas ----------

const unwrap = <T>(result: { data: T | null; error: { message: string } | null }, what: string): T => {
  if (result.error) {
    throw new Error(`[Supabase] Falha ao ${what}: ${result.error.message}`);
  }
  return (result.data ?? []) as T;
};

/**
 * Carrega tudo que o usuário autenticado pode ver. A RLS já restringe as
 * linhas: um aluno recebe só os próprios dados, um professor só as suas turmas.
 */
export const fetchAcademicSnapshot = async (client: SupabaseClient): Promise<AcademicSnapshot> => {
  const [cursos, disciplinas, turmas, usuarios, matriculas, vinculos, notas, frequencias] = await Promise.all([
    client.from('cursos').select('*'),
    client.from('disciplinas').select('*'),
    client.from('turmas').select('*'),
    client.from('usuarios').select('id, nome, email, cpf, telefone, role, avatar_url, ativo, created_at, data_nascimento, endereco'),
    client.from('matriculas').select('*'),
    client.from('professor_disciplinas').select('*'),
    client.from('notas').select('*'),
    client.from('frequencias').select('*'),
  ]);

  const usuariosRows = unwrap<Row[]>(usuarios, 'carregar usuários');

  return {
    cursos: unwrap<Row[]>(cursos, 'carregar cursos').map(mapCurso),
    disciplinas: unwrap<Row[]>(disciplinas, 'carregar disciplinas').map(mapDisciplina),
    turmas: unwrap<Row[]>(turmas, 'carregar turmas').map(mapTurma),
    alunos: usuariosRows.filter(u => u.role === 'aluno').map(mapAluno),
    professores: usuariosRows.filter(u => u.role === 'professor').map(mapProfessor),
    matriculas: unwrap<Row[]>(matriculas, 'carregar matrículas').map(mapMatricula),
    professorTurmaDisciplina: unwrap<Row[]>(vinculos, 'carregar vínculos de professores').map(mapProfessorTurmaDisciplina),
    notas: unwrap<Row[]>(notas, 'carregar notas').map(mapNota),
    frequencias: unwrap<Row[]>(frequencias, 'carregar frequências').map(mapFrequencia),
  };
};

// ---------- escritas (gestor) ----------

const alunoToRow = (data: Partial<NovoAluno>): Row => {
  const row: Row = {};
  if (data.nome_completo !== undefined) row.nome = data.nome_completo;
  if (data.email !== undefined) row.email = data.email;
  if (data.cpf !== undefined) row.cpf = onlyDigits(data.cpf);
  if (data.telefone !== undefined) row.telefone = data.telefone || null;
  if (data.foto_url !== undefined) row.avatar_url = data.foto_url || null;
  if (data.data_nascimento) row.data_nascimento = toSqlDate(data.data_nascimento);
  if (data.endereco !== undefined) row.endereco = data.endereco ?? null;
  return row;
};

export const insertAluno = async (client: SupabaseClient, data: NovoAluno): Promise<Aluno> => {
  const result = await client
    .from('usuarios')
    .insert({ ...alunoToRow(data), role: 'aluno', ativo: data.ativo ?? true })
    .select()
    .single();
  return mapAluno(unwrap<Row>(result, 'cadastrar aluno'));
};

export const updateAlunoRow = async (client: SupabaseClient, id: string, data: Partial<NovoAluno>): Promise<Aluno> => {
  const row = alunoToRow(data);
  if (data.ativo !== undefined) row.ativo = data.ativo;
  const result = await client.from('usuarios').update(row).eq('id', id).select().single();
  return mapAluno(unwrap<Row>(result, 'atualizar aluno'));
};

export const insertMatricula = async (
  client: SupabaseClient,
  params: { aluno_id: string; turma_id: string; curso_id: string }
): Promise<Matricula> => {
  const result = await client
    .from('matriculas')
    .insert({ ...params, status: 'ativo', data_matricula: toSqlDate(new Date()) })
    .select()
    .single();
  return mapMatricula(unwrap<Row>(result, 'matricular aluno'));
};

export const updateMatriculaTurma = async (
  client: SupabaseClient,
  id: string,
  params: { turma_id: string; curso_id: string }
): Promise<Matricula> => {
  const result = await client.from('matriculas').update(params).eq('id', id).select().single();
  return mapMatricula(unwrap<Row>(result, 'transferir matrícula'));
};

// ---------- escritas (professor) ----------

export const upsertNotas = async (client: SupabaseClient, params: LancamentoNotas): Promise<Nota[]> => {
  const rows = params.notas.map(item => ({
    aluno_id: item.aluno_id,
    disciplina_id: params.disciplina_id,
    turma_id: params.turma_id,
    professor_id: params.professor_id,
    tipo_avaliacao: params.tipo_avaliacao,
    nota: item.nota,
    peso: params.peso,
    data_avaliacao: toSqlDate(params.data_avaliacao),
    observacao: item.observacao ?? null,
  }));
  const result = await client
    .from('notas')
    .upsert(rows, { onConflict: 'aluno_id,disciplina_id,turma_id,tipo_avaliacao' })
    .select();
  return unwrap<Row[]>(result, 'salvar notas').map(mapNota);
};

export const upsertFrequencias = async (client: SupabaseClient, params: RegistroFrequencias): Promise<Frequencia[]> => {
  const data = toSqlDate(params.data_aula);
  const rows = params.presencas.map(item => ({
    aluno_id: item.aluno_id,
    disciplina_id: params.disciplina_id,
    turma_id: params.turma_id,
    professor_id: params.professor_id,
    data,
    presente: item.status === 'presente',
    justificado: item.status === 'justificado',
    observacao: item.observacao ?? null,
  }));
  const result = await client
    .from('frequencias')
    .upsert(rows, { onConflict: 'aluno_id,disciplina_id,turma_id,data' })
    .select();
  return unwrap<Row[]>(result, 'salvar frequência').map(mapFrequencia);
};
