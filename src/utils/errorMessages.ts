// ============================================
// ERROR MESSAGES - Mensagens de erro contextuais
// ============================================

/**
 * Tipo de erro
 */
export enum ErrorType {
  // Validação
  VALIDATION = 'validation',
  REQUIRED_FIELD = 'required_field',
  INVALID_FORMAT = 'invalid_format',
  
  // Autenticação
  AUTH_FAILED = 'auth_failed',
  UNAUTHORIZED = 'unauthorized',
  SESSION_EXPIRED = 'session_expired',
  
  // Rede
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  
  // Servidor
  SERVER_ERROR = 'server_error',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  
  // Permissões
  FORBIDDEN = 'forbidden',
  INSUFFICIENT_PERMISSIONS = 'insufficient_permissions',
  
  // Dados
  DUPLICATE_ENTRY = 'duplicate_entry',
  DATA_NOT_FOUND = 'data_not_found',
  INVALID_DATA = 'invalid_data',
  
  // Outros
  UNKNOWN = 'unknown',
}

/**
 * Mensagens de erro contextuais
 */
const errorMessages: Record<ErrorType, { title: string; message: string; action?: string }> = {
  // Validação
  [ErrorType.VALIDATION]: {
    title: 'Erro de Validação',
    message: 'Alguns campos não foram preenchidos corretamente.',
    action: 'Verifique os campos em vermelho e tente novamente.',
  },
  [ErrorType.REQUIRED_FIELD]: {
    title: 'Campo Obrigatório',
    message: 'Este campo é obrigatório.',
    action: 'Por favor, preencha o campo marcado.',
  },
  [ErrorType.INVALID_FORMAT]: {
    title: 'Formato Inválido',
    message: 'O formato do dado inserido está incorreto.',
    action: 'Verifique o formato esperado e tente novamente.',
  },
  
  // Autenticação
  [ErrorType.AUTH_FAILED]: {
    title: 'Falha na Autenticação',
    message: 'CPF ou senha incorretos.',
    action: 'Verifique suas credenciais e tente novamente.',
  },
  [ErrorType.UNAUTHORIZED]: {
    title: 'Não Autorizado',
    message: 'Você não tem permissão para acessar este recurso.',
    action: 'Entre com uma conta autorizada.',
  },
  [ErrorType.SESSION_EXPIRED]: {
    title: 'Sessão Expirada',
    message: 'Sua sessão expirou por inatividade.',
    action: 'Faça login novamente para continuar.',
  },
  
  // Rede
  [ErrorType.NETWORK_ERROR]: {
    title: 'Erro de Conexão',
    message: 'Não foi possível conectar ao servidor.',
    action: 'Verifique sua conexão com a internet e tente novamente.',
  },
  [ErrorType.TIMEOUT]: {
    title: 'Tempo Esgotado',
    message: 'A requisição demorou muito para responder.',
    action: 'Tente novamente em alguns instantes.',
  },
  
  // Servidor
  [ErrorType.SERVER_ERROR]: {
    title: 'Erro no Servidor',
    message: 'Ocorreu um erro interno no servidor.',
    action: 'Tente novamente mais tarde ou contate o suporte.',
  },
  [ErrorType.NOT_FOUND]: {
    title: 'Não Encontrado',
    message: 'O recurso solicitado não foi encontrado.',
    action: 'Verifique se o recurso ainda existe.',
  },
  [ErrorType.CONFLICT]: {
    title: 'Conflito de Dados',
    message: 'A operação conflita com dados existentes.',
    action: 'Verifique os dados e tente novamente.',
  },
  
  // Permissões
  [ErrorType.FORBIDDEN]: {
    title: 'Acesso Negado',
    message: 'Você não tem permissão para executar esta ação.',
    action: 'Solicite permissão ao administrador.',
  },
  [ErrorType.INSUFFICIENT_PERMISSIONS]: {
    title: 'Permissões Insuficientes',
    message: 'Seu perfil não tem as permissões necessárias.',
    action: 'Contate o administrador para obter acesso.',
  },
  
  // Dados
  [ErrorType.DUPLICATE_ENTRY]: {
    title: 'Registro Duplicado',
    message: 'Já existe um registro com estes dados.',
    action: 'Verifique se o CPF, email ou outro identificador já está cadastrado.',
  },
  [ErrorType.DATA_NOT_FOUND]: {
    title: 'Dados Não Encontrados',
    message: 'Os dados solicitados não foram encontrados.',
    action: 'Verifique se o registro ainda existe.',
  },
  [ErrorType.INVALID_DATA]: {
    title: 'Dados Inválidos',
    message: 'Os dados fornecidos são inválidos.',
    action: 'Revise os dados e tente novamente.',
  },
  
  // Outros
  [ErrorType.UNKNOWN]: {
    title: 'Erro Inesperado',
    message: 'Ocorreu um erro inesperado.',
    action: 'Tente novamente ou contate o suporte se o problema persistir.',
  },
};

/**
 * Obtém mensagem de erro contextual
 */
export const getErrorMessage = (
  type: ErrorType,
  customMessage?: string
): { title: string; message: string; action?: string } => {
  const error = errorMessages[type] || errorMessages[ErrorType.UNKNOWN];
  
  return {
    ...error,
    message: customMessage || error.message,
  };
};

/**
 * Detecta tipo de erro a partir de código HTTP
 */
export const getErrorTypeFromStatus = (status: number): ErrorType => {
  switch (status) {
    case 400:
      return ErrorType.VALIDATION;
    case 401:
      return ErrorType.UNAUTHORIZED;
    case 403:
      return ErrorType.FORBIDDEN;
    case 404:
      return ErrorType.NOT_FOUND;
    case 409:
      return ErrorType.CONFLICT;
    case 408:
    case 504:
      return ErrorType.TIMEOUT;
    case 500:
    case 502:
    case 503:
      return ErrorType.SERVER_ERROR;
    default:
      return ErrorType.UNKNOWN;
  }
};

/**
 * Detecta tipo de erro a partir de mensagem de erro
 */
export const getErrorTypeFromMessage = (message: string): ErrorType => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('cpf') || lowerMessage.includes('senha')) {
    return ErrorType.AUTH_FAILED;
  }
  if (lowerMessage.includes('duplica') || lowerMessage.includes('já existe')) {
    return ErrorType.DUPLICATE_ENTRY;
  }
  if (lowerMessage.includes('não encontrado') || lowerMessage.includes('not found')) {
    return ErrorType.NOT_FOUND;
  }
  if (lowerMessage.includes('permissão') || lowerMessage.includes('permission')) {
    return ErrorType.FORBIDDEN;
  }
  if (lowerMessage.includes('rede') || lowerMessage.includes('network')) {
    return ErrorType.NETWORK_ERROR;
  }
  if (lowerMessage.includes('timeout') || lowerMessage.includes('tempo esgotado')) {
    return ErrorType.TIMEOUT;
  }
  
  return ErrorType.UNKNOWN;
};
