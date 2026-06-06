// ============================================
// VIDEOAULAS CONTEXT - Gerenciamento de videoaulas e aulas ao vivo
// ============================================

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import type { 
  Videoaula, 
  ProgressoVideoaula,
  AnotacaoAula,
  QuizAula,
  RespostaQuiz,
  AulaAoVivo,
  MensagemChatAoVivo,
  ParticipanteAulaAoVivo,
  TopicoDisciplina,
  NotificacaoVideoaula
} from '../types/videoaulas';

// ============================================
// TIPOS
// ============================================

interface VideoaulasContextType {
  // Tópicos
  topicos: TopicoDisciplina[];
  
  // Videoaulas
  videoaulas: Videoaula[];
  progressos: ProgressoVideoaula[];
  anotacoes: AnotacaoAula[];
  quizzes: QuizAula[];
  respostasQuizzes: RespostaQuiz[];
  
  // Aulas ao Vivo
  aulasAoVivo: AulaAoVivo[];
  mensagensChat: MensagemChatAoVivo[];
  participantes: ParticipanteAulaAoVivo[];
  
  // Ações - Tópicos
  getTopicosPorDisciplina: (disciplinaId: string) => TopicoDisciplina[];
  criarTopico: (topico: Omit<TopicoDisciplina, 'id' | 'criado_em' | 'atualizado_em'>) => void;
  editarTopico: (topicoId: string, dados: Partial<TopicoDisciplina>) => void;
  deletarTopico: (topicoId: string) => void;
  
  // Ações - Videoaulas
  getVideoaulasPorDisciplina: (disciplinaId: string) => Videoaula[];
  getVideoaulasPorTopico: (topicoId: string) => Videoaula[];
  getProgressoAluno: (alunoId: string, videoaulaId: string) => ProgressoVideoaula | undefined;
  salvarProgresso: (progresso: Omit<ProgressoVideoaula, 'id'>) => void;
  marcarComoConcluida: (alunoId: string, videoaulaId: string) => void;
  
  // Ações - Anotações
  getAnotacoesPorVideoaula: (videoaulaId: string, alunoId: string) => AnotacaoAula[];
  salvarAnotacao: (anotacao: Omit<AnotacaoAula, 'id' | 'criado_em' | 'atualizado_em'>) => void;
  editarAnotacao: (anotacaoId: string, conteudo: string) => void;
  deletarAnotacao: (anotacaoId: string) => void;
  
  // Ações - Quiz
  getQuizPorVideoaula: (videoaulaId: string) => QuizAula | undefined;
  getRespostasQuiz: (quizId: string, alunoId: string) => RespostaQuiz[];
  submeterQuiz: (resposta: Omit<RespostaQuiz, 'id' | 'data_realizacao'>, alunoId: string) => void;
  
  // Ações - Aulas ao Vivo
  getAulasAoVivoPorDisciplina: (disciplinaId: string) => AulaAoVivo[];
  getAulasAoVivoAgendadas: () => AulaAoVivo[];
  criarAulaAoVivo: (aula: Omit<AulaAoVivo, 'id' | 'criado_em' | 'atualizado_em'>) => void;
  editarAulaAoVivo: (aulaId: string, dados: Partial<AulaAoVivo>) => void;
  deletarAulaAoVivo: (aulaId: string) => void;
  iniciarAula: (aulaId: string) => void;
  finalizarAula: (aulaId: string) => void;
  
  // Ações - Chat
  getMensagensChat: (aulaAoVivoId: string) => MensagemChatAoVivo[];
  enviarMensagemChat: (aulaAoVivoId: string, usuarioId: string, usuarioNome: string, usuarioTipo: 'aluno' | 'professor' | 'gestor', mensagem: string) => void;
  
  // Ações - Videoaulas (Professor/Gestor)
  criarVideoaula: (videoaula: Omit<Videoaula, 'id' | 'criado_em' | 'atualizado_em'>) => void;
  editarVideoaula: (videoaulaId: string, dados: Partial<Videoaula>) => void;
  deletarVideoaula: (videoaulaId: string) => void;
}

