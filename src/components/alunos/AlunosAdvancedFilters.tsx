// ============================================
// ALUNOS ADVANCED FILTERS - Filtros avançados para alunos
// ============================================

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Search, Users, UserCheck, UserX, GraduationCap } from 'lucide-react';
import { useAdvancedFilters, FilterConfig } from '../../hooks/useAdvancedFilters';
import { AdvancedFilterPanel } from '../shared/AdvancedFilterPanel';
import { QuickFilters, QuickFilter } from '../shared/QuickFilters';
import { MultiSelect, MultiSelectOption } from '../shared/MultiSelect';
import { DateRangeFilter, DateRange } from '../shared/DateRangeFilter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useMockData } from '../../contexts/MockDataContext';

interface AlunosAdvancedFiltersProps {
  onFiltersChange: (filters: AlunosFilterConfig) => void;
}

export interface AlunosFilterConfig extends FilterConfig {
  searchTerm: string;
  status: string[];
  cursos: string[];
  turmas: string[];
  dateRange: DateRange;
  estadoCivil: string;
  sexo: string;
}

const defaultFilters: AlunosFilterConfig = {
  searchTerm: '',
  status: [],
  cursos: [],
  turmas: [],
  dateRange: { from: undefined, to: undefined },
  estadoCivil: 'todos',
  sexo: 'todos',
};

