// ============================================
// MOCK DATA CONTEXT - Gerenciamento de dados mockados
// OTIMIZADO: Com persistência versionada no localStorage, memoização e lazy loading
// ============================================

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useRef } from 'react';
import { mockData as initialMockData } from '../data/mockData';
import { mockNotifications as initialNotifications } from '../data/mockNotifications';
import i18n from '../i18n';
import { isSupabaseMode } from '../config/appMode';
import { supabase } from '../lib/supabase';
import { useOptionalAuth } from './AuthContext';
import {
  fetchAcademicSnapshot,
  insertAluno,
  insertMatricula,
  updateAlunoRow,
  updateMatriculaTurma,
  upsertFrequencias,
  upsertNotas,
  type LancamentoNotas,
  type NovoAluno,
  type RegistroFrequencias,
} from '../services/academicRepository';
import {
  localizeCursos,
  localizeDisciplinas,
  localizeTurmas,
  localizeMateriais,
  localizeObservacoes,
  localizePagamentos,
  localizeNotas,
  localizeFrequencias,
  localizeComunicados,
  localizeNotificacoes,
} from '../data/localizeMockData';
import type { 
  Aluno, 
  Professor,
  Gestor, 
  Curso, 
  Turma, 
  Disciplina, 
  Material, 
  Matricula, 
  Nota, 
  Frequencia,
  Observacao,
  Pagamento,
  Comunicado,
  ComunicadoLeitura,
  ProfessorTurmaDisciplina,
  Notificacao,
  LogAuditoria,
} from '../types';

export interface MockDataContextType {
  // Dados
  alunos: Aluno[];
  professores: Professor[];
  gestores: Gestor[];
  cursos: Curso[];
  turmas: Turma[];
  disciplinas: Disciplina[];
  materiais: Material[];
  matriculas: Matricula[];
  notas: Nota[];
  frequencias: Frequencia[];
  observacoes: Observacao[];
  pagamentos: Pagamento[];
  comunicados: Comunicado[];
  comunicadosLeituras: ComunicadoLeitura[];
  professorTurmaDisciplina: ProfessorTurmaDisciplina[];
  notificacoes: Notificacao[];
  logsAuditoria: LogAuditoria[];

  // CRUD Alunos
  createAluno: (data: Omit<Aluno, 'id' | 'created_at'>) => Aluno;
  updateAluno: (id: string, data: Partial<Aluno>) => void;
  deleteAluno: (id: string) => void;
  getAlunoById: (id: string) => Aluno | undefined;

  // CRUD Professores
  createProfessor: (data: Omit<Professor, 'id' | 'created_at'>) => Professor;
  updateProfessor: (id: string, data: Partial<Professor>) => void;
  deleteProfessor: (id: string) => void;
  getProfessorById: (id: string) => Professor | undefined;

