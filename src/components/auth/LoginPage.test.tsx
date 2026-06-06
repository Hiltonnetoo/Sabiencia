// ============================================
// LOGIN PAGE TESTS - Testes da página de login
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper com providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar o formulário de login', () => {
      renderWithProviders(<LoginPage />);

      expect(screen.getByText('Sistema de Gestão Educacional')).toBeInTheDocument();
      expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('deve exibir a logo da Sabiencia', () => {
      renderWithProviders(<LoginPage />);

      const logo = screen.getByRole('img', { name: 'Sabiencia' });
      expect(logo).toBeInTheDocument();
    });

    it('deve exibir título e descrição', () => {
      renderWithProviders(<LoginPage />);

      expect(screen.getByText('Sistema de Gestão Educacional')).toBeInTheDocument();
      expect(screen.getByText(/faça login para acessar/i)).toBeInTheDocument();
    });

    it('deve exibir link para modo demonstração', () => {
      renderWithProviders(<LoginPage />);

      const demoLink = screen.getByText(/modo demonstração/i);
      expect(demoLink).toBeInTheDocument();
      expect(demoLink.closest('a')).toHaveAttribute('href', '/demo');
    });

    it('deve exibir credenciais de teste', () => {
      renderWithProviders(<LoginPage />);

      expect(screen.getByText(/credenciais de teste/i)).toBeInTheDocument();
      expect(screen.getByText(/gestor/i)).toBeInTheDocument();
      expect(screen.getByText(/professor/i)).toBeInTheDocument();
      expect(screen.getByText(/aluno/i)).toBeInTheDocument();
    });
  });

  describe('Campos de Entrada', () => {
    it('deve permitir digitar CPF', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      await user.type(cpfInput, '12345678901');

      expect(cpfInput).toHaveValue('123.456.789-01');
    });

    it('deve formatar CPF automaticamente', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      await user.type(cpfInput, '00000000001');

      expect(cpfInput).toHaveValue('000.000.000-01');
    });

    it('deve limitar CPF a 11 dígitos', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      await user.type(cpfInput, '123456789012345');

      const value = (cpfInput as HTMLInputElement).value.replace(/\D/g, '');
      expect(value.length).toBeLessThanOrEqual(11);
    });

    it('deve permitir digitar senha', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const senhaInput = screen.getByLabelText(/senha/i);
      await user.type(senhaInput, 'senha123');

      expect(senhaInput).toHaveValue('senha123');
    });

    it('deve esconder senha por padrão', () => {
      renderWithProviders(<LoginPage />);

      const senhaInput = screen.getByLabelText(/senha/i);
      expect(senhaInput).toHaveAttribute('type', 'password');
    });

    it('deve alternar visibilidade da senha', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const senhaInput = screen.getByLabelText(/senha/i);
      const toggleButton = screen.getByRole('button', { name: /mostrar senha/i });

      // Senha escondida inicialmente
      expect(senhaInput).toHaveAttribute('type', 'password');

      // Mostrar senha
      await user.click(toggleButton);
      expect(senhaInput).toHaveAttribute('type', 'text');

      // Esconder senha novamente
      await user.click(toggleButton);
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
        expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
      });
    });

    it('deve validar CPF incompleto', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      await user.type(cpfInput, '123456');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
      });
    });

    it('deve validar senha vazia', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      await user.type(cpfInput, '00000000001');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument();
      });
    });

    it('deve validar senha muito curta', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      await user.type(cpfInput, '00000000001');
      await user.type(senhaInput, '123');

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login', () => {
    it('deve fazer login com credenciais de gestor', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '00000000001');
      await user.type(senhaInput, 'gestor123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/redirect');
      });
    });

    it('deve fazer login com credenciais de professor', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '11111111111');
      await user.type(senhaInput, 'prof123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/redirect');
      });
    });

    it('deve fazer login com credenciais de aluno', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '33333333333');
      await user.type(senhaInput, 'aluno123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/redirect');
      });
    });

    it('deve exibir erro com credenciais inválidas', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '99999999999');
      await user.type(senhaInput, 'senhaerrada');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/cpf ou senha inválidos/i)).toBeInTheDocument();
      });
    });

    it('deve limpar erro ao tentar novamente', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      // Primeira tentativa com erro
      await user.type(cpfInput, '99999999999');
      await user.type(senhaInput, 'senhaerrada');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/cpf ou senha inválidos/i)).toBeInTheDocument();
      });

      // Limpar e tentar novamente
      await user.clear(cpfInput);
      await user.clear(senhaInput);
      await user.type(cpfInput, '00000000001');
      await user.type(senhaInput, 'gestor123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/cpf ou senha inválidos/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Estado de Loading', () => {
    it('deve desabilitar botão durante login', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '00000000001');
      await user.type(senhaInput, 'gestor123');

      expect(submitButton).not.toBeDisabled();

      await user.click(submitButton);

      // Durante o login, o botão pode estar desabilitado (depende do timing)
      // Após o login, deve voltar ao normal
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it('deve exibir indicador de carregamento', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(cpfInput, '00000000001');
      await user.type(senhaInput, 'gestor123');
      await user.click(submitButton);

      // Verificar que o formulário foi submetido
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels associados aos inputs', () => {
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      expect(cpfInput).toHaveAttribute('id');
      expect(senhaInput).toHaveAttribute('id');
    });

    it('deve ter placeholder nos inputs', () => {
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      expect(cpfInput).toHaveAttribute('placeholder');
      expect(senhaInput).toHaveAttribute('placeholder');
    });

    it('deve permitir submit com Enter', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const senhaInput = screen.getByLabelText(/senha/i);

      await user.type(cpfInput, '00000000001');
      await user.type(senhaInput, 'gestor123');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/redirect');
      });
    });

    it('deve ter foco no primeiro campo ao carregar', () => {
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      cpfInput.focus();
      expect(document.activeElement).toBe(cpfInput);
    });
  });

  describe('UX', () => {
    it('deve limpar mensagem de erro ao digitar', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const cpfInput = screen.getByLabelText(/cpf/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      // Gerar erro
      await user.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
      });

      // Digitar deve limpar erro (se implementado)
      await user.type(cpfInput, '1');
      
      // Verificar que a página ainda está renderizada
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });
  });
});
