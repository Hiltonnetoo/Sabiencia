// ============================================
// FORMATTERS - Funções de formatação
// ============================================

/**
 * Formata CPF: 000.000.000-00
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
};

/**
 * Remove formatação do CPF
 */
export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

/**
 * Formata telefone: (00) 00000-0000
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  // Formato antigo (8 dígitos)
  const match8 = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
  if (match8) {
    return `(${match8[1]}) ${match8[2]}-${match8[3]}`;
  }
  return phone;
};

/**
 * Formata CEP: 00000-000
 */
export const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{5})(\d{3})$/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return cep;
};

/**
 * Formata data: dd/MM/yyyy
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formata data com hora: dd/MM/yyyy HH:mm
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formata moeda: R$ 0.000,00
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Calcula idade a partir da data de nascimento
 */
export const calculateAge = (birthDate: Date | string): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Obtém iniciais do nome para avatar
 */
export const getInitials = (nome: string): string => {
  if (!nome) return '?';
  
  const parts = nome.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Formata nome (primeira letra maiúscula)
 */
export const formatName = (nome: string): string => {
  return nome
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formata número com separador de milhares
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('pt-BR');
};

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Formata percentual: 0.00%
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Trunca texto com reticências
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formata período (manhã, tarde, noite)
 */
export const formatPeriodo = (periodo: 'manha' | 'tarde' | 'noite'): string => {
  const periodos = {
    manha: 'Manhã',
    tarde: 'Tarde',
    noite: 'Noite'
  };
  return periodos[periodo] || periodo;
};

/**
 * Formata status de matrícula
 */
export const formatStatusMatricula = (status: string): string => {
  const statuses: Record<string, string> = {
    ativo: 'Ativo',
    trancado: 'Trancado',
    concluido: 'Concluído',
    evadido: 'Evadido'
  };
  return statuses[status] || status;
};

/**
 * Formata status de frequência
 */
export const formatStatusFrequencia = (status: string): string => {
  const statuses: Record<string, string> = {
    presente: 'Presente',
    ausente: 'Ausente',
    justificado: 'Justificado'
  };
  return statuses[status] || status;
};

/**
 * Formata status de pagamento
 */
export const formatStatusPagamento = (status: string): string => {
  const statuses: Record<string, string> = {
    pendente: 'Pendente',
    pago: 'Pago',
    vencido: 'Vencido',
    cancelado: 'Cancelado'
  };
  return statuses[status] || status;
};

/**
 * Retorna tempo relativo (ex: "há 2 dias")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `há ${years} ano${years > 1 ? 's' : ''}`;
  if (months > 0) return `há ${months} ${months > 1 ? 'meses' : 'mês'}`;
  if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
  if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'agora mesmo';
};
