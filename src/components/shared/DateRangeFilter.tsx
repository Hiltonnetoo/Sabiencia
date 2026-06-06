// ============================================
// DATE RANGE FILTER - Filtro de intervalo de datas
// ============================================

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../ui/utils';

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangeFilterProps {
  label: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const quickRanges = [
  {
    label: 'Hoje',
    getValue: () => ({
      from: new Date(),
      to: new Date(),
    }),
  },
  {
    label: 'Últimos 7 dias',
    getValue: () => ({
      from: subDays(new Date(), 7),
      to: new Date(),
    }),
  },
  {
    label: 'Últimos 30 dias',
    getValue: () => ({
      from: subDays(new Date(), 30),
      to: new Date(),
    }),
  },
  {
    label: 'Este mês',
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Este ano',
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
];

export function DateRangeFilter({
  label,
  value,
  onChange,
  className,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    onChange({ from: undefined, to: undefined });
  };

  const formatDateRange = () => {
    if (!value.from && !value.to) {
      return 'Selecione o período';
    }

    if (value.from && !value.to) {
      return format(value.from, 'dd/MM/yyyy', { locale: ptBR });
    }

    if (value.from && value.to) {
      return `${format(value.from, 'dd/MM/yyyy')} - ${format(value.to, 'dd/MM/yyyy')}`;
    }

    return 'Selecione o período';
  };

  const hasValue = value.from || value.to;

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between',
              hasValue && 'border-blue-300 bg-blue-50'
            )}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className={cn(!hasValue && 'text-gray-500')}>
                {formatDateRange()}
              </span>
            </span>
            
            {hasValue && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Quick ranges */}
            <div className="border-r p-2 space-y-1">
              <div className="px-2 py-1 text-xs font-semibold text-gray-600">
                Atalhos
              </div>
              {quickRanges.map((range) => (
                <Button
                  key={range.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    onChange(range.getValue());
                    setIsOpen(false);
                  }}
                >
                  {range.label}
                </Button>
              ))}
            </div>

            {/* Calendar */}
            <div className="p-3">
              <Calendar
                mode="range"
                selected={{
                  from: value.from,
                  to: value.to,
                }}
                onSelect={(range) => {
                  onChange({
                    from: range?.from,
                    to: range?.to,
                  });
                }}
                numberOfMonths={2}
                locale={ptBR}
              />
              
              <div className="flex items-center justify-between pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                >
                  Limpar
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={!value.from}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
