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
  const hasActiveFilters = busca || curso_id !== 'todos' || periodo !== 'todos' || status !== 'todos';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Nome da turma..."
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

        {/* Período */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Período
          </label>
          <Select value={periodo} onValueChange={onPeriodoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="manha">Manhã</SelectItem>
              <SelectItem value="tarde">Tarde</SelectItem>
              <SelectItem value="noite">Noite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Status
          </label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="inativa">Inativa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="text-sm text-gray-600">
          Filtros ativos: {[
            busca && 'Busca',
            curso_id !== 'todos' && 'Curso',
            periodo !== 'todos' && 'Período',
            status !== 'todos' && 'Status',
          ].filter(Boolean).join(', ')}
        </div>
      )}
    </div>
  );
}
