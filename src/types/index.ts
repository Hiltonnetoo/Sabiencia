// ============================================
// TYPES - SISTEMA SABIENCIA
// ============================================

export type Role = 'aluno' | 'professor' | 'gestor';

export type StatusMatricula = 'ativo' | 'trancado' | 'concluido' | 'evadido';

export type StatusFrequencia = 'presente' | 'ausente' | 'justificado';

export type StatusPagamento = 'pendente' | 'pago' | 'vencido' | 'cancelado';

export type TipoComunicado = 'todos_alunos' | 'todos_professores' | 'turma_especifica' | 'individual';

export type PrioridadeComunicado = 'baixa' | 'normal' | 'alta' | 'urgente';

export type TipoObservacao = 'pedagogica' | 'comportamental' | 'administrativa';

export type Periodo = 'manha' | 'tarde' | 'noite' | 'integral';

export type TipoMaterial = 'pdf' | 'video';

export type TipoConteudoAula = 'video' | 'pdf' | 'atividade' | 'teste' | 'extra';

export type TipoNotificacao = 'academico' | 'financeiro' | 'sistema' | 'comunicado' | 'frequencia' | 'nota' | 'material';

export type PrioridadeNotificacao = 'info' | 'success' | 'warning' | 'error';


// ============================================
// USER & PROFILE
// ============================================

