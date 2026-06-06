// ============================================
// SEARCH BAR - Barra de busca reutilizável com DEBOUNCE
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceDelay?: number; // Delay para debounce (padrão: 300ms)
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  debounceDelay = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Sincronizar valor externo com interno
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce: Só chama onChange após parar de digitar
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, debounceDelay]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="pl-10 pr-10"
      />
      {localValue && (
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
