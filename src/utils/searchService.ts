// ============================================
// SEARCH SERVICE - Serviço de busca global
// ============================================

import {
  Aluno,
  Professor,
  Turma,
  Disciplina,
  Material,
  Comunicado,
  Observacao,
  Notificacao,
  Pagamento,
  User,
} from '../types';
import { SearchResult, SearchCategory } from '../types/search';
import { formatCPF, formatCurrency, formatDate } from './formatters';

export class SearchService {
  /**
   * Busca em todas as entidades do sistema
   */
  static searchAll(
    query: string,
    data: {
      alunos: Aluno[];
      professores: Professor[];
      turmas: Turma[];
      disciplinas: Disciplina[];
      materiais: Material[];
      comunicados: Comunicado[];
      observacoes: Observacao[];
      notificacoes: Notificacao[];
      pagamentos: Pagamento[];
    },
    userRole: User['role'],
    categories?: SearchCategory[]
  ): SearchResult[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) return [];

    const results: SearchResult[] = [];

    // Buscar em alunos
    if (!categories || categories.includes('alunos')) {
      const alunosResults = this.searchAlunos(normalizedQuery, data.alunos, userRole);
      results.push(...alunosResults);
    }

    // Buscar em professores
    if (!categories || categories.includes('professores')) {
      const professoresResults = this.searchProfessores(normalizedQuery, data.professores, userRole);
      results.push(...professoresResults);
    }

    // Buscar em turmas
    if (!categories || categories.includes('turmas')) {
      const turmasResults = this.searchTurmas(normalizedQuery, data.turmas, userRole);
      results.push(...turmasResults);
    }

    // Buscar em disciplinas
    if (!categories || categories.includes('disciplinas')) {
      const disciplinasResults = this.searchDisciplinas(normalizedQuery, data.disciplinas, userRole);
      results.push(...disciplinasResults);
    }

    // Buscar em materiais
    if (!categories || categories.includes('materiais')) {
      const materiaisResults = this.searchMateriais(normalizedQuery, data.materiais, userRole);
      results.push(...materiaisResults);
    }

    // Buscar em comunicados
    if (!categories || categories.includes('comunicados')) {
      const comunicadosResults = this.searchComunicados(normalizedQuery, data.comunicados, userRole);
      results.push(...comunicadosResults);
    }

    // Buscar em observações
    if (!categories || categories.includes('observacoes')) {
      const observacoesResults = this.searchObservacoes(normalizedQuery, data.observacoes, userRole);
      results.push(...observacoesResults);
    }

    // Buscar em notificações
    if (!categories || categories.includes('notificacoes')) {
      const notificacoesResults = this.searchNotificacoes(normalizedQuery, data.notificacoes, userRole);
      results.push(...notificacoesResults);
    }

    // Buscar em pagamentos
    if (!categories || categories.includes('pagamentos')) {
      const pagamentosResults = this.searchPagamentos(normalizedQuery, data.pagamentos, userRole);
      results.push(...pagamentosResults);
    }

