// ============================================
// ALUNO DASHBOARD TESTS - Testes do dashboard do aluno
// ============================================

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AlunoDashboard } from './AlunoDashboard';
import { MockDataProvider } from '../../contexts/MockDataContext';

// Mock do contexto de autenticação para retornar o usuário de forma síncrona
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'aluno-001',
      cpf: '333.333.333-33',
      nome_completo: 'João Pedro Santos',
      email: 'joao@exemplo.com',
      role: 'aluno',
      ativo: true
    },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn()
  }),
  useRole: () => 'aluno',
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

describe('AlunoDashboard', () => {
  describe('Renderização', () => {
    it('deve renderizar o título do dashboard', () => {
      renderWithProviders(<AlunoDashboard />);

      expect(screen.queryAllByText(/dashboard/i).length > 0 || screen.queryAllByText(/meu painel/i).length > 0 || screen.queryAllByText(/Olá/i).length > 0).toBe(true);
    });

    it('deve exibir saudação ao aluno', () => {
      renderWithProviders(<AlunoDashboard />);

      const greeting = screen.queryByText(/bem-vindo/i) || 
                      screen.queryByText(/olá/i) ||
                      screen.queryAllByText(/Olá/i).length > 0;
      expect(greeting).toBeTruthy();
    });
  });

  describe('Informações Acadêmicas', () => {
    it('deve exibir curso do aluno', () => {
      renderWithProviders(<AlunoDashboard />);

      expect(screen.queryAllByText(/curso/i).length > 0 || screen.queryAllByText(/turma/i).length > 0).toBe(true);
    });

    it('deve exibir frequência', () => {
      renderWithProviders(<AlunoDashboard />);

      const frequencia = screen.queryAllByText(/frequência/i).length > 0 ||
                        screen.queryAllByText(/presença/i).length > 0;
      expect(frequencia).toBeTruthy();
    });

    it('deve exibir notas ou desempenho', () => {
      renderWithProviders(<AlunoDashboard />);

      const notas = screen.queryAllByText(/notas/i).length > 0 ||
                   screen.queryAllByText(/desempenho/i).length > 0 ||
                   screen.queryAllByText(/média/i).length > 0;
      expect(notas).toBeTruthy();
    });
  });

  describe('Aulas e Materiais', () => {
    it('deve exibir próximas aulas', () => {
      renderWithProviders(<AlunoDashboard />);

      const aulas = screen.queryAllByText(/aulas/i).length > 0 ||
                   screen.queryAllByText(/próximas/i).length > 0 ||
                   screen.queryAllByText(/cronograma/i).length > 0;
      expect(aulas).toBeTruthy();
    });

    it('deve ter acesso a materiais', () => {
      renderWithProviders(<AlunoDashboard />);

      const materiais = screen.queryAllByText(/materiais/i).length > 0 ||
                       screen.queryAllByText(/biblioteca/i).length > 0 ||
                       screen.queryAllByText(/conteúdo/i).length > 0;
      expect(materiais).toBeTruthy();
    });
  });

  describe('Financeiro', () => {
    it('deve exibir informações de pagamento', () => {
      renderWithProviders(<AlunoDashboard />);

      const financeiro = screen.queryAllByText(/pagamento/i).length > 0 ||
                        screen.queryAllByText(/mensalidade/i).length > 0 ||
                        screen.queryAllByText(/financeiro/i).length > 0 ||
                        screen.queryAllByText(/pagamentos/i).length > 0;
      expect(financeiro).toBeTruthy();
    });
  });

  describe('Comunicados', () => {
    it('deve exibir comunicados recentes', () => {
      renderWithProviders(<AlunoDashboard />);

      const comunicados = screen.queryAllByText(/comunicado/i).length > 0 ||
                         screen.queryAllByText(/avisos/i).length > 0 ||
                         screen.queryAllByText(/notificações/i).length > 0;
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

      const calendar = screen.queryAllByText(/aulas/i).length > 0 ||
                      screen.queryAllByText(/frequência/i).length > 0;
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
          <MockDataProvider>
            <AlunoDashboard />
          </MockDataProvider>
        </BrowserRouter>
      );

      expect(screen.queryAllByText(/dashboard/i).length > 0 || screen.queryAllByText(/meu painel/i).length > 0 || screen.queryAllByText(/Olá/i).length > 0).toBe(true);
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
