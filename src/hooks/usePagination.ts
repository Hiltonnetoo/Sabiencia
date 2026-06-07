// ============================================
// USE PAGINATION - Hook para paginação client-side
// ============================================

import { useState, useMemo, useEffect, useRef } from 'react';

export interface PaginationConfig {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export interface PaginationResult<T> {
  // Dados paginados
  currentItems: T[];
  
  // Estado atual
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  
  // Informações
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Ações
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setPageSize: (size: number) => void;
  
  // Utilitários
  getPageNumbers: () => (number | 'ellipsis')[];
}

export function usePagination<T>(
  items: T[],
  config: PaginationConfig = {}
): PaginationResult<T> {
  const {
    initialPage = 1,
    initialPageSize = 25,
    pageSizeOptions = [10, 25, 50, 100],
  } = config;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const isFirstRender = useRef(true);

  // Resetar para primeira página quando itens mudarem (ex: ao filtrar)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [items.length]);

  // Calcular valores
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Garantir que currentPage está dentro dos limites
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Pegar itens da página atual
  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  // Estado de navegação
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Ações de navegação
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const firstPage = () => {
    setCurrentPage(1);
  };

  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Resetar para primeira página
  };

  // Gerar números de página com ellipsis
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const delta = 2; // Quantidade de páginas antes/depois da atual
    const range: (number | 'ellipsis')[] = [];
    const rangeWithEllipsis: (number | 'ellipsis')[] = [];

    // Sempre mostrar primeira página
    range.push(1);

    // Calcular range ao redor da página atual
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Sempre mostrar última página
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Adicionar ellipsis quando necessário
    let prev = 0;
    for (const num of range) {
      if (typeof num === 'number') {
        if (prev && num - prev > 1) {
          rangeWithEllipsis.push('ellipsis');
        }
        rangeWithEllipsis.push(num);
        prev = num;
      }
    }

    return rangeWithEllipsis;
  };

  return {
    currentItems,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
    getPageNumbers,
  };
}
