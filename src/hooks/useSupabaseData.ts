// ============================================
// SUPABASE DATA HOOKS
// Hooks para substituir dados mock por Supabase
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import * as supabaseData from '../services/supabaseData';
import type {
  Aluno,
  Professor,
  Turma,
  Disciplina,
  Aula,
  Frequencia,
  Nota,
  MaterialDidatico,
  Atividade,
  AtividadeResposta,
  Comunicado,
  ChatMensagem,
  Ocorrencia,
  UsuarioNotificacao,
  Evento,
  Avaliacao,
  PlanoAula,
  RecursoEducativo,
  Relatorio
} from '../types';

// ============================================
// HOOKS DE DADOS
// ============================================

export const useAlunos = (turmaId?: string) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getAlunos(turmaId);
      setAlunos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar alunos';
      setError(message);
      console.error('Erro ao carregar alunos:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [turmaId]);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  const createAluno = async (aluno: Partial<Aluno>) => {
    try {
      const result = await supabaseData.createAluno(aluno);
      if (result) {
        await fetchAlunos();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar aluno');
      return null;
    }
  };

  const updateAluno = async (id: string, aluno: Partial<Aluno>) => {
    try {
      const result = await supabaseData.updateAluno(id, aluno);
      if (result) {
        await fetchAlunos();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar aluno');
      return null;
    }
  };

  const deleteAluno = async (id: string) => {
    try {
      const result = await supabaseData.deleteAluno(id);
      if (result) {
        await fetchAlunos();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir aluno');
      return false;
    }
  };

  return {
    alunos,
    loading,
    error,
    refetch: fetchAlunos,
    createAluno,
    updateAluno,
    deleteAluno
  };
};

export const useProfessores = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getProfessores();
      setProfessores(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar professores';
      setError(message);
      console.error('Erro ao carregar professores:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessores();
  }, [fetchProfessores]);

  const createProfessor = async (professor: Partial<Professor>) => {
    try {
      const result = await supabaseData.createProfessor(professor);
      if (result) {
        await fetchProfessores();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar professor');
      return null;
    }
  };

  const updateProfessor = async (id: string, professor: Partial<Professor>) => {
    try {
      const result = await supabaseData.updateProfessor(id, professor);
      if (result) {
        await fetchProfessores();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar professor');
      return null;
    }
  };

  return {
    professores,
    loading,
    error,
    refetch: fetchProfessores,
    createProfessor,
    updateProfessor
  };
};

export const useTurmas = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurmas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getTurmas();
      setTurmas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar turmas';
      setError(message);
      console.error('Erro ao carregar turmas:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTurmas();
  }, [fetchTurmas]);

  const createTurma = async (turma: Partial<Turma>) => {
    try {
      const result = await supabaseData.createTurma(turma);
      if (result) {
        await fetchTurmas();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar turma');
      return null;
    }
  };

  const updateTurma = async (id: string, turma: Partial<Turma>) => {
    try {
      const result = await supabaseData.updateTurma(id, turma);
      if (result) {
        await fetchTurmas();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar turma');
      return null;
    }
  };

  return {
    turmas,
    loading,
    error,
    refetch: fetchTurmas,
    createTurma,
    updateTurma
  };
};

export const useDisciplinas = (professorId?: string) => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisciplinas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getDisciplinas(professorId);
      setDisciplinas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar disciplinas';
      setError(message);
      console.error('Erro ao carregar disciplinas:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [professorId]);

  useEffect(() => {
    fetchDisciplinas();
  }, [fetchDisciplinas]);

  return {
    disciplinas,
    loading,
    error,
    refetch: fetchDisciplinas
  };
};

export const useAulas = (turmaId?: string, disciplinaId?: string) => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAulas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getAulas(turmaId, disciplinaId);
      setAulas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar aulas';
      setError(message);
      console.error('Erro ao carregar aulas:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [turmaId, disciplinaId]);

  useEffect(() => {
    fetchAulas();
  }, [fetchAulas]);

  const createAula = async (aula: Partial<Aula>) => {
    try {
      const result = await supabaseData.createAula(aula);
      if (result) {
        await fetchAulas();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar aula');
      return null;
    }
  };

  return {
    aulas,
    loading,
    error,
    refetch: fetchAulas,
    createAula
  };
};

export const useFrequencia = (aulaId: string) => {
  const [frequencias, setFrequencias] = useState<Frequencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFrequencias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getFrequencia(aulaId);
      setFrequencias(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar frequência';
      setError(message);
      console.error('Erro ao carregar frequência:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [aulaId]);

  useEffect(() => {
    if (aulaId) {
      fetchFrequencias();
    }
  }, [fetchFrequencias, aulaId]);

  const registrarFrequencia = async (frequenciasData: Partial<Frequencia>[]) => {
    try {
      const result = await supabaseData.registrarFrequencia(frequenciasData);
      if (result) {
        await fetchFrequencias();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao registrar frequência');
      return false;
    }
  };

  return {
    frequencias,
    loading,
    error,
    refetch: fetchFrequencias,
    registrarFrequencia
  };
};

export const useNotas = (alunoId?: string, disciplinaId?: string, turmaId?: string) => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getNotas(alunoId, disciplinaId, turmaId);
      setNotas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar notas';
      setError(message);
      console.error('Erro ao carregar notas:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [alunoId, disciplinaId, turmaId]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const registrarNota = async (nota: Partial<Nota>) => {
    try {
      const result = await supabaseData.registrarNota(nota);
      if (result) {
        await fetchNotas();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao registrar nota');
      return null;
    }
  };

  return {
    notas,
    loading,
    error,
    refetch: fetchNotas,
    registrarNota
  };
};

export const useMateriais = (professorId?: string, disciplinaId?: string) => {
  const [materiais, setMateriais] = useState<MaterialDidatico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMateriais = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getMateriais(professorId, disciplinaId);
      setMateriais(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar materiais';
      setError(message);
      console.error('Erro ao carregar materiais:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [professorId, disciplinaId]);

  useEffect(() => {
    fetchMateriais();
  }, [fetchMateriais]);

  const createMaterial = async (material: Partial<MaterialDidatico>) => {
    try {
      const result = await supabaseData.createMaterial(material);
      if (result) {
        await fetchMateriais();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar material');
      return null;
    }
  };

  return {
    materiais,
    loading,
    error,
    refetch: fetchMateriais,
    createMaterial
  };
};

export const useAtividades = (turmaId?: string, disciplinaId?: string) => {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAtividades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getAtividades(turmaId, disciplinaId);
      setAtividades(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar atividades';
      setError(message);
      console.error('Erro ao carregar atividades:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [turmaId, disciplinaId]);

  useEffect(() => {
    fetchAtividades();
  }, [fetchAtividades]);

  const createAtividade = async (atividade: Partial<Atividade>) => {
    try {
      const result = await supabaseData.createAtividade(atividade);
      if (result) {
        await fetchAtividades();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar atividade');
      return null;
    }
  };

  return {
    atividades,
    loading,
    error,
    refetch: fetchAtividades,
    createAtividade
  };
};

export const useAtividadeById = (id: string) => {
  const [atividade, setAtividade] = useState<Atividade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAtividade = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getAtividadeById(id);
      setAtividade(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar atividade';
      setError(message);
      console.error('Erro ao carregar atividade:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAtividade();
    }
  }, [fetchAtividade, id]);

  return {
    atividade,
    loading,
    error,
    refetch: fetchAtividade
  };
};

export const useRespostasAtividade = (atividadeId: string) => {
  const [respostas, setRespostas] = useState<AtividadeResposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRespostas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getRespostasAtividade(atividadeId);
      setRespostas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar respostas';
      setError(message);
      console.error('Erro ao carregar respostas:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [atividadeId]);

  useEffect(() => {
    if (atividadeId) {
      fetchRespostas();
    }
  }, [fetchRespostas, atividadeId]);

  const enviarResposta = async (resposta: Partial<AtividadeResposta>) => {
    try {
      const result = await supabaseData.enviarRespostaAtividade(resposta);
      if (result) {
        await fetchRespostas();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar resposta');
      return null;
    }
  };

  return {
    respostas,
    loading,
    error,
    refetch: fetchRespostas,
    enviarResposta
  };
};

export const useComunicados = (turmaId?: string, role?: string) => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComunicados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getComunicados(turmaId, role);
      setComunicados(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar comunicados';
      setError(message);
      console.error('Erro ao carregar comunicados:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [turmaId, role]);

  useEffect(() => {
    fetchComunicados();
  }, [fetchComunicados]);

  const createComunicado = async (comunicado: Partial<Comunicado>) => {
    try {
      const result = await supabaseData.createComunicado(comunicado);
      if (result) {
        await fetchComunicados();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar comunicado');
      return null;
    }
  };

  return {
    comunicados,
    loading,
    error,
    refetch: fetchComunicados,
    createComunicado
  };
};

export const useChat = (turmaId: string) => {
  const [mensagens, setMensagens] = useState<ChatMensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSubscription] = useState<any>(null);

  const fetchMensagens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getMensagensChat(turmaId);
      setMensagens(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar mensagens';
      setError(message);
      console.error('Erro ao carregar mensagens:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [turmaId]);

  useEffect(() => {
    if (turmaId) {
      fetchMensagens();

      // Configurar subscription real-time
      const sub = supabaseData.subscribeToChat(turmaId, (novaMensagem) => {
        setMensagens(prev => [...prev, novaMensagem]);
      });

      setSubscription(sub);

      return () => {
        if (sub) {
          supabaseData.unsubscribeFromChannel(sub);
        }
      };
    }
  }, [fetchMensagens, turmaId]);

  const enviarMensagem = async (mensagem: Partial<ChatMensagem>) => {
    try {
      const result = await supabaseData.enviarMensagemChat(mensagem);
      // A mensagem já será adicionada via subscription
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
      return null;
    }
  };

  return {
    mensagens,
    loading,
    error,
    refetch: fetchMensagens,
    enviarMensagem
  };
};

export const useOcorrencias = (alunoId?: string, turmaId?: string) => {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOcorrencias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getOcorrencias(alunoId, turmaId);
      setOcorrencias(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar ocorrências';
      setError(message);
      console.error('Erro ao carregar ocorrências:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [alunoId, turmaId]);

  useEffect(() => {
    fetchOcorrencias();
  }, [fetchOcorrencias]);

  const registrarOcorrencia = async (ocorrencia: Partial<Ocorrencia>) => {
    try {
      const result = await supabaseData.registrarOcorrencia(ocorrencia);
      if (result) {
        await fetchOcorrencias();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao registrar ocorrência');
      return null;
    }
  };

  return {
    ocorrencias,
    loading,
    error,
    refetch: fetchOcorrencias,
    registrarOcorrencia
  };
};

export const useNotificacoes = () => {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState<UsuarioNotificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSubscription] = useState<any>(null);

  const fetchNotificacoes = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getNotificacoes(user.id);
      setNotificacoes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar notificações';
      setError(message);
      console.error('Erro ao carregar notificações:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchNotificacoes();

      // Configurar subscription real-time
      const sub = supabaseData.subscribeToNotificacoes(user.id, (novaNotificacao) => {
        setNotificacoes(prev => [novaNotificacao, ...prev]);
      });

      setSubscription(sub);

      return () => {
        if (sub) {
          supabaseData.unsubscribeFromChannel(sub);
        }
      };
    }
  }, [fetchNotificacoes, user?.id]);

  const marcarComoLida = async (notificacaoId: string) => {
    try {
      const result = await supabaseData.marcarNotificacaoLida(notificacaoId);
      if (result) {
        setNotificacoes(prev =>
          prev.map(n => n.id === notificacaoId ? { ...n, lido: true } : n)
        );
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao marcar notificação como lida');
      return false;
    }
  };

  return {
    notificacoes,
    loading,
    error,
    refetch: fetchNotificacoes,
    marcarComoLida
  };
};

export const useEventos = (mes?: string) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getEventos(mes);
      setEventos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar eventos';
      setError(message);
      console.error('Erro ao carregar eventos:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [mes]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const createEvento = async (evento: Partial<Evento>) => {
    try {
      const result = await supabaseData.createEvento(evento);
      if (result) {
        await fetchEventos();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar evento');
      return null;
    }
  };

  return {
    eventos,
    loading,
    error,
    refetch: fetchEventos,
    createEvento
  };
};

export const useAvaliacoes = (turmaId?: string, disciplinaId?: string) => {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvaliacoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getAvaliacoes(turmaId, disciplinaId);
      setAvaliacoes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar avaliações';
      setError(message);
      console.error('Erro ao carregar avaliações:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [turmaId, disciplinaId]);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  const createAvaliacao = async (avaliacao: Partial<Avaliacao>) => {
    try {
      const result = await supabaseData.createAvaliacao(avaliacao);
      if (result) {
        await fetchAvaliacoes();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar avaliação');
      return null;
    }
  };

  return {
    avaliacoes,
    loading,
    error,
    refetch: fetchAvaliacoes,
    createAvaliacao
  };
};

export const usePlanoAula = (id: string) => {
  const [plano, setPlano] = useState<PlanoAula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlano = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getPlanoAulaById(id);
      setPlano(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar plano de aula';
      setError(message);
      console.error('Erro ao carregar plano de aula:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPlano();
    }
  }, [fetchPlano, id]);

  const createPlanoAula = async (planoData: Partial<PlanoAula>) => {
    try {
      const result = await supabaseData.createPlanoAula(planoData);
      if (result) {
        await fetchPlano();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar plano de aula');
      return null;
    }
  };

  return {
    plano,
    loading,
    error,
    refetch: fetchPlano,
    createPlanoAula
  };
};

export const useRecursosEducativos = (professorId?: string) => {
  const [recursos, setRecursos] = useState<RecursoEducativo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecursos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getRecursosEducativos(professorId);
      setRecursos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar recursos educativos';
      setError(message);
      console.error('Erro ao carregar recursos educativos:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [professorId]);

  useEffect(() => {
    fetchRecursos();
  }, [fetchRecursos]);

  const createRecurso = async (recurso: Partial<RecursoEducativo>) => {
    try {
      const result = await supabaseData.createRecursoEducativo(recurso);
      if (result) {
        await fetchRecursos();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar recurso educativo');
      return null;
    }
  };

  return {
    recursos,
    loading,
    error,
    refetch: fetchRecursos,
    createRecurso
  };
};

export const useRelatorios = () => {
  const { user } = useAuth();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatorios = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getRelatorios(user.id);
      setRelatorios(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar relatórios';
      setError(message);
      console.error('Erro ao carregar relatórios:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRelatorios();
  }, [fetchRelatorios]);

  const createRelatorio = async (relatorio: Partial<Relatorio>) => {
    try {
      const result = await supabaseData.createRelatorio(relatorio);
      if (result) {
        await fetchRelatorios();
      }
      return result;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar relatório');
      return null;
    }
  };

  return {
    relatorios,
    loading,
    error,
    refetch: fetchRelatorios,
    createRelatorio
  };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<{
    totalAlunos: number;
    totalProfessores: number;
    totalTurmas: number;
    totalDisciplinas: number;
    atividadesPendentes: number;
    eventosProximos: number;
  }>({
    totalAlunos: 0,
    totalProfessores: 0,
    totalTurmas: 0,
    totalDisciplinas: 0,
    atividadesPendentes: 0,
    eventosProximos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseData.getDashboardStats();
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar estatísticas';
      setError(message);
      console.error('Erro ao carregar estatísticas:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
