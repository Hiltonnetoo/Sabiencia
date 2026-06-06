// ============================================
// MULTI SELECT - Seleção múltipla com checkbox
// ============================================

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '../ui/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxDisplay?: number;
  className?: string;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  maxDisplay = 2,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleClear = () => {
    onChange([]);
  };

  const selectedOptions = options.filter(opt => value.includes(opt.value));
  const selectedCount = selectedOptions.length;

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between',
              selectedCount > 0 && 'border-blue-300 bg-blue-50'
            )}
          >
            <span className="flex items-center gap-2 flex-1 min-w-0">
              {selectedCount === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : (
                <>
                  <span className="truncate">
                    {selectedOptions
                      .slice(0, maxDisplay)
                      .map(opt => opt.label)
                      .join(', ')}
                  </span>
                  {selectedCount > maxDisplay && (
                    <Badge variant="secondary" className="flex-shrink-0">
                      +{selectedCount - maxDisplay}
                    </Badge>
                  )}
                </>
              )}
            </span>
            
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {selectedCount > 0 && (
                <Badge variant="default" className="mr-1">
                  {selectedCount}
                </Badge>
              )}
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )} />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-semibold">
              {selectedCount > 0
                ? `${selectedCount} selecionado${selectedCount !== 1 ? 's' : ''}`
                : 'Selecione opções'}
            </span>
            
            {selectedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          <div className="p-2 max-h-[300px] overflow-y-auto">
            {options.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                Nenhuma opção disponível
              </div>
            ) : (
              <div className="space-y-1">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleToggle(option.value)}
                  >
                    <Checkbox
                      id={`multi-${option.value}`}
                      checked={value.includes(option.value)}
                      onCheckedChange={() => handleToggle(option.value)}
                    />
                    <Label
                      htmlFor={`multi-${option.value}`}
                      className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <Badge variant="secondary" className="ml-2">
                          {option.count}
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
