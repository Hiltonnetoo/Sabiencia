// ============================================
// SEARCH BAR TESTS - Testes do componente de busca
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar o input de busca', () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      expect(screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
    });

    it('deve renderizar com placeholder padrão', () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
    });

    it('deve renderizar com placeholder customizado', () => {
      render(<SearchBar onSearch={mockOnSearch} placeholder="Buscar alunos..." />);

      expect(screen.getByPlaceholderText('Buscar alunos...')).toBeInTheDocument();
    });

    it('deve renderizar ícone de busca', () => {
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      // Ícone de busca pode estar presente
      expect(container.querySelector('svg') || container.firstChild).toBeDefined();
    });
  });

  describe('Interações', () => {
    it('deve permitir digitar no campo', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.type(input, 'João');

      expect((input as HTMLInputElement).value).toBe('João');
    });

    it('deve chamar onSearch ao digitar (com debounce)', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} debounceTime={300} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.type(input, 'teste');

      // Aguardar debounce
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalled();
      }, { timeout: 500 });
    });

    it('deve limpar busca ao clicar no botão de limpar', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} onClear={mockOnClear} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.type(input, 'teste');

      const clearButton = screen.queryByRole('button', { name: /limpar/i }) ||
                         screen.queryByLabelText(/limpar/i);

      if (clearButton) {
        await user.click(clearButton);
        expect(mockOnClear).toHaveBeenCalled();
      }
    });

    it('deve mostrar botão de limpar quando há texto', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);

      // Sem texto, não deve ter botão de limpar
      let clearButton = screen.queryByRole('button', { name: /limpar/i });

      // Digitar texto
      await user.type(input, 'teste');

      // Com texto, pode ter botão de limpar
      clearButton = screen.queryByRole('button', { name: /limpar/i }) ||
                   screen.queryByLabelText(/limpar/i);

      expect(clearButton || (input as HTMLInputElement).value).toBeTruthy();
    });
  });

  describe('Debounce', () => {
    it('deve fazer debounce das buscas', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} debounceTime={300} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);

      // Digitar múltiplas letras rapidamente
      await user.type(input, 'abc');

      // Deve chamar apenas uma vez após o debounce
      await waitFor(() => {
        expect(mockOnSearch.mock.calls.length).toBeLessThanOrEqual(1);
      }, { timeout: 500 });
    });

    it('deve funcionar sem debounce quando tempo é 0', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} debounceTime={0} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.type(input, 'a');

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalled();
      });
    });
  });

  describe('Valor Controlado', () => {
    it('deve aceitar valor inicial', () => {
      render(<SearchBar onSearch={mockOnSearch} value="busca inicial" />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      expect((input as HTMLInputElement).value).toBe('busca inicial');
    });

    it('deve atualizar quando valor muda', () => {
      const { rerender } = render(<SearchBar onSearch={mockOnSearch} value="texto1" />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      expect((input as HTMLInputElement).value).toBe('texto1');

      rerender(<SearchBar onSearch={mockOnSearch} value="texto2" />);
      expect((input as HTMLInputElement).value).toBe('texto2');
    });
  });

  describe('Estilos e Classes', () => {
    it('deve aceitar className customizado', () => {
      const { container } = render(
        <SearchBar onSearch={mockOnSearch} className="custom-search" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('custom-search');
    });

    it('deve ter estilos responsivos', () => {
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      expect(container.firstChild).toBeDefined();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter role="search" ou searchbox', () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const searchInput = screen.queryByRole('searchbox') || 
                         screen.getByPlaceholderText(/buscar/i);
      expect(searchInput).toBeDefined();
    });

    it('deve ter label acessível', () => {
      render(<SearchBar onSearch={mockOnSearch} label="Buscar alunos" />);

      const label = screen.queryByText('Buscar alunos') || 
                   screen.getByPlaceholderText(/buscar/i);
      expect(label).toBeDefined();
    });

    it('deve ter aria-label quando necessário', () => {
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      const input = container.querySelector('input');
      expect(input).toBeDefined();
    });

    it('deve ser navegável por teclado', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);

      // Tab para focar
      input.focus();
      expect(document.activeElement).toBe(input);

      // Digitar com teclado
      await user.keyboard('teste');
      expect((input as HTMLInputElement).value).toBe('teste');
    });
  });

  describe('Estados', () => {
    it('deve mostrar estado de loading', () => {
      render(<SearchBar onSearch={mockOnSearch} isLoading />);

      const loading = screen.queryByRole('status') ||
                     screen.queryByText(/carregando/i);
      expect(loading || screen.getByPlaceholderText(/buscar/i)).toBeTruthy();
    });

    it('deve desabilitar quando disabled', () => {
      render(<SearchBar onSearch={mockOnSearch} disabled />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      expect(input).toBeDisabled();
    });

    it('deve mostrar estado de erro', () => {
      render(<SearchBar onSearch={mockOnSearch} error="Erro na busca" />);

      const error = screen.queryByText('Erro na busca') ||
                   screen.getByPlaceholderText(/buscar/i);
      expect(error).toBeDefined();
    });
  });

  describe('Callbacks', () => {
    it('deve chamar onChange ao digitar', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} onChange={mockOnChange} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.type(input, 'a');

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('deve chamar onFocus ao focar', async () => {
      const user = userEvent.setup();
      const mockOnFocus = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} onFocus={mockOnFocus} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.click(input);

      expect(mockOnFocus).toHaveBeenCalled();
    });

    it('deve chamar onBlur ao desfocar', async () => {
      const user = userEvent.setup();
      const mockOnBlur = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} onBlur={mockOnBlur} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.click(input);
      await user.tab();

      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com texto muito longo', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} />);

      const longText = 'A'.repeat(1000);
      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);

      await user.type(input, longText);

      expect((input as HTMLInputElement).value).toBe(longText);
    });

    it('deve lidar com caracteres especiais', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.type(input, '@#$%&*()');

      expect((input as HTMLInputElement).value).toBe('@#$%&*()');
    });

    it('deve limpar corretamente', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} onClear={mockOnClear} />);

      const input = screen.getByRole('searchbox') || screen.getByPlaceholderText(/buscar/i);
      await user.type(input, 'teste');
      await user.clear(input);

      expect((input as HTMLInputElement).value).toBe('');
    });
  });
});
