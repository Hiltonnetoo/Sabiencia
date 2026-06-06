// ============================================
// PERMISSIONS - Sistema de permissões
// ============================================

import type { User, Role } from '../types';

/**
 * Verifica se usuário é Gestor
 */
export const isGestor = (user: User | null): boolean => {
  return user?.role === 'gestor';
};

/**
 * Verifica se usuário é Professor
 */
export const isProfessor = (user: User | null): boolean => {
  return user?.role === 'professor';
};

/**
 * Verifica se usuário é Aluno
 */
export const isAluno = (user: User | null): boolean => {
  return user?.role === 'aluno';
};

/**
 * Verifica se usuário pode editar aluno
 * Gestor: pode editar qualquer aluno
 * Professor: pode editar alunos das suas turmas
 * Aluno: pode editar apenas próprios dados (limitado)
 */
export const canEditAluno = (
  user: User | null,
  alunoId: string,
  professorTurmas?: string[]
): boolean => {
  if (!user) return false;
  
  if (isGestor(user)) return true;
  
  if (isAluno(user)) {
    // Aluno só pode editar dados próprios (limitados)
    return user.id === alunoId;
  }
  
  if (isProfessor(user) && professorTurmas) {
    // Professor pode editar alunos das turmas dele
    // (verificação deve ser feita com matriculas)
    return true; // Simplificado - em produção, verificar matriculas
  }
  
  return false;
};

/**
 * Verifica se usuário pode visualizar turma
 * Gestor: pode ver todas turmas
 * Professor: pode ver suas turmas
 * Aluno: pode ver sua turma
 */
export const canViewTurma = (
  user: User | null,
  turmaId: string,
  userTurmaId?: string
): boolean => {
  if (!user) return false;
  
  if (isGestor(user)) return true;
  
  if (isAluno(user)) {
    return userTurmaId === turmaId;
  }
  
  if (isProfessor(user)) {
    // Professor pode ver turmas atribuídas
    // Verificação deve ser feita com professorTurmaDisciplina
    return true; // Simplificado
  }
  
  return false;
};

/**
 * Verifica se usuário pode deletar material
 * Gestor: pode deletar qualquer material
 * Professor: pode deletar apenas materiais próprios
 * Aluno: não pode deletar
 */
export const canDeleteMaterial = (
  user: User | null,
  materialProfessorId: string
): boolean => {
  if (!user) return false;
  
  if (isGestor(user)) return true;
  
  if (isProfessor(user)) {
    return user.id === materialProfessorId;
  }
  
  return false;
};

/**
 * Verifica se usuário pode lançar notas
 * Gestor: pode lançar notas
 * Professor: pode lançar notas das suas disciplinas
 * Aluno: não pode
 */
export const canLancarNotas = (
  user: User | null,
  disciplinaId?: string,
  professorDisciplinas?: string[]
): boolean => {
  if (!user) return false;
  
  if (isGestor(user)) return true;
  
  if (isProfessor(user)) {
    if (!disciplinaId || !professorDisciplinas) return true; // Simplificado
    return professorDisciplinas.includes(disciplinaId);
  }
  
  return false;
};

/**
 * Verifica se usuário pode lançar frequência
 * Mesma lógica de lançar notas
 */
export const canLancarFrequencia = canLancarNotas;

/**
 * Verifica se usuário pode criar comunicados
 * Gestor: pode criar qualquer comunicado
 * Professor: pode criar comunicados para suas turmas
 * Aluno: não pode
 */
export const canCreateComunicado = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user) || isProfessor(user);
};

/**
 * Verifica se usuário pode gerenciar professores
 * Apenas gestor
 */
export const canManageProfessores = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user);
};

/**
 * Verifica se usuário pode gerenciar cursos
 * Apenas gestor
 */
export const canManageCursos = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user);
};

/**
 * Verifica se usuário pode gerenciar turmas
 * Apenas gestor
 */
export const canManageTurmas = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user);
};

/**
 * Verifica se usuário pode visualizar relatórios gerenciais
 * Apenas gestor
 */
export const canViewRelatoriosGerenciais = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user);
};

/**
 * Verifica se usuário pode visualizar logs de auditoria
 * Apenas gestor
 */
export const canViewLogs = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user);
};

/**
 * Verifica se usuário pode gerenciar financeiro
 * Apenas gestor
 */
export const canManageFinanceiro = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user);
};

/**
 * Verifica se usuário pode fazer upload de materiais
 * Gestor: sim
 * Professor: sim (para suas disciplinas)
 * Aluno: não
 */
export const canUploadMaterial = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user) || isProfessor(user);
};

/**
 * Verifica se usuário pode visualizar dados financeiros do aluno
 * Gestor: pode ver todos
 * Aluno: pode ver apenas próprios
 * Professor: não pode ver
 */
export const canViewFinanceiro = (
  user: User | null,
  alunoId?: string
): boolean => {
  if (!user) return false;
  
  if (isGestor(user)) return true;
  
  if (isAluno(user) && alunoId) {
    return user.id === alunoId;
  }
  
  return false;
};

/**
 * Verifica se usuário pode adicionar observações sobre alunos
 * Gestor: sim
 * Professor: sim (para alunos das suas turmas)
 * Aluno: não
 */
export const canAddObservacao = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user) || isProfessor(user);
};

/**
 * Verifica se usuário pode excluir aluno
 * Apenas gestor
 */
export const canDeleteAluno = (user: User | null): boolean => {
  if (!user) return false;
  return isGestor(user);
};

/**
 * Retorna rota padrão baseada no role
 */
export const getDefaultRoute = (role: Role): string => {
  const routes: Record<Role, string> = {
    gestor: '/gestor/dashboard',
    professor: '/professor/dashboard',
    aluno: '/aluno/dashboard'
  };
  
  return routes[role] || '/login';
};

/**
 * Retorna nome amigável do role
 */
export const getRoleName = (role: Role): string => {
  const names: Record<Role, string> = {
    gestor: 'Gestor',
    professor: 'Professor',
    aluno: 'Aluno'
  };
  
  return names[role] || role;
};

/**
 * Verifica se usuário tem permissão para acessar rota
 */
export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;
  
  // Rotas públicas
  if (route === '/' || route === '/login') return true;
  
  // Rotas do gestor
  if (route.startsWith('/gestor')) return isGestor(user);
  
  // Rotas do professor
  if (route.startsWith('/professor')) return isProfessor(user);
  
  // Rotas do aluno
  if (route.startsWith('/aluno')) return isAluno(user);
  
  return false;
};

/**
 * Lista de permissões por role
 */
export const rolePermissions: Record<Role, string[]> = {
  gestor: [
    'view_all_data',
    'manage_users',
    'manage_professors',
    'manage_students',
    'manage_courses',
    'manage_classes',
    'manage_finances',
    'view_reports',
    'view_logs',
    'send_announcements',
    'manage_library',
    'manage_grades',
    'manage_attendance'
  ],
  professor: [
    'view_own_classes',
    'view_class_students',
    'manage_own_materials',
    'manage_grades',
    'manage_attendance',
    'add_observations',
    'send_class_announcements',
    'view_class_reports'
  ],
  aluno: [
    'view_own_data',
    'view_own_grades',
    'view_own_attendance',
    'download_materials',
    'watch_videos',
    'edit_own_profile'
  ]
};

/**
 * Verifica se usuário tem permissão específica
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  return rolePermissions[user.role]?.includes(permission) || false;
};
