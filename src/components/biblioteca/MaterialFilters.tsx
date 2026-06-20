// ============================================
// MATERIAL FILTERS - Filtros para biblioteca
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, X } from 'lucide-react';
import { Button } from '../ui/button';

interface MaterialFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tipoFilter: string;
  onTipoFilterChange: (value: string) => void;
  disciplinaFilter: string;
  onDisciplinaFilterChange: (value: string) => void;
  moduloFilter: string;
  onModuloFilterChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  availableDisciplinas: Array<{ id: string; nome: string }>;
  availableModulos: string[];
  onClearFilters?: () => void;
}

export const MaterialFilters: React.FC<MaterialFiltersProps> = ({
  searchTerm,
  onSearchChange,
  tipoFilter,
  onTipoFilterChange,
  disciplinaFilter,
  onDisciplinaFilterChange,
  moduloFilter,
  onModuloFilterChange,
  selectedTags,
  onTagToggle,
  availableTags,
  availableDisciplinas,
  availableModulos,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const hasActiveFilters =
    searchTerm || 
    tipoFilter !== 'all' || 
    disciplinaFilter !== 'all' || 
    moduloFilter !== 'all' ||
    selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('components.biblioteca.filters.searchPlaceholder')}
          className="pl-10"
        />
      </div>

      {/* Filtros em Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Tipo */}
        <Select value={tipoFilter} onValueChange={onTipoFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('common.labels.allTypes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.labels.allTypes')}</SelectItem>
            <SelectItem value="pdf">{t('components.biblioteca.uploadForm.pdf')}</SelectItem>
            <SelectItem value="video">{t('components.biblioteca.filters.video')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Disciplina */}
        <Select value={disciplinaFilter} onValueChange={onDisciplinaFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('common.labels.allSubjects')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.labels.allSubjects')}</SelectItem>
            {availableDisciplinas
              .filter(disc => disc?.id && disc.id.trim() !== '')
              .map(disc => (
                <SelectItem key={disc.id} value={disc.id}>
                  {disc.nome}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Módulo */}
        <Select value={moduloFilter} onValueChange={onModuloFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('common.labels.allModules')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.labels.allModules')}</SelectItem>
            {availableModulos
              .filter(modulo => modulo && modulo.trim() !== '')
              .map((modulo, idx) => (
                <SelectItem key={idx} value={modulo}>
                  {modulo}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Limpar Filtros */}
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t('common.actions.clearFilters')}
          </Button>
        )}
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">{t('components.biblioteca.filters.filterByTags')}</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Contador de Resultados */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          Filtros ativos: 
          {searchTerm && <Badge variant="secondary" className="ml-2">Busca</Badge>}
          {tipoFilter !== 'all' && <Badge variant="secondary" className="ml-2">Tipo</Badge>}
          {disciplinaFilter !== 'all' && <Badge variant="secondary" className="ml-2">Disciplina</Badge>}
          {moduloFilter !== 'all' && <Badge variant="secondary" className="ml-2">Módulo</Badge>}
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
