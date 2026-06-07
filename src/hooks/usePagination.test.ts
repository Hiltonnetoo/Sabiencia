// ============================================
// USEPAGINATION TESTS - Testes do hook de paginação
// ============================================

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  const mockData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`
  }));

  describe('Estado Inicial', () => {
    it('deve iniciar com configuração padrão', () => {
      const { result } = renderHook(() => usePagination(mockData));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(25);
      expect(result.current.totalPages).toBe(4);
      expect(result.current.totalItems).toBe(100);
    });

    it('deve aceitar página inicial customizada', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 3 })
      );

      expect(result.current.currentPage).toBe(3);
    });

    it('deve aceitar itens por página customizado', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPageSize: 25 })
      );

      expect(result.current.pageSize).toBe(25);
      expect(result.current.totalPages).toBe(4);
    });
  });

  describe('Dados Paginados', () => {
    it('deve retornar dados da primeira página corretamente', () => {
      const { result } = renderHook(() => usePagination(mockData, { initialPageSize: 10 }));

      expect(result.current.currentItems).toHaveLength(10);
      expect(result.current.currentItems[0].id).toBe(1);
      expect(result.current.currentItems[9].id).toBe(10);
    });

    it('deve retornar dados da página especificada', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 3, initialPageSize: 10 })
      );

      expect(result.current.currentItems).toHaveLength(10);
      expect(result.current.currentItems[0].id).toBe(21); // (3-1) * 10 + 1
      expect(result.current.currentItems[9].id).toBe(30);
    });

    it('deve lidar com última página incompleta', () => {
      const smallData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`
      }));

      const { result } = renderHook(() =>
        usePagination(smallData, { initialPage: 3, initialPageSize: 10 })
      );

      expect(result.current.currentItems).toHaveLength(5);
      expect(result.current.currentItems[0].id).toBe(21);
      expect(result.current.currentItems[4].id).toBe(25);
    });
  });

  describe('Navegação', () => {
    it('deve ir para próxima página', () => {
      const { result } = renderHook(() => usePagination(mockData, { initialPageSize: 10 }));

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it('deve ir para página anterior', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 5, initialPageSize: 10 })
      );

      act(() => {
        result.current.previousPage();
      });

      expect(result.current.currentPage).toBe(4);
    });

    it('deve ir para página específica', () => {
      const { result } = renderHook(() => usePagination(mockData, { initialPageSize: 10 }));

      act(() => {
        result.current.goToPage(7);
      });

      expect(result.current.currentPage).toBe(7);
    });

    it('não deve ir além da última página', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 10, initialPageSize: 10 })
      );

      act(() => {
        result.current.nextPage();
      });

      expect(result.current.currentPage).toBe(10); // permanece na última página
    });

    it('não deve ir antes da primeira página', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 1, initialPageSize: 10 })
      );

      act(() => {
        result.current.previousPage();
      });

      expect(result.current.currentPage).toBe(1); // permanece na primeira página
    });
  });

  describe('Estados de Navegação', () => {
    it('deve detectar quando está na primeira página', () => {
      const { result } = renderHook(() => usePagination(mockData, { initialPageSize: 10 }));

      expect(result.current.currentPage === 1).toBe(true);
      expect(result.current.currentPage === result.current.totalPages).toBe(false);
    });

    it('deve detectar quando está na última página', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 10, initialPageSize: 10 })
      );

      expect(result.current.currentPage === 1).toBe(false);
      expect(result.current.currentPage === result.current.totalPages).toBe(true);
    });

    it('deve detectar página intermediária', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 5, initialPageSize: 10 })
      );

      expect(result.current.currentPage === 1).toBe(false);
      expect(result.current.currentPage === result.current.totalPages).toBe(false);
    });
  });

  describe('Mudança de Itens por Página', () => {
    it('deve alterar quantidade de itens por página', () => {
      const { result } = renderHook(() => usePagination(mockData, { initialPageSize: 10 }));

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.pageSize).toBe(25);
      expect(result.current.totalPages).toBe(4);
    });

    it('deve resetar para primeira página ao mudar itens por página', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 5, initialPageSize: 10 })
      );

      act(() => {
        result.current.setPageSize(50);
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(2);
    });
  });

  describe('Casos Extremos', () => {
    it('deve lidar com array vazio', () => {
      const { result } = renderHook(() => usePagination([]));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.currentItems).toEqual([]);
    });

    it('deve lidar com dados menores que itens por página', () => {
      const smallData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const { result } = renderHook(() =>
        usePagination(smallData, { initialPageSize: 10 })
      );

      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentItems).toHaveLength(3);
    });

    it('deve recalcular ao mudar dados', () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePagination(data, { initialPageSize: 10 }),
        { initialProps: { data: mockData.slice(0, 50) } }
      );

      expect(result.current.totalPages).toBe(5);

      rerender({ data: mockData });

      expect(result.current.totalPages).toBe(10);
    });
  });

  describe('Informações de Paginação', () => {
    it('deve calcular índices corretamente', () => {
      const { result } = renderHook(() =>
        usePagination(mockData, { initialPage: 3, initialPageSize: 10 })
      );

      expect(result.current.startIndex).toBe(20); // (3-1) * 10
      expect(result.current.endIndex).toBe(30); // 20 + 10
    });

    it('deve calcular índices para última página incompleta', () => {
      const smallData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const { result } = renderHook(() =>
        usePagination(smallData, { initialPage: 3, initialPageSize: 10 })
      );

      expect(result.current.startIndex).toBe(20);
      expect(result.current.endIndex).toBe(25);
    });
  });
});