export interface User {
  id: string;
  cpf: string;
  email: string;
  role: Role;
  nome_completo: string;
  telefone?: string;
  foto_url?: string;
  ativo: boolean;
  created_at: Date;
  data_nascimento?: any;
  celular?: string;
  endereco?: any;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface Aluno extends User {
  role: 'aluno';
  data_nascimento: Date;
  rg?: string;
  sexo?: 'M' | 'F' | 'Outro';
  estado_civil?: string;
  endereco?: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  nome_responsavel?: string;
  telefone_responsavel?: string;
  curso_nome?: string;
  status?: string;
  matricula?: any;
  turma_id?: string;
}

export interface Professor extends User {
  role: 'professor';
  especialidades: string[];
  formacao: string;
  registro_profissional?: string;
  especializacao?: string;
  data_nascimento?: any;
  status?: string;
}

export interface Gestor extends User {
  role: 'gestor';
  cargo: string;
}


// ============================================
// ACADEMIC STRUCTURE
// ============================================

export interface Curso {
  id: string;
  nome: string;
  descricao: string;
  carga_horaria: number;
  duracao_meses: number;
  ativo: boolean;
  created_at: Date;
}

export interface Disciplina {
  id: string;
  curso_id: string;
  nome: string;
  descricao: string;
  carga_horaria: number;
  ordem: number;
  ementa?: string;
  created_at: Date;
  codigo?: string;
  curso_nome?: string;
}

export interface Turma {
  id: string;
  Identity?: string;
  curso_id: string;
  nome: string;
  data_inicio: Date;
  data_fim: Date;
  periodo: Periodo;
  ativa: boolean;
  ativo?: boolean;
  created_at: Date;
  codigo?: string;
  curso_nome?: string;
  total_alunos?: number;
  turno?: string;
  professor_responsavel_id?: string;
}

export interface ProfessorTurmaDisciplina {
  id: string;
  professor_id: string;
  turma_id: string;
  disciplina_id: string;
  created_at: Date;
}

export interface Matricula {
  id: string;
  aluno_id: string;
  turma_id: string;
  data_matricula: Date;
  status: StatusMatricula;
  data_conclusao?: Date;
  created_at: Date;
  numero_matricula?: string;
}


// ============================================
// ACADEMIC DATA
// ============================================

export interface Frequencia {
  id: string;
  aluno_id: string;
  disciplina_id: string;
  turma_id: string;
  professor_id: string;
  data_aula: Date;
  status: StatusFrequencia;
  observacao?: string;
  created_at: Date;
  presencas?: number;
  total_aulas?: number;
}

export interface Nota {
  id: string;
  aluno_id: string;
  disciplina_id: string;
  turma_id: string;
  professor_id: string;
  tipo_avaliacao: string;
  nota: number;
  peso: number;
  data_avaliacao: Date;
  observacao?: string;
  created_at: Date;
  av1?: number;
  av2?: number;
  av3?: number;
}

export interface Material {
  id: string;
  disciplina_id: string;
  professor_id: string;
  titulo: string;
  descricao: string;
  tipo: TipoMaterial;
  url?: string; // URL do PDF ou YouTube
  thumbnail_url?: string;
  tamanho_kb?: number; // Para PDFs
  duracao_segundos?: number; // Para vídeos
  modulo: string;
  tags: string[];
  visivel_para_alunos: boolean;
  visivel_alunos?: boolean;
  permite_download: boolean;
  data_upload: Date;
  disciplina_nome?: string;
}

export interface Observacao {
  id: string;
  aluno_id: string;
  professor_id: string;
  disciplina_id?: string;
  tipo: TipoObservacao;
  conteudo: string;
  visivel_aluno: boolean;
  created_at: Date;
  titulo?: string;
  aluno_nome?: string;
}


// ============================================
// FINANCIAL
// ============================================

export interface Pagamento {
  id: string;
  aluno_id: string;
  valor: number;
  data_vencimento: Date;
  data_pagamento?: Date;
  status: StatusPagamento;
  metodo_pagamento?: string;
  comprovante_url?: string;
  observacao?: string;
  created_at: Date;
  aluno_nome?: string;
}


// ============================================
// COMMUNICATION
// ============================================

export interface Comunicado {
  id: string;
  remetente_id: string;
  titulo: string;
  mensagem: string;
  destinatarios: TipoComunicado;
  turma_id?: string;
  aluno_id?: string;
  prioridade: PrioridadeComunicado;
  permitir_resposta: boolean;
  data_envio: Date;
  created_at: Date;
  conteudo?: string;
}

export interface ComunicadoLeitura {
  id: string;
  comunicado_id: string;
  usuario_id: string;
  data_leitura: Date;
  created_at: Date;
}

export interface RespostaComunicado {
  id: string;
  comunicado_id: string;
  usuario_id: string;
  mensagem: string;
  created_at: Date;
}

export interface ComunicadoComDetalhes extends Comunicado {
  remetente?: User;
  turma?: Turma;
  aluno?: Aluno;
  total_leituras?: number;
  total_destinatarios?: number;
  lido?: boolean;
  data_leitura?: Date;
}


// ============================================
// NOTIFICATIONS
// ============================================

export interface Notificacao {
  id: string;
  usuario_id: string;
  tipo: TipoNotificacao;
  prioridade: PrioridadeNotificacao;
  titulo: string;
  mensagem: string;
  link?: string;
  lida: boolean;
  data_leitura?: Date;
  created_at: Date;
}


// ============================================
// AUDIT
// ============================================

export interface LogAuditoria {
  id: string;
  user_id: string;
  acao: string;
  tabela: string;
  registro_id: string;
  dados_anteriores?: any;
  dados_novos?: any;
  ip_address: string;
  created_at: Date;
}


// ============================================
// VIEW MODELS (para telas)
// ============================================

export interface AlunoComDetalhes extends Aluno {
  curso?: Curso;
  turma?: Turma;
  matricula?: Matricula;
  frequencia_geral?: number;
  media_geral?: number;
}

export interface TurmaComDetalhes extends Turma {
  curso?: Curso;
  total_alunos: number;
  professores?: Professor[];
}

export interface MaterialComDetalhes extends Material {
  disciplina?: Disciplina;
  professor?: Professor;
  turma?: Turma;
}

export interface DashboardStats {
  total_alunos: number;
  total_professores: number;
  total_turmas: number;
  frequencia_geral: number;
  inadimplentes: number;
  novos_alunos_mes: number;
}


// ============================================
// AULAS E CONTEÚDOS (novo sistema)
// ============================================

export interface Modulo {
  id: string;
  disciplina_id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  created_at: Date;
}

export interface Aula {
  id: string;
  modulo_id: string;
  disciplina_id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  duracao_minutos?: number;
  created_at: Date;
}

export interface ConteudoAula {
  id: string;
  aula_id: string;
  tipo: TipoConteudoAula;
  titulo: string;
  descricao?: string;
  url?: string; // URL do vídeo (YouTube/Vimeo) ou arquivo PDF
  arquivo_url?: string; // URL do arquivo hospedado
  duracao_segundos?: number; // Para vídeos
  tamanho_kb?: number; // Para PDFs
  ordem: number;
  visivel: boolean;
  obrigatorio: boolean;
  created_at: Date;
}

export interface ProgressoAula {
  id: string;
  aluno_id: string;
  aula_id: string;
  conteudo_id?: string;
  concluido: boolean;
  percentual_assistido?: number; // Para vídeos
  tempo_assistido_segundos?: number;
  ultima_visualizacao: Date;
  created_at: Date;
}

export interface Evento {
  id: string;
  criador_id: string; // Professor ou Gestor
  titulo: string;
  descricao: string;
  tipo: 'palestra' | 'workshop' | 'aula_ao_vivo' | 'evento_social' | 'extracurricular';
  data_inicio: Date;
  data_fim: Date;
  local_tipo: 'online' | 'presencial';
  local_link?: string; // Link para evento online
  local_endereco?: string; // Endereço para presencial
  vagas_limitadas: boolean;
  total_vagas?: number;
  publico: 'todos' | 'curso_especifico' | 'turma_especifica';
  curso_id?: string;
  turma_id?: string;
  emitir_certificado: boolean;
  imagem_url?: string;
  ativo: boolean;
  created_at: Date;
}

export interface InscricaoEvento {
  id: string;
  evento_id: string;
  usuario_id: string;
  presente?: boolean;
  data_inscricao: Date;
  created_at: Date;
}


// ============================================
// CUPONS E PROMOÇÕES
// ============================================

export interface Cupom {
  id: string;
  codigo: string;
  descricao: string;
  tipo_desconto: 'percentual' | 'valor_fixo';
  valor_desconto: number;
  valor_minimo_compra?: number;
  data_inicio: Date;
  data_fim: Date;
  limite_uso?: number;
  usos_atuais: number;
  limite_por_usuario?: number;
  cursos_aplicaveis?: string[]; // IDs dos cursos, vazio = todos
  ativo: boolean;
  created_at: Date;
}

export interface UsoCupom {
  id: string;
  cupom_id: string;
  aluno_id: string;
  pagamento_id: string;
  valor_desconto_aplicado: number;
  data_uso: Date;
  created_at: Date;
}

export interface Questionario {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'satisfacao_curso' | 'avaliacao_professor' | 'feedback_instituicao' | 'pesquisa_personalizada';
  ativo: boolean;
  obrigatorio: boolean;
  anonimo: boolean;
  data_inicio: Date;
  data_fim?: Date;
  publico: 'todos' | 'curso_especifico' | 'turma_especifica';
  curso_id?: string;
  turma_id?: string;
  created_at: Date;
}

export interface PerguntaQuestionario {
  id: string;
  questionario_id: string;
  texto: string;
  tipo: 'multipla_escolha' | 'escala' | 'texto_curto' | 'texto_longo' | 'sim_nao';
  opcoes?: string[]; // Para múltipla escolha
  escala_min?: number; // Para escala
  escala_max?: number;
  obrigatoria: boolean;
  ordem: number;
  created_at: Date;
}

export interface RespostaQuestionario {
  id: string;
  questionario_id: string;
  pergunta_id: string;
  usuario_id?: string; // null se anônimo
  resposta: string;
  data_resposta: Date;
  created_at: Date;
}

export interface Certificado {
  id: string;
  aluno_id: string;
  tipo: 'conclusao_curso' | 'participacao_evento' | 'aprovacao_disciplina' | 'horas_complementares';
  referencia_id: string; // ID do curso, evento ou disciplina
  titulo: string;
  descricao: string;
  carga_horaria?: number;
  data_emissao: Date;
  codigo_validacao: string;
  url_pdf?: string;
  created_at: Date;
}

// ============================================
// VIDEOAULAS E AULAS AO VIVO
// ============================================

export * from './videoaulas';

// ============================================
// COMPATIBILITY TYPES FOR SUPABASE DATA
// ============================================
export type MaterialDidatico = any;
export type Atividade = any;
export type AtividadeResposta = any;
export type ChatMensagem = any;
export type Ocorrencia = any;
export type UsuarioNotificacao = any;
export type Avaliacao = any;
export type PlanoAula = any;
export type RecursoEducativo = any;
export type Relatorio = any;
export type Usuario = User;

