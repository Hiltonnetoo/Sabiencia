// ============================================
// NAVIGATION - Itens de navegação por perfil
// `titleKey` é a chave i18n; `title` é o fallback (PT).
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
  { title: 'Dashboard', titleKey: 'nav.dashboard', href: '/gestor/dashboard', icon: LayoutDashboard },

  { title: 'Cadastros', titleKey: 'nav.groups.registers', isHeader: true },
  { title: 'Alunos', titleKey: 'nav.students', href: '/gestor/alunos', icon: Users },
  { title: 'Professores', titleKey: 'nav.teachers', href: '/gestor/professores', icon: GraduationCap },
  { title: 'Cursos', titleKey: 'nav.courses', href: '/gestor/cursos', icon: BookOpen },
  { title: 'Turmas', titleKey: 'nav.classes', href: '/gestor/turmas', icon: Briefcase },
  { title: 'Disciplinas', titleKey: 'nav.subjects', href: '/gestor/disciplinas', icon: FolderOpen },

  { title: 'Acadêmico', titleKey: 'nav.groups.academic', isHeader: true },
  { title: 'Biblioteca Virtual', titleKey: 'nav.library', href: '/gestor/biblioteca', icon: FileText },
  { title: 'Comunicados', titleKey: 'nav.announcements', href: '/gestor/comunicados', icon: MessageSquare },
  { title: 'Observações', titleKey: 'nav.observations', href: '/gestor/observacoes', icon: ClipboardList },
  { title: 'Questionários', titleKey: 'nav.questionnaires', href: '/gestor/questionarios', icon: FileQuestion },
  { title: 'Eventos', titleKey: 'nav.events', href: '/gestor/eventos', icon: CalendarDays },

  { title: 'Administrativo', titleKey: 'nav.groups.administrative', isHeader: true },
  { title: 'Financeiro', titleKey: 'nav.financial', href: '/gestor/financeiro', icon: DollarSign, badge: '3' },
  { title: 'Relatórios', titleKey: 'nav.reports', href: '/gestor/relatorios', icon: BarChart3 },
  { title: 'Cupons', titleKey: 'nav.coupons', href: '/gestor/cupons', icon: Tag },

  { title: 'Conta', titleKey: 'nav.groups.account', isHeader: true },
  { title: 'Meu Perfil', titleKey: 'nav.profile', href: '/gestor/perfil', icon: User },
  { title: 'Configurações', titleKey: 'nav.settings', href: '/gestor/configuracoes', icon: Settings }
];

// ============================================
// NAVEGAÇÃO DO PROFESSOR
// ============================================
export const professorNavItems: NavItem[] = [
  { title: 'Dashboard', titleKey: 'nav.dashboard', href: '/professor/dashboard', icon: LayoutDashboard },
  { title: 'Minhas Turmas', titleKey: 'nav.myClasses', href: '/professor/turmas', icon: Users },
  { title: 'Alunos', titleKey: 'nav.students', href: '/professor/alunos', icon: UserCheck },
  { title: 'Lançar Notas', titleKey: 'nav.enterGrades', href: '/professor/notas', icon: FileCheck },
  { title: 'Frequência', titleKey: 'nav.attendance', href: '/professor/frequencia', icon: Calendar },
  { title: 'Biblioteca Virtual', titleKey: 'nav.library', href: '/professor/materiais', icon: FileText },
  { title: 'Conteúdo das Aulas', titleKey: 'nav.lessonContent', href: '/professor/conteudo', icon: Video },
  { title: 'Observações', titleKey: 'nav.observations', href: '/professor/observacoes', icon: ClipboardList },
  { title: 'Comunicados', titleKey: 'nav.announcements', href: '/professor/comunicados', icon: MessageSquare },
  { title: 'Relatórios', titleKey: 'nav.reports', href: '/professor/relatorios', icon: BarChart3 },
  { title: 'Meu Perfil', titleKey: 'nav.profile', href: '/professor/perfil', icon: User },
  { title: 'Configurações', titleKey: 'nav.settings', href: '/professor/configuracoes', icon: Settings }
];

// ============================================
// NAVEGAÇÃO DO ALUNO
// ============================================
export const alunoNavItems: NavItem[] = [
  { title: 'Início', titleKey: 'nav.home', href: '/aluno/dashboard', icon: LayoutDashboard },
  { title: 'Minhas Aulas', titleKey: 'nav.myLessons', href: '/aluno/aulas', icon: Video },
  { title: 'Biblioteca Virtual', titleKey: 'nav.library', href: '/aluno/materiais', icon: FileText },
  { title: 'Notas', titleKey: 'nav.grades', href: '/aluno/notas', icon: FileCheck },
  { title: 'Frequência', titleKey: 'nav.attendance', href: '/aluno/frequencia', icon: Calendar },
  { title: 'Comunicados', titleKey: 'nav.announcements', href: '/aluno/comunicados', icon: Bell, badge: '2' },
  { title: 'Financeiro', titleKey: 'nav.financial', href: '/aluno/financeiro', icon: DollarSign },
  { title: 'Observações', titleKey: 'nav.observations', href: '/aluno/observacoes', icon: ClipboardList },
  { title: 'Eventos', titleKey: 'nav.events', href: '/aluno/eventos', icon: CalendarDays },
  { title: 'Certificados', titleKey: 'nav.certificates', href: '/aluno/certificados', icon: Award },
  { title: 'Meu Perfil', titleKey: 'nav.profile', href: '/aluno/perfil', icon: User },
  { title: 'Configurações', titleKey: 'nav.settings', href: '/aluno/configuracoes', icon: Settings }
];
