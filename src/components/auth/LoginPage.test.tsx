// ============================================
// LOGIN PAGE TESTS - Testes da página de login
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do useAuth
const mockLogin = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    logout: vi.fn(),
    updateUser: vi.fn()
  }),
  useRole: () => null,
  useIsAuthenticated: () => false,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Wrapper com providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar o formulário de login', () => {
      renderWithProviders(<LoginPage />);

      expect(screen.queryAllByText(/Sabiencia/i).length).toBeGreaterThan(0);
      expect(screen.getByLabelText(/cpf ou/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('deve exibir a logo da Sabiencia', () => {
      renderWithProviders(<LoginPage />);

      const logo = screen.getByRole('img', { name: 'Sabiencia' });
      expect(logo).toBeInTheDocument();
    });

    it('deve exibir título e descrição', () => {
      renderWithProviders(<LoginPage />);

      expect(screen.queryAllByText(/Sabiencia/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/entre com suas credenciais/i)).toBeInTheDocument();
    });

    it('deve exibir link para modo demonstração', () => {
      renderWithProviders(<LoginPage />);

      const demoLink = screen.getByText(/Demonstração/i);
      expect(demoLink).toBeInTheDocument();
    });

    it('deve exibir credenciais de teste', () => {
      renderWithProviders(<LoginPage />);

      expect(screen.getByText(/Demonstração/i)).toBeInTheDocument();
      expect(screen.queryAllByText(/gestor/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/professor/i).length).toBeGreaterThan(0);
      expect(screen.queryAllByText(/aluno/i).length).toBeGreaterThan(0);
    });
  });

  describe('Campos de Entrada', () => {
    it('deve permitir digitar CPF', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      await user.type(cpfInput, '12345678901');

      expect(cpfInput).toHaveValue('123.456.789-01');
    });

    it('deve formatar CPF automaticamente', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      await user.type(cpfInput, '00000000001');

      expect(cpfInput).toHaveValue('000.000.000-01');
    });

    it('deve limitar CPF a 11 dígitos', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      await user.type(cpfInput, '123456789012345');

      const value = (cpfInput as HTMLInputElement).value.replace(/\D/g, '');
      expect(value.length).toBeLessThanOrEqual(11);
    });

    it('deve permitir digitar senha', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const senhaInput = screen.getByLabelText(/^senha$/i);
      await user.type(senhaInput, 'senha123');

      expect(senhaInput).toHaveValue('senha123');
    });

    it('deve esconder senha por padrão', () => {
      renderWithProviders(<LoginPage />);

      const senhaInput = screen.getByLabelText(/^senha$/i);
      expect(senhaInput).toHaveAttribute('type', 'password');
    });

    it('deve alternar visibilidade da senha', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const senhaInput = screen.getByLabelText(/^senha$/i);
      const toggleButton = screen.getByRole('button', { name: /mostrar senha/i });

      // Senha escondida inicialmente
      expect(senhaInput).toHaveAttribute('type', 'password');

      // Mostrar senha
      await user.click(toggleButton);
      expect(senhaInput).toHaveAttribute('type', 'text');

      // Esconder senha novamente
      const hideButton = screen.getByRole('button', { name: /esconder senha/i });
      await user.click(hideButton);
      expect(senhaInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Validações', () => {
    it('deve validar CPF vazio', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Informe CPF ou e‑mail/i)).toBeInTheDocument();
      });
    });

    it('deve validar CPF incompleto', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      await user.type(cpfInput, '123456');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/formato do CPF está incorreto/i)).toBeInTheDocument();
      });
    });

    it('deve validar email inválido', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      await user.type(cpfInput, 'invalido@email');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/E‑mail inválido/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login', () => {
    it('deve fazer login com credenciais de gestor', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      const senhaInput = screen.getByLabelText(/^senha$/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '00000000001');
      await user.type(senhaInput, 'gestor123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('000.000.000-01', 'gestor123');
      });
    });

    it('deve fazer login com credenciais de professor', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      const senhaInput = screen.getByLabelText(/^senha$/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '11111111111');
      await user.type(senhaInput, 'prof123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('111.111.111-11', 'prof123');
      });
    });

    it('deve fazer login com credenciais de aluno', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      const senhaInput = screen.getByLabelText(/^senha$/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '33333333333');
      await user.type(senhaInput, 'aluno123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('333.333.333-33', 'aluno123');
      });
    });
  });

  describe('UX', () => {
    it('deve mostrar loader durante o login', async () => {
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf ou/i);
      const senhaInput = screen.getByLabelText(/^senha$/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '00000000001');
      await user.type(senhaInput, 'gestor123');
      await user.click(submitButton);

      expect(screen.getByText(/entrando/i)).toBeInTheDocument();
    });
  });
});
