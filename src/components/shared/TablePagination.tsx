// ============================================
// TABLE PAGINATION - Wrapper de paginação para tabelas
// ============================================

import React, { ReactNode } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { PaginationControls } from './PaginationControls';
import { usePagination, PaginationConfig } from '../../hooks/usePagination';

interface TablePaginationProps<T> {
  items: T[];
  config?: PaginationConfig;
  children: (paginatedItems: T[]) => ReactNode;
  header?: ReactNode;
  emptyState?: ReactNode;
  showPageSizeSelector?: boolean;
  showPageInfo?: boolean;
  compact?: boolean;
  className?: string;
}

export function TablePagination<T>({
  items,
  config,
  children,
  header,
  emptyState,
  showPageSizeSelector = true,
  showPageInfo = true,
  compact = false,
  className,
}: TablePaginationProps<T>) {
  const pagination = usePagination(items, config);

  const {
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
  } = pagination;

  // Mostrar empty state se não houver itens
  if (totalItems === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <Card className={className}>
      {header && <>{header}</>}
      
      <CardContent className="p-0">
        {children(currentItems)}
      </CardContent>

      {totalItems > 0 && (
        <CardFooter className="border-t p-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onPageChange={goToPage}
            onPageSizeChange={setPageSize}
            onFirstPage={firstPage}
            onLastPage={lastPage}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
            getPageNumbers={getPageNumbers}
            showPageSizeSelector={showPageSizeSelector}
            showPageInfo={showPageInfo}
            compact={compact}
            className="w-full"
          />
        </CardFooter>
      )}
    </Card>
  );
}
