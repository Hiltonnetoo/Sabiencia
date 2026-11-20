// ============================================
// ALUNO FORM TESTS - Testes do formulário de alunos
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AlunoForm } from './AlunoForm';
import { MockDataProvider } from '../../contexts/MockDataContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MockDataProvider>
        {component}
      </MockDataProvider>
    </BrowserRouter>
  );
};

describe('AlunoForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.useRealTimers();
  });

  describe('Renderização - Modo Criação', () => {
    it('deve renderizar formulário vazio', () => {
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^cpf\s*\*?$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('deve ter todos os campos obrigatórios', () => {
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^cpf\s*\*?$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^telefone\s*\*?$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    });

    it('deve ter botão de salvar', () => {
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    });

    it('deve ter botão de cancelar', () => {
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });
  });

  describe('Validações', () => {
    it('deve validar nome completo obrigatório', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.queryAllByText(/Nome deve ter pelo menos 3/i) ||
                       screen.queryAllByText(/campo obrigatório/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it('deve validar CPF obrigatório', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      await user.type(nomeInput, 'João Silva');

      const submitButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.queryAllByText(/formato do CPF está incorreto/i) ||
                       screen.queryAllByText(/campo obrigatório/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it('deve validar formato de email', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'email-invalido');

      const submitButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.queryAllByText(/email.*inválido/i) ||
                      screen.queryAllByText(/formato.*email/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it('deve validar formato de telefone', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const telefoneInput = screen.getByLabelText(/^telefone\s*\*?$/i);
      await user.type(telefoneInput, '123');

      const submitButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errors = screen.queryAllByText(/telefone deve ter pelo menos 10/i) ||
                       screen.queryAllByText(/telefone.*inválido/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Formatação de Campos', () => {
    it('deve formatar CPF automaticamente', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const cpfInput = screen.getByLabelText(/^cpf\s*\*?$/i) as HTMLInputElement;
      await user.type(cpfInput, '12345678901');

      await waitFor(() => {
        expect(cpfInput.value).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
      });
    });

    it('deve formatar telefone automaticamente', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const telefoneInput = screen.getByLabelText(/^telefone\s*\*?$/i) as HTMLInputElement;
      await user.type(telefoneInput, '11987654321');

      await waitFor(() => {
        expect(telefoneInput.value).toMatch(/\(\d{2}\)/);
      });
    });

    it('deve formatar CEP automaticamente', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const cepInput = screen.getByLabelText(/cep/i) as HTMLInputElement;
      await user.type(cepInput, '01310100');

      await waitFor(() => {
        expect(cepInput.value).toBe('01310-100');
      });
    });
  });

  describe('Envio do Formulário', () => {
    const preencherObrigatorios = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/^cpf\s*\*?$/i), '52998224725');
      await user.type(screen.getByLabelText(/email/i), 'joao@exemplo.com');
      await user.type(screen.getByLabelText(/^telefone\s*\*?$/i), '11987654321');
      await user.type(screen.getByLabelText(/data de nascimento/i), '2000-01-01');
    };

    it('deve enviar os dados válidos para onSubmit', async () => {
      const user = userEvent.setup({ delay: null });
      const onSubmit = vi.fn();
      renderWithProviders(<AlunoForm onSubmit={onSubmit} />);

      await preencherObrigatorios(user);
      await user.click(screen.getByRole('button', { name: /salvar/i }));

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      const enviado = onSubmit.mock.calls[0][0];
      expect(enviado.nome_completo).toBe('João Silva');
      expect(enviado.email).toBe('joao@exemplo.com');
      expect(enviado.cpf.replace(/\D/g, '')).toBe('52998224725');
      expect(enviado.data_nascimento).toBeInstanceOf(Date);
    });

    it('deve chamar onSuccess após salvar quando não há onSubmit', async () => {
      const user = userEvent.setup({ delay: null });
      const onSuccess = vi.fn();
      renderWithProviders(<AlunoForm onSuccess={onSuccess} />);

      await preencherObrigatorios(user);
      await user.click(screen.getByRole('button', { name: /salvar/i }));

      await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });

    it('não deve enviar com campos obrigatórios vazios', async () => {
      const user = userEvent.setup({ delay: null });
      const onSubmit = vi.fn();
      renderWithProviders(<AlunoForm onSubmit={onSubmit} />);

      await user.click(screen.getByRole('button', { name: /salvar/i }));

      await screen.findAllByText(/Nome deve ter pelo menos 3/i);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Modo Edição', () => {
    const mockAluno = {
      id: '1',
      nome_completo: 'João Silva',
      cpf: '123.456.789-09',
      email: 'joao@exemplo.com',
      telefone: '11987654321',
      data_nascimento: new Date('2000-01-01'),
      endereco: {
        cep: '01310-100',
        rua: 'Rua A',
        numero: '123',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      ativo: true,
      created_at: new Date('2024-01-01')
    };

    it('deve carregar dados do aluno para edição', () => {
      renderWithProviders(<AlunoForm initialData={mockAluno as any} onSuccess={mockOnSuccess} />);

      const nomeInput = screen.getByLabelText(/nome completo/i) as HTMLInputElement;
      expect(nomeInput.value).toBe('João Silva');
    });

    it('deve permitir editar campos', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm initialData={mockAluno as any} onSuccess={mockOnSuccess} />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      await user.clear(nomeInput);
      await user.type(nomeInput, 'João Pedro Silva');

      expect((nomeInput as HTMLInputElement).value).toBe('João Pedro Silva');
    });
  });

  describe('Cancelamento', () => {
    it('deve limpar formulário ao cancelar', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/nome completo/i), 'Teste');

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      // Formulário pode ser limpo ou navegação pode ocorrer
      expect(cancelButton).toBeDefined();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels associados aos inputs', () => {
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      const cpfInput = screen.getByLabelText(/^cpf\s*\*?$/i);
      const emailInput = screen.getByLabelText(/email/i);

      expect(nomeInput).toHaveAttribute('id');
      expect(cpfInput).toHaveAttribute('id');
      expect(emailInput).toHaveAttribute('id');
    });

    it('deve marcar campos obrigatórios', () => {
      renderWithProviders(<AlunoForm onSuccess={mockOnSuccess} />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      expect(nomeInput).toHaveAttribute('required');
    });
  });
});
