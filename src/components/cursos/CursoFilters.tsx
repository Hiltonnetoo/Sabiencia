// ============================================
// CURSO FILTERS - Filtros para cursos
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { X } from 'lucide-react';

interface CursoFiltersProps {
  filters: {
    ativo: string;
    cargaHorariaMin: string;
    cargaHorariaMax: string;
    duracaoMin: string;
    duracaoMax: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const CursoFilters: React.FC<CursoFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t('components.cursos.filters.title')}</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              {t('common.actions.clear')}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="filter-ativo">{t('components.cursos.filters.statusLabel')}</Label>
            <Select
              value={filters.ativo}
              onValueChange={(value) => onFilterChange('ativo', value)}
            >
              <SelectTrigger id="filter-ativo">
                <SelectValue placeholder={t('components.cursos.filters.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('components.cursos.filters.all')}</SelectItem>
                <SelectItem value="ativo">{t('components.cursos.filters.active')}</SelectItem>
                <SelectItem value="inativo">{t('components.cursos.filters.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Carga Horária */}
          <div className="space-y-2">
            <Label>{t('components.cursos.filters.workloadLabel')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="filter-ch-min" className="text-xs text-gray-500">
                  {t('components.cursos.filters.min')}
                </Label>
                <Input
                  id="filter-ch-min"
                  type="number"
                  min="0"
                  placeholder={t('components.cursos.filters.minPlaceholder')}
                  value={filters.cargaHorariaMin}
                  onChange={(e) => onFilterChange('cargaHorariaMin', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="filter-ch-max" className="text-xs text-gray-500">
                  {t('components.cursos.filters.max')}
                </Label>
                <Input
                  id="filter-ch-max"
                  type="number"
                  min="0"
                  placeholder={t('components.cursos.filters.maxPlaceholder')}
                  value={filters.cargaHorariaMax}
                  onChange={(e) => onFilterChange('cargaHorariaMax', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Duração */}
          <div className="space-y-2">
            <Label>{t('components.cursos.filters.durationLabel')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="filter-dur-min" className="text-xs text-gray-500">
                  {t('components.cursos.filters.min')}
                </Label>
                <Input
                  id="filter-dur-min"
                  type="number"
                  min="0"
                  placeholder={t('components.cursos.filters.minPlaceholder')}
                  value={filters.duracaoMin}
                  onChange={(e) => onFilterChange('duracaoMin', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="filter-dur-max" className="text-xs text-gray-500">
                  {t('components.cursos.filters.max')}
                </Label>
                <Input
                  id="filter-dur-max"
                  type="number"
                  min="0"
                  placeholder={t('components.cursos.filters.maxPlaceholder')}
                  value={filters.duracaoMax}
                  onChange={(e) => onFilterChange('duracaoMax', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
