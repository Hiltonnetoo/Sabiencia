import React from 'react';
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
  const hasActiveFilters = busca || curso_id !== 'todos';

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <Button
            onClick={onLimpar}
            variant="ghost"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Busca */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Nome ou descrição..."
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Curso */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Curso
          </label>
          <Select value={curso_id} onValueChange={onCursoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os cursos</SelectItem>
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
          Filtros ativos: {[
            busca && 'Busca',
            curso_id !== 'todos' && 'Curso',
          ].filter(Boolean).join(', ')}
        </div>
      )}
    </div>
  );
}
