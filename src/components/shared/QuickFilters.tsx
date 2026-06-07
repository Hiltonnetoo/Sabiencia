// ============================================
// QUICK FILTERS - Filtros rápidos predefinidos
// ============================================

import React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

export interface QuickFilter {
  id: string;
  label: string;
  icon?: React.ReactNode;
  filters: Record<string, any>;
  count?: number;
  color?: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  activeFilterId?: string;
  onFilterClick: (filter: QuickFilter) => void;
  className?: string;
}

const colorClasses = {
  default: 'border-gray-200 bg-white hover:bg-gray-50 data-[active=true]:bg-gray-100 data-[active=true]:border-gray-300',
  blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100 data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:border-blue-600',
  green: 'border-green-200 bg-green-50 hover:bg-green-100 data-[active=true]:bg-green-600 data-[active=true]:text-white data-[active=true]:border-green-600',
  yellow: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 data-[active=true]:bg-yellow-600 data-[active=true]:text-white data-[active=true]:border-yellow-600',
  red: 'border-red-200 bg-red-50 hover:bg-red-100 data-[active=true]:bg-red-600 data-[active=true]:text-white data-[active=true]:border-red-600',
  purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100 data-[active=true]:bg-purple-600 data-[active=true]:text-white data-[active=true]:border-purple-600',
};

export function QuickFilters({
  filters,
  activeFilterId,
  onFilterClick,
  className,
}: QuickFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {filters.map((filter) => {
        const isActive = activeFilterId === filter.id;
        const colorClass = colorClasses[filter.color || 'default'];

        return (
          <button
            key={filter.id}
            onClick={() => onFilterClick(filter)}
            data-active={isActive}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              colorClass
            )}
          >
            {filter.icon && (
              <span className="w-4 h-4">{filter.icon}</span>
            )}
            <span className="text-sm font-medium">{filter.label}</span>
            {filter.count !== undefined && (
              <Badge
                variant={isActive ? "secondary" : "default"}
                className={cn(
                  "ml-1",
                  isActive && "bg-white/20 text-white"
                )}
              >
                {filter.count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