  // CRUD Materiais
  createMaterial: (data: Omit<Material, 'id' | 'data_upload'>) => Material;
  updateMaterial: (id: string, data: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  getMaterialById: (id: string) => Material | undefined;

  // CRUD Comunicados
  addComunicado: (data: Omit<Comunicado, 'id' | 'created_at'>) => Comunicado;
  addComunicadoLeitura: (data: Omit<ComunicadoLeitura, 'id' | 'created_at'>) => ComunicadoLeitura;

  // CRUD Pagamentos
  registrarPagamento: (pagamentoId: string, data: {
    data_pagamento: Date;
    metodo_pagamento: string;
    comprovante_url?: string;
    observacao?: string;
  }) => void;
  updatePagamento: (id: string, data: Partial<Pagamento>) => void;
  cancelarPagamento: (id: string, observacao?: string) => void;

  // CRUD Turmas
  addTurma: (data: Omit<Turma, 'id' | 'created_at'>) => Turma;
  updateTurma: (id: string, data: Partial<Turma>) => void;
  deleteTurma: (id: string) => void;
  getTurmaById: (id: string) => Turma | undefined;

  // CRUD Disciplinas
  addDisciplina: (data: Omit<Disciplina, 'id' | 'created_at'>) => Disciplina;
  updateDisciplina: (id: string, data: Partial<Disciplina>) => void;
  deleteDisciplina: (id: string) => void;
  getDisciplinaById: (id: string) => Disciplina | undefined;

  // CRUD Cursos
  addCurso: (data: Omit<Curso, 'id' | 'created_at'>) => Curso;
  updateCurso: (id: string, data: Partial<Curso>) => void;
  deleteCurso: (id: string) => void;
  getCursoById: (id: string) => Curso | undefined;

  // CRUD Observações
  addObservacao: (data: Omit<Observacao, 'id' | 'created_at'>) => Observacao;
  updateObservacao: (id: string, data: Partial<Observacao>) => void;
  deleteObservacao: (id: string) => void;
  getObservacaoById: (id: string) => Observacao | undefined;

  // CRUD Matrículas
  createMatricula: (data: Omit<Matricula, 'id' | 'created_at' | 'data_matricula'> & { data_matricula?: Date }) => Matricula;
  updateMatricula: (id: string, data: Partial<Matricula>) => void;
  deleteMatricula: (id: string) => void;
  getMatriculasByAlunoId: (alunoId: string) => Matricula[];
  getMatriculasByTurmaId: (turmaId: string) => Matricula[];

  // Lançamentos Acadêmicos em Lote (Professor)
  lancarNotasEmLote: (params: LancamentoNotas) => Nota[];
  registrarFrequenciasEmLote: (params: RegistroFrequencias) => Frequencia[];

  // ==================== JORNADA (persistente) ====================
  // Use estas funções na interface: no modo demo gravam no localStorage;
  // no modo supabase gravam no banco (sujeitas à RLS) e só então atualizam o estado.
  /** Origem dos dados exibidos */
  dataSource: 'demo' | 'supabase';
  /** true enquanto o snapshot do Supabase está sendo carregado */
  isSyncing: boolean;
  /** Último erro de carga do Supabase, se houver */
  syncError: string | null;
  /** Recarrega os dados do Supabase (no-op no modo demo) */
  reloadFromBackend: () => Promise<void>;
  cadastrarAluno: (data: NovoAluno, turmaId?: string) => Promise<Aluno>;
  atualizarAluno: (id: string, data: Partial<NovoAluno>, turmaId?: string) => Promise<void>;
  salvarNotas: (params: LancamentoNotas) => Promise<Nota[]>;
  salvarFrequencias: (params: RegistroFrequencias) => Promise<Frequencia[]>;

  // CRUD Notificações
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  getNotificationsByUser: (userId: string) => Notificacao[];

  // Gerenciamento do estado mock
  resetMockData: () => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MOCK_DATA_STORAGE_KEY = 'sabiencia_mock_data_v1';
export const MOCK_NOTIFICATIONS_STORAGE_KEY = 'sabiencia_mock_notifications_v1';

// Função para gerar IDs únicos previsíveis e estáveis
const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
};

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

// Converte recursivamente strings de data em instâncias reais de Date
function reviveDates<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string' && ISO_DATE_REGEX.test(obj)) {
    const d = new Date(obj);
    if (!isNaN(d.getTime())) return d as unknown as T;
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(reviveDates) as unknown as T;
  }
  if (typeof obj === 'object') {
    const res: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      res[key] = reviveDates((obj as Record<string, unknown>)[key]);
    }
    return res as unknown as T;
  }
  return obj;
}

// Estado vazio do modo supabase: nada de fixture misturado com dado real
const EMPTY_DATA = Object.fromEntries(
  Object.entries(initialMockData).map(([key, value]) => [key, Array.isArray(value) ? [] : value])
) as unknown as typeof initialMockData;

function loadInitialState(): typeof initialMockData {
  if (isSupabaseMode()) {
    return EMPTY_DATA;
  }
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialMockData;
  }
  try {
    const stored = localStorage.getItem(MOCK_DATA_STORAGE_KEY);
    if (!stored) return initialMockData;
    const parsed = JSON.parse(stored);
    if (parsed && parsed.version === 1 && parsed.data) {
      const revived = reviveDates(parsed.data);
      return {
        ...initialMockData,
        ...revived,
      };
    }
  } catch (e) {
    console.warn('[MockData] Falha ao carregar dados do localStorage, usando defaults:', e);
  }
  return initialMockData;
}

