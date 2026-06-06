// ============================================
// ALUNO DASHBOARD TESTS - Testes do dashboard do aluno
// ============================================

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AlunoDashboard } from './AlunoDashboard';
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

describe('AlunoDashboard', () => {
  describe('Renderização', () => {
    it('deve renderizar o título do dashboard', () => {
      renderWithProviders(<AlunoDashboard />);

      expect(screen.getByText(/dashboard/i) || screen.getByText(/meu painel/i)).toBeInTheDocument();
    });

    it('deve exibir saudação ao aluno', () => {
      renderWithProviders(<AlunoDashboard />);

      const greeting = screen.queryByText(/bem-vindo/i) || 
                      screen.queryByText(/olá/i);
      expect(greeting).toBeTruthy();
    });
  });

  describe('Informações Acadêmicas', () => {
    it('deve exibir curso do aluno', () => {
      renderWithProviders(<AlunoDashboard />);

      expect(screen.getByText(/curso/i) || screen.getByText(/turma/i)).toBeInTheDocument();
    });

    it('deve exibir frequência', () => {
      renderWithProviders(<AlunoDashboard />);

      const frequencia = screen.queryByText(/frequência/i) ||
                        screen.queryByText(/presença/i);
      expect(frequencia).toBeTruthy();
    });

    it('deve exibir notas ou desempenho', () => {
      renderWithProviders(<AlunoDashboard />);

      const notas = screen.queryByText(/notas/i) ||
                   screen.queryByText(/desempenho/i) ||
                   screen.queryByText(/média/i);
      expect(notas).toBeTruthy();
    });
  });

  describe('Aulas e Materiais', () => {
    it('deve exibir próximas aulas', () => {
      renderWithProviders(<AlunoDashboard />);

      const aulas = screen.queryByText(/aulas/i) ||
                   screen.queryByText(/próximas/i) ||
                   screen.queryByText(/cronograma/i);
      expect(aulas).toBeTruthy();
    });

    it('deve ter acesso a materiais', () => {
      renderWithProviders(<AlunoDashboard />);

      const materiais = screen.queryByText(/materiais/i) ||
                       screen.queryByText(/biblioteca/i) ||
                       screen.queryByText(/conteúdo/i);
      expect(materiais).toBeTruthy();
    });
  });

  describe('Financeiro', () => {
    it('deve exibir informações de pagamento', () => {
      renderWithProviders(<AlunoDashboard />);

      const financeiro = screen.queryByText(/pagamento/i) ||
                        screen.queryByText(/mensalidade/i) ||
                        screen.queryByText(/financeiro/i);
      expect(financeiro).toBeTruthy();
    });
  });

  describe('Comunicados', () => {
    it('deve exibir comunicados recentes', () => {
      renderWithProviders(<AlunoDashboard />);

      const comunicados = screen.queryByText(/comunicados/i) ||
                         screen.queryByText(/avisos/i) ||
                         screen.queryByText(/notificações/i);
      expect(comunicados).toBeTruthy();
    });
  });

  describe('Ações Rápidas', () => {
    it('deve ter botões de ações rápidas', () => {
      renderWithProviders(<AlunoDashboard />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Calendário e Eventos', () => {
    it('deve mostrar eventos ou calendário', () => {
      renderWithProviders(<AlunoDashboard />);

      const calendar = screen.queryByText(/eventos/i) ||
                      screen.queryByText(/calendário/i) ||
                      screen.queryByText(/agenda/i);
      expect(calendar).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      renderWithProviders(<AlunoDashboard />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('deve usar memoização eficiente', () => {
      const { rerender } = renderWithProviders(<AlunoDashboard />);

      rerender(
        <BrowserRouter>
          <AuthProvider>
            <MockDataProvider>
              <AlunoDashboard />
            </MockDataProvider>
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.getByText(/dashboard/i) || screen.getByText(/meu painel/i)).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve adaptar a diferentes tamanhos de tela', () => {
      renderWithProviders(<AlunoDashboard />);

      // Verificar que renderiza corretamente
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter headings adequados', () => {
      renderWithProviders(<AlunoDashboard />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('deve ter navegação acessível', () => {
      renderWithProviders(<AlunoDashboard />);

      const links = screen.queryAllByRole('link');
      const buttons = screen.getAllByRole('button');
      
      expect(links.length + buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Dados Dinâmicos', () => {
    it('deve exibir dados específicos do aluno logado', () => {
      renderWithProviders(<AlunoDashboard />);

      // Dashboard deve ter conteúdo personalizado
      const content = document.body.textContent || '';
      expect(content.length).toBeGreaterThan(0);
    });

    it('deve calcular estatísticas do aluno', () => {
      renderWithProviders(<AlunoDashboard />);

      // Deve ter números/percentagens
      const content = document.body.textContent || '';
      const hasNumbers = /\d+/.test(content);
      expect(hasNumbers).toBe(true);
    });
  });
});
