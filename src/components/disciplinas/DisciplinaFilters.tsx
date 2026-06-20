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

interface DisciplinaFiltersProps {
  busca: string;
  curso_id: string;
  cursos: Curso[];
  onBuscaChange: (value: string) => void;
  onCursoChange: (value: string) => void;
  onLimpar: () => void;
}

export function DisciplinaFilters({
  busca,
  curso_id,
  cursos,
  onBuscaChange,
  onCursoChange,
  onLimpar,
}: DisciplinaFiltersProps) {
  const { t } = useTranslation();
  const hasActiveFilters = busca || curso_id !== 'todos';

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{t('components.disciplinas.filters.title')}</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Busca */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {t('components.disciplinas.filters.searchLabel')}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t('components.disciplinas.filters.searchPlaceholder')}
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Curso */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {t('components.disciplinas.filters.courseLabel')}
          </label>
          <Select value={curso_id} onValueChange={onCursoChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('components.disciplinas.filters.selectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">{t('components.disciplinas.filters.allCourses')}</SelectItem>
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
      </div>

      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          {t('components.disciplinas.filters.activeFilters', { filters: [
            busca && t('components.disciplinas.filters.filterSearch'),
            curso_id !== 'todos' && t('components.disciplinas.filters.filterCourse'),
          ].filter(Boolean).join(', ') })}
        </div>
      )}
    </div>
  );
}
