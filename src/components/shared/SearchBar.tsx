// ============================================
// SEARCH BAR - Barra de busca reutilizável com DEBOUNCE
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
  debounceTime?: number;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  onClear,
  placeholder = 'Buscar...',
  className = '',
  debounceDelay,
  debounceTime,
  isLoading = false,
  disabled = false,
  error,
  label,
  onFocus,
  onBlur,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const delay = debounceTime !== undefined ? debounceTime : (debounceDelay !== undefined ? debounceDelay : 300);

  // Sincronizar valor externo com interno
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce: Só chama onSearch após parar de digitar
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        if (onSearch) {
          onSearch(localValue);
        }
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, delay, value, onSearch]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
    if (onClear) onClear();
  }, [onChange, onSearch, onClear]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (onChange) {
      onChange(val);
    }
  }, [onChange]);

  return (
    <div className={`relative ${className}`}>
      {label && <label className="sr-only">{label}</label>}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        role="searchbox"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className="pl-10 pr-10"
      />
      {isLoading && (
        <div role="status" className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          <span className="sr-only">Carregando...</span>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </div>
      )}
      {localValue && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          aria-label="Limpar pesquisa"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

