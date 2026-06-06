// ============================================
// MOCK DATA CONTEXT - Gerenciamento de dados mockados
// OTIMIZADO: Com memoização e lazy loading para melhor performance
// ============================================

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockData as initialMockData } from '../data/mockData';
import { mockNotifications as initialNotifications } from '../data/mockNotifications';
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
  LogAuditoria
} from '../types';

interface MockDataContextType {
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

  // CRUD Notificações
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  getNotificationsByUser: (userId: string) => Notificacao[];
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// Função para gerar IDs únicos
const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alunos, setAlunos] = useState<Aluno[]>(initialMockData.alunos);
  const [professores, setProfessores] = useState<Professor[]>(initialMockData.professores);
  const [gestores] = useState<Gestor[]>(initialMockData.gestores);
  const [cursos, setCursos] = useState<Curso[]>(initialMockData.cursos);
  const [turmas, setTurmas] = useState<Turma[]>(initialMockData.turmas);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(initialMockData.disciplinas);
  const [materiais, setMateriais] = useState<Material[]>(initialMockData.materiais);
  const [matriculas] = useState<Matricula[]>(initialMockData.matriculas);
  const [notas] = useState<Nota[]>(initialMockData.notas);
  const [frequencias] = useState<Frequencia[]>(initialMockData.frequencias);
  const [observacoes, setObservacoes] = useState<Observacao[]>(initialMockData.observacoes);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(initialMockData.pagamentos);
  const [comunicados, setComunicados] = useState<Comunicado[]>(initialMockData.comunicados);
  const [comunicadosLeituras, setComunicadosLeituras] = useState<ComunicadoLeitura[]>(initialMockData.comunicadosLeituras || []);
  const [professorTurmaDisciplina] = useState<ProfessorTurmaDisciplina[]>(initialMockData.professorTurmaDisciplina);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initialNotifications);
  const [logsAuditoria] = useState<LogAuditoria[]>(initialMockData.logsAuditoria || []);

  // ==================== ALUNOS ====================

  const createAluno = (data: Omit<Aluno, 'id' | 'created_at'>): Aluno => {
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
  };

  const getAlunoById = (id: string): Aluno | undefined => {
    return alunos.find(aluno => aluno.id === id);
  };

  // ==================== PROFESSORES ====================

  const createProfessor = (data: Omit<Professor, 'id' | 'created_at'>): Professor => {
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
      prev.map(disciplina =>
        disciplina.id === id ? { ...disciplina, ...data } : disciplina
      )
    );
  };

  const deleteDisciplina = (id: string): void => {
    setDisciplinas(prev => prev.filter(disciplina => disciplina.id !== id));
  };

  const getDisciplinaById = (id: string): Disciplina | undefined => {
    return disciplinas.find(disciplina => disciplina.id === id);
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
      prev.map(observacao =>
        observacao.id === id ? { ...observacao, ...data } : observacao
      )
    );
  };

  const deleteObservacao = (id: string): void => {
    setObservacoes(prev => prev.filter(observacao => observacao.id !== id));
  };

  const getObservacaoById = (id: string): Observacao | undefined => {
    return observacoes.find(observacao => observacao.id === id);
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

  // ==================== VALUE ====================
  // OTIMIZADO: Usar useMemo para prevenir recriação desnecessária do objeto de valor

  const value: MockDataContextType = useMemo(() => ({
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
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getNotificationsByUser,
  }), [
    alunos, professores, gestores, cursos, turmas, disciplinas, materiais,
    matriculas, notas, frequencias, observacoes, pagamentos, comunicados,
    comunicadosLeituras, professorTurmaDisciplina, notificacoes, logsAuditoria
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
