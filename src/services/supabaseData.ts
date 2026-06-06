// ============================================
// SUPABASE DATA SERVICE
// Substitui todas as chamadas de dados mock por Supabase
// ============================================

import { supabase } from '../lib/supabase';
import type { 
  Aluno, 
  Professor, 
  Gestor, 
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
  Relatorio,
  Usuario
} from '../types';

// ============================================
// ALUNOS
// ============================================

export const getAlunos = async (turmaId?: string): Promise<Aluno[]> => {
  try {
    let query = supabase
      .from('alunos')
      .select(`
        *,
        turmas:nome
      `)
      .eq('ativo', true);

    if (turmaId) {
      query = query.eq('turma_id', turmaId);
    }

    const { data, error } = await query.order('nome');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    throw error;
  }
};

export const getAlunoById = async (id: string): Promise<Aluno | null> => {
  try {
    const { data, error } = await supabase
      .from('alunos')
      .select(`
        *,
        turmas(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    throw error;
  }
};

export const createAluno = async (aluno: Partial<Aluno>): Promise<Aluno | null> => {
  try {
    const { data, error } = await supabase
      .from('alunos')
      .insert([aluno])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    throw error;
  }
};

export const updateAluno = async (id: string, aluno: Partial<Aluno>): Promise<Aluno | null> => {
  try {
    const { data, error } = await supabase
      .from('alunos')
      .update(aluno)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    throw error;
  }
};

export const deleteAluno = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alunos')
      .update({ ativo: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    throw error;
  }
};

// ============================================
// PROFESSORES
// ============================================

export const getProfessores = async (): Promise<Professor[]> => {
  try {
    const { data, error } = await supabase
      .from('professores')
      .select('id, cpf, email, role, nome_completo, telefone, foto_url, ativo, created_at, especialidades, formacao, registro_profissional')
      .eq('ativo', true)
      .order('nome_completo');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    throw error;
  }
};

export const getProfessorById = async (id: string): Promise<Professor | null> => {
  try {
    const { data, error } = await supabase
      .from('professores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    throw error;
  }
};

export const createProfessor = async (professor: Partial<Professor>): Promise<Professor | null> => {
  try {
    const { data, error } = await supabase
      .from('professores')
      .insert([professor])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    throw error;
  }
};

export const updateProfessor = async (id: string, professor: Partial<Professor>): Promise<Professor | null> => {
  try {
    const { data, error } = await supabase
      .from('professores')
      .update(professor)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);
    throw error;
  }
};

// ============================================
// GESTORES
// ============================================

export const getGestores = async (): Promise<Gestor[]> => {
  try {
    const { data, error } = await supabase
      .from('gestores')
      .select('id, cpf, email, role, nome_completo, telefone, foto_url, ativo, created_at, cargo')
      .eq('ativo', true)
      .order('nome_completo');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar gestores:', error);
    throw error;
  }
};

export const getGestorById = async (id: string): Promise<Gestor | null> => {
  try {
    const { data, error } = await supabase
      .from('gestores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar gestor:', error);
    throw error;
  }
};

// ============================================
// TURMAS
// ============================================

export const getTurmas = async (): Promise<Turma[]> => {
  try {
    const { data, error } = await supabase
      .from('turmas')
      .select(`
        *,
        professores:nome,
        count:alunos(count)
      `)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    throw error;
  }
};

export const getTurmaById = async (id: string): Promise<Turma | null> => {
  try {
    const { data, error } = await supabase
      .from('turmas')
      .select(`
        *,
        professores(*),
        alunos(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar turma:', error);
    throw error;
  }
};

export const createTurma = async (turma: Partial<Turma>): Promise<Turma | null> => {
  try {
    const { data, error } = await supabase
      .from('turmas')
      .insert([turma])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar turma:', error);
    throw error;
  }
};

export const updateTurma = async (id: string, turma: Partial<Turma>): Promise<Turma | null> => {
  try {
    const { data, error } = await supabase
      .from('turmas')
      .update(turma)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    throw error;
  }
};

// ============================================
// DISCIPLINAS
// ============================================

export const getDisciplinas = async (professorId?: string): Promise<Disciplina[]> => {
  try {
    let query = supabase
      .from('disciplinas')
      .select(`
        *,
        professores:nome,
        count:turmas_disciplinas(count)
      `)
      .eq('ativo', true);

    if (professorId) {
      query = query.eq('professor_id', professorId);
    }

    const { data, error } = await query.order('nome');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    throw error;
  }
};

export const getDisciplinaById = async (id: string): Promise<Disciplina | null> => {
  try {
    const { data, error } = await supabase
      .from('disciplinas')
      .select(`
        *,
        professores(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar disciplina:', error);
    throw error;
  }
};

// ============================================
// AULAS
// ============================================

export const getAulas = async (turmaId?: string, disciplinaId?: string): Promise<Aula[]> => {
  try {
    let query = supabase
      .from('aulas')
      .select(`
        *,
        turmas:nome,
        disciplinas:nome,
        professores:nome
      `)
      .gte('data', new Date().toISOString().split('T')[0]) // Aulas futuras e de hoje
      .order('data', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (turmaId) {
      query = query.eq('turma_id', turmaId);
    }

    if (disciplinaId) {
      query = query.eq('disciplina_id', disciplinaId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    throw error;
  }
};

export const createAula = async (aula: Partial<Aula>): Promise<Aula | null> => {
  try {
    const { data, error } = await supabase
      .from('aulas')
      .insert([aula])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    throw error;
  }
};

// ============================================
// FREQUÊNCIA
// ============================================

export const getFrequencia = async (aulaId: string): Promise<Frequencia[]> => {
  try {
    const { data, error } = await supabase
      .from('frequencias')
      .select(`
        *,
        alunos:nome
      `)
      .eq('aula_id', aulaId)
      .order('aluno_id');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar frequência:', error);
    throw error;
  }
};

export const registrarFrequencia = async (frequencias: Partial<Frequencia>[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('frequencias')
      .insert(frequencias);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao registrar frequência:', error);
    throw error;
  }
};

// ============================================
// NOTAS
// ============================================

export const getNotas = async (alunoId?: string, disciplinaId?: string, turmaId?: string): Promise<Nota[]> => {
  try {
    let query = supabase
      .from('notas')
      .select(`
        *,
        alunos:nome,
        disciplinas:nome,
        avaliacoes:titulo
      `)
      .order('data_avaliacao', { ascending: false });

    if (alunoId) {
      query = query.eq('aluno_id', alunoId);
    }

    if (disciplinaId) {
      query = query.eq('disciplina_id', disciplinaId);
    }

    if (turmaId) {
      query = query.eq('turma_id', turmaId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    throw error;
  }
};

export const registrarNota = async (nota: Partial<Nota>): Promise<Nota | null> => {
  try {
    const { data, error } = await supabase
      .from('notas')
      .insert([nota])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao registrar nota:', error);
    throw error;
  }
};

// ============================================
// MATERIAIS DIDÁTICOS
// ============================================

export const getMateriais = async (professorId?: string, disciplinaId?: string): Promise<MaterialDidatico[]> => {
  try {
    let query = supabase
      .from('materiais_didaticos')
      .select(`
        *,
        professores:nome,
        disciplinas:nome
      `)
      .eq('ativo', true)
      .order('titulo');

    if (professorId) {
      query = query.eq('professor_id', professorId);
    }

    if (disciplinaId) {
      query = query.eq('disciplina_id', disciplinaId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
    throw error;
  }
};

export const createMaterial = async (material: Partial<MaterialDidatico>): Promise<MaterialDidatico | null> => {
  try {
    const { data, error } = await supabase
      .from('materiais_didaticos')
      .insert([material])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar material:', error);
    throw error;
  }
};

// ============================================
// ATIVIDADES
// ============================================

export const getAtividades = async (turmaId?: string, disciplinaId?: string): Promise<Atividade[]> => {
  try {
    let query = supabase
      .from('atividades')
      .select(`
        *,
        professores:nome,
        disciplinas:nome,
        turmas:nome
      `)
      .eq('ativo', true)
      .order('prazo_entrega', { ascending: true });

    if (turmaId) {
      query = query.eq('turma_id', turmaId);
    }

    if (disciplinaId) {
      query = query.eq('disciplina_id', disciplinaId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    throw error;
  }
};

export const getAtividadeById = async (id: string): Promise<Atividade | null> => {
  try {
    const { data, error } = await supabase
      .from('atividades')
      .select(`
        *,
        professores(*),
        disciplinas(*),
        turmas(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar atividade:', error);
    throw error;
  }
};

export const createAtividade = async (atividade: Partial<Atividade>): Promise<Atividade | null> => {
  try {
    const { data, error } = await supabase
      .from('atividades')
      .insert([atividade])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    throw error;
  }
};

// ============================================
// RESPOSTAS DE ATIVIDADES
// ============================================

export const getRespostasAtividade = async (atividadeId: string): Promise<AtividadeResposta[]> => {
  try {
    const { data, error } = await supabase
      .from('atividades_respostas')
      .select(`
        *,
        alunos:nome
      `)
      .eq('atividade_id', atividadeId)
      .order('data_envio', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    throw error;
  }
};

export const enviarRespostaAtividade = async (resposta: Partial<AtividadeResposta>): Promise<AtividadeResposta | null> => {
  try {
    const { data, error } = await supabase
      .from('atividades_respostas')
      .insert([resposta])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao enviar resposta:', error);
    throw error;
  }
};

// ============================================
// COMUNICADOS
// ============================================

export const getComunicados = async (turmaId?: string, role?: string): Promise<Comunicado[]> => {
  try {
    let query = supabase
      .from('comunicados')
      .select(`
        *,
        professores:nome,
        gestores:nome
      `)
      .eq('ativo', true)
      .order('data_criacao', { ascending: false });

    if (turmaId) {
      query = query.eq('turma_id', turmaId);
    }

    if (role === 'aluno') {
      query = query.or('destinatario.eq.todos,destinatario.eq.alunos');
    } else if (role === 'professor') {
      query = query.or('destinatario.eq.todos,destinatario.eq.professores');
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar comunicados:', error);
    throw error;
  }
};

export const createComunicado = async (comunicado: Partial<Comunicado>): Promise<Comunicado | null> => {
  try {
    const { data, error } = await supabase
      .from('comunicados')
      .insert([comunicado])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar comunicado:', error);
    throw error;
  }
};

// ============================================
// CHAT
// ============================================

export const getMensagensChat = async (turmaId: string, limit: number = 50): Promise<ChatMensagem[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_mensagens')
      .select(`
        *,
        alunos:nome,
        professores:nome,
        gestores:nome
      `)
      .eq('turma_id', turmaId)
      .order('data_envio', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ? data.reverse() : []; // Reverter para ordem cronológica
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw error;
  }
};

export const enviarMensagemChat = async (mensagem: Partial<ChatMensagem>): Promise<ChatMensagem | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_mensagens')
      .insert([mensagem])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};

// ============================================
// OCORRÊNCIAS
// ============================================

export const getOcorrencias = async (alunoId?: string, turmaId?: string): Promise<Ocorrencia[]> => {
  try {
    let query = supabase
      .from('ocorrencias')
      .select(`
        *,
        alunos:nome,
        professores:nome,
        gestores:nome
      `)
      .order('data_ocorrencia', { ascending: false });

    if (alunoId) {
      query = query.eq('aluno_id', alunoId);
    }

    if (turmaId) {
      query = query.eq('turma_id', turmaId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ocorrências:', error);
    throw error;
  }
};

export const registrarOcorrencia = async (ocorrencia: Partial<Ocorrencia>): Promise<Ocorrencia | null> => {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .insert([ocorrencia])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao registrar ocorrência:', error);
    throw error;
  }
};

// ============================================
// NOTIFICAÇÕES
// ============================================

export const getNotificacoes = async (usuarioId: string): Promise<UsuarioNotificacao[]> => {
  try {
    const { data, error } = await supabase
      .from('usuario_notificacoes')
      .select(`
        *,
        notificacoes(*)
      `)
      .eq('usuario_id', usuarioId)
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    throw error;
  }
};

export const marcarNotificacaoLida = async (notificacaoId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('usuario_notificacoes')
      .update({ lido: true, lido_em: new Date().toISOString() })
      .eq('id', notificacaoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error;
  }
};

// ============================================
// EVENTOS
// ============================================

export const getEventos = async (mes?: string): Promise<Evento[]> => {
  try {
    let query = supabase
      .from('eventos')
      .select('*')
      .gte('data_evento', new Date().toISOString().split('T')[0]) // Eventos futuros e de hoje
      .order('data_evento', { ascending: true });

    if (mes) {
      const [ano, mesNum] = mes.split('-');
      const startDate = `${ano}-${mesNum}-01`;
      const endDate = new Date(parseInt(ano), parseInt(mesNum), 0).toISOString().split('T')[0];
      
      query = query
        .gte('data_evento', startDate)
        .lte('data_evento', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }
};

export const createEvento = async (evento: Partial<Evento>): Promise<Evento | null> => {
  try {
    const { data, error } = await supabase
      .from('eventos')
      .insert([evento])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw error;
  }
};

// ============================================
// AVALIAÇÕES
// ============================================

export const getAvaliacoes = async (turmaId?: string, disciplinaId?: string): Promise<Avaliacao[]> => {
  try {
    let query = supabase
      .from('avaliacoes')
      .select(`
        *,
        disciplinas:nome,
        turmas:nome
      `)
      .eq('ativo', true)
      .order('data_avaliacao', { ascending: true });

    if (turmaId) {
      query = query.eq('turma_id', turmaId);
    }

    if (disciplinaId) {
      query = query.eq('disciplina_id', disciplinaId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw error;
  }
};

export const createAvaliacao = async (avaliacao: Partial<Avaliacao>): Promise<Avaliacao | null> => {
  try {
    const { data, error } = await supabase
      .from('avaliacoes')
      .insert([avaliacao])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    throw error;
  }
};

// ============================================
// PLANOS DE AULA
// ============================================

export const getPlanoAulaById = async (id: string): Promise<PlanoAula | null> => {
  try {
    const { data, error } = await supabase
      .from('planos_aula')
      .select(`
        *,
        professores:nome,
        disciplinas:nome,
        turmas:nome
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar plano de aula:', error);
    throw error;
  }
};

export const createPlanoAula = async (plano: Partial<PlanoAula>): Promise<PlanoAula | null> => {
  try {
    const { data, error } = await supabase
      .from('planos_aula')
      .insert([plano])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar plano de aula:', error);
    throw error;
  }
};

// ============================================
// RECURSOS EDUCATIVOS
// ============================================

export const getRecursosEducativos = async (professorId?: string): Promise<RecursoEducativo[]> => {
  try {
    let query = supabase
      .from('recursos_educativos')
      .select(`
        *,
        professores:nome
      `)
      .eq('ativo', true)
      .order('titulo');

    if (professorId) {
      query = query.eq('professor_id', professorId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar recursos educativos:', error);
    throw error;
  }
};

export const createRecursoEducativo = async (recurso: Partial<RecursoEducativo>): Promise<RecursoEducativo | null> => {
  try {
    const { data, error } = await supabase
      .from('recursos_educativos')
      .insert([recurso])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar recurso educativo:', error);
    throw error;
  }
};

// ============================================
// RELATÓRIOS
// ============================================

export const getRelatorios = async (usuarioId: string): Promise<Relatorio[]> => {
  try {
    const { data, error } = await supabase
      .from('relatorios')
      .select(`
        *,
        usuarios:nome
      `)
      .eq('usuario_id', usuarioId)
      .order('data_geracao', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    throw error;
  }
};

export const createRelatorio = async (relatorio: Partial<Relatorio>): Promise<Relatorio | null> => {
  try {
    const { data, error } = await supabase
      .from('relatorios')
      .insert([relatorio])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar relatório:', error);
    throw error;
  }
};

// ============================================
// ESTATÍSTICAS E DASHBOARD
// ============================================

export const getDashboardStats = async (): Promise<{
  totalAlunos: number;
  totalProfessores: number;
  totalTurmas: number;
  totalDisciplinas: number;
  atividadesPendentes: number;
  eventosProximos: number;
}> => {
  try {
    const [
      { count: totalAlunos },
      { count: totalProfessores },
      { count: totalTurmas },
      { count: totalDisciplinas },
      { count: atividadesPendentes },
      { count: eventosProximos }
    ] = await Promise.all([
      supabase.from('alunos').select('*', { count: 'exact', head: true }).eq('ativo', true),
      supabase.from('professores').select('*', { count: 'exact', head: true }).eq('ativo', true),
      supabase.from('turmas').select('*', { count: 'exact', head: true }).eq('ativo', true),
      supabase.from('disciplinas').select('*', { count: 'exact', head: true }).eq('ativo', true),
      supabase.from('atividades').select('*', { count: 'exact', head: true }).eq('ativo', true).gte('prazo_entrega', new Date().toISOString()),
      supabase.from('eventos').select('*', { count: 'exact', head: true }).gte('data_evento', new Date().toISOString())
    ]);

    return {
      totalAlunos: totalAlunos || 0,
      totalProfessores: totalProfessores || 0,
      totalTurmas: totalTurmas || 0,
      totalDisciplinas: totalDisciplinas || 0,
      atividadesPendentes: atividadesPendentes || 0,
      eventosProximos: eventosProximos || 0
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};

// ============================================
// FUNÇÕES DE SUPORTE
// ============================================

export const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    const fileName = `${path}/${Date.now()}-${file.name}`;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    throw error;
  }
};

export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw error;
  }
};

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export const subscribeToChat = (turmaId: string, callback: (mensagem: ChatMensagem) => void) => {
  return supabase
    .channel(`chat:${turmaId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_mensagens',
        filter: `turma_id=eq.${turmaId}`
      }, 
      (payload) => {
        callback(payload.new as ChatMensagem);
      }
    )
    .subscribe();
};

export const subscribeToNotificacoes = (usuarioId: string, callback: (notificacao: UsuarioNotificacao) => void) => {
  return supabase
    .channel(`notificacoes:${usuarioId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'usuario_notificacoes',
        filter: `usuario_id=eq.${usuarioId}`
      }, 
      (payload) => {
        callback(payload.new as UsuarioNotificacao);
      }
    )
    .subscribe();
};

export const unsubscribeFromChannel = (channel: any) => {
  if (channel) {
    supabase.removeChannel(channel);
  }
};