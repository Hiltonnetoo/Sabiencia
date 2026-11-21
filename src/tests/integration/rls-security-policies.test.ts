// ============================================
// AUTORIZAÇÃO NO FRONTEND
// Testa as regras de permissão da interface (utils/permissions) e o escopo
// da busca global. Elas espelham a RLS, mas NÃO a substituem: as policies
// do banco são testadas contra Postgres real em supabase/tests/rls_test.sql
// (npm run test:db, job "Database RLS Tests" na CI).
// ============================================

import { describe, it, expect } from 'vitest';
import type { User, Role } from '../../types';
import {
  isGestor,
  isProfessor,
  isAluno,
  canEditAluno,
  canViewTurma,
  canLancarNotas,
  canLancarFrequencia,
  canManageFinanceiro,
  canViewFinanceiro,
  canDeleteMaterial,
  canAccessRoute,
} from '../../utils/permissions';
import { SearchService } from '../../utils/searchService';

// Helpers para simular usuários autenticados
const createMockUser = (role: Role, id: string, email: string): User => ({
  id,
  cpf: '12345678909',
  email,
  role,
  nome_completo: `Usuário ${role} ${id}`,
  ativo: true,
  created_at: new Date('2025-01-01'),
});

const gestor = createMockUser('gestor', 'usr-gestor-1', 'admin@britos.edu.br');
const professorA = createMockUser('professor', 'usr-prof-a', 'prof.roberto@britos.edu.br');
const professorB = createMockUser('professor', 'usr-prof-b', 'prof.carlos@britos.edu.br');
const aluno1 = createMockUser('aluno', 'usr-aluno-1', 'lucas@britos.edu.br');
const aluno2 = createMockUser('aluno', 'usr-aluno-2', 'mariana@britos.edu.br');

