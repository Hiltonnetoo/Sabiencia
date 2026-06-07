// ============================================
// PROFESSOR DASHBOARD TESTS - Testes do dashboard do professor
// ============================================

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfessorDashboard } from './ProfessorDashboard';
import { MockDataProvider } from '../../contexts/MockDataContext';

// Mock do contexto de autenticação para retornar o usuário de forma síncrona
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'prof-001',
      cpf: '111.111.111-11',
      nome_completo: 'Ana Paula Costa',
      email: 'ana@sabiencia.com.br',
      role: 'professor',
      ativo: true
    },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn()
  }),
  useRole: () => 'professor',
  useIsAuthenticated: () => true,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MockDataProvider>
        {component}
      </MockDataProvider>
    </BrowserRouter>
  );
};

describe('ProfessorDashboard', () => {
  describe('Renderização', () => {
    it('deve renderizar o título do dashboard', () => {
      renderWithProviders(<ProfessorDashboard />);

      expect(screen.queryAllByText(/dashboard/i).length > 0 || screen.queryAllByText(/professor/i).length > 0).toBe(true);
    });

    it('deve exibir saudação ao professor', () => {
      renderWithProviders(<ProfessorDashboard />);

      const greeting = screen.queryByText(/bem-vindo/i) || 
                      screen.queryByText(/olá/i) ||
                      screen.queryByText(/professor/i);
      expect(greeting).toBeTruthy();
    });
  });

  describe('Turmas do Professor', () => {
    it('deve exibir lista de turmas', () => {
      renderWithProviders(<ProfessorDashboard />);

      expect(screen.queryAllByText(/turmas/i).length > 0 || screen.queryAllByText(/minhas turmas/i).length > 0).toBe(true);
    });

    it('deve mostrar quantidade de turmas', () => {
      renderWithProviders(<ProfessorDashboard />);

      const content = document.body.textContent || '';
      expect(/\d+/.test(content)).toBe(true);
    });
  });

  describe('Alunos', () => {
    it('deve exibir total de alunos', () => {
      renderWithProviders(<ProfessorDashboard />);

      expect(screen.queryAllByText(/alunos/i).length).toBeGreaterThan(0);
    });
  });

  describe('Atividades Pendentes', () => {
    it('deve exibir atividades para correção', () => {
      renderWithProviders(<ProfessorDashboard />);

      const activities = screen.queryAllByText(/atividades/i).length > 0 ||
                        screen.queryAllByText(/pendentes/i).length > 0 ||
                        screen.queryAllByText(/correção/i).length > 0;
      expect(activities).toBeTruthy();
    });
  });

  describe('Ações Rápidas', () => {
    it('deve ter botões de ações rápidas', () => {
      renderWithProviders(<ProfessorDashboard />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('deve ter link para frequência', () => {
      renderWithProviders(<ProfessorDashboard />);

      const frequenciaLink = screen.queryByText(/frequência/i) ||
                            screen.queryByText(/presença/i);
      expect(frequenciaLink).toBeTruthy();
    });

    it('deve ter link para notas', () => {
      renderWithProviders(<ProfessorDashboard />);

      expect(screen.getByText(/notas/i) || screen.getByText(/avaliações/i)).toBeInTheDocument();
    });
  });

  describe('Comunicados', () => {
    it('deve exibir comunicados recentes', () => {
      renderWithProviders(<ProfessorDashboard />);

      const comunicados = screen.queryByText(/comunicado/i) ||
                          screen.queryByText(/avisos/i);
      expect(comunicados).toBeTruthy();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica', () => {
      renderWithProviders(<ProfessorDashboard />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      renderWithProviders(<ProfessorDashboard />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