function loadInitialNotifications(): Notificacao[] {
  if (isSupabaseMode()) {
    return [];
  }
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialNotifications;
  }
  try {
    const stored = localStorage.getItem(MOCK_NOTIFICATIONS_STORAGE_KEY);
    if (!stored) return initialNotifications;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return reviveDates(parsed);
    }
  } catch {
    // fallback
  }
  return initialNotifications;
}

// Chaves naturais dos lançamentos (uma nota por avaliação; uma presença por dia)
type NotaKey = Pick<Nota, 'aluno_id' | 'turma_id' | 'disciplina_id' | 'tipo_avaliacao'>;
const sameNotaKey = (a: NotaKey, b: NotaKey): boolean =>
  a.aluno_id === b.aluno_id &&
  a.turma_id === b.turma_id &&
  a.disciplina_id === b.disciplina_id &&
  a.tipo_avaliacao === b.tipo_avaliacao;

type FrequenciaKey = Pick<Frequencia, 'aluno_id' | 'turma_id' | 'disciplina_id' | 'data_aula'>;
const sameDay = (a: Date, b: Date): boolean => {
  const x = new Date(a);
  const y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
};
const sameFrequenciaKey = (a: FrequenciaKey, b: FrequenciaKey): boolean =>
  a.aluno_id === b.aluno_id &&
  a.turma_id === b.turma_id &&
  a.disciplina_id === b.disciplina_id &&
  sameDay(a.data_aula, b.data_aula);

