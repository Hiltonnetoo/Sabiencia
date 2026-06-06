// ============================================
// PROFESSOR DASHBOARD TESTS - Testes do dashboard do professor
// ============================================

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfessorDashboard } from './ProfessorDashboard';
import { MockDataProvider } from '../../contexts/MockDataContext';
import { AuthProvider } from '../../contexts/AuthContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <MockDataProvider>
          {component}
        </MockDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProfessorDashboard', () => {
  describe('Renderização', () => {
    it('deve renderizar o título do dashboard', () => {
      renderWithProviders(<ProfessorDashboard />);

      expect(screen.getByText(/dashboard/i) || screen.getByText(/professor/i)).toBeInTheDocument();
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

      expect(screen.getByText(/turmas/i) || screen.getByText(/minhas turmas/i)).toBeInTheDocument();
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

      expect(screen.getByText(/alunos/i)).toBeInTheDocument();
    });
  });

  describe('Atividades Pendentes', () => {
    it('deve exibir atividades para correção', () => {
      renderWithProviders(<ProfessorDashboard />);

      const activities = screen.queryByText(/atividades/i) ||
                        screen.queryByText(/pendentes/i) ||
                        screen.queryByText(/correção/i);
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

      const comunicados = screen.queryByText(/comunicados/i) ||
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
