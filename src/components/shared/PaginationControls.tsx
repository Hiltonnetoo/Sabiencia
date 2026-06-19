// ============================================
// PAGINATION CONTROLS - Controles de paginação
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  getPageNumbers: () => (number | 'ellipsis')[];
  className?: string;
  showPageSizeSelector?: boolean;
  showPageInfo?: boolean;
  compact?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  hasNextPage,
  hasPreviousPage,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPreviousPage,
  getPageNumbers,
  className,
  showPageSizeSelector = true,
  showPageInfo = true,
  compact = false,
}: PaginationControlsProps) {
  const { t } = useTranslation();
  const pageNumbers = getPageNumbers();

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 flex-wrap',
        className
      )}
    >
      {/* Informação e seletor de itens por página */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Info de itens */}
        {showPageInfo && (
          <div className="text-sm text-gray-600">
            {t('components.pagination.showing')}{' '}
            <span className="font-semibold">
              {startIndex + 1}-{endIndex}
            </span>{' '}
            {t('components.pagination.of')}{' '}
            <span className="font-semibold">{totalItems}</span>{' '}
            {t('components.pagination.item', { count: totalItems })}
          </div>
        )}

        {/* Seletor de itens por página */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('components.pagination.itemsPerPage')}</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[70px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Controles de navegação */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Primeira página */}
          {!compact && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFirstPage}
              disabled={!hasPreviousPage}
              title={t('components.pagination.firstPage')}
              aria-label={t('components.pagination.firstPage')}
              className="h-9 w-9 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Página anterior */}
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={!hasPreviousPage}
            title={t('components.pagination.previousPage')}
            aria-label={t('components.pagination.previousPage')}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Números de página */}
          {!compact && (
            <div className="hidden sm:flex items-center gap-1">
              {pageNumbers.map((pageNum, index) => {
                if (pageNum === 'ellipsis') {
                  return (
                    <div
                      key={`ellipsis-${index}`}
                      className="w-9 h-9 flex items-center justify-center"
                    >
                      <span className="text-gray-600">...</span>
                    </div>
                  );
                }

                const isActive = pageNum === currentPage;

                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={cn(
                      'h-9 w-9 p-0',
                      isActive && 'pointer-events-none'
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Indicador de página (mobile) */}
          {!compact && (
            <div className="sm:hidden flex items-center">
              <span className="text-sm text-gray-600 mx-2">
                {currentPage} / {totalPages}
              </span>
            </div>
          )}

          {/* Próxima página */}
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={!hasNextPage}
            title={t('components.pagination.nextPage')}
            aria-label={t('components.pagination.nextPage')}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Última página */}
          {!compact && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLastPage}
              disabled={!hasNextPage}
              title={t('components.pagination.lastPage')}
              aria-label={t('components.pagination.lastPage')}
              className="h-9 w-9 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
