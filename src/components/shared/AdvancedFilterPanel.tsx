// ============================================
// ADVANCED FILTER PANEL - Painel de filtros avançados
// ============================================

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Filter,
  X,
  Save,
  Star,
  Trash2,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { SavedFilter } from '../../hooks/useAdvancedFilters';
import { toast } from 'sonner';
import { cn } from '../ui/utils';

interface AdvancedFilterPanelProps {
  children: React.ReactNode;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  activeFiltersLabels?: string[];
  onReset: () => void;
  savedFilters: SavedFilter[];
  onSaveFilter: (name: string) => void;
  onApplyFilter: (filterId: string) => void;
  onDeleteFilter: (filterId: string) => void;
  onSetDefault: (filterId: string) => void;
  activeFilterId: string | null;
}

export function AdvancedFilterPanel({
  children,
  hasActiveFilters,
  activeFiltersCount,
  activeFiltersLabels = [],
  onReset,
  savedFilters,
  onSaveFilter,
  onApplyFilter,
  onDeleteFilter,
  onSetDefault,
  activeFilterId,
}: AdvancedFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast.error('Digite um nome para o filtro');
      return;
    }

    onSaveFilter(filterName);
    setFilterName('');
    setIsSaveDialogOpen(false);
    toast.success('Filtro salvo com sucesso!');
  };

  const handleDeleteFilter = (filterId: string, filterName: string) => {
    if (confirm(`Deseja realmente excluir o filtro "${filterName}"?`)) {
      onDeleteFilter(filterId);
      toast.success('Filtro excluído');
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de ações de filtro */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1">
          {/* Botão principal de filtros */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  isOpen && "rotate-180"
                )} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] p-0" align="start">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filtros Avançados</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    aria-label="Fechar filtros avançados"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 max-h-[500px] overflow-y-auto">
                {children}
              </div>

              <div className="p-4 border-t bg-gray-50 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  disabled={!hasActiveFilters}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Limpar Tudo
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSaveDialogOpen(true);
                      setIsOpen(false);
                    }}
                    disabled={!hasActiveFilters}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Filtro
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Filtros salvos */}
          {savedFilters.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Star className="w-4 h-4" />
                  Meus Filtros
                  <Badge variant="secondary">
                    {savedFilters.length}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Filtros Salvos</h4>
                  
                  {savedFilters.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">
                      Nenhum filtro salvo
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {savedFilters.map(filter => (
                        <div
                          key={filter.id}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-lg border",
                            activeFilterId === filter.id
                              ? "bg-blue-50 border-blue-200"
                              : "hover:bg-gray-50"
                          )}
                        >
                          <button
                            onClick={() => onApplyFilter(filter.id)}
                            className="flex-1 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {filter.name}
                              </span>
                              {filter.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  Padrão
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(filter.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </button>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onSetDefault(filter.id)}
                              className="h-7 w-7 p-0"
                              title="Definir como padrão"
                              aria-label={`Definir filtro ${filter.name} como padrão`}
                            >
                              <Star
                                className={cn(
                                  "w-3 h-3",
                                  filter.isDefault && "fill-yellow-400 text-yellow-400"
                                )}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFilter(filter.id, filter.name)}
                              className="h-7 w-7 p-0"
                              title="Excluir"
                              aria-label={`Excluir filtro ${filter.name}`}
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Badge de filtros ativos */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} ativo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
            {activeFiltersLabels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activeFiltersLabels.slice(0, 3).map((label, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
                {activeFiltersLabels.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{activeFiltersLabels.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog de salvar filtro */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Filtro</DialogTitle>
            <DialogDescription>
              Dê um nome para este filtro para poder reutilizá-lo depois.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">Nome do Filtro</Label>
              <Input
                id="filter-name"
                placeholder="Ex: Alunos Ativos 2025.2"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveFilter();
                  }
                }}
                autoFocus
              />
            </div>

            {activeFiltersLabels.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Filtros incluídos:</Label>
                <div className="flex flex-wrap gap-1">
                  {activeFiltersLabels.map((label, index) => (
                    <Badge key={index} variant="secondary">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSaveDialogOpen(false);
                setFilterName('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveFilter}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
