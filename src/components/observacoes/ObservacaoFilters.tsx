// ============================================
// OBSERVACAO FILTERS - Filtros de observações
// ============================================

import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { Aluno, Professor, Disciplina } from '../../types';
import type { ObservacaoFilters } from '../../schemas/observacaoSchemas';

interface ObservacaoFiltersProps {
  filters: ObservacaoFilters;
  onFiltersChange: (filters: ObservacaoFilters) => void;
  alunos?: Aluno[];
  professores?: Professor[];
  disciplinas?: Disciplina[];
  showAlunoFilter?: boolean;
  showProfessorFilter?: boolean;
  showDisciplinaFilter?: boolean;
}

export function ObservacaoFilters({
  filters,
  onFiltersChange,
  alunos = [],
  professores = [],
  disciplinas = [],
  showAlunoFilter = true,
  showProfessorFilter = true,
  showDisciplinaFilter = true
}: ObservacaoFiltersProps) {
  const hasActiveFilters = 
    filters.busca || 
    filters.aluno_id || 
    filters.professor_id || 
    filters.disciplina_id || 
    filters.tipo;

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Busca */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar no conteúdo..."
            value={filters.busca || ''}
            onChange={(e) => onFiltersChange({ ...filters, busca: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Tipo */}
        <div>
          <Select
            value={filters.tipo || 'todos'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                tipo: value === 'todos' ? undefined : (value as 'pedagogica' | 'comportamental' | 'administrativa')
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="pedagogica">Pedagógica</SelectItem>
              <SelectItem value="comportamental">Comportamental</SelectItem>
              <SelectItem value="administrativa">Administrativa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Aluno */}
        {showAlunoFilter && alunos.length > 0 && (
          <div>
            <Select
              value={filters.aluno_id || 'todos'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  aluno_id: value === 'todos' ? undefined : value
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Aluno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os alunos</SelectItem>
                {alunos
                  .filter(aluno => aluno?.id && aluno.id.trim() !== '')
                  .map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome_completo}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Professor */}
        {showProfessorFilter && professores.length > 0 && (
          <div>
            <Select
              value={filters.professor_id || 'todos'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  professor_id: value === 'todos' ? undefined : value
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Professor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os professores</SelectItem>
                {professores
                  .filter(professor => professor?.id && professor.id.trim() !== '')
                  .map((professor) => (
                    <SelectItem key={professor.id} value={professor.id}>
                      {professor.nome_completo}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Disciplina */}
        {showDisciplinaFilter && disciplinas.length > 0 && (
          <div>
            <Select
              value={filters.disciplina_id || 'todos'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  disciplina_id: value === 'todos' ? undefined : value
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Disciplina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as disciplinas</SelectItem>
                <SelectItem value="sem-disciplina">Sem disciplina</SelectItem>
                {disciplinas
                  .filter(disciplina => disciplina?.id && disciplina.id.trim() !== '')
                  .map((disciplina) => (
                    <SelectItem key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
