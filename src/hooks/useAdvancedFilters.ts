// ============================================
// USE ADVANCED FILTERS - Hook para filtros avançados com salvamento
// ============================================

import { useState, useEffect, useCallback } from 'react';

export interface FilterConfig {
  [key: string]: any;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterConfig;
  createdAt: Date;
  isDefault?: boolean;
}

interface UseAdvancedFiltersOptions {
  storageKey: string;
  defaultFilters: FilterConfig;
  onFilterChange?: (filters: FilterConfig) => void;
}

export function useAdvancedFilters({
  storageKey,
  defaultFilters,
  onFilterChange,
}: UseAdvancedFiltersOptions) {
  const [filters, setFilters] = useState<FilterConfig>(defaultFilters);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  // Carregar filtros salvos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`${storageKey}-saved-filters`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedFilters(parsed.map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
        })));
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, [storageKey]);

  // Carregar último filtro usado
  useEffect(() => {
    const lastFilters = localStorage.getItem(`${storageKey}-last-filters`);
    if (lastFilters) {
      try {
        setFilters(JSON.parse(lastFilters));
      } catch (error) {
        console.error('Error loading last filters:', error);
      }
    }
  }, [storageKey]);

  // Salvar último filtro usado
  useEffect(() => {
    localStorage.setItem(`${storageKey}-last-filters`, JSON.stringify(filters));
    onFilterChange?.(filters);
  }, [filters, storageKey, onFilterChange]);

  // Atualizar filtro específico
  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setActiveFilterId(null); // Desativa filtro salvo ao modificar
  }, []);

  // Atualizar múltiplos filtros
  const updateFilters = useCallback((newFilters: Partial<FilterConfig>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    setActiveFilterId(null);
  }, []);

  // Resetar filtros
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setActiveFilterId(null);
  }, [defaultFilters]);

  // Salvar filtro atual
  const saveCurrentFilter = useCallback((name: string) => {
    const newFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name,
      filters: { ...filters },
      createdAt: new Date(),
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    setActiveFilterId(newFilter.id);

    localStorage.setItem(
      `${storageKey}-saved-filters`,
      JSON.stringify(updated)
    );

    return newFilter;
  }, [filters, savedFilters, storageKey]);

  // Aplicar filtro salvo
  const applyFilter = useCallback((filterId: string) => {
    const filter = savedFilters.find(f => f.id === filterId);
    if (filter) {
      setFilters(filter.filters);
      setActiveFilterId(filterId);
    }
  }, [savedFilters]);

  // Deletar filtro salvo
  const deleteFilter = useCallback((filterId: string) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);

    if (activeFilterId === filterId) {
      setActiveFilterId(null);
    }

    localStorage.setItem(
      `${storageKey}-saved-filters`,
      JSON.stringify(updated)
    );
  }, [savedFilters, activeFilterId, storageKey]);

  // Definir filtro como padrão
  const setAsDefault = useCallback((filterId: string) => {
    const updated = savedFilters.map(f => ({
      ...f,
      isDefault: f.id === filterId,
    }));
    setSavedFilters(updated);

    localStorage.setItem(
      `${storageKey}-saved-filters`,
      JSON.stringify(updated)
    );
  }, [savedFilters, storageKey]);

  // Verificar se há filtros ativos
  const hasActiveFilters = useCallback(() => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      const defaultValue = defaultFilters[key];
      
      if (typeof value === 'string') {
        return value !== '' && value !== defaultValue;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== defaultValue;
    });
  }, [filters, defaultFilters]);

  // Contar filtros ativos
  const activeFiltersCount = useCallback(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key];
      const defaultValue = defaultFilters[key];
      
      if (typeof value === 'string') {
        return value !== '' && value !== defaultValue;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== defaultValue;
    }).length;
  }, [filters, defaultFilters]);

  // Obter labels dos filtros ativos
  const getActiveFiltersLabels = useCallback((labels: Record<string, string>) => {
    return Object.keys(filters)
      .filter(key => {
        const value = filters[key];
        const defaultValue = defaultFilters[key];
        
        if (typeof value === 'string') {
          return value !== '' && value !== defaultValue;
        }
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== defaultValue;
      })
      .map(key => labels[key] || key);
  }, [filters, defaultFilters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    savedFilters,
    saveCurrentFilter,
    applyFilter,
    deleteFilter,
    setAsDefault,
    activeFilterId,
    hasActiveFilters: hasActiveFilters(),
    activeFiltersCount: activeFiltersCount(),
    getActiveFiltersLabels,
  };
}
