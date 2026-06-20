import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Search, X } from 'lucide-react';
import { Curso } from '../../types';

interface TurmaFiltersProps {
  busca: string;
  curso_id: string;
  periodo: string;
  status: string;
  cursos: Curso[];
  onBuscaChange: (value: string) => void;
  onCursoChange: (value: string) => void;
  onPeriodoChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onLimpar: () => void;
}

export function TurmaFilters({
  busca,
  curso_id,
  periodo,
  status,
  cursos,
  onBuscaChange,
  onCursoChange,
  onPeriodoChange,
  onStatusChange,
  onLimpar,
}: TurmaFiltersProps) {
  const { t } = useTranslation();
  const hasActiveFilters = busca || curso_id !== 'todos' || periodo !== 'todos' || status !== 'todos';

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{t('components.turmas.filters.title')}</h3>
        {hasActiveFilters && (
          <Button
            onClick={onLimpar}
            variant="ghost"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            {t('common.actions.clear')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {t('components.turmas.filters.searchLabel')}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('components.turmas.filters.searchPlaceholder')}
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Curso */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {t('components.turmas.filters.courseLabel')}
          </label>
          <Select value={curso_id} onValueChange={onCursoChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('components.turmas.filters.selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">{t('components.turmas.filters.allCourses')}</SelectItem>
              {cursos
                .filter(curso => curso?.id && curso.id.trim() !== '')
                .map(curso => (
                  <SelectItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Período */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {t('components.turmas.filters.periodLabel')}
          </label>
          <Select value={periodo} onValueChange={onPeriodoChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('components.turmas.filters.selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">{t('components.turmas.filters.all')}</SelectItem>
              <SelectItem value="manha">{t('components.turmas.periodo.manha')}</SelectItem>
              <SelectItem value="tarde">{t('components.turmas.periodo.tarde')}</SelectItem>
              <SelectItem value="noite">{t('components.turmas.periodo.noite')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {t('components.turmas.filters.statusLabel')}
          </label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('components.turmas.filters.selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">{t('components.turmas.filters.all')}</SelectItem>
              <SelectItem value="ativa">{t('components.turmas.filters.active')}</SelectItem>
              <SelectItem value="inativa">{t('components.turmas.filters.inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          {t('components.turmas.filters.activeFilters', {
            filters: [
              busca && t('components.turmas.filters.filterSearch'),
              curso_id !== 'todos' && t('components.turmas.filters.filterCourse'),
              periodo !== 'todos' && t('components.turmas.filters.filterPeriod'),
              status !== 'todos' && t('components.turmas.filters.filterStatus'),
            ].filter(Boolean).join(', '),
          })}
        </div>
      )}
    </div>
  );
}
