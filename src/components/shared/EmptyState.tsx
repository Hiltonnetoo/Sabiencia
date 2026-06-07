// ============================================
// EMPTY STATE - Componente para estados vazios
// ============================================

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface EmptyStateProps {
  /**
   * Ícone a ser exibido (do lucide-react ou JSX customizado)
   */
  icon?: any;
  
  /**
   * Título principal
   */
  title: string;
  
  /**
   * Descrição/subtítulo
   */
  description?: string;
  
  /**
   * Texto do botão de ação (opcional)
   */
  actionLabel?: string;
  
  /**
   * Callback ao clicar no botão de ação
   */
  onAction?: () => void;
  
  /**
   * Texto do botão secundário (opcional)
   */
  secondaryActionLabel?: string;
  
  /**
   * Callback ao clicar no botão secundário
   */
  onSecondaryAction?: () => void;
  
  /**
   * Mostrar em um card ou apenas o conteúdo
   * @default true
   */
  showCard?: boolean;
  
  /**
   * Tamanho do ícone
   * @default 'default'
   */
  iconSize?: 'small' | 'default' | 'large';
  
  /**
   * Cor do ícone
   * @default 'gray'
   */
  iconColor?: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  
  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Objeto de ação (legado para testes)
   */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  showCard = true,
  iconSize = 'default',
  iconColor = 'gray',
  className = '',
  action,
}: EmptyStateProps) {
  // Tamanhos do ícone
  const iconSizeClasses = {
    small: 'w-12 h-12',
    default: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  // Cores do ícone
  const iconColorClasses = {
    gray: 'text-gray-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  };

  // Background do ícone
  const iconBgClasses = {
    gray: 'bg-gray-100',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
  };

  const finalActionLabel = actionLabel || action?.label;
  const finalOnAction = onAction || action?.onClick;

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const IconComponent = Icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className={`${iconSizeClasses[iconSize]} ${iconColorClasses[iconColor]}`} />;
  };

  const content = (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      {/* Ícone */}
      {Icon && (
        <div className={`rounded-full p-4 mb-4 ${iconBgClasses[iconColor]}`}>
          {renderIcon()}
        </div>
      )}

      {/* Título */}
      <h3 className="text-lg text-gray-900 mb-2">
        {title}
      </h3>

      {/* Descrição */}
      {description && (
        <p className="text-sm text-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}

      {/* Botões de ação */}
      {(finalActionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {finalActionLabel && finalOnAction && (
            <Button onClick={finalOnAction}>
              {finalActionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (showCard) {
    return (
      <Card>
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}

/**
 * EmptyStateSimple - Versão simplificada sem botões
 */
export function EmptyStateSimple({
  icon: Icon,
  message,
  iconColor = 'gray',
  className = '',
}: {
  icon: any;
  message: string;
  iconColor?: EmptyStateProps['iconColor'];
  className?: string;
}) {
  const iconColorClasses = {
    gray: 'text-gray-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  };

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const IconComponent = Icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className={`w-12 h-12 ${iconColorClasses[iconColor]} mb-3`} />;
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 ${className}`}>
      {renderIcon()}
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}

/**
 * SearchEmptyState - Estado vazio específico para buscas
 */
export function SearchEmptyState({
  searchTerm,
  onClearSearch,
}: {
  searchTerm: string;
  onClearSearch?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="rounded-full p-4 mb-4 bg-gray-100">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <h3 className="text-lg text-gray-900 mb-2">
        Nenhum resultado encontrado
      </h3>

      <p className="text-sm text-gray-600 mb-2 max-w-md">
        Não encontramos resultados para <strong>"{searchTerm}"</strong>
      </p>
      
      <p className="text-sm text-gray-500 mb-6">
        Tente usar palavras-chave diferentes ou remover filtros.
      </p>

      {onClearSearch && (
        <Button variant="outline" onClick={onClearSearch}>
          Limpar Busca
        </Button>
      )}
    </div>
  );
}

/**
 * FilterEmptyState - Estado vazio específico para filtros
 */
export function FilterEmptyState({
  onClearFilters,
  activeFiltersCount,
}: {
  onClearFilters?: () => void;
  activeFiltersCount?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="rounded-full p-4 mb-4 bg-blue-50">
        <svg
          className="w-16 h-16 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </div>

      <h3 className="text-lg text-gray-900 mb-2">
        Nenhum item corresponde aos filtros
      </h3>

      {activeFiltersCount !== undefined && activeFiltersCount > 0 && (
        <p className="text-sm text-gray-500 mb-2">
          {activeFiltersCount} filtros ativos
        </p>
      )}

      <p className="text-sm text-gray-600 mb-6 max-w-md">
        Ajuste os filtros aplicados para ver mais resultados
      </p>

      {onClearFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
