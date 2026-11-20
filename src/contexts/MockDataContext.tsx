// ============================================
// MOCK DATA CONTEXT - Gerenciamento de dados mockados
// OTIMIZADO: Com persistência versionada no localStorage, memoização e lazy loading
// ============================================

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useRef } from 'react';
import { mockData as initialMockData } from '../data/mockData';
import { mockNotifications as initialNotifications } from '../data/mockNotifications';
import i18n from '../i18n';
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
  StatusFrequencia
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
  lancarNotasEmLote: (params: {
    turma_id: string;
    disciplina_id: string;
    professor_id: string;
    tipo_avaliacao: string;
    peso: number;
    data_avaliacao: Date;
    notas: Array<{ aluno_id: string; nota: number; observacao?: string }>;
  }) => Nota[];

  registrarFrequenciasEmLote: (params: {
    turma_id: string;
    disciplina_id: string;
    professor_id: string;
    data_aula: Date;
    presencas: Array<{ aluno_id: string; status: StatusFrequencia; observacao?: string }>;
  }) => Frequencia[];

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

function loadInitialState(): typeof initialMockData {
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

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadedInitialData = useMemo(() => loadInitialState(), []);

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

  const lancarNotasEmLote = (params: {
    turma_id: string;
    disciplina_id: string;
    professor_id: string;
    tipo_avaliacao: string;
    peso: number;
    data_avaliacao: Date;
    notas: Array<{ aluno_id: string; nota: number; observacao?: string }>;
  }): Nota[] => {
    const { turma_id, disciplina_id, professor_id, tipo_avaliacao, peso, data_avaliacao, notas: notasInput } = params;
    const now = new Date();
    const resultNotas: Nota[] = [];

    setNotas(prev => {
      const next = [...prev];
      for (const item of notasInput) {
        const existingIndex = next.findIndex(
          n =>
            n.aluno_id === item.aluno_id &&
            n.turma_id === turma_id &&
            n.disciplina_id === disciplina_id &&
            n.tipo_avaliacao === tipo_avaliacao
        );

        if (existingIndex >= 0) {
          const updated: Nota = {
            ...next[existingIndex],
            nota: item.nota,
            peso,
            data_avaliacao,
            observacao: item.observacao,
            professor_id,
          };
          next[existingIndex] = updated;
          resultNotas.push(updated);
        } else {
          const novaNota: Nota = {
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
          next.push(novaNota);
          resultNotas.push(novaNota);
        }
      }
      return next;
    });

    return resultNotas;
  };

  // ==================== FREQUÊNCIA EM LOTE ====================

  const registrarFrequenciasEmLote = (params: {
    turma_id: string;
    disciplina_id: string;
    professor_id: string;
    data_aula: Date;
    presencas: Array<{ aluno_id: string; status: StatusFrequencia; observacao?: string }>;
  }): Frequencia[] => {
    const { turma_id, disciplina_id, professor_id, data_aula, presencas: presencasInput } = params;
    const now = new Date();
    const resultFreqs: Frequencia[] = [];
    const targetDate = new Date(data_aula);
    const targetDay = targetDate.getDate();
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    setFrequencias(prev => {
      const next = [...prev];
      for (const item of presencasInput) {
        const existingIndex = next.findIndex(f => {
          if (f.aluno_id !== item.aluno_id || f.turma_id !== turma_id || f.disciplina_id !== disciplina_id) {
            return false;
          }
          const fDate = new Date(f.data_aula);
          return (
            fDate.getDate() === targetDay &&
            fDate.getMonth() === targetMonth &&
            fDate.getFullYear() === targetYear
          );
        });

        if (existingIndex >= 0) {
          const updated: Frequencia = {
            ...next[existingIndex],
            status: item.status,
            observacao: item.observacao,
            professor_id,
          };
          next[existingIndex] = updated;
          resultFreqs.push(updated);
        } else {
          const novaFreq: Frequencia = {
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
          next.push(novaFreq);
          resultFreqs.push(novaFreq);
        }
      }
      return next;
    });

    return resultFreqs;
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
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getNotificationsByUser,
    resetMockData,
  }), [
    alunos, professores, gestores, cursos, turmas, disciplinas, materiais,
    matriculas, notas, frequencias, observacoes, pagamentos, comunicados,
    comunicadosLeituras, professorTurmaDisciplina, notificacoes, logsAuditoria,
    lang
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
