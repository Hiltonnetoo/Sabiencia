// ============================================
// ACCESSIBILITY HELPERS - Utilitários de acessibilidade
// ============================================

/**
 * Gera IDs únicos para aria-describedby
 */
export const generateAriaId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formata texto para screen readers
 * Ex: "15/11/2025" -> "15 de novembro de 2025"
 */
export const formatForScreenReader = {
  date: (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  },
  
  time: (timeStr: string): string => {
    return timeStr.replace(':', ' horas e ') + ' minutos';
  },
  
  currency: (value: number): string => {
    return `${value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}`;
  },
  
  percentage: (value: number): string => {
    return `${value} por cento`;
  },
  
  phone: (phone: string): string => {
    // "11 98765-4321" -> "11 9 8765 4321"
    return phone.replace(/(\d{2})\s?(\d{1})(\d{4})-?(\d{4})/, '$1 $2 $3 $4');
  },
  
  cpf: (cpf: string): string => {
    // "123.456.789-00" -> "1 2 3 ponto 4 5 6 ponto..."
    return cpf.split('').join(' ').replace(/\./g, ' ponto ').replace(/-/g, ' traço ');
  },
};

/**
 * Retorna descrição de status para screen readers
 */
export const getStatusDescription = (status: string): string => {
  const descriptions: Record<string, string> = {
    ativo: 'Status: Ativo',
    inativo: 'Status: Inativo',
    pendente: 'Status: Pendente',
    aprovado: 'Status: Aprovado',
    reprovado: 'Status: Reprovado',
    em_andamento: 'Status: Em andamento',
    concluido: 'Status: Concluído',
    cancelado: 'Status: Cancelado',
    pago: 'Status: Pago',
    em_atraso: 'Status: Em atraso',
    vencido: 'Status: Vencido',
  };
  
  return descriptions[status] || `Status: ${status}`;
};

/**
 * Retorna texto de contagem para screen readers
 */
export const getCountDescription = (count: number, singular: string, plural: string): string => {
  if (count === 0) return `Nenhum ${singular}`;
  if (count === 1) return `1 ${singular}`;
  return `${count} ${plural}`;
};

/**
 * Gera aria-label descritivo para botões de ação
 */
export const getActionLabel = (
  action: 'edit' | 'delete' | 'view' | 'download' | 'share',
  itemName: string,
  itemType?: string
): string => {
  const actions = {
    edit: 'Editar',
    delete: 'Excluir',
    view: 'Visualizar',
    download: 'Baixar',
    share: 'Compartilhar',
  };
  
  const typeLabel = itemType ? ` ${itemType}` : '';
  return `${actions[action]}${typeLabel}: ${itemName}`;
};

/**
 * Gera aria-label para paginação
 */
export const getPaginationLabel = (currentPage: number, totalPages: number): string => {
  return `Página ${currentPage} de ${totalPages}`;
};

/**
 * Gera aria-label para progresso
 */
export const getProgressLabel = (current: number, total: number, unit?: string): string => {
  const percentage = Math.round((current / total) * 100);
  const unitLabel = unit ? ` ${unit}` : '';
  return `${current} de ${total}${unitLabel}, ${percentage}% completo`;
};

/**
 * Gera descrição de navegação para breadcrumbs
 */
export const getBreadcrumbLabel = (items: string[]): string => {
  return `Você está em: ${items.join(', depois ')}`;
};

/**
 * Detecta se há suporte a screen reader
 */
export const hasScreenReaderSupport = (): boolean => {
  return typeof window !== 'undefined' && 
         (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
          'speechSynthesis' in window);
};

/**
 * Anuncia mensagem para screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Verifica se elemento está visível para screen readers
 */
export const isVisibleToScreenReader = (element: HTMLElement): boolean => {
  return (
    element.getAttribute('aria-hidden') !== 'true' &&
    element.style.display !== 'none' &&
    element.style.visibility !== 'hidden'
  );
};

/**
 * Gera descrição de tabela para screen readers
 */
export const getTableDescription = (
  rows: number,
  columns: number,
  caption?: string
): string => {
  const baseDesc = `Tabela com ${rows} linhas e ${columns} colunas`;
  return caption ? `${caption}. ${baseDesc}` : baseDesc;
};

/**
 * Gera aria-label para ordenação de tabela
 */
export const getSortLabel = (
  column: string,
  currentSort?: { column: string; direction: 'asc' | 'desc' }
): string => {
  if (currentSort?.column === column) {
    const direction = currentSort.direction === 'asc' ? 'crescente' : 'decrescente';
    return `${column}, ordenado ${direction}. Clique para inverter ordem`;
  }
  return `${column}, não ordenado. Clique para ordenar`;
};

/**
 * Gera descrição de filtro aplicado
 */
export const getFilterDescription = (filters: Record<string, any>): string => {
  const activeFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${value}`);
  
  if (activeFilters.length === 0) {
    return 'Nenhum filtro aplicado';
  }
  
  return `${activeFilters.length} filtros aplicados: ${activeFilters.join(', ')}`;
};