const VideoaulasContext = createContext<VideoaulasContextType | undefined>(undefined);

// ============================================
// DADOS MOCK
// ============================================

const mockTopicos: TopicoDisciplina[] = [
  {
    id: 't1',
    disciplina_id: 'd1', // Matemática Básica
    titulo: 'Módulo 1 - Fundamentos',
    descricao: 'Conceitos básicos de matemática.',
    ordem: 1,
    criado_em: new Date('2024-01-15'),
    atualizado_em: new Date('2024-01-15')
  },
  {
    id: 't2',
    disciplina_id: 'd1',
    titulo: 'Módulo 2 - Álgebra',
    descricao: 'Equações e funções.',
    ordem: 2,
    criado_em: new Date('2024-01-20'),
    atualizado_em: new Date('2024-01-20')
  }
];

const mockVideoaulas: Videoaula[] = [
  {
    id: 'v1',
    disciplina_id: 'd1', // Matemática Básica
    topico_id: 't1',
    titulo: '1 - Introdução aos Números Reais',
    descricao: 'Nesta aula vamos estudar os conjuntos numéricos e as propriedades dos números reais.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtube_id: 'dQw4w9WgXcQ',
    duracao_segundos: 1200, // 20 min
    ordem_dentro_topico: 1,
    thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    materiais_anexos: [
      {
        id: 'm1',
        tipo: 'pdf',
        titulo: 'Slides da Aula 1',
        url: '#',
        tamanho_kb: 2048
      }
    ],
    quiz_id: 'q1',
    visivel: true,
    criado_por: 'prof1',
    criado_em: new Date('2024-01-15'),
    atualizado_em: new Date('2024-01-15')
  },
  {
    id: 'v2',
    disciplina_id: 'd1',
    topico_id: 't1',
    titulo: '2 - Operações com Frações',
    descricao: 'Aprenda a somar, subtrair, multiplicar e dividir frações de forma prática.',
    youtube_url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    youtube_id: 'jNQXAC9IVRw',
    duracao_segundos: 1800, // 30 min
    ordem_dentro_topico: 2,
    materiais_anexos: [
      {
        id: 'm2',
        tipo: 'pdf',
        titulo: 'Lista de Exercícios - Frações',
        url: '#',
        tamanho_kb: 1024
      }
    ],
    quiz_id: 'q2',
    visivel: true,
    criado_por: 'prof1',
    criado_em: new Date('2024-01-16'),
    atualizado_em: new Date('2024-01-16')
  },
  {
    id: 'v3',
    disciplina_id: 'd1',
    topico_id: 't2',
    titulo: '1 - Equações do 1º Grau',
    descricao: 'Resolução de equações lineares e aplicações práticas.',
    youtube_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    youtube_id: '9bZkp7q19f0',
    duracao_segundos: 2400, // 40 min
    ordem_dentro_topico: 1,
    materiais_anexos: [],
    visivel: true,
    criado_por: 'prof1',
    criado_em: new Date('2024-01-20'),
    atualizado_em: new Date('2024-01-20')
  }
];

const mockProgressos: ProgressoVideoaula[] = [
  {
    id: 'p1',
    aluno_id: 'aluno1',
    videoaula_id: 'v1',
    tempo_assistido_segundos: 1200,
    ultima_posicao_segundos: 1200,
    concluida: true,
    percentual_assistido: 100,
    data_primeira_visualizacao: new Date('2024-11-01'),
    data_ultima_visualizacao: new Date('2024-11-01'),
    total_visualizacoes: 1
  },
  {
    id: 'p2',
    aluno_id: 'aluno1',
    videoaula_id: 'v2',
    tempo_assistido_segundos: 900,
    ultima_posicao_segundos: 900,
    concluida: false,
    percentual_assistido: 50,
    data_primeira_visualizacao: new Date('2024-11-02'),
    data_ultima_visualizacao: new Date('2024-11-05'),
    total_visualizacoes: 3
  }
];

