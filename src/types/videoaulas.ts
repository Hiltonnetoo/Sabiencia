// ============================================
// TYPES - Videoaulas e Aulas ao Vivo
// ============================================

// ============================================
// TÓPICOS (NOVO - Estrutura hierárquica)
// ============================================

export interface TopicoDisciplina {
  id: string;
  disciplina_id: string;
  titulo: string; // "Tópico 1: Compreensão de texto"
  descricao?: string;
  ordem: number;
  criado_em: Date;
  atualizado_em: Date;
}

// ============================================
// VIDEOAULAS
// ============================================

export interface Videoaula {
  id: string;
  disciplina_id: string;
  topico_id: string; // NOVO: Referência ao tópico
  titulo: string;
  descricao: string;
  youtube_url: string; // URL privada/não listada do YouTube
  youtube_id: string; // ID do vídeo extraído da URL
  duracao_segundos: number;
  ordem_dentro_topico: number; // NOVO: Ordem dentro do tópico (1, 2, 3...)
  thumbnail_url?: string;
  materiais_anexos: MaterialAnexo[];
  quiz_id?: string;
  visivel: boolean;
  criado_por: string; // ID do professor/gestor
  criado_em: Date;
  atualizado_em: Date;
}

export interface MaterialAnexo {
  id: string;
  tipo: 'pdf' | 'slide' | 'documento' | 'link';
  titulo: string;
  url: string;
  tamanho_kb?: number;
}

export interface ProgressoVideoaula {
  id: string;
  aluno_id: string;
  videoaula_id: string;
  tempo_assistido_segundos: number;
  ultima_posicao_segundos: number;
  concluida: boolean;
  percentual_assistido: number; // 0-100
  data_primeira_visualizacao: Date;
  data_ultima_visualizacao: Date;
  total_visualizacoes: number;
}

export interface AnotacaoAula {
  id: string;
  aluno_id: string;
  videoaula_id: string;
  conteudo: string;
  tempo_video_segundos?: number; // Opcional: momento do vídeo
  criado_em: Date;
  atualizado_em: Date;
}

export interface QuizAula {
  id: string;
  videoaula_id: string;
  titulo: string;
  descricao: string;
  questoes: QuestaoQuiz[];
  nota_minima_aprovacao: number; // 0-100
  permite_refazer: boolean;
  max_tentativas?: number;
  criado_em: Date;
}

export interface QuestaoQuiz {
  id: string;
  pergunta: string;
  tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa';
  opcoes?: OpcaoQuestao[]; // Apenas para múltipla escolha
  resposta_correta?: string; // ID da opção ou texto
  explicacao?: string; // Mostrada após responder
  peso: number; // Peso da questão na nota final
}

export interface OpcaoQuestao {
  id: string;
  texto: string;
  correta: boolean;
}

export interface RespostaQuiz {
  id: string;
  quiz_id: string;
  aluno_id: string;
  respostas: RespostaPergunta[];
  nota: number; // 0-100
  aprovado: boolean;
  tentativa: number;
  tempo_gasto_segundos: number;
  data_realizacao: Date;
}

export interface RespostaPergunta {
  questao_id: string;
  resposta: string; // ID da opção ou texto dissertativo
  correta: boolean;
  pontos_obtidos: number;
}

// ============================================
// AULAS AO VIVO
// ============================================

export interface AulaAoVivo {
  id: string;
  disciplina_id: string;
  turma_id?: string; // Opcional: se for para turma específica
  professor_id: string;
  titulo: string;
  descricao: string;
  data_inicio: Date;
  duracao_minutos: number;
  link_sala: string; // URL do Zoom, Google Meet, etc.
  plataforma: 'zoom' | 'google_meet' | 'teams' | 'jitsi' | 'outro';
  senha_sala?: string;
  status: 'agendada' | 'ao_vivo' | 'finalizada' | 'cancelada';
  max_participantes?: number;
  permite_chat: boolean;
  permite_camera_alunos: boolean;
  permite_microfone_alunos: boolean;
  notificacao_enviada: boolean;
  criado_em: Date;
  atualizado_em: Date;
}

export interface ParticipanteAulaAoVivo {
  id: string;
  aula_ao_vivo_id: string;
  usuario_id: string;
  usuario_nome: string;
  usuario_tipo: 'aluno' | 'professor' | 'gestor';
  entrou_em: Date;
  saiu_em?: Date;
  camera_ativada: boolean;
  microfone_ativado: boolean;
  online: boolean;
}

export interface MensagemChatAoVivo {
  id: string;
  aula_ao_vivo_id: string;
  usuario_id: string;
  usuario_nome: string;
  usuario_tipo: 'aluno' | 'professor' | 'gestor';
  mensagem: string;
  enviado_em: Date;
  editado: boolean;
  deletado: boolean;
}

export interface NotificacaoAulaAoVivo {
  id: string;
  aula_ao_vivo_id: string;
  usuario_id: string;
  tipo: 'agendamento' | 'lembrete_1h' | 'lembrete_10min' | 'inicio' | 'cancelamento';
  enviada: boolean;
  lida: boolean;
  enviada_em?: Date;
  criado_em: Date;
}

// ============================================
// NOTIFICAÇÕES (NOVO)
// ============================================

export interface NotificacaoVideoaula {
  id: string;
  usuario_id: string; // Aluno que receberá
  tipo: 'nova_videoaula' | 'novo_topico' | 'material_adicionado' | 'aula_ao_vivo_agendada';
  titulo: string;
  mensagem: string;
  disciplina_id: string;
  disciplina_nome?: string;
  videoaula_id?: string;
  topico_id?: string;
  aula_ao_vivo_id?: string;
  lida: boolean;
  criado_em: Date;
}

// ============================================
// ESTATÍSTICAS E ANALYTICS
// ============================================

export interface EstatisticasVideoaula {
  videoaula_id: string;
  total_visualizacoes: number;
  total_alunos_assistiram: number;
  total_alunos_concluiram: number;
  taxa_conclusao: number; // 0-100
  tempo_medio_assistido_segundos: number;
  taxa_retencao: number; // Quantos % assistem até o final
  media_quiz?: number;
  taxa_aprovacao_quiz?: number;
}

export interface EstatisticasAluno {
  aluno_id: string;
  disciplina_id?: string;
  total_videoaulas_disponiveis: number;
  total_videoaulas_assistidas: number;
  total_videoaulas_concluidas: number;
  percentual_conclusao: number; // 0-100
  tempo_total_assistido_horas: number;
  media_quizzes?: number;
  total_anotacoes: number;
  ultima_atividade: Date;
}

// ============================================
// FILTROS E PESQUISA
// ============================================

export interface FiltrosVideoaula {
  disciplina_id?: string;
  modulo?: string;
  status?: 'todas' | 'nao_assistidas' | 'em_andamento' | 'concluidas';
  ordem?: 'cronologica' | 'alfabetica' | 'duracao';
  busca?: string;
}

export interface FiltrosAulaAoVivo {
  disciplina_id?: string;
  status?: 'todas' | 'agendadas' | 'ao_vivo' | 'finalizadas';
  periodo?: 'hoje' | 'semana' | 'mes' | 'todos';
  busca?: string;
}