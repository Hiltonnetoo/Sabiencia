// ============================================
// LOADING FALLBACK - Loading state otimizado
// ============================================

import React from 'react';

interface LoadingFallbackProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente de loading otimizado
 * - Sem dependências pesadas
 * - CSS puro com Tailwind
 * - Renderização instantânea
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  fullScreen = true,
  message = 'Carregando...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-solid border-blue-600 border-r-transparent`}
            role="status"
            aria-label="Carregando"
          />
        </div>
        {message && (
          <p className="text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Skeleton para loading de conteúdo
 */
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
};

/**
 * Card skeleton para loading de cards
 */
export const CardSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 1, className = '' }) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border rounded-lg p-6 space-y-4 animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
};

/**
 * Table skeleton para loading de tabelas
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
