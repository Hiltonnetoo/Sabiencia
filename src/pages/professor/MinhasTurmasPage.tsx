// ============================================
// MINHAS TURMAS PAGE - Lista de turmas do professor
// FUNCIONALIDADE: Exibe todas as turmas que o professor leciona
// ============================================

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { EmptyState } from '../../components/shared/EmptyState';
import { 
  Users, 
  BookOpen, 
  Calendar,
  Clock,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  GraduationCap,
  FileCheck
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { calculateFrequenciaPercentual } from '../../utils/calculations';

export const MinhasTurmasPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { turmas, cursos, disciplinas, professorTurmaDisciplina, matriculas, frequencias } = useMockData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurso, setSelectedCurso] = useState<string>('todos');
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  if (!user) return null;

  // OTIMIZADO: Calcular dados do professor com memoização + Maps O(1)
  const dadosProfessor = useMemo(() => {
    // Construir Maps para lookup O(1) — elimina O(N²) dos find() aninhados
    const turmasMap      = new Map(turmas.map(t => [t.id, t]));
    const cursosMap      = new Map(cursos.map(c => [c.id, c]));
    const disciplinasMap = new Map(disciplinas.map(d => [d.id, d]));

    // Encontrar atribuições do professor (turmas + disciplinas que leciona)
    const minhasAtribuicoes = professorTurmaDisciplina.filter(
      ptd => ptd.professor_id === user.id
    );

    // IDs únicos de turmas
    const turmaIds = [...new Set(minhasAtribuicoes.map(a => a.turma_id))];

    // Buscar turmas completas
    const minhasTurmas = turmaIds
      .map(turmaId => {
        const turma = turmasMap.get(turmaId);  // O(1)
        if (!turma) return null;

        const curso = cursosMap.get(turma.curso_id);  // O(1)

        // Disciplinas que leciono nesta turma
        const disciplinasNaTurma = minhasAtribuicoes
          .filter(a => a.turma_id === turmaId)
          .map(a => disciplinasMap.get(a.disciplina_id))  // O(1)
          .filter(Boolean);

        // Alunos matriculados na turma
        const alunosNaTurma = matriculas.filter(
          m => m.turma_id === turmaId && m.status === 'ativo'
        );

        // Calcular frequência média da turma
        const frequenciasTurma = frequencias.filter(f => 
          alunosNaTurma.some(m => m.aluno_id === f.aluno_id)
        );

        const frequenciaMedia = frequenciasTurma.length > 0
          ? frequenciasTurma.reduce((sum, f) => {
              const alunoFreqs = frequencias.filter(fr => fr.aluno_id === f.aluno_id);
              const percent = calculateFrequenciaPercentual(alunoFreqs);
              return sum + percent;
            }, 0) / alunosNaTurma.length
          : 0;

        return {
          turma,
          curso,
          disciplinas: disciplinasNaTurma,
          totalAlunos: alunosNaTurma.length,
          frequenciaMedia: Math.round(frequenciaMedia)
        };
      })
      .filter(Boolean);

    return minhasTurmas;
  }, [user.id, turmas, cursos, disciplinas, professorTurmaDisciplina, matriculas, frequencias]);

  // Filtrar turmas
  const turmasFiltradas = useMemo(() => {
    return dadosProfessor.filter(item => {
      if (!item) return false;

      const { turma, curso } = item;

      // Filtro de busca
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchNome = turma.nome.toLowerCase().includes(search);
        const matchCurso = curso?.nome.toLowerCase().includes(search);
        if (!matchNome && !matchCurso) return false;
      }

      // Filtro de curso
      if (selectedCurso !== 'todos' && turma.curso_id !== selectedCurso) {
        return false;
      }

      // Filtro de período
      if (selectedPeriodo !== 'todos' && turma.periodo !== selectedPeriodo) {
        return false;
      }

      // Filtro de status
      if (selectedStatus !== 'todos') {
        const isAtiva = turma.ativa && new Date(turma.data_fim) > new Date();
        const isFinalizada = new Date(turma.data_fim) < new Date();
        
        if (selectedStatus === 'ativa' && !isAtiva) return false;
        if (selectedStatus === 'finalizada' && !isFinalizada) return false;
        if (selectedStatus === 'inativa' && (isAtiva || isFinalizada)) return false;
      }

      return true;
    });
  }, [dadosProfessor, searchTerm, selectedCurso, selectedPeriodo, selectedStatus]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalTurmas = dadosProfessor.length;
    const turmasAtivas = dadosProfessor.filter(item => 
      item && item.turma.ativa && new Date(item.turma.data_fim) > new Date()
    ).length;
    const totalAlunos = dadosProfessor.reduce((sum, item) => 
      sum + (item?.totalAlunos || 0), 0
    );
    const frequenciaGeral = dadosProfessor.length > 0
      ? Math.round(
          dadosProfessor.reduce((sum, item) => sum + (item?.frequenciaMedia || 0), 0) / 
          dadosProfessor.length
        )
      : 0;

    return {
      totalTurmas,
      turmasAtivas,
      totalAlunos,
      frequenciaGeral
    };
  }, [dadosProfessor]);

  const getPeriodoBadge = (periodo: string) => {
    const configs = {
      manha: { label: t('professor.minhasTurmas.periods.manha'), className: 'bg-yellow-100 text-yellow-700' },
      tarde: { label: t('professor.minhasTurmas.periods.tarde'), className: 'bg-orange-100 text-orange-700' },
      noite: { label: t('professor.minhasTurmas.periods.noite'), className: 'bg-indigo-100 text-indigo-700' },
      integral: { label: t('professor.minhasTurmas.periods.integral'), className: 'bg-purple-100 text-purple-700' },
    };

    const config = configs[periodo as keyof typeof configs];

    return (
      <Badge className={config.className}>
        <Clock className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (turma: any) => {
    const isAtiva = turma.ativa && new Date(turma.data_fim) > new Date();
    const isFinalizada = new Date(turma.data_fim) < new Date();

    if (isAtiva) {
      return <Badge className="bg-green-100 text-green-700">{t('professor.minhasTurmas.status.active')}</Badge>;
    } else if (isFinalizada) {
      return <Badge className="bg-gray-100 text-gray-700">{t('professor.minhasTurmas.status.finished')}</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700">{t('professor.minhasTurmas.status.inactive')}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('professor.minhasTurmas.title')}</h1>
        <p className="text-gray-600 mt-1">
          {t('professor.minhasTurmas.subtitle')}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('professor.minhasTurmas.stats.totalClasses')}</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalTurmas}</div>
            <p className="text-xs text-gray-500 mt-1">
              {t('professor.minhasTurmas.stats.activeClasses', { count: estatisticas.turmasAtivas })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('professor.minhasTurmas.stats.totalStudents')}</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalAlunos}</div>
            <p className="text-xs text-gray-500 mt-1">
              {t('professor.minhasTurmas.stats.inAllClasses')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('professor.minhasTurmas.stats.overallAttendance')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.frequenciaGeral}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {t('professor.minhasTurmas.stats.averagePresence')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('professor.minhasTurmas.stats.subjects')}</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...new Set(
                dadosProfessor.flatMap(item => 
                  item?.disciplinas.map(d => d?.id) || []
                )
              )].length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('professor.minhasTurmas.stats.differentSubjects')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <CardTitle>{t('common.actions.filters')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('professor.minhasTurmas.filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filtro por Curso */}
            <Select value={selectedCurso} onValueChange={setSelectedCurso}>
              <SelectTrigger>
                <SelectValue placeholder={t('professor.minhasTurmas.filters.coursePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('professor.minhasTurmas.filters.allCourses')}</SelectItem>
                {cursos.map(curso => (
                  <SelectItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Período */}
            <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
              <SelectTrigger>
                <SelectValue placeholder={t('professor.minhasTurmas.filters.periodPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('professor.minhasTurmas.filters.allPeriods')}</SelectItem>
                <SelectItem value="manha">{t('professor.minhasTurmas.periods.manha')}</SelectItem>
                <SelectItem value="tarde">{t('professor.minhasTurmas.periods.tarde')}</SelectItem>
                <SelectItem value="noite">{t('professor.minhasTurmas.periods.noite')}</SelectItem>
                <SelectItem value="integral">{t('professor.minhasTurmas.periods.integral')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por Status */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t('professor.minhasTurmas.filters.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('professor.minhasTurmas.filters.allStatuses')}</SelectItem>
                <SelectItem value="ativa">{t('professor.minhasTurmas.filters.statusActive')}</SelectItem>
                <SelectItem value="finalizada">{t('professor.minhasTurmas.filters.statusFinished')}</SelectItem>
                <SelectItem value="inativa">{t('professor.minhasTurmas.filters.statusInactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contador de resultados */}
          {searchTerm || selectedCurso !== 'todos' || selectedPeriodo !== 'todos' || selectedStatus !== 'todos' ? (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {t('professor.minhasTurmas.resultsCount', { count: turmasFiltradas.length })}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCurso('todos');
                  setSelectedPeriodo('todos');
                  setSelectedStatus('todos');
                }}
              >
                {t('common.actions.clearFilters')}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Lista de Turmas */}
      {turmasFiltradas.length === 0 ? (
        <EmptyState
          title={t('professor.minhasTurmas.empty.title')}
          description={
            searchTerm || selectedCurso !== 'todos' || selectedPeriodo !== 'todos' || selectedStatus !== 'todos'
              ? t('professor.minhasTurmas.empty.withFilters')
              : t('professor.minhasTurmas.empty.default')
          }
          icon={GraduationCap}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {turmasFiltradas.map(item => {
            if (!item) return null;
            
            const { turma, curso, disciplinas, totalAlunos, frequenciaMedia } = item;

            return (
              <Card key={turma.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{turma.nome}</CardTitle>
                      {curso && (
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <BookOpen className="w-3 h-3" />
                          {curso.nome}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-600">{totalAlunos}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {getPeriodoBadge(turma.periodo)}
                    {getStatusBadge(turma)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Datas */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">{t('professor.minhasTurmas.startLabel')}</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(turma.data_inicio)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">{t('professor.minhasTurmas.endLabel')}</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(turma.data_fim)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Disciplinas */}
                  {disciplinas && disciplinas.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">{t('professor.minhasTurmas.subjectsITeach')}</p>
                      <div className="flex flex-wrap gap-1">
                        {disciplinas.slice(0, 2).map(disc => (
                          disc && (
                            <Badge key={disc.id} variant="outline" className="text-xs">
                              {disc.nome}
                            </Badge>
                          )
                        ))}
                        {disciplinas.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{disciplinas.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Frequência */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{t('professor.minhasTurmas.averageAttendance')}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{frequenciaMedia}%</span>
                  </div>

                  {/* Botão Ver Alunos */}
                  <Button
                    onClick={() => navigate('/professor/alunos', { state: { turmaId: turma.id } })}
                    className="w-full"
                    variant="outline"
                  >
                    {t('professor.minhasTurmas.viewStudents')}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MinhasTurmasPage;
