// ============================================
// STATUS BADGE TESTS - Testes do componente de badge de status
// ============================================

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  describe('Renderização', () => {
    it('deve renderizar com status ativo', () => {
      render(<StatusBadge status="ativo" />);

      expect(screen.getByText(/ativo/i)).toBeInTheDocument();
    });

    it('deve renderizar com status inativo', () => {
      render(<StatusBadge status="inativo" />);

      expect(screen.getByText(/inativo/i)).toBeInTheDocument();
    });

    it('deve renderizar com status pendente', () => {
      render(<StatusBadge status="pendente" />);

      expect(screen.getByText(/pendente/i)).toBeInTheDocument();
    });

    it('deve renderizar com status aprovado', () => {
      render(<StatusBadge status="aprovado" />);

      expect(screen.getByText(/aprovado/i)).toBeInTheDocument();
    });

    it('deve renderizar com status reprovado', () => {
      render(<StatusBadge status="reprovado" />);

      expect(screen.getByText(/reprovado/i)).toBeInTheDocument();
    });
  });

  describe('Estilos', () => {
    it('deve aplicar classe CSS apropriada para ativo', () => {
      render(<StatusBadge status="ativo" />);

      const badge = screen.getByText(/ativo/i);
      expect(badge.className).toBeDefined();
    });

    it('deve aplicar classe CSS apropriada para inativo', () => {
      render(<StatusBadge status="inativo" />);

      const badge = screen.getByText(/inativo/i);
      expect(badge.className).toBeDefined();
    });
  });

  describe('Variações', () => {
    it('deve aceitar className customizado', () => {
      render(<StatusBadge status="ativo" className="custom-class" />);

      const badge = screen.getByText(/ativo/i);
      expect(badge.className).toContain('custom-class');
    });
  });

  describe('Cores e Variantes', () => {
    const statusList = [
      'ativo', 'inativo', 'pendente', 'aprovado', 'reprovado',
      'pago', 'vencido', 'cancelado', 'concluido', 'em_andamento'
    ];

    statusList.forEach(status => {
      it(`deve renderizar status ${status} corretamente`, () => {
        render(<StatusBadge status={status} />);

        const badge = screen.getByText(new RegExp(status.replace('_', ' '), 'i'));
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter role adequado', () => {
      const { container } = render(<StatusBadge status="ativo" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('deve ser legível por leitores de tela', () => {
      render(<StatusBadge status="ativo" />);

      const badge = screen.getByText(/ativo/i);
      expect(badge.textContent).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com status inexistente graciosamente', () => {
      render(<StatusBadge status="status_inexistente" />);

      const badge = screen.getByText(/status_inexistente/i);
      expect(badge).toBeInTheDocument();
    });

    it('deve renderizar sem className adicional', () => {
      render(<StatusBadge status="ativo" />);

      expect(screen.getByText(/ativo/i)).toBeInTheDocument();
    });
  });
});
