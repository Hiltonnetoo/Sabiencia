// ============================================
// RELATÓRIO FILTERS - Filtros para relatórios
// ============================================

import { useTranslation } from 'react-i18next';
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
import type { RelatorioFiltros } from '../../schemas/relatorioSchemas';

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
  
  const { t } = useTranslation();
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
            <Label>{t('components.relatorioFilters.reportType')}</Label>
            <Select
              value={filters.tipo || 'todos'}
              onValueChange={(value) => handleFilterChange('tipo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.relatorioFilters.selectType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('components.relatorioFilters.allTypes')}</SelectItem>
                <SelectItem value="desempenho_aluno">{t('components.relatorioFilters.typeStudentPerformance')}</SelectItem>
                <SelectItem value="desempenho_turma">{t('components.relatorioFilters.typeClassPerformance')}</SelectItem>
                <SelectItem value="frequencia">{t('components.relatorioFilters.typeAttendance')}</SelectItem>
                <SelectItem value="financeiro">{t('components.relatorioFilters.typeFinancial')}</SelectItem>
                <SelectItem value="disciplina">{t('components.relatorioFilters.typeSubject')}</SelectItem>
                <SelectItem value="observacoes">{t('components.relatorioFilters.typeObservations')}</SelectItem>
                <SelectItem value="geral">{t('components.relatorioFilters.typeGeneral')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Período */}
        {showPeriodoFilter && (
          <div className="space-y-2">
            <Label>{t('components.relatorioFilters.period')}</Label>
            <Select
              value={filters.periodo || 'todos'}
              onValueChange={(value) => handleFilterChange('periodo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.relatorioFilters.selectPeriod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('components.relatorioFilters.all')}</SelectItem>
                <SelectItem value="mensal">{t('components.relatorioFilters.monthly')}</SelectItem>
                <SelectItem value="bimestral">{t('components.relatorioFilters.bimonthly')}</SelectItem>
                <SelectItem value="semestral">{t('components.relatorioFilters.biannual')}</SelectItem>
                <SelectItem value="anual">{t('components.relatorioFilters.annual')}</SelectItem>
                <SelectItem value="personalizado">{t('components.relatorioFilters.custom')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Curso */}
        {showCursoFilter && cursos.length > 0 && (
          <div className="space-y-2">
            <Label>{t('components.relatorioFilters.course')}</Label>
            <Select
              value={filters.curso_id || 'todos'}
              onValueChange={(value) => handleFilterChange('curso_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.relatorioFilters.allCourses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('components.relatorioFilters.allCourses')}</SelectItem>
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
            <Label>{t('components.relatorioFilters.class')}</Label>
            <Select
              value={filters.turma_id || 'todos'}
              onValueChange={(value) => handleFilterChange('turma_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.relatorioFilters.allClasses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('components.relatorioFilters.allClasses')}</SelectItem>
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
            <Label>{t('components.relatorioFilters.subject')}</Label>
            <Select
              value={filters.disciplina_id || 'todos'}
              onValueChange={(value) => handleFilterChange('disciplina_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.relatorioFilters.allSubjects')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('components.relatorioFilters.allSubjects')}</SelectItem>
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
            <Label>{t('components.relatorioFilters.student')}</Label>
            <Select
              value={filters.aluno_id || 'todos'}
              onValueChange={(value) => handleFilterChange('aluno_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.relatorioFilters.allStudents')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('components.relatorioFilters.allStudents')}</SelectItem>
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
            <Label>{t('components.relatorioFilters.teacher')}</Label>
            <Select
              value={filters.professor_id || 'todos'}
              onValueChange={(value) => handleFilterChange('professor_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('components.relatorioFilters.allTeachers')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('components.relatorioFilters.allTeachers')}</SelectItem>
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
            <Label>{t('components.relatorioFilters.startDate')}</Label>
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
            <Label>{t('components.relatorioFilters.endDate')}</Label>
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
