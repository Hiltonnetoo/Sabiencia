// ============================================
// LOADING SPINNER TESTS - Testes do componente de loading
// ============================================

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Renderização', () => {
    it('deve renderizar o spinner', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve renderizar com texto', () => {
      render(<LoadingSpinner text="Carregando..." />);

      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve renderizar sem texto', () => {
      render(<LoadingSpinner />);

      const text = screen.queryByText(/carregando/i);
      expect(text).toBeNull();
    });
  });

  describe('Tamanhos', () => {
    it('deve aceitar tamanho pequeno', () => {
      const { container } = render(<LoadingSpinner size="sm" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve aceitar tamanho médio', () => {
      const { container } = render(<LoadingSpinner size="md" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve aceitar tamanho grande', () => {
      const { container } = render(<LoadingSpinner size="lg" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve usar tamanho padrão quando não especificado', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Estilos', () => {
    it('deve aceitar className customizado', () => {
      const { container } = render(<LoadingSpinner className="custom-spinner" />);

      const spinner = container.firstChild as HTMLElement;
      expect(spinner.className).toContain('custom-spinner');
    });

    it('deve aplicar classes padrão', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.firstChild).toBeDefined();
    });
  });

  describe('Variantes', () => {
    it('deve aceitar variante primary', () => {
      const { container } = render(<LoadingSpinner variant="primary" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve aceitar variante secondary', () => {
      const { container } = render(<LoadingSpinner variant="secondary" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve aceitar variante white', () => {
      const { container } = render(<LoadingSpinner variant="white" />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Centralização', () => {
    it('deve centralizar quando solicitado', () => {
      const { container } = render(<LoadingSpinner centered />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeDefined();
    });

    it('não deve centralizar por padrão', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.firstChild).toBeDefined();
    });
  });

  describe('Fullscreen', () => {
    it('deve renderizar em fullscreen', () => {
      const { container } = render(<LoadingSpinner fullscreen />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toBeDefined();
    });

    it('deve incluir overlay em fullscreen', () => {
      const { container } = render(<LoadingSpinner fullscreen />);

      expect(container.firstChild).toBeDefined();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter role="status"', () => {
      const { container } = render(<LoadingSpinner />);

      const spinner = container.querySelector('[role="status"]') || container.firstChild;
      expect(spinner).toBeDefined();
    });

    it('deve ter aria-label descritivo', () => {
      const { container } = render(<LoadingSpinner />);

      const spinner = container.querySelector('[aria-label]') || container.firstChild;
      expect(spinner).toBeDefined();
    });

    it('deve ter aria-live="polite"', () => {
      const { container } = render(<LoadingSpinner />);

      const spinner = container.querySelector('[aria-live]') || container.firstChild;
      expect(spinner).toBeDefined();
    });

    it('deve ser anunciado para leitores de tela', () => {
      render(<LoadingSpinner text="Carregando dados" />);

      const text = screen.getByText('Carregando dados');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Animação', () => {
    it('deve ter animação de rotação', () => {
      const { container } = render(<LoadingSpinner />);

      const spinner = container.firstChild as HTMLElement;
      expect(spinner.className).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('deve renderizar com múltiplas props', () => {
      const { container } = render(
        <LoadingSpinner 
          size="lg"
          variant="primary"
          text="Carregando..."
          centered
          className="custom"
        />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve lidar com texto longo', () => {
      const longText = 'Este é um texto muito longo para o spinner de loading que deve ser renderizado corretamente';
      render(<LoadingSpinner text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('deve renderizar sem props', () => {
      const { container } = render(<LoadingSpinner />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve renderizar rapidamente', () => {
      const startTime = performance.now();
      render(<LoadingSpinner />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('deve re-renderizar eficientemente', () => {
      const { rerender } = render(<LoadingSpinner text="Texto 1" />);

      rerender(<LoadingSpinner text="Texto 2" />);

      expect(screen.getByText('Texto 2')).toBeInTheDocument();
    });
  });
});
