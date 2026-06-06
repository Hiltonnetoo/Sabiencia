// ============================================
// RELATÓRIO FILTERS - Filtros para relatórios
// ============================================

import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { Curso, Turma, Disciplina, Aluno, Professor } from '../../types';
import type { RelatorioFiltros, TipoRelatorio } from '../../schemas/relatorioSchemas';

interface RelatorioFiltersProps {
  filters: Partial<RelatorioFiltros>;
  onFiltersChange: (filters: Partial<RelatorioFiltros>) => void;
  cursos?: Curso[];
  turmas?: Turma[];
  disciplinas?: Disciplina[];
  alunos?: Aluno[];
  professores?: Professor[];
  showTipoFilter?: boolean;
  showCursoFilter?: boolean;
  showTurmaFilter?: boolean;
  showDisciplinaFilter?: boolean;
  showAlunoFilter?: boolean;
  showProfessorFilter?: boolean;
  showPeriodoFilter?: boolean;
}

export function RelatorioFilters({
  filters,
  onFiltersChange,
  cursos = [],
  turmas = [],
  disciplinas = [],
  alunos = [],
  professores = [],
  showTipoFilter = true,
  showCursoFilter = true,
  showTurmaFilter = true,
  showDisciplinaFilter = true,
  showAlunoFilter = true,
  showProfessorFilter = true,
  showPeriodoFilter = true,
}: RelatorioFiltersProps) {
  
  const handleFilterChange = (key: keyof RelatorioFiltros, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'todos' || value === '' ? undefined : value,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        {/* Tipo de Relatório */}
        {showTipoFilter && (
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select
              value={filters.tipo || 'todos'}
              onValueChange={(value) => handleFilterChange('tipo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="desempenho_aluno">Desempenho do Aluno</SelectItem>
                <SelectItem value="desempenho_turma">Desempenho da Turma</SelectItem>
                <SelectItem value="frequencia">Frequência</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="disciplina">Por Disciplina</SelectItem>
                <SelectItem value="observacoes">Observações</SelectItem>
                <SelectItem value="geral">Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Período */}
        {showPeriodoFilter && (
          <div className="space-y-2">
            <Label>Período</Label>
            <Select
              value={filters.periodo || 'todos'}
              onValueChange={(value) => handleFilterChange('periodo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="bimestral">Bimestral</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Curso */}
        {showCursoFilter && cursos.length > 0 && (
          <div className="space-y-2">
            <Label>Curso</Label>
            <Select
              value={filters.curso_id || 'todos'}
              onValueChange={(value) => handleFilterChange('curso_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os cursos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cursos</SelectItem>
                {cursos
                  .filter(curso => curso?.id && curso.id.trim() !== '')
                  .map((curso) => (
                    <SelectItem key={curso.id} value={curso.id}>
                      {curso.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Turma */}
        {showTurmaFilter && turmas.length > 0 && (
          <div className="space-y-2">
            <Label>Turma</Label>
            <Select
              value={filters.turma_id || 'todos'}
              onValueChange={(value) => handleFilterChange('turma_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as turmas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as turmas</SelectItem>
                {turmas
                  .filter(turma => turma?.id && turma.id.trim() !== '')
                  .map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Disciplina */}
        {showDisciplinaFilter && disciplinas.length > 0 && (
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Select
              value={filters.disciplina_id || 'todos'}
              onValueChange={(value) => handleFilterChange('disciplina_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as disciplinas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as disciplinas</SelectItem>
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

        {/* Aluno */}
        {showAlunoFilter && alunos.length > 0 && (
          <div className="space-y-2">
            <Label>Aluno</Label>
            <Select
              value={filters.aluno_id || 'todos'}
              onValueChange={(value) => handleFilterChange('aluno_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os alunos" />
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
          <div className="space-y-2">
            <Label>Professor</Label>
            <Select
              value={filters.professor_id || 'todos'}
              onValueChange={(value) => handleFilterChange('professor_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os professores" />
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

        {/* Data Início */}
        {filters.periodo === 'personalizado' && (
          <div className="space-y-2">
            <Label>Data Início</Label>
            <Input
              type="date"
              value={filters.data_inicio || ''}
              onChange={(e) => handleFilterChange('data_inicio', e.target.value)}
            />
          </div>
        )}

        {/* Data Fim */}
        {filters.periodo === 'personalizado' && (
          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Input
              type="date"
              value={filters.data_fim || ''}
              onChange={(e) => handleFilterChange('data_fim', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