const mockAnotacoes: AnotacaoAula[] = [
  {
    id: 'a1',
    aluno_id: 'aluno1',
    videoaula_id: 'v1',
    conteudo: 'Importante: Os números reais incluem racionais e irracionais',
    tempo_video_segundos: 300,
    criado_em: new Date('2024-11-01T10:30:00'),
    atualizado_em: new Date('2024-11-01T10:30:00')
  },
  {
    id: 'a2',
    aluno_id: 'aluno1',
    videoaula_id: 'v1',
    conteudo: 'Revisar a propriedade comutativa da adição',
    criado_em: new Date('2024-11-01T10:45:00'),
    atualizado_em: new Date('2024-11-01T10:45:00')
  }
];

const mockQuizzes: QuizAula[] = [
  {
    id: 'q1',
    videoaula_id: 'v1',
    titulo: 'Quiz - Números Reais',
    descricao: 'Teste seus conhecimentos sobre números reais',
    questoes: [
      {
        id: 'q1q1',
        pergunta: 'Qual dos seguintes conjuntos está contido nos números reais?',
        tipo: 'multipla_escolha',
        opcoes: [
          { id: 'op1', texto: 'Números Naturais', correta: true },
          { id: 'op2', texto: 'Números Imaginários', correta: false },
          { id: 'op3', texto: 'Números Complexos', correta: false },
          { id: 'op4', texto: 'Nenhuma das anteriores', correta: false }
        ],
        resposta_correta: 'op1',
        explicacao: 'Os números naturais (0, 1, 2, 3...) fazem parte dos números reais.',
        peso: 1
      },
      {
        id: 'q1q2',
        pergunta: 'O número PI (π) é um número racional?',
        tipo: 'verdadeiro_falso',
        resposta_correta: 'false',
        explicacao: 'PI é um número irracional, pois não pode ser expresso como fração de dois inteiros.',
        peso: 1
      }
    ],
    nota_minima_aprovacao: 70,
    permite_refazer: true,
    max_tentativas: 3,
    criado_em: new Date('2024-01-15')
  },
  {
    id: 'q2',
    videoaula_id: 'v2',
    titulo: 'Quiz - Operações com Frações',
    descricao: 'Avalie seu aprendizado sobre frações',
    questoes: [
      {
        id: 'q2q1',
        pergunta: 'Quanto é 1/2 + 1/4?',
        tipo: 'multipla_escolha',
        opcoes: [
          { id: 'op1', texto: '2/6', correta: false },
          { id: 'op2', texto: '3/4', correta: true },
          { id: 'op3', texto: '1/6', correta: false },
          { id: 'op4', texto: '2/4', correta: false }
        ],
        resposta_correta: 'op2',
        explicacao: '1/2 + 1/4 = 2/4 + 1/4 = 3/4',
        peso: 1
      }
    ],
    nota_minima_aprovacao: 70,
    permite_refazer: true,
    criado_em: new Date('2024-01-16')
  }
];

const mockRespostasQuizzes: RespostaQuiz[] = [];

const mockAulasAoVivo: AulaAoVivo[] = [
  {
    id: 'live1',
    disciplina_id: 'd1',
    turma_id: 't1',
    professor_id: 'prof1',
    titulo: 'Revisão para Prova - Matemática Básica',
    descricao: 'Vamos revisar todo o conteúdo do módulo 1 e 2, tirar dúvidas e fazer exercícios ao vivo.',
    data_inicio: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Daqui 2 dias
    duracao_minutos: 90,
    link_sala: 'https://meet.google.com/abc-defg-hij',
    plataforma: 'google_meet',
    status: 'agendada',
    max_participantes: 50,
    permite_chat: true,
    permite_camera_alunos: true,
    permite_microfone_alunos: true,
    notificacao_enviada: false,
    criado_em: new Date(),
    atualizado_em: new Date()
  },
  {
    id: 'live2',
    disciplina_id: 'd2', // Português
    professor_id: 'prof2',
    titulo: 'Aula ao Vivo - Interpretação de Textos',
    descricao: 'Técnicas avançadas de interpretação e análise textual.',
    data_inicio: new Date(Date.now() + 5 * 60 * 60 * 1000), // Daqui 5 horas
    duracao_minutos: 60,
    link_sala: 'https://zoom.us/j/123456789',
    plataforma: 'zoom',
    senha_sala: '12345',
    status: 'agendada',
    permite_chat: true,
    permite_camera_alunos: false,
    permite_microfone_alunos: true,
    notificacao_enviada: true,
    criado_em: new Date(),
    atualizado_em: new Date()
  }
];