    return results;
  }

  /**
   * Busca em alunos
   */
  private static searchAlunos(query: string, alunos: Aluno[], userRole: User['role']): SearchResult[] {
    return alunos
      .filter(aluno => 
        aluno.nome_completo.toLowerCase().includes(query) ||
        aluno.email.toLowerCase().includes(query) ||
        formatCPF(aluno.cpf).includes(query) ||
        aluno.cpf.includes(query)
      )
      .map(aluno => ({
        id: aluno.id,
        type: 'alunos' as SearchCategory,
        title: aluno.nome_completo,
        subtitle: `${formatCPF(aluno.cpf)} • ${aluno.email}`,
        description: `Curso: ${aluno.curso_nome} • Status: ${aluno.status}`,
        url: userRole === 'gestor' ? `/gestor/alunos/${aluno.id}` : '#',
        metadata: { aluno },
      }));
  }

  /**
   * Busca em professores
   */
  private static searchProfessores(query: string, professores: Professor[], userRole: User['role']): SearchResult[] {
    return professores
      .filter(professor => 
        professor.nome_completo.toLowerCase().includes(query) ||
        professor.email.toLowerCase().includes(query) ||
        formatCPF(professor.cpf).includes(query) ||
        professor.cpf.includes(query) ||
        professor.especializacao?.toLowerCase().includes(query)
      )
      .map(professor => ({
        id: professor.id,
        type: 'professores' as SearchCategory,
        title: professor.nome_completo,
        subtitle: `${formatCPF(professor.cpf)} • ${professor.email}`,
        description: professor.especializacao ? `Especialização: ${professor.especializacao}` : undefined,
        url: userRole === 'gestor' ? `/gestor/professores/${professor.id}` : '#',
        metadata: { professor },
      }));
  }

  /**
   * Busca em turmas
   */
  private static searchTurmas(query: string, turmas: Turma[], userRole: User['role']): SearchResult[] {
    return turmas
      .filter(turma => 
        turma.nome.toLowerCase().includes(query) ||
        turma.codigo.toLowerCase().includes(query) ||
        turma.curso_nome?.toLowerCase().includes(query)
      )
      .map(turma => ({
        id: turma.id,
        type: 'turmas' as SearchCategory,
        title: turma.nome,
        subtitle: `Código: ${turma.codigo} • ${turma.curso_nome}`,
        description: `${turma.total_alunos} alunos • ${turma.turno}`,
        url: userRole === 'gestor' ? `/gestor/turmas` : '#',
        metadata: { turma },
      }));
  }

  /**
   * Busca em disciplinas
   */
  private static searchDisciplinas(query: string, disciplinas: Disciplina[], userRole: User['role']): SearchResult[] {
    return disciplinas
      .filter(disciplina => 
        disciplina.nome.toLowerCase().includes(query) ||
        disciplina.codigo.toLowerCase().includes(query) ||
        disciplina.curso_nome?.toLowerCase().includes(query)
      )
      .map(disciplina => ({
        id: disciplina.id,
        type: 'disciplinas' as SearchCategory,
        title: disciplina.nome,
        subtitle: `Código: ${disciplina.codigo} • ${disciplina.curso_nome}`,
        description: `Carga horária: ${disciplina.carga_horaria}h`,
        url: userRole === 'gestor' ? `/gestor/disciplinas` : '#',
        metadata: { disciplina },
      }));
  }

  /**
   * Busca em materiais
   */
  private static searchMateriais(query: string, materiais: Material[], userRole: User['role']): SearchResult[] {
    return materiais
      .filter(material => 
        material.titulo.toLowerCase().includes(query) ||
        material.descricao?.toLowerCase().includes(query) ||
        material.disciplina_nome?.toLowerCase().includes(query) ||
        material.tags?.some(tag => tag.toLowerCase().includes(query))
      )
      .map(material => ({
        id: material.id,
        type: 'materiais' as SearchCategory,
        title: material.titulo,
        subtitle: `${material.tipo.toUpperCase()} • ${material.disciplina_nome}`,
        description: material.descricao,
        url: userRole === 'gestor' 
          ? '/gestor/biblioteca' 
          : userRole === 'professor'
          ? '/professor/biblioteca'
          : '/aluno/biblioteca',
        metadata: { material },
      }));
  }

  /**
   * Busca em comunicados
   */
  private static searchComunicados(query: string, comunicados: Comunicado[], userRole: User['role']): SearchResult[] {
    return comunicados
      .filter(comunicado => 
        comunicado.titulo.toLowerCase().includes(query) ||
        comunicado.conteudo.toLowerCase().includes(query)
      )
      .map(comunicado => ({
        id: comunicado.id,
        type: 'comunicados' as SearchCategory,
        title: comunicado.titulo,
        subtitle: `${comunicado.prioridade} • ${formatDate(comunicado.created_at)}`,
        description: comunicado.conteudo.substring(0, 100) + (comunicado.conteudo.length > 100 ? '...' : ''),
        url: userRole === 'gestor' 
          ? '/gestor/comunicados' 
          : userRole === 'professor'
          ? '/professor/comunicados'
          : '/aluno/comunicados',
        metadata: { comunicado },
      }));
  }

  /**
   * Busca em observações
   */
  private static searchObservacoes(query: string, observacoes: Observacao[], userRole: User['role']): SearchResult[] {
    // Alunos não devem ver observações em busca
    if (userRole === 'aluno') return [];

    return observacoes
      .filter(observacao => 
        observacao.titulo.toLowerCase().includes(query) ||
        observacao.conteudo.toLowerCase().includes(query) ||
        observacao.aluno_nome?.toLowerCase().includes(query)
      )
      .map(observacao => ({
        id: observacao.id,
        type: 'observacoes' as SearchCategory,
        title: observacao.titulo,
        subtitle: `${observacao.tipo} • ${observacao.aluno_nome}`,
        description: observacao.conteudo.substring(0, 100) + (observacao.conteudo.length > 100 ? '...' : ''),
        url: userRole === 'gestor' 
          ? '/gestor/observacoes' 
          : '/professor/observacoes',
        metadata: { observacao },
      }));
  }

  /**
   * Busca em notificações
   */
  private static searchNotificacoes(query: string, notificacoes: Notificacao[], userRole: User['role']): SearchResult[] {
    return notificacoes
      .filter(notificacao => 
        notificacao.titulo.toLowerCase().includes(query) ||
        notificacao.mensagem.toLowerCase().includes(query)
      )
      .map(notificacao => ({
        id: notificacao.id,
        type: 'notificacoes' as SearchCategory,
        title: notificacao.titulo,
        subtitle: `${notificacao.tipo} • ${formatDate(notificacao.created_at)}`,
        description: notificacao.mensagem,
        url: notificacao.link || '#',
        metadata: { notificacao },
      }));
  }

  /**
   * Busca em pagamentos
   */
  private static searchPagamentos(query: string, pagamentos: Pagamento[], userRole: User['role']): SearchResult[] {
    return pagamentos
      .filter(pagamento => 
        pagamento.aluno_nome?.toLowerCase().includes(query) ||
        pagamento.status.toLowerCase().includes(query) ||
        formatCurrency(pagamento.valor).includes(query)
      )
      .map(pagamento => ({
        id: pagamento.id,
        type: 'pagamentos' as SearchCategory,
        title: `Pagamento - ${pagamento.aluno_nome}`,
        subtitle: `${formatCurrency(pagamento.valor)} • ${pagamento.status}`,
        description: `Vencimento: ${formatDate(pagamento.data_vencimento)}`,
        url: userRole === 'gestor' 
          ? '/gestor/financeiro' 
          : '/aluno/financeiro',
        metadata: { pagamento },
      }));
  }

  /**
   * Agrupa resultados por categoria
   */
  static groupByCategory(results: SearchResult[]): Record<SearchCategory, SearchResult[]> {
    const grouped: Record<string, SearchResult[]> = {};

    results.forEach(result => {
      if (!grouped[result.type]) {
        grouped[result.type] = [];
      }
      grouped[result.type].push(result);
    });

    return grouped as Record<SearchCategory, SearchResult[]>;
  }
}