export function AlunosAdvancedFilters({ onFiltersChange }: AlunosAdvancedFiltersProps) {
  const { t } = useTranslation();
  const { cursos, turmas, alunos, matriculas } = useMockData();

  const {
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
    hasActiveFilters,
    activeFiltersCount,
    getActiveFiltersLabels,
  } = useAdvancedFilters({
    storageKey: 'alunos-filters',
    defaultFilters,
    onFilterChange: onFiltersChange as (filters: FilterConfig) => void,
  });

  // Calcular contadores para quick filters
  const statusCounts = useMemo(() => {
    const counts = {
      ativo: 0,
      trancado: 0,
      concluido: 0,
      evadido: 0,
    };

    matriculas.forEach(mat => {
      if (counts[mat.status] !== undefined) {
        counts[mat.status]++;
      }
    });

    return counts;
  }, [matriculas]);

  // Quick Filters
  const quickFilters: QuickFilter[] = [
    {
      id: 'todos',
      label: t('components.alunosAdvancedFilters.quickAll'),
      icon: <Users />,
      filters: { ...defaultFilters },
      count: alunos.length,
      color: 'default',
    },
    {
      id: 'ativos',
      label: t('components.alunosAdvancedFilters.quickActive'),
      icon: <UserCheck />,
      filters: { ...defaultFilters, status: ['ativo'] },
      count: statusCounts.ativo,
      color: 'green',
    },
    {
      id: 'trancados',
      label: t('components.alunosAdvancedFilters.quickLocked'),
      icon: <UserX />,
      filters: { ...defaultFilters, status: ['trancado'] },
      count: statusCounts.trancado,
      color: 'yellow',
    },
    {
      id: 'concluidos',
      label: t('components.alunosAdvancedFilters.quickCompleted'),
      icon: <GraduationCap />,
      filters: { ...defaultFilters, status: ['concluido'] },
      count: statusCounts.concluido,
      color: 'blue',
    },
  ];

  // Opções para multi-select
  const statusOptions: MultiSelectOption[] = [
    { value: 'ativo', label: t('components.alunosAdvancedFilters.statusActive'), count: statusCounts.ativo },
    { value: 'trancado', label: t('components.alunosAdvancedFilters.statusLocked'), count: statusCounts.trancado },
    { value: 'concluido', label: t('components.alunosAdvancedFilters.statusCompleted'), count: statusCounts.concluido },
    { value: 'evadido', label: t('components.alunosAdvancedFilters.statusDroppedOut'), count: statusCounts.evadido },
  ];

  const cursosOptions: MultiSelectOption[] = cursos.map(curso => ({
    value: curso.id,
    label: curso.nome,
    count: matriculas.filter(m => {
      const turma = turmas.find(t => t.id === m.turma_id);
      return turma?.curso_id === curso.id;
    }).length,
  }));

  const turmasOptions: MultiSelectOption[] = turmas.map(turma => ({
    value: turma.id,
    label: turma.nome,
    count: matriculas.filter(m => m.turma_id === turma.id).length,
  }));

  // Labels para os filtros ativos
  const filterLabels: Record<string, string> = {
    searchTerm: t('components.alunosAdvancedFilters.labelSearch'),
    status: t('components.alunosAdvancedFilters.labelStatus'),
    cursos: t('components.alunosAdvancedFilters.labelCourses'),
    turmas: t('components.alunosAdvancedFilters.labelClasses'),
    dateRange: t('components.alunosAdvancedFilters.labelPeriod'),
    estadoCivil: t('components.alunosAdvancedFilters.labelMaritalStatus'),
    sexo: t('components.alunosAdvancedFilters.labelSex'),
  };

  const handleQuickFilterClick = (filter: QuickFilter) => {
    if (activeFilterId === filter.id) {
      resetFilters();
    } else {
      updateFilters(filter.filters);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <QuickFilters
        filters={quickFilters}
        activeFilterId={activeFilterId ?? undefined}
        onFilterClick={handleQuickFilterClick}
      />

      {/* Advanced Filters Panel */}
      <AdvancedFilterPanel
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
        activeFiltersLabels={getActiveFiltersLabels(filterLabels)}
        onReset={resetFilters}
        savedFilters={savedFilters}
        onSaveFilter={saveCurrentFilter}
        onApplyFilter={applyFilter}
        onDeleteFilter={deleteFilter}
        onSetDefault={setAsDefault}
        activeFilterId={activeFilterId}
      >
        <div className="space-y-4">
          {/* Busca */}
          <div className="space-y-2">
            <Label htmlFor="search">{t('components.alunosAdvancedFilters.searchField')}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder={t('components.alunosAdvancedFilters.searchPlaceholder')}
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status (Multi-select) */}
            <MultiSelect
              label={t('components.alunosAdvancedFilters.labelStatus')}
              options={statusOptions}
              value={filters.status}
              onChange={(value) => updateFilter('status', value)}
              placeholder={t('components.alunosAdvancedFilters.allStatuses')}
            />

            {/* Cursos (Multi-select) */}
            <MultiSelect
              label={t('components.alunosAdvancedFilters.labelCourses')}
              options={cursosOptions}
              value={filters.cursos}
              onChange={(value) => updateFilter('cursos', value)}
              placeholder={t('components.alunosAdvancedFilters.allCourses')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Turmas (Multi-select) */}
            <MultiSelect
              label={t('components.alunosAdvancedFilters.labelClasses')}
              options={turmasOptions}
              value={filters.turmas}
              onChange={(value) => updateFilter('turmas', value)}
              placeholder={t('components.alunosAdvancedFilters.allClasses')}
            />

            {/* Sexo */}
            <div className="space-y-2">
              <Label htmlFor="sexo">{t('components.alunosAdvancedFilters.sex')}</Label>
              <Select
                value={filters.sexo}
                onValueChange={(value) => updateFilter('sexo', value)}
              >
                <SelectTrigger id="sexo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">{t('components.alunosAdvancedFilters.sexAll')}</SelectItem>
                  <SelectItem value="M">{t('components.alunosAdvancedFilters.sexMale')}</SelectItem>
                  <SelectItem value="F">{t('components.alunosAdvancedFilters.sexFemale')}</SelectItem>
                  <SelectItem value="Outro">{t('components.alunosAdvancedFilters.sexOther')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Estado Civil */}
            <div className="space-y-2">
              <Label htmlFor="estadoCivil">{t('components.alunosAdvancedFilters.maritalStatus')}</Label>
              <Select
                value={filters.estadoCivil}
                onValueChange={(value) => updateFilter('estadoCivil', value)}
              >
                <SelectTrigger id="estadoCivil">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">{t('components.alunosAdvancedFilters.maritalAll')}</SelectItem>
                  <SelectItem value="Solteiro">{t('components.alunosAdvancedFilters.maritalSingle')}</SelectItem>
                  <SelectItem value="Casado">{t('components.alunosAdvancedFilters.maritalMarried')}</SelectItem>
                  <SelectItem value="Divorciado">{t('components.alunosAdvancedFilters.maritalDivorced')}</SelectItem>
                  <SelectItem value="Viúvo">{t('components.alunosAdvancedFilters.maritalWidowed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data de Matrícula */}
            <DateRangeFilter
              label={t('components.alunosAdvancedFilters.enrollmentPeriod')}
              value={filters.dateRange}
              onChange={(range) => updateFilter('dateRange', range)}
            />
          </div>
        </div>
      </AdvancedFilterPanel>
    </div>
  );
}