const mockMensagensChat: MensagemChatAoVivo[] = [];
const mockParticipantes: ParticipanteAulaAoVivo[] = [];

// ============================================
// PROVIDER
// ============================================

export const VideoaulasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topicos, setTopicos] = useState<TopicoDisciplina[]>(mockTopicos);
  const [videoaulas, setVideoaulas] = useState<Videoaula[]>(mockVideoaulas);
  const [progressos, setProgressos] = useState<ProgressoVideoaula[]>(mockProgressos);
  
  const [anotacoes, setAnotacoes] = useState<AnotacaoAula[]>(() => {
    const saved = localStorage.getItem('sabiencia_anotacoes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((a: any) => ({
          ...a,
          criado_em: new Date(a.criado_em),
          atualizado_em: new Date(a.atualizado_em)
        }));
      } catch (e) {
        console.error('Erro ao ler anotações do localStorage:', e);
      }
    }
    return mockAnotacoes;
  });

  const [quizzes] = useState<QuizAula[]>(mockQuizzes);
  const [respostasQuizzes, setRespostasQuizzes] = useState<RespostaQuiz[]>(mockRespostasQuizzes);
  const [aulasAoVivo, setAulasAoVivo] = useState<AulaAoVivo[]>(mockAulasAoVivo);
  const [mensagensChat, setMensagensChat] = useState<MensagemChatAoVivo[]>(mockMensagensChat);
  const [participantes] = useState<ParticipanteAulaAoVivo[]>(mockParticipantes);

  // Persistir anotações no localStorage sempre que houver alteração
  React.useEffect(() => {
    localStorage.setItem('sabiencia_anotacoes', JSON.stringify(anotacoes));
  }, [anotacoes]);

  // ========== TÓPICOS ==========

  const getTopicosPorDisciplina = (disciplinaId: string) => {
    return topicos.filter(t => t.disciplina_id === disciplinaId);
  };

  const criarTopico = (topico: Omit<TopicoDisciplina, 'id' | 'criado_em' | 'atualizado_em'>) => {
    const novoTopico: TopicoDisciplina = {
      id: `t${Date.now()}`,
      ...topico,
      criado_em: new Date(),
      atualizado_em: new Date()
    };
    setTopicos(prev => [...prev, novoTopico]);
    toast.success('Tópico criado com sucesso!');
  };

  const editarTopico = (topicoId: string, dados: Partial<TopicoDisciplina>) => {
    setTopicos(prev => prev.map(t => 
      t.id === topicoId 
        ? { ...t, ...dados, atualizado_em: new Date() }
        : t
    ));
    toast.success('Tópico atualizado!');
  };

  const deletarTopico = (topicoId: string) => {
    setTopicos(prev => prev.filter(t => t.id !== topicoId));
    toast.success('Tópico removido!');
  };

  // ========== VIDEOAULAS ==========

  const getVideoaulasPorDisciplina = (disciplinaId: string) => {
    return videoaulas.filter(v => v.disciplina_id === disciplinaId && v.visivel);
  };

  const getVideoaulasPorTopico = (topicoId: string) => {
    return videoaulas.filter(v => v.topico_id === topicoId && v.visivel);
  };

  const getProgressoAluno = (alunoId: string, videoaulaId: string) => {
    return progressos.find(p => p.aluno_id === alunoId && p.videoaula_id === videoaulaId);
  };

  const salvarProgresso = (progresso: Omit<ProgressoVideoaula, 'id'>) => {
    const existente = progressos.find(
      p => p.aluno_id === progresso.aluno_id && p.videoaula_id === progresso.videoaula_id
    );

    if (existente) {
      setProgressos(prev => prev.map(p => 
        p.id === existente.id 
          ? { 
              ...p, 
              ...progresso,
              total_visualizacoes: p.total_visualizacoes + 1,
              data_ultima_visualizacao: new Date()
            }
          : p
      ));
    } else {
      const novoProgresso: ProgressoVideoaula = {
        id: `p${Date.now()}`,
        ...progresso,
        data_primeira_visualizacao: new Date(),
        data_ultima_visualizacao: new Date(),
        total_visualizacoes: 1
      };
      setProgressos(prev => [...prev, novoProgresso]);
    }
  };

  const marcarComoConcluida = (alunoId: string, videoaulaId: string) => {
    const videoaula = videoaulas.find(v => v.id === videoaulaId);
    if (!videoaula) return;

    salvarProgresso({
      aluno_id: alunoId,
      videoaula_id: videoaulaId,
      tempo_assistido_segundos: videoaula.duracao_segundos,
      ultima_posicao_segundos: videoaula.duracao_segundos,
      concluida: true,
      percentual_assistido: 100
    } as Omit<ProgressoVideoaula, 'id'>);

    toast.success('Aula marcada como concluída!');
  };

  // ========== ANOTAÇÕES ==========

  const getAnotacoesPorVideoaula = (videoaulaId: string, alunoId: string) => {
    return anotacoes.filter(a => a.videoaula_id === videoaulaId && a.aluno_id === alunoId);
  };

  const salvarAnotacao = (anotacao: Omit<AnotacaoAula, 'id' | 'criado_em' | 'atualizado_em'>) => {
    const novaAnotacao: AnotacaoAula = {
      id: `a${Date.now()}`,
      ...anotacao,
      criado_em: new Date(),
      atualizado_em: new Date()
    };
    setAnotacoes(prev => [...prev, novaAnotacao]);
  };

  const editarAnotacao = (anotacaoId: string, conteudo: string) => {
    setAnotacoes(prev => prev.map(a => 
      a.id === anotacaoId 
        ? { ...a, conteudo, atualizado_em: new Date() }
        : a
    ));
  };

  const deletarAnotacao = (anotacaoId: string) => {
    setAnotacoes(prev => prev.filter(a => a.id !== anotacaoId));
  };

  // ========== QUIZ ==========

  const getQuizPorVideoaula = (videoaulaId: string) => {
    const videoaula = videoaulas.find(v => v.id === videoaulaId);
    if (!videoaula || !videoaula.quiz_id) return undefined;
    return quizzes.find(q => q.id === videoaula.quiz_id);
  };

  const getRespostasQuiz = (quizId: string, alunoId: string) => {
    return respostasQuizzes.filter(r => r.quiz_id === quizId && r.aluno_id === alunoId);
  };

  const submeterQuiz = (resposta: Omit<RespostaQuiz, 'id' | 'data_realizacao'>, alunoId: string) => {
    const novaResposta: RespostaQuiz = {
      id: `rq${Date.now()}`,
      ...resposta,
      aluno_id: alunoId,
      data_realizacao: new Date()
    };
    setRespostasQuizzes(prev => [...prev, novaResposta]);
  };

  // ========== AULAS AO VIVO ==========

  const getAulasAoVivoPorDisciplina = (disciplinaId: string) => {
    return aulasAoVivo.filter(a => a.disciplina_id === disciplinaId);
  };

  const getAulasAoVivoAgendadas = () => {
    return aulasAoVivo.filter(a => a.status === 'agendada' || a.status === 'ao_vivo');
  };

  const criarAulaAoVivo = (aula: Omit<AulaAoVivo, 'id' | 'criado_em' | 'atualizado_em'>) => {
    const novaAula: AulaAoVivo = {
      id: `live${Date.now()}`,
      ...aula,
      criado_em: new Date(),
      atualizado_em: new Date()
    };
    setAulasAoVivo(prev => [...prev, novaAula]);
    toast.success('Aula ao vivo criada com sucesso!');
  };

  const editarAulaAoVivo = (aulaId: string, dados: Partial<AulaAoVivo>) => {
    setAulasAoVivo(prev => prev.map(a => 
      a.id === aulaId 
        ? { ...a, ...dados, atualizado_em: new Date() }
        : a
    ));
    toast.success('Aula ao vivo atualizada!');
  };

  const deletarAulaAoVivo = (aulaId: string) => {
    setAulasAoVivo(prev => prev.filter(a => a.id !== aulaId));
    toast.success('Aula ao vivo removida!');
  };

  const iniciarAula = (aulaId: string) => {
    editarAulaAoVivo(aulaId, { status: 'ao_vivo' });
    toast.success('Aula iniciada!');
  };

  const finalizarAula = (aulaId: string) => {
    editarAulaAoVivo(aulaId, { status: 'finalizada' });
    toast.success('Aula finalizada!');
  };

  // ========== CHAT ==========

  const getMensagensChat = (aulaAoVivoId: string) => {
    return mensagensChat.filter(m => m.aula_ao_vivo_id === aulaAoVivoId && !m.deletado);
  };

  const enviarMensagemChat = (
    aulaAoVivoId: string, 
    usuarioId: string, 
    usuarioNome: string, 
    usuarioTipo: 'aluno' | 'professor' | 'gestor', 
    mensagem: string
  ) => {
    const novaMensagem: MensagemChatAoVivo = {
      id: `m${Date.now()}`,
      aula_ao_vivo_id: aulaAoVivoId,
      usuario_id: usuarioId,
      usuario_nome: usuarioNome,
      usuario_tipo: usuarioTipo,
      mensagem,
      enviado_em: new Date(),
      editado: false,
      deletado: false
    };
    setMensagensChat(prev => [...prev, novaMensagem]);
  };

  // ========== VIDEOAULAS (PROFESSOR/GESTOR) ==========

  const criarVideoaula = (videoaula: Omit<Videoaula, 'id' | 'criado_em' | 'atualizado_em'>) => {
    const novaVideoaula: Videoaula = {
      id: `v${Date.now()}`,
      ...videoaula,
      criado_em: new Date(),
      atualizado_em: new Date()
    };
    setVideoaulas(prev => [...prev, novaVideoaula]);
    toast.success('Videoaula criada com sucesso!');
  };

  const editarVideoaula = (videoaulaId: string, dados: Partial<Videoaula>) => {
    setVideoaulas(prev => prev.map(v => 
      v.id === videoaulaId 
        ? { ...v, ...dados, atualizado_em: new Date() }
        : v
    ));
    toast.success('Videoaula atualizada!');
  };

  const deletarVideoaula = (videoaulaId: string) => {
    setVideoaulas(prev => prev.filter(v => v.id !== videoaulaId));
    toast.success('Videoaula removida!');
  };

  const value: VideoaulasContextType = {
    topicos,
    videoaulas,
    progressos,
    anotacoes,
    quizzes,
    respostasQuizzes,
    aulasAoVivo,
    mensagensChat,
    participantes,
    getTopicosPorDisciplina,
    criarTopico,
    editarTopico,
    deletarTopico,
    getVideoaulasPorDisciplina,
    getVideoaulasPorTopico,
    getProgressoAluno,
    salvarProgresso,
    marcarComoConcluida,
    getAnotacoesPorVideoaula,
    salvarAnotacao,
    editarAnotacao,
    deletarAnotacao,
    getQuizPorVideoaula,
    getRespostasQuiz,
    submeterQuiz,
    getAulasAoVivoPorDisciplina,
    getAulasAoVivoAgendadas,
    criarAulaAoVivo,
    editarAulaAoVivo,
    deletarAulaAoVivo,
    iniciarAula,
    finalizarAula,
    getMensagensChat,
    enviarMensagemChat,
    criarVideoaula,
    editarVideoaula,
    deletarVideoaula
  };

  return (
    <VideoaulasContext.Provider value={value}>
      {children}
    </VideoaulasContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useVideoaulas = () => {
  const context = useContext(VideoaulasContext);
  if (!context) {
    throw new Error('useVideoaulas deve ser usado dentro de VideoaulasProvider');
  }
  return context;
};