describe('Autorização no frontend (espelho das regras de RLS)', () => {
  describe('Matriz de Permissões e Acessos Autorizados (T06)', () => {
    it('Gestor tem permissão irrestrita de gestão, lançamento e visualização de rotas', () => {
      expect(isGestor(gestor)).toBe(true);
      expect(canManageFinanceiro(gestor)).toBe(true);
      expect(canViewFinanceiro(gestor)).toBe(true);
      expect(canLancarNotas(gestor)).toBe(true);
      expect(canLancarFrequencia(gestor)).toBe(true);
      expect(canEditAluno(gestor, aluno1.id)).toBe(true);
      expect(canViewTurma(gestor, 'turma-qualquer')).toBe(true);
      expect(canDeleteMaterial(gestor, 'qualquer-prof')).toBe(true);
      expect(canAccessRoute(gestor, '/gestor/dashboard')).toBe(true);
    });

    it('Professor pode lançar notas e frequência nas disciplinas que leciona', () => {
      expect(isProfessor(professorA)).toBe(true);
      const profDisciplinas = ['disc-anatomia', 'disc-fisiologia'];
      expect(canLancarNotas(professorA, 'disc-anatomia', profDisciplinas)).toBe(true);
      expect(canLancarFrequencia(professorA, 'disc-fisiologia', profDisciplinas)).toBe(true);
    });

    it('Aluno pode visualizar seus próprios dados e materiais de sua turma', () => {
      expect(isAluno(aluno1)).toBe(true);
      expect(canEditAluno(aluno1, aluno1.id)).toBe(true);
      expect(canViewTurma(aluno1, 'turma-1', 'turma-1')).toBe(true);
      expect(canViewFinanceiro(aluno1, aluno1.id)).toBe(true); // Aluno visualiza suas próprias faturas
    });
  });

  describe('Garantias Negativas de Segurança (Explicit Access Denials)', () => {
    it('NEGATIVA 1: Aluno não pode editar dados de outro aluno', () => {
      expect(canEditAluno(aluno1, aluno2.id)).toBe(false);
    });

    it('NEGATIVA 1.1: Aluno não pode consultar dados financeiros de outro aluno', () => {
      expect(canViewFinanceiro(aluno1, aluno2.id)).toBe(false);
    });

    it('NEGATIVA 2: Aluno não pode lançar notas nem registrar frequência', () => {
      expect(canLancarNotas(aluno1)).toBe(false);
      expect(canLancarFrequencia(aluno1)).toBe(false);
      expect(canLancarNotas(aluno1, 'disc-1', ['disc-1'])).toBe(false);
    });

    it('NEGATIVA 3: Aluno não pode acessar turmas nas quais não está matriculado', () => {
      expect(canViewTurma(aluno1, 'turma-alheia', 'turma-matriculada')).toBe(false);
    });

    it('NEGATIVA 4: Aluno não pode gerenciar ou deletar materiais didáticos', () => {
      expect(canDeleteMaterial(aluno1, professorA.id)).toBe(false);
      expect(canDeleteMaterial(aluno1, aluno1.id)).toBe(false);
    });

    it('NEGATIVA 5: Professor não tem acesso ao módulo financeiro (gerenciamento ou consultas)', () => {
      expect(canManageFinanceiro(professorA)).toBe(false);
      expect(canViewFinanceiro(professorA)).toBe(false);
      expect(canAccessRoute(professorA, '/gestor/financeiro')).toBe(false);
      expect(canAccessRoute(professorA, '/aluno/financeiro')).toBe(false);
    });

    it('NEGATIVA 6: Professor não pode lançar notas em disciplinas alheias', () => {
      const turmasProfA = ['disc-anatomia'];
      // Tentativa de lançar em Farmacologia (pertence ao Prof B)
      expect(canLancarNotas(professorA, 'disc-farmacologia', turmasProfA)).toBe(false);
      expect(canLancarFrequencia(professorA, 'disc-farmacologia', turmasProfA)).toBe(false);
    });

    it('NEGATIVA 7: Professor não pode editar alunos de turmas para as quais não foi atribuído', () => {
      const professorTurmas = ['turma-1'];
      expect(canEditAluno(professorA, aluno1.id, professorTurmas, 'turma-2')).toBe(false);
    });

    it('NEGATIVA 8: Professor não pode deletar material criado por outro professor', () => {
      expect(canDeleteMaterial(professorA, professorB.id)).toBe(false);
    });

    it('NEGATIVA 9: Usuário anônimo/deslogado tem acesso negado em todas as operações restritas', () => {
      expect(canEditAluno(null, aluno1.id)).toBe(false);
      expect(canViewTurma(null, 'turma-1')).toBe(false);
      expect(canLancarNotas(null)).toBe(false);
      expect(canManageFinanceiro(null)).toBe(false);
      expect(canDeleteMaterial(null, professorA.id)).toBe(false);
      expect(canAccessRoute(null, '/aluno/dashboard')).toBe(false);
      expect(canAccessRoute(null, '/professor/dashboard')).toBe(false);
      expect(canAccessRoute(null, '/gestor/dashboard')).toBe(false);
    });

    it('NEGATIVA 10: Na busca global, professores não visualizam registros financeiros/pagamentos', () => {
      const pagamentosMock = [
        {
          id: 'pag-1',
          aluno_id: aluno1.id,
          aluno_nome: 'Lucas Silva',
          valor: 299.90,
          status: 'pago',
          data_vencimento: new Date('2025-02-10'),
          created_at: new Date('2025-01-01'),
        } as any,
      ];

      const searchResults = SearchService.searchAll(
        'Lucas',
        {
          alunos: [],
          professores: [],
          turmas: [],
          disciplinas: [],
          materiais: [],
          comunicados: [],
          observacoes: [],
          notificacoes: [],
          pagamentos: pagamentosMock,
        },
        'professor',
        ['pagamentos'],
        professorA.id
      );

      expect(searchResults).toHaveLength(0);
    });

    it('NEGATIVA 11: Na busca global, aluno só visualiza seus próprios pagamentos e não os de terceiros', () => {
      const pagamentosMock = [
        {
          id: 'pag-1',
          aluno_id: aluno1.id,
          aluno_nome: 'Lucas Silva',
          valor: 299.90,
          status: 'pago',
          data_vencimento: new Date('2025-02-10'),
          created_at: new Date('2025-01-01'),
        } as any,
        {
          id: 'pag-2',
          aluno_id: aluno2.id,
          aluno_nome: 'Mariana Santos',
          valor: 299.90,
          status: 'pendente',
          data_vencimento: new Date('2025-02-10'),
          created_at: new Date('2025-01-01'),
        } as any,
      ];

      // Aluno 1 buscando pagamentos
      const searchAluno1 = SearchService.searchAll(
        '299',
        {
          alunos: [],
          professores: [],
          turmas: [],
          disciplinas: [],
          materiais: [],
          comunicados: [],
          observacoes: [],
          notificacoes: [],
          pagamentos: pagamentosMock,
        },
        'aluno',
        ['pagamentos'],
        aluno1.id
      );

      expect(searchAluno1).toHaveLength(1);
      expect(searchAluno1[0].metadata?.pagamento?.aluno_id).toBe(aluno1.id);
      expect(searchAluno1[0].title).toContain('Lucas Silva');
    });
  });
});
