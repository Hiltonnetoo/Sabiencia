// ============================================
// USE BREADCRUMBS - Hook para gerenciar breadcrumbs dinamicamente
// ============================================

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    icon?: LucideIcon;
    parent?: string;
  };
}

// Configuração de breadcrumbs por rota
const breadcrumbConfig: BreadcrumbConfig = {
  // Gestor
  '/gestor/dashboard': { label: 'Dashboard', icon: Home },
  '/gestor/alunos': { label: 'Alunos', parent: '/gestor/dashboard' },
  '/gestor/alunos/novo': { label: 'Novo Aluno', parent: '/gestor/alunos' },
  '/gestor/alunos/editar': { label: 'Editar Aluno', parent: '/gestor/alunos' },
  '/gestor/alunos/detalhes': { label: 'Detalhes do Aluno', parent: '/gestor/alunos' },
  '/gestor/professores': { label: 'Professores', parent: '/gestor/dashboard' },
  '/gestor/professores/novo': { label: 'Novo Professor', parent: '/gestor/professores' },
  '/gestor/professores/editar': { label: 'Editar Professor', parent: '/gestor/professores' },
  '/gestor/professores/detalhes': { label: 'Detalhes do Professor', parent: '/gestor/professores' },
  '/gestor/cursos': { label: 'Cursos', parent: '/gestor/dashboard' },
  '/gestor/cursos/novo': { label: 'Novo Curso', parent: '/gestor/cursos' },
  '/gestor/cursos/editar': { label: 'Editar Curso', parent: '/gestor/cursos' },
  '/gestor/turmas': { label: 'Turmas', parent: '/gestor/dashboard' },
  '/gestor/turmas/nova': { label: 'Nova Turma', parent: '/gestor/turmas' },
  '/gestor/turmas/editar': { label: 'Editar Turma', parent: '/gestor/turmas' },
  '/gestor/disciplinas': { label: 'Disciplinas', parent: '/gestor/dashboard' },
  '/gestor/disciplinas/nova': { label: 'Nova Disciplina', parent: '/gestor/disciplinas' },
  '/gestor/disciplinas/editar': { label: 'Editar Disciplina', parent: '/gestor/disciplinas' },
  '/gestor/biblioteca': { label: 'Biblioteca Virtual', parent: '/gestor/dashboard' },
  '/gestor/financeiro': { label: 'Financeiro', parent: '/gestor/dashboard' },
  '/gestor/comunicados': { label: 'Comunicados', parent: '/gestor/dashboard' },
  '/gestor/comunicados/novo': { label: 'Novo Comunicado', parent: '/gestor/comunicados' },
  '/gestor/comunicados/editar': { label: 'Editar Comunicado', parent: '/gestor/comunicados' },
  '/gestor/relatorios': { label: 'Relatórios', parent: '/gestor/dashboard' },
  '/gestor/observacoes': { label: 'Observações', parent: '/gestor/dashboard' },
  '/gestor/observacoes/nova': { label: 'Nova Observação', parent: '/gestor/observacoes' },
  '/gestor/observacoes/editar': { label: 'Editar Observação', parent: '/gestor/observacoes' },
  '/gestor/perfil': { label: 'Meu Perfil', parent: '/gestor/dashboard' },
  '/gestor/configuracoes': { label: 'Configurações', parent: '/gestor/dashboard' },

  // Professor
  '/professor/dashboard': { label: 'Dashboard', icon: Home },
  '/professor/turmas': { label: 'Minhas Turmas', parent: '/professor/dashboard' },
  '/professor/alunos': { label: 'Alunos', parent: '/professor/dashboard' },
  '/professor/notas': { label: 'Lançar Notas', parent: '/professor/dashboard' },
  '/professor/frequencia': { label: 'Frequência', parent: '/professor/dashboard' },
  '/professor/materiais': { label: 'Biblioteca Virtual', parent: '/professor/dashboard' },
  '/professor/observacoes': { label: 'Observações', parent: '/professor/dashboard' },
  '/professor/observacoes/nova': { label: 'Nova Observação', parent: '/professor/observacoes' },
  '/professor/observacoes/editar': { label: 'Editar Observação', parent: '/professor/observacoes' },
  '/professor/comunicados': { label: 'Comunicados', parent: '/professor/dashboard' },
  '/professor/comunicados/novo': { label: 'Novo Comunicado', parent: '/professor/comunicados' },
  '/professor/relatorios': { label: 'Relatórios', parent: '/professor/dashboard' },
  '/professor/perfil': { label: 'Meu Perfil', parent: '/professor/dashboard' },
  '/professor/configuracoes': { label: 'Configurações', parent: '/professor/dashboard' },

  // Aluno
  '/aluno/dashboard': { label: 'Início', icon: Home },
  '/aluno/aulas': { label: 'Minhas Aulas', parent: '/aluno/dashboard' },
  '/aluno/materiais': { label: 'Biblioteca Virtual', parent: '/aluno/dashboard' },
  '/aluno/notas': { label: 'Minhas Notas', parent: '/aluno/dashboard' },
  '/aluno/frequencia': { label: 'Minha Frequência', parent: '/aluno/dashboard' },
  '/aluno/comunicados': { label: 'Comunicados', parent: '/aluno/dashboard' },
  '/aluno/financeiro': { label: 'Financeiro', parent: '/aluno/dashboard' },
  '/aluno/observacoes': { label: 'Observações', parent: '/aluno/dashboard' },
  '/aluno/perfil': { label: 'Meu Perfil', parent: '/aluno/dashboard' },
  '/aluno/configuracoes': { label: 'Configurações', parent: '/aluno/dashboard' },
};

/**
 * Hook para gerenciar breadcrumbs baseado na rota atual
 * @param customLabel - Label customizado para substituir o padrão (usado em páginas de detalhes)
 */
export const useBreadcrumbs = (customLabel?: string): BreadcrumbItem[] => {
  const location = useLocation();

  return useMemo(() => {
    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [];

    // Função recursiva para construir a cadeia de breadcrumbs
    const buildBreadcrumbs = (currentPath: string) => {
      const config = breadcrumbConfig[currentPath];
      
      if (!config) return;

      // Se tem parent, adiciona ele primeiro (recursivamente)
      if (config.parent) {
        buildBreadcrumbs(config.parent);
      }

      // Adiciona o breadcrumb atual
      breadcrumbs.push({
        label: config.label,
        href: currentPath,
        icon: config.icon,
      });
    };

    // Constrói os breadcrumbs
    buildBreadcrumbs(path);

    // Se tem label customizado e breadcrumbs foram gerados, substitui o último
    if (customLabel && breadcrumbs.length > 0) {
      const lastIndex = breadcrumbs.length - 1;
      breadcrumbs[lastIndex] = {
        ...breadcrumbs[lastIndex],
        label: customLabel,
      };
    }

    // O último item não deve ter href (é a página atual)
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].href = undefined;
    }

    return breadcrumbs;
  }, [location.pathname, customLabel]);
};
