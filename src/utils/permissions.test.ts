// ============================================
// PERMISSIONS (RBAC) TESTS
// ============================================

import { describe, it, expect } from 'vitest';
import type { User, Role } from '../types';
import {
  isGestor,
  isProfessor,
  isAluno,
  canEditAluno,
  canViewTurma,
  canDeleteMaterial,
  canLancarNotas,
  canCreateComunicado,
  canManageProfessores,
  canManageFinanceiro,
  canViewFinanceiro,
  canDeleteAluno,
  canAccessRoute,
  getDefaultRoute,
  getRoleName,
  hasPermission,
} from './permissions';

const makeUser = (role: Role, id = 'u1'): User => ({
  id,
  cpf: '000.000.000-00',
  email: `${id}@demo.local`,
  role,
  nome_completo: `${role} test`,
  ativo: true,
  created_at: new Date(),
});

const gestor = makeUser('gestor', 'g1');
const professor = makeUser('professor', 'p1');
const aluno = makeUser('aluno', 'a1');

describe('permissions (RBAC)', () => {
  describe('role guards', () => {
    it('identifies each role correctly', () => {
      expect(isGestor(gestor)).toBe(true);
      expect(isProfessor(professor)).toBe(true);
      expect(isAluno(aluno)).toBe(true);
      expect(isGestor(professor)).toBe(false);
      expect(isProfessor(aluno)).toBe(false);
      expect(isAluno(gestor)).toBe(false);
    });

    it('returns false for null user', () => {
      expect(isGestor(null)).toBe(false);
      expect(isProfessor(null)).toBe(false);
      expect(isAluno(null)).toBe(false);
    });
  });

  describe('gestor-only capabilities', () => {
    it('allows gestor and denies others', () => {
      for (const can of [canManageProfessores, canManageFinanceiro, canDeleteAluno]) {
        expect(can(gestor)).toBe(true);
        expect(can(professor)).toBe(false);
        expect(can(aluno)).toBe(false);
        expect(can(null)).toBe(false);
      }
    });
  });

  describe('canEditAluno', () => {
    it('gestor edits anyone', () => {
      expect(canEditAluno(gestor, 'a1')).toBe(true);
    });
    it('aluno edits only itself', () => {
      expect(canEditAluno(aluno, 'a1')).toBe(true);
      expect(canEditAluno(aluno, 'a2')).toBe(false);
    });
    it('professor edits students of assigned classes', () => {
      expect(canEditAluno(professor, 'a1', ['t1'])).toBe(true);
      expect(canEditAluno(professor, 'a1')).toBe(false);
    });
  });

  describe('canViewTurma', () => {
    it('aluno sees only its own class', () => {
      expect(canViewTurma(aluno, 't1', 't1')).toBe(true);
      expect(canViewTurma(aluno, 't1', 't2')).toBe(false);
    });
    it('gestor sees all classes', () => {
      expect(canViewTurma(gestor, 't9')).toBe(true);
    });
  });

  describe('canDeleteMaterial', () => {
    it('professor deletes only its own material', () => {
      expect(canDeleteMaterial(professor, 'p1')).toBe(true);
      expect(canDeleteMaterial(professor, 'p2')).toBe(false);
    });
    it('aluno can never delete', () => {
      expect(canDeleteMaterial(aluno, 'a1')).toBe(false);
    });
  });

  describe('canViewFinanceiro', () => {
    it('aluno sees only its own finance', () => {
      expect(canViewFinanceiro(aluno, 'a1')).toBe(true);
      expect(canViewFinanceiro(aluno, 'a2')).toBe(false);
    });
    it('professor cannot view finance', () => {
      expect(canViewFinanceiro(professor, 'a1')).toBe(false);
    });
  });

  describe('canLancarNotas', () => {
    it('professor restricted to its disciplines when provided', () => {
      expect(canLancarNotas(professor, 'd1', ['d1', 'd2'])).toBe(true);
      expect(canLancarNotas(professor, 'd9', ['d1', 'd2'])).toBe(false);
    });
    it('aluno cannot grade', () => {
      expect(canLancarNotas(aluno)).toBe(false);
    });
  });

  describe('canCreateComunicado', () => {
    it('allows gestor and professor, denies aluno', () => {
      expect(canCreateComunicado(gestor)).toBe(true);
      expect(canCreateComunicado(professor)).toBe(true);
      expect(canCreateComunicado(aluno)).toBe(false);
    });
  });

  describe('canAccessRoute', () => {
    it('guards role-prefixed routes', () => {
      expect(canAccessRoute(gestor, '/gestor/dashboard')).toBe(true);
      expect(canAccessRoute(professor, '/gestor/dashboard')).toBe(false);
      expect(canAccessRoute(aluno, '/aluno/notas')).toBe(true);
      expect(canAccessRoute(aluno, '/professor/turmas')).toBe(false);
    });
    it('allows public routes for any logged user and denies null', () => {
      expect(canAccessRoute(aluno, '/login')).toBe(true);
      expect(canAccessRoute(null, '/gestor/dashboard')).toBe(false);
    });
  });

  describe('getDefaultRoute / getRoleName', () => {
    it('maps role to default route', () => {
      expect(getDefaultRoute('gestor')).toBe('/gestor/dashboard');
      expect(getDefaultRoute('professor')).toBe('/professor/dashboard');
      expect(getDefaultRoute('aluno')).toBe('/aluno/dashboard');
    });
    it('maps role to friendly name', () => {
      expect(getRoleName('gestor')).toBe('Gestor');
      expect(getRoleName('aluno')).toBe('Aluno');
    });
  });

  describe('hasPermission', () => {
    it('checks role permission table', () => {
      expect(hasPermission(gestor, 'manage_finances')).toBe(true);
      expect(hasPermission(professor, 'manage_finances')).toBe(false);
      expect(hasPermission(aluno, 'view_own_grades')).toBe(true);
      expect(hasPermission(aluno, 'manage_users')).toBe(false);
      expect(hasPermission(null, 'view_own_grades')).toBe(false);
    });
  });
});
