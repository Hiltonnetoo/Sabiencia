// ============================================
// NAVIGATION - Itens de navegação por perfil
// ============================================

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  MessageSquare,
  FolderOpen,
  ClipboardList,
  UserCheck,
  Video,
  Bell,
  FileCheck,
  Briefcase,
  Shield,
  User,
  CalendarDays,
  Tag,
  Award,
  FileQuestion
} from 'lucide-react';
import type { NavItem } from '../components/layout/Sidebar';

// ============================================
// NAVEGAÇÃO DO GESTOR
// ============================================
export const gestorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/gestor/dashboard',
    icon: LayoutDashboard
  },
  
  // CATEGORIA: CADASTROS
  {
    title: 'Cadastros',
    isHeader: true
  },
  {
    title: 'Alunos',
    href: '/gestor/alunos',
    icon: Users
  },
  {
    title: 'Professores',
    href: '/gestor/professores',
    icon: GraduationCap
  },
  {
    title: 'Cursos',
    href: '/gestor/cursos',
    icon: BookOpen
  },
  {
    title: 'Turmas',
    href: '/gestor/turmas',
    icon: Briefcase
  },
  {
    title: 'Disciplinas',
    href: '/gestor/disciplinas',
    icon: FolderOpen
  },

  // CATEGORIA: ACADÊMICO
  {
    title: 'Acadêmico',
    isHeader: true
  },
  {
    title: 'Biblioteca Virtual',
    href: '/gestor/biblioteca',
    icon: FileText
  },
  {
    title: 'Comunicados',
    href: '/gestor/comunicados',
    icon: MessageSquare
  },
  {
    title: 'Observações',
    href: '/gestor/observacoes',
    icon: ClipboardList
  },
  {
    title: 'Questionários',
    href: '/gestor/questionarios',
    icon: FileQuestion
  },
  {
    title: 'Eventos',
    href: '/gestor/eventos',
    icon: CalendarDays
  },

  // CATEGORIA: ADMINISTRATIVO
  {
    title: 'Administrativo',
    isHeader: true
  },
  {
    title: 'Financeiro',
    href: '/gestor/financeiro',
    icon: DollarSign,
    badge: '3'
  },
  {
    title: 'Relatórios',
    href: '/gestor/relatorios',
    icon: BarChart3
  },
  {
    title: 'Cupons',
    href: '/gestor/cupons',
    icon: Tag
  },

  // CATEGORIA: CONTA
  {
    title: 'Conta',
    isHeader: true
  },
  {
    title: 'Meu Perfil',
    href: '/gestor/perfil',
    icon: User
  },
  {
    title: 'Configurações',
    href: '/gestor/configuracoes',
    icon: Settings
  }
];

// ============================================
// NAVEGAÇÃO DO PROFESSOR
// ============================================
export const professorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/professor/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Minhas Turmas',
    href: '/professor/turmas',
    icon: Users
  },
  {
    title: 'Alunos',
    href: '/professor/alunos',
    icon: UserCheck
  },
  {
    title: 'Lançar Notas',
    href: '/professor/notas',
    icon: FileCheck
  },
  {
    title: 'Frequência',
    href: '/professor/frequencia',
    icon: Calendar
  },
  {
    title: 'Biblioteca Virtual',
    href: '/professor/materiais',
    icon: FileText
  },
  {
    title: 'Conteúdo das Aulas',
    href: '/professor/conteudo',
    icon: Video
  },
  {
    title: 'Observações',
    href: '/professor/observacoes',
    icon: ClipboardList
  },
  {
    title: 'Comunicados',
    href: '/professor/comunicados',
    icon: MessageSquare
  },
  {
    title: 'Relatórios',
    href: '/professor/relatorios',
    icon: BarChart3
  },
  {
    title: 'Meu Perfil',
    href: '/professor/perfil',
    icon: User
  },
  {
    title: 'Configurações',
    href: '/professor/configuracoes',
    icon: Settings
  }
];

// ============================================
// NAVEGAÇÃO DO ALUNO
// ============================================
export const alunoNavItems: NavItem[] = [
  {
    title: 'Início',
    href: '/aluno/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Minhas Aulas',
    href: '/aluno/aulas',
    icon: Video
  },
  {
    title: 'Biblioteca Virtual',
    href: '/aluno/materiais',
    icon: FileText
  },
  {
    title: 'Notas',
    href: '/aluno/notas',
    icon: FileCheck
  },
  {
    title: 'Frequência',
    href: '/aluno/frequencia',
    icon: Calendar
  },
  {
    title: 'Comunicados',
    href: '/aluno/comunicados',
    icon: Bell,
    badge: '2'
  },
  {
    title: 'Financeiro',
    href: '/aluno/financeiro',
    icon: DollarSign
  },
  {
    title: 'Observações',
    href: '/aluno/observacoes',
    icon: ClipboardList
  },
  {
    title: 'Eventos',
    href: '/aluno/eventos',
    icon: CalendarDays
  },
  {
    title: 'Certificados',
    href: '/aluno/certificados',
    icon: Award
  },
  {
    title: 'Meu Perfil',
    href: '/aluno/perfil',
    icon: User
  },
  {
    title: 'Configurações',
    href: '/aluno/configuracoes',
    icon: Settings
  }
];