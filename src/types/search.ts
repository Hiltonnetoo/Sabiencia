// ============================================
// TYPES - Tipos para o sistema de busca global
// ============================================

export type SearchCategory = 
  | 'alunos'
  | 'professores'
  | 'turmas'
  | 'disciplinas'
  | 'materiais'
  | 'comunicados'
  | 'observacoes'
  | 'notificacoes'
  | 'pagamentos';

export interface SearchResult {
  id: string;
  type: SearchCategory;
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  result?: SearchResult;
}

export interface SearchFilters {
  categories?: SearchCategory[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const CATEGORY_LABELS: Record<SearchCategory, string> = {
  alunos: 'Alunos',
  professores: 'Professores',
  turmas: 'Turmas',
  disciplinas: 'Disciplinas',
  materiais: 'Materiais',
  comunicados: 'Comunicados',
  observacoes: 'Observações',
  notificacoes: 'Notificações',
  pagamentos: 'Pagamentos',
};

export const CATEGORY_ICONS: Record<SearchCategory, string> = {
  alunos: '👨‍🎓',
  professores: '👨‍🏫',
  turmas: '👥',
  disciplinas: '📚',
  materiais: '📄',
  comunicados: '📢',
  observacoes: '📝',
  notificacoes: '🔔',
  pagamentos: '💰',
};