/** Substitui os itens com a mesma chave e acrescenta os novos */
function upsertBy<T>(prev: T[], items: T[], same: (a: T, b: T) => boolean): T[] {
  const next = prev.map(old => items.find(item => same(old, item)) ?? old);
  for (const item of items) {
    if (!prev.some(old => same(old, item))) next.push(item);
  }
  return next;
}

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabaseMode = isSupabaseMode();
  const auth = useOptionalAuth();
  const authUserId = auth?.user?.id ?? null;
  const loadedInitialData = useMemo(() => loadInitialState(), []);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [alunos, setAlunos] = useState<Aluno[]>(() => loadedInitialData.alunos || initialMockData.alunos);
  const [professores, setProfessores] = useState<Professor[]>(() => loadedInitialData.professores || initialMockData.professores);
  const [gestores, setGestores] = useState<Gestor[]>(() => loadedInitialData.gestores || initialMockData.gestores);
  const [cursos, setCursos] = useState<Curso[]>(() => loadedInitialData.cursos || initialMockData.cursos);
  const [turmas, setTurmas] = useState<Turma[]>(() => loadedInitialData.turmas || initialMockData.turmas);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(() => loadedInitialData.disciplinas || initialMockData.disciplinas);
  const [materiais, setMateriais] = useState<Material[]>(() => loadedInitialData.materiais || initialMockData.materiais);
  const [matriculas, setMatriculas] = useState<Matricula[]>(() => loadedInitialData.matriculas || initialMockData.matriculas);
  const [notas, setNotas] = useState<Nota[]>(() => loadedInitialData.notas || initialMockData.notas);
  const [frequencias, setFrequencias] = useState<Frequencia[]>(() => loadedInitialData.frequencias || initialMockData.frequencias);
  const [observacoes, setObservacoes] = useState<Observacao[]>(() => loadedInitialData.observacoes || initialMockData.observacoes);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(() => loadedInitialData.pagamentos || initialMockData.pagamentos);
  const [comunicados, setComunicados] = useState<Comunicado[]>(() => loadedInitialData.comunicados || initialMockData.comunicados);
  const [comunicadosLeituras, setComunicadosLeituras] = useState<ComunicadoLeitura[]>(() => loadedInitialData.comunicadosLeituras || initialMockData.comunicadosLeituras || []);
  const [professorTurmaDisciplina, setProfessorTurmaDisciplina] = useState<ProfessorTurmaDisciplina[]>(() => loadedInitialData.professorTurmaDisciplina || initialMockData.professorTurmaDisciplina);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(() => loadInitialNotifications());
  const [logsAuditoria, setLogsAuditoria] = useState<LogAuditoria[]>(() => loadedInitialData.logsAuditoria || initialMockData.logsAuditoria || []);

  const isInitialMount = useRef(true);

  // Persiste automaticamente as alterações no localStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // No modo supabase o banco é a fonte da verdade: nada vai para o localStorage
    if (supabaseMode) return;
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const payload = {
        version: 1,
        timestamp: Date.now(),
        data: {
          alunos,
          professores,
          gestores,
          cursos,
          turmas,
          disciplinas,
          materiais,
          matriculas,
          notas,
          frequencias,
          observacoes,
          pagamentos,
          comunicados,
          comunicadosLeituras,
          professorTurmaDisciplina,
          logsAuditoria,
        },
      };
      localStorage.setItem(MOCK_DATA_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(MOCK_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notificacoes));
    } catch (e) {
      console.warn('[MockData] Erro ao persistir dados no localStorage:', e);
    }
  }, [
    alunos,
    professores,
    gestores,
    cursos,
    turmas,
    disciplinas,
    materiais,
    matriculas,
    notas,
    frequencias,
    observacoes,
    pagamentos,
    comunicados,
    comunicadosLeituras,
    professorTurmaDisciplina,
    notificacoes,
    logsAuditoria,
  ]);

  // Idioma ativo — força recomputação dos dados localizados ao trocar de idioma.
  const [lang, setLang] = useState<string>(i18n.language);
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on('languageChanged', handler);
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);

  // ==================== SUPABASE: CARGA DO SNAPSHOT ====================

  const applySnapshot = (snapshot: Awaited<ReturnType<typeof fetchAcademicSnapshot>>) => {
    setCursos(snapshot.cursos);
    setDisciplinas(snapshot.disciplinas);
    setTurmas(snapshot.turmas);
    setAlunos(snapshot.alunos);
    setProfessores(snapshot.professores);
    setMatriculas(snapshot.matriculas);
    setProfessorTurmaDisciplina(snapshot.professorTurmaDisciplina);
    setNotas(snapshot.notas);
    setFrequencias(snapshot.frequencias);
  };

  const reloadFromBackend = async (): Promise<void> => {
    if (!supabaseMode) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      applySnapshot(await fetchAcademicSnapshot(supabase));
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!supabaseMode) return;
    if (!authUserId) {
      applySnapshot({
        cursos: [], disciplinas: [], turmas: [], alunos: [], professores: [],
        matriculas: [], professorTurmaDisciplina: [], notas: [], frequencias: [],
      });
      return;
    }
    void reloadFromBackend();
  }, [supabaseMode, authUserId]);

  // ==================== ALUNOS ====================

  const createAluno = (data: Omit<Aluno, 'id' | 'created_at'>): Aluno => {
    if (!data || !data.nome_completo || !data.cpf || !data.email) {
      throw new Error('Dados incompletos');
    }
    const newAluno: Aluno = {
      ...data,
      id: generateId('aluno'),
      created_at: new Date(),
    };

    setAlunos(prev => [...prev, newAluno]);
    return newAluno;
  };

  const updateAluno = (id: string, data: Partial<Aluno>): void => {
    setAlunos(prev =>
      prev.map(aluno =>
        aluno.id === id ? { ...aluno, ...data } : aluno
      )
    );
  };

  const deleteAluno = (id: string): void => {
    setAlunos(prev => prev.filter(aluno => aluno.id !== id));
    // Remove em cascata as matrículas associadas ao aluno deletado
    setMatriculas(prev => prev.filter(m => m.aluno_id !== id));
  };

  const getAlunoById = (id: string): Aluno | undefined => {
    return alunos.find(aluno => aluno.id === id);
  };

  // ==================== PROFESSORES ====================

  const createProfessor = (data: Omit<Professor, 'id' | 'created_at'>): Professor => {
    if (!data || !data.nome_completo || !data.cpf || !data.email) {
      throw new Error('Dados incompletos');
    }
    const newProfessor: Professor = {
      ...data,
      id: generateId('prof'),
      created_at: new Date(),
    };

    setProfessores(prev => [...prev, newProfessor]);
    return newProfessor;
  };

  const updateProfessor = (id: string, data: Partial<Professor>): void => {
    setProfessores(prev =>
      prev.map(professor =>
        professor.id === id ? { ...professor, ...data } : professor
      )
    );
  };

  const deleteProfessor = (id: string): void => {
    setProfessores(prev => prev.filter(professor => professor.id !== id));
  };

  const getProfessorById = (id: string): Professor | undefined => {
    return professores.find(professor => professor.id === id);
  };

  // ==================== MATERIAIS ====================

  const createMaterial = (data: Omit<Material, 'id' | 'data_upload'>): Material => {
    const newMaterial: Material = {
      ...data,
      id: generateId('mat'),
      data_upload: new Date(),
    };

    setMateriais(prev => [...prev, newMaterial]);
    return newMaterial;
  };

  const updateMaterial = (id: string, data: Partial<Material>): void => {
    setMateriais(prev =>
      prev.map(material =>
        material.id === id ? { ...material, ...data } : material
      )
    );
  };

  const deleteMaterial = (id: string): void => {
    setMateriais(prev => prev.filter(material => material.id !== id));
  };

  const getMaterialById = (id: string): Material | undefined => {
    return materiais.find(material => material.id === id);
  };

  // ==================== COMUNICADOS ====================

  const addComunicado = (data: Omit<Comunicado, 'id' | 'created_at'>): Comunicado => {
    const newComunicado: Comunicado = {
      ...data,
      id: generateId('com'),
      created_at: new Date(),
    };

    setComunicados(prev => [...prev, newComunicado]);
    return newComunicado;
  };

  const addComunicadoLeitura = (data: Omit<ComunicadoLeitura, 'id' | 'created_at'>): ComunicadoLeitura => {
    const newLeitura: ComunicadoLeitura = {
      ...data,
      id: generateId('leitura'),
      created_at: new Date(),
    };

    setComunicadosLeituras(prev => [...prev, newLeitura]);
    return newLeitura;
  };

  // ==================== PAGAMENTOS ====================

  const registrarPagamento = (
    pagamentoId: string,
    data: {
      data_pagamento: Date;
      metodo_pagamento: string;
      comprovante_url?: string;
      observacao?: string;
    }
  ): void => {
    setPagamentos(prev =>
      prev.map(pag =>
        pag.id === pagamentoId
          ? {
              ...pag,
              status: 'pago' as const,
              data_pagamento: data.data_pagamento,
              metodo_pagamento: data.metodo_pagamento,
              comprovante_url: data.comprovante_url,
              observacao: data.observacao,
            }
          : pag
      )
    );
  };

  const updatePagamento = (id: string, data: Partial<Pagamento>): void => {
    setPagamentos(prev =>
      prev.map(pag =>
        pag.id === id ? { ...pag, ...data } : pag
      )
    );
  };

  const cancelarPagamento = (id: string, observacao?: string): void => {
    setPagamentos(prev =>
      prev.map(pag =>
        pag.id === id
          ? {
              ...pag,
              status: 'cancelado' as const,
              observacao: observacao || pag.observacao,
            }
          : pag
      )
    );
  };

  // ==================== TURMAS ====================

  const addTurma = (data: Omit<Turma, 'id' | 'created_at'>): Turma => {
    const newTurma: Turma = {
      ...data,
      id: generateId('turma'),
      created_at: new Date(),
    };

    setTurmas(prev => [...prev, newTurma]);
    return newTurma;
  };

  const updateTurma = (id: string, data: Partial<Turma>): void => {
    setTurmas(prev =>
      prev.map(turma =>
        turma.id === id ? { ...turma, ...data } : turma
      )
    );
  };

  const deleteTurma = (id: string): void => {
    setTurmas(prev => prev.filter(turma => turma.id !== id));
  };

  const getTurmaById = (id: string): Turma | undefined => {
    return turmas.find(turma => turma.id === id);
  };

  // ==================== DISCIPLINAS ====================

  const addDisciplina = (data: Omit<Disciplina, 'id' | 'created_at'>): Disciplina => {
    const newDisciplina: Disciplina = {
      ...data,
      id: generateId('disc'),
      created_at: new Date(),
    };

    setDisciplinas(prev => [...prev, newDisciplina]);
    return newDisciplina;
  };

  const updateDisciplina = (id: string, data: Partial<Disciplina>): void => {
    setDisciplinas(prev =>
      prev.map(disc =>
        disc.id === id ? { ...disc, ...data } : disc
      )
    );
  };

  const deleteDisciplina = (id: string): void => {
    setDisciplinas(prev => prev.filter(disc => disc.id !== id));
  };

  const getDisciplinaById = (id: string): Disciplina | undefined => {
    return disciplinas.find(disc => disc.id === id);
  };

  // ==================== CURSOS ====================

  const addCurso = (data: Omit<Curso, 'id' | 'created_at'>): Curso => {
    const newCurso: Curso = {
      ...data,
      id: generateId('curso'),
      created_at: new Date(),
    };

    setCursos(prev => [...prev, newCurso]);
    return newCurso;
  };

  const updateCurso = (id: string, data: Partial<Curso>): void => {
    setCursos(prev =>
      prev.map(curso =>
        curso.id === id ? { ...curso, ...data } : curso
      )
    );
  };

  const deleteCurso = (id: string): void => {
    setCursos(prev => prev.filter(curso => curso.id !== id));
  };

  const getCursoById = (id: string): Curso | undefined => {
    return cursos.find(curso => curso.id === id);
  };

  // ==================== OBSERVAÇÕES ====================

  const addObservacao = (data: Omit<Observacao, 'id' | 'created_at'>): Observacao => {
    const newObservacao: Observacao = {
      ...data,
      id: generateId('obs'),
      created_at: new Date(),
    };

    setObservacoes(prev => [...prev, newObservacao]);
    return newObservacao;
  };

  const updateObservacao = (id: string, data: Partial<Observacao>): void => {
    setObservacoes(prev =>
      prev.map(obs =>
        obs.id === id ? { ...obs, ...data } : obs
      )
    );
  };

  const deleteObservacao = (id: string): void => {
    setObservacoes(prev => prev.filter(obs => obs.id !== id));
  };

  const getObservacaoById = (id: string): Observacao | undefined => {
    return observacoes.find(obs => obs.id === id);
  };

  // ==================== MATRÍCULAS ====================

  const createMatricula = (
    data: Omit<Matricula, 'id' | 'created_at' | 'data_matricula'> & { data_matricula?: Date }
  ): Matricula => {
    const year = new Date().getFullYear();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newMatricula: Matricula = {
      ...data,
      id: generateId('matr'),
      numero_matricula: data.numero_matricula || `MAT-${year}-${randomCode}`,
      data_matricula: data.data_matricula || new Date(),
      created_at: new Date(),
      status: data.status || 'ativo',
    };

    setMatriculas(prev => [...prev, newMatricula]);
    return newMatricula;
  };

  const updateMatricula = (id: string, data: Partial<Matricula>): void => {
    setMatriculas(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMatricula = (id: string): void => {
    setMatriculas(prev => prev.filter(m => m.id !== id));
  };

  const getMatriculasByAlunoId = (alunoId: string): Matricula[] => {
    return matriculas.filter(m => m.aluno_id === alunoId);
  };

  const getMatriculasByTurmaId = (turmaId: string): Matricula[] => {
    return matriculas.filter(m => m.turma_id === turmaId);
  };

  // ==================== NOTAS EM LOTE ====================

  const lancarNotasEmLote = (params: LancamentoNotas): Nota[] => {
    const { turma_id, disciplina_id, professor_id, tipo_avaliacao, peso, data_avaliacao } = params;
    const now = new Date();
    // Calcula o resultado a partir do estado atual (e não dentro do updater,
    // que o React pode executar depois do return)
    const resultNotas: Nota[] = params.notas.map(item => {
      const existing = notas.find(n => sameNotaKey(n, { ...item, turma_id, disciplina_id, tipo_avaliacao }));
      return existing
        ? { ...existing, nota: item.nota, peso, data_avaliacao, observacao: item.observacao, professor_id }
        : {
            id: generateId('nota'),
            aluno_id: item.aluno_id,
            turma_id,
            disciplina_id,
            professor_id,
            tipo_avaliacao,
            nota: item.nota,
            peso,
            data_avaliacao,
            observacao: item.observacao,
            created_at: now,
          };
    });
    setNotas(prev => upsertBy(prev, resultNotas, sameNotaKey));
    return resultNotas;
  };

  // ==================== FREQUÊNCIA EM LOTE ====================

  const registrarFrequenciasEmLote = (params: RegistroFrequencias): Frequencia[] => {
    const { turma_id, disciplina_id, professor_id, data_aula } = params;
    const now = new Date();
    const resultFreqs: Frequencia[] = params.presencas.map(item => {
      const existing = frequencias.find(f =>
        sameFrequenciaKey(f, { aluno_id: item.aluno_id, turma_id, disciplina_id, data_aula })
      );
      return existing
        ? { ...existing, status: item.status, observacao: item.observacao, professor_id }
        : {
            id: generateId('freq'),
            aluno_id: item.aluno_id,
            turma_id,
            disciplina_id,
            professor_id,
            data_aula,
            status: item.status,
            observacao: item.observacao,
            created_at: now,
          };
    });
    setFrequencias(prev => upsertBy(prev, resultFreqs, sameFrequenciaKey));
    return resultFreqs;
  };

  // ==================== JORNADA (demo ou supabase) ====================

  const cursoDaTurma = (turmaId: string): string => {
    const turma = turmas.find(t => t.id === turmaId);
    if (!turma) throw new Error('Turma não encontrada');
    return turma.curso_id;
  };

  const cadastrarAluno = async (data: NovoAluno, turmaId?: string): Promise<Aluno> => {
    if (!supabaseMode) {
      const aluno = createAluno(data);
      if (turmaId) createMatricula({ aluno_id: aluno.id, turma_id: turmaId, status: 'ativo' });
      return aluno;
    }
    const aluno = await insertAluno(supabase, data);
    setAlunos(prev => [...prev, aluno]);
    if (turmaId) {
      const matricula = await insertMatricula(supabase, {
        aluno_id: aluno.id,
        turma_id: turmaId,
        curso_id: cursoDaTurma(turmaId),
      });
      setMatriculas(prev => [...prev, matricula]);
    }
    return aluno;
  };

  const atualizarAluno = async (id: string, data: Partial<NovoAluno>, turmaId?: string): Promise<void> => {
    const atual = matriculas.find(m => m.aluno_id === id);
    if (!supabaseMode) {
      updateAluno(id, data as Partial<Aluno>);
      if (turmaId && atual && atual.turma_id !== turmaId) updateMatricula(atual.id, { turma_id: turmaId });
      if (turmaId && !atual) createMatricula({ aluno_id: id, turma_id: turmaId, status: 'ativo' });
      return;
    }
    const aluno = await updateAlunoRow(supabase, id, data);
    setAlunos(prev => prev.map(a => (a.id === id ? aluno : a)));
    if (turmaId && atual && atual.turma_id !== turmaId) {
      const matricula = await updateMatriculaTurma(supabase, atual.id, { turma_id: turmaId, curso_id: cursoDaTurma(turmaId) });
      setMatriculas(prev => prev.map(m => (m.id === matricula.id ? matricula : m)));
    }
    if (turmaId && !atual) {
      const matricula = await insertMatricula(supabase, { aluno_id: id, turma_id: turmaId, curso_id: cursoDaTurma(turmaId) });
      setMatriculas(prev => [...prev, matricula]);
    }
  };

  const salvarNotas = async (params: LancamentoNotas): Promise<Nota[]> => {
    if (!supabaseMode) return lancarNotasEmLote(params);
    const saved = await upsertNotas(supabase, params);
    setNotas(prev => upsertBy(prev, saved, sameNotaKey));
    return saved;
  };

  const salvarFrequencias = async (params: RegistroFrequencias): Promise<Frequencia[]> => {
    if (!supabaseMode) return registrarFrequenciasEmLote(params);
    const saved = await upsertFrequencias(supabase, params);
    setFrequencias(prev => upsertBy(prev, saved, sameFrequenciaKey));
    return saved;
  };

  // ==================== NOTIFICAÇÕES ====================

  const markNotificationAsRead = (id: string): void => {
    setNotificacoes(prev =>
      prev.map(notif =>
        notif.id === id
          ? { ...notif, lida: true, data_leitura: new Date() }
          : notif
      )
    );
  };

  const markAllNotificationsAsRead = (userId: string): void => {
    setNotificacoes(prev =>
      prev.map(notif =>
        notif.usuario_id === userId && !notif.lida
          ? { ...notif, lida: true, data_leitura: new Date() }
          : notif
      )
    );
  };

  const getNotificationsByUser = (userId: string): Notificacao[] => {
    return notificacoes
      .filter(notif => notif.usuario_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // ==================== RESET ====================

  const resetMockData = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(MOCK_DATA_STORAGE_KEY);
      localStorage.removeItem(MOCK_NOTIFICATIONS_STORAGE_KEY);
    }
    setAlunos(initialMockData.alunos);
    setProfessores(initialMockData.professores);
    setGestores(initialMockData.gestores);
    setCursos(initialMockData.cursos);
    setTurmas(initialMockData.turmas);
    setDisciplinas(initialMockData.disciplinas);
    setMateriais(initialMockData.materiais);
    setMatriculas(initialMockData.matriculas);
    setNotas(initialMockData.notas);
    setFrequencias(initialMockData.frequencias);
    setObservacoes(initialMockData.observacoes);
    setPagamentos(initialMockData.pagamentos);
    setComunicados(initialMockData.comunicados);
    setComunicadosLeituras(initialMockData.comunicadosLeituras || []);
    setProfessorTurmaDisciplina(initialMockData.professorTurmaDisciplina);
    setNotificacoes(initialNotifications);
    setLogsAuditoria(initialMockData.logsAuditoria || []);
  };

  // ==================== VALUE ====================

  const value: MockDataContextType = useMemo(() => ({
    alunos,
    professores,
    gestores,
    cursos: localizeCursos(cursos),
    turmas: localizeTurmas(turmas),
    disciplinas: localizeDisciplinas(disciplinas),
    materiais: localizeMateriais(materiais),
    matriculas,
    notas: localizeNotas(notas),
    frequencias: localizeFrequencias(frequencias),
    observacoes: localizeObservacoes(observacoes),
    pagamentos: localizePagamentos(pagamentos),
    comunicados: localizeComunicados(comunicados),
    comunicadosLeituras,
    professorTurmaDisciplina,
    notificacoes: localizeNotificacoes(notificacoes),
    logsAuditoria,
    createAluno,
    updateAluno,
    deleteAluno,
    getAlunoById,
    createProfessor,
    updateProfessor,
    deleteProfessor,
    getProfessorById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
    addComunicado,
    addComunicadoLeitura,
    registrarPagamento,
    updatePagamento,
    cancelarPagamento,
    addTurma,
    updateTurma,
    deleteTurma,
    getTurmaById,
    addDisciplina,
    updateDisciplina,
    deleteDisciplina,
    getDisciplinaById,
    addObservacao,
    updateObservacao,
    deleteObservacao,
    getObservacaoById,
    addCurso,
    updateCurso,
    deleteCurso,
    getCursoById,
    createMatricula,
    updateMatricula,
    deleteMatricula,
    getMatriculasByAlunoId,
    getMatriculasByTurmaId,
    lancarNotasEmLote,
    registrarFrequenciasEmLote,
    dataSource: supabaseMode ? 'supabase' : 'demo',
    isSyncing,
    syncError,
    reloadFromBackend,
    cadastrarAluno,
    atualizarAluno,
    salvarNotas,
    salvarFrequencias,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getNotificationsByUser,
    resetMockData,
  }), [
    alunos, professores, gestores, cursos, turmas, disciplinas, materiais,
    matriculas, notas, frequencias, observacoes, pagamentos, comunicados,
    comunicadosLeituras, professorTurmaDisciplina, notificacoes, logsAuditoria,
    lang, isSyncing, syncError
  ]);

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};

// Hook para usar o contexto
export const useMockData = (): MockDataContextType => {
  const context = useContext(MockDataContext);

  if (context === undefined) {
    throw new Error('useMockData deve ser usado dentro de um MockDataProvider');
  }

  return context;
};
