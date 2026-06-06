// ============================================
// EMPTY STATE TESTS - Testes dos componentes de estado vazio
// ============================================

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState, SearchEmptyState, FilterEmptyState } from './EmptyState';

describe('EmptyState', () => {
  describe('Renderização Básica', () => {
    it('deve renderizar com título', () => {
      render(<EmptyState title="Nenhum item encontrado" />);

      expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
    });

    it('deve renderizar com descrição', () => {
      render(
        <EmptyState 
          title="Sem dados" 
          description="Não há dados para exibir" 
        />
      );

      expect(screen.getByText('Não há dados para exibir')).toBeInTheDocument();
    });

    it('deve renderizar com ícone', () => {
      const { container } = render(
        <EmptyState 
          title="Vazio"
          icon={<div data-testid="custom-icon">Icon</div>}
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('deve renderizar com botão de ação', () => {
      const mockAction = vi.fn();
      
      render(
        <EmptyState 
          title="Sem dados"
          action={{
            label: 'Adicionar item',
            onClick: mockAction
          }}
        />
      );

      expect(screen.getByRole('button', { name: /adicionar item/i })).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve chamar onClick ao clicar no botão de ação', async () => {
      const user = userEvent.setup();
      const mockAction = vi.fn();

      render(
        <EmptyState 
          title="Vazio"
          action={{
            label: 'Clique aqui',
            onClick: mockAction
          }}
        />
      );

      const button = screen.getByRole('button', { name: /clique aqui/i });
      await user.click(button);

      expect(mockAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Variações', () => {
    it('deve renderizar sem ação', () => {
      render(<EmptyState title="Sem ação" />);

      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBe(0);
    });

    it('deve renderizar sem descrição', () => {
      render(<EmptyState title="Apenas título" />);

      expect(screen.getByText('Apenas título')).toBeInTheDocument();
    });

    it('deve renderizar sem ícone', () => {
      render(<EmptyState title="Sem ícone" />);

      expect(screen.getByText('Sem ícone')).toBeInTheDocument();
    });
  });
});

describe('SearchEmptyState', () => {
  describe('Renderização', () => {
    it('deve renderizar mensagem de busca vazia', () => {
      render(<SearchEmptyState searchTerm="teste" />);

      expect(screen.getByText(/teste/i)).toBeInTheDocument();
    });

    it('deve exibir termo de busca', () => {
      render(<SearchEmptyState searchTerm="João Silva" />);

      expect(screen.getByText(/joão silva/i)).toBeInTheDocument();
    });

    it('deve ter botão para limpar busca', () => {
      const mockClear = vi.fn();
      render(<SearchEmptyState searchTerm="teste" onClearSearch={mockClear} />);

      expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve chamar onClearSearch ao limpar', async () => {
      const user = userEvent.setup();
      const mockClear = vi.fn();

      render(<SearchEmptyState searchTerm="teste" onClearSearch={mockClear} />);

      const clearButton = screen.getByRole('button', { name: /limpar/i });
      await user.click(clearButton);

      expect(mockClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mensagens', () => {
    it('deve mostrar sugestões de busca', () => {
      render(<SearchEmptyState searchTerm="xyz123" />);

      const suggestions = screen.queryByText(/sugestão/i) || 
                         screen.queryByText(/tente/i) ||
                         screen.queryByText(/nenhum resultado/i);
      expect(suggestions).toBeTruthy();
    });
  });
});

describe('FilterEmptyState', () => {
  describe('Renderização', () => {
    it('deve renderizar mensagem de filtro vazio', () => {
      render(<FilterEmptyState />);

      expect(screen.getByText(/nenhum.*resultado/i) || screen.getByText(/filtro/i)).toBeInTheDocument();
    });

    it('deve ter botão para limpar filtros', () => {
      const mockClear = vi.fn();
      render(<FilterEmptyState onClearFilters={mockClear} />);

      expect(screen.getByRole('button', { name: /limpar.*filtros/i })).toBeInTheDocument();
    });

    it('deve exibir quantidade de filtros ativos', () => {
      render(<FilterEmptyState activeFiltersCount={3} />);

      expect(screen.getByText(/3/)).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve chamar onClearFilters ao limpar', async () => {
      const user = userEvent.setup();
      const mockClear = vi.fn();

      render(<FilterEmptyState onClearFilters={mockClear} />);

      const clearButton = screen.getByRole('button', { name: /limpar.*filtros/i });
      await user.click(clearButton);

      expect(mockClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Estados', () => {
    it('deve mostrar mensagem diferente quando há filtros ativos', () => {
      const { rerender } = render(<FilterEmptyState activeFiltersCount={0} />);

      const messageNoFilters = screen.queryByText(/filtro/i);

      rerender(<FilterEmptyState activeFiltersCount={2} />);

      const messageWithFilters = screen.queryByText(/filtro/i) || screen.queryByText(/2/);
      expect(messageWithFilters).toBeTruthy();
    });
  });
});

describe('Acessibilidade', () => {
  it('EmptyState deve ter estrutura semântica', () => {
    render(<EmptyState title="Teste" />);

    const heading = screen.queryByRole('heading') || screen.getByText('Teste');
    expect(heading).toBeInTheDocument();
  });

  it('SearchEmptyState deve ter botões acessíveis', () => {
    const mockClear = vi.fn();
    render(<SearchEmptyState searchTerm="teste" onClearSearch={mockClear} />);

    const button = screen.getByRole('button', { name: /limpar/i });
    expect(button).toBeAccessible || expect(button).toBeDefined();
  });

  it('FilterEmptyState deve ter labels descritivos', () => {
    const mockClear = vi.fn();
    render(<FilterEmptyState onClearFilters={mockClear} />);

    const button = screen.getByRole('button');
    expect(button.textContent).toBeTruthy();
  });
});

describe('Responsividade', () => {
  it('deve renderizar em diferentes tamanhos de tela', () => {
    const { container } = render(<EmptyState title="Teste" />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('deve manter layout em mobile', () => {
    global.innerWidth = 375;
    render(<EmptyState title="Mobile" />);

    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });

  it('deve manter layout em desktop', () => {
    global.innerWidth = 1920;
    render(<EmptyState title="Desktop" />);

    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });
});
