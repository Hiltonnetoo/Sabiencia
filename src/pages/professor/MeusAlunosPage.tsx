// ============================================
// MEUS ALUNOS PAGE - Lista de alunos das turmas do professor
// FUNCIONALIDADE: Exibe todos os alunos matriculados nas turmas que o professor leciona
// ============================================

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { EmptyState } from '../../components/shared/EmptyState';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { 
  Users, 
  Search,
  Filter,
  FileCheck,
  ClipboardList,
  TrendingUp,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { calculateFrequenciaPercentual, calculateMedia } from '../../utils/calculations';
import { formatCPF } from '../../utils/formatters';

export const MeusAlunosPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { 
    alunos, 
    turmas, 
    cursos, 
    professorTurmaDisciplina, 
    matriculas, 
    frequencias,
    notas 
  } = useMockData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurma, setSelectedTurma] = useState<string>('todas');
  const [selectedCurso, setSelectedCurso] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  // Verificar se veio de uma turma específica
  useEffect(() => {
    if (location.state?.turmaId) {
      setSelectedTurma(location.state.turmaId);
    }
  }, [location.state]);

  if (!user) return null;

  // OTIMIZADO: Calcular dados dos alunos com memoização
  const dadosAlunos = useMemo(() => {
    // Encontrar turmas do professor
    const minhasAtribuicoes = professorTurmaDisciplina.filter(
      ptd => ptd.professor_id === user.id
    );
    const turmaIds = [...new Set(minhasAtribuicoes.map(a => a.turma_id))];

    // Buscar matrículas nas minhas turmas
    const matriculasMinhasTurmas = matriculas.filter(
      m => turmaIds.includes(m.turma_id)
    );

    // Montar dados completos dos alunos
    const alunosComDados = matriculasMinhasTurmas
      .map(matricula => {
        const aluno = alunos.find(a => a.id === matricula.aluno_id);
        if (!aluno) return null;

        const turma = turmas.find(t => t.id === matricula.turma_id);
        const curso = turma ? cursos.find(c => c.id === turma.curso_id) : undefined;

        // Calcular frequência do aluno
        const frequenciasAluno = frequencias.filter(f => f.aluno_id === aluno.id);
        const frequenciaPercentual = calculateFrequenciaPercentual(frequenciasAluno);

        // Calcular média de notas do aluno
        const notasAluno = notas.filter(n => n.aluno_id === aluno.id);
        const media = notasAluno.length > 0 ? calculateMedia(notasAluno) : 0;

        return {
          aluno,
          matricula,
          turma,
          curso,
          frequenciaPercentual,
          media
        };
      })
      .filter(Boolean);

    return alunosComDados;
  }, [user.id, alunos, turmas, cursos, professorTurmaDisciplina, matriculas, frequencias, notas]);

  // Minhas turmas para o filtro
  const minhasTurmas = useMemo(() => {
    const minhasAtribuicoes = professorTurmaDisciplina.filter(
      ptd => ptd.professor_id === user.id
    );
    const turmaIds = [...new Set(minhasAtribuicoes.map(a => a.turma_id))];
    return turmas.filter(t => turmaIds.includes(t.id));
  }, [user.id, turmas, professorTurmaDisciplina]);

  // Filtrar alunos
  const alunosFiltrados = useMemo(() => {
    return dadosAlunos.filter(item => {
      if (!item) return false;

      const { aluno, turma, curso, matricula } = item;

      // Filtro de busca
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchNome = aluno.nome_completo.toLowerCase().includes(search);
        const matchCPF = aluno.cpf.toLowerCase().includes(search);
        const matchTurma = turma?.nome.toLowerCase().includes(search);
        if (!matchNome && !matchCPF && !matchTurma) return false;
      }

      // Filtro de turma
      if (selectedTurma !== 'todas' && turma?.id !== selectedTurma) {
        return false;
      }

      // Filtro de curso
      if (selectedCurso !== 'todos' && curso?.id !== selectedCurso) {
        return false;
      }

      // Filtro de status
      if (selectedStatus !== 'todos') {
        if (selectedStatus === 'ativo' && matricula.status !== 'ativo') return false;
        if (selectedStatus === 'trancado' && matricula.status !== 'trancado') return false;
        if (selectedStatus === 'concluido' && matricula.status !== 'concluido') return false;
      }

      return true;
    });
  }, [dadosAlunos, searchTerm, selectedTurma, selectedCurso, selectedStatus]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    const totalAlunos = dadosAlunos.length;
    const alunosAtivos = dadosAlunos.filter(item => 
      item && item.matricula.status === 'ativo'
    ).length;
    const frequenciaMedia = dadosAlunos.length > 0
      ? Math.round(
          dadosAlunos.reduce((sum, item) => sum + (item?.frequenciaPercentual || 0), 0) / 
          dadosAlunos.length
        )
      : 0;
    const mediaGeral = dadosAlunos.length > 0
      ? (
          dadosAlunos.reduce((sum, item) => sum + (item?.media || 0), 0) / 
          dadosAlunos.length
        ).toFixed(1)
      : '0.0';

    return {
      totalAlunos,
      alunosAtivos,
      frequenciaMedia,
      mediaGeral
    };
  }, [dadosAlunos]);

  const getStatusMatricula = (status: string) => {
    return <StatusBadge status={status as any} />;
  };

  const getFrequenciaColor = (percent: number) => {
    if (percent >= 75) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMediaColor = (media: number) => {
    if (media >= 7) return 'text-green-600';
    if (media >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('professor.meusAlunos.title')}</h1>
        <p className="text-gray-600 mt-1">
          {t('professor.meusAlunos.subtitle')}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('professor.meusAlunos.stats.totalStudents')}</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalAlunos}</div>
            <p className="text-xs text-gray-500 mt-1">
              {t('professor.meusAlunos.stats.activeCount', { count: estatisticas.alunosAtivos })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('professor.meusAlunos.stats.averageAttendance')}</CardTitle>
            <FileCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.frequenciaMedia}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {t('professor.meusAlunos.stats.ofLessonsHeld')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('professor.meusAlunos.stats.overallAverage')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.mediaGeral}</div>
            <p className="text-xs text-gray-500 mt-1">
              {t('professor.meusAlunos.stats.classesAverageGrade')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('nav.classes')}</CardTitle>
            <GraduationCap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minhasTurmas.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {t('professor.meusAlunos.stats.classesYouTeach')}
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
                placeholder={t('professor.meusAlunos.filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filtro por Turma */}
            <Select value={selectedTurma} onValueChange={setSelectedTurma}>
              <SelectTrigger>
                <SelectValue placeholder={t('professor.meusAlunos.filters.classPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">{t('common.labels.allClasses')}</SelectItem>
                {minhasTurmas.map(turma => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Curso */}
            <Select value={selectedCurso} onValueChange={setSelectedCurso}>
              <SelectTrigger>
                <SelectValue placeholder={t('professor.meusAlunos.filters.coursePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('professor.meusAlunos.filters.allCourses')}</SelectItem>
                {cursos.map(curso => (
                  <SelectItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Status */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t('professor.meusAlunos.filters.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">{t('common.labels.allStatuses')}</SelectItem>
                <SelectItem value="ativo">{t('professor.meusAlunos.filters.statusActive')}</SelectItem>
                <SelectItem value="trancado">{t('professor.meusAlunos.filters.statusLocked')}</SelectItem>
                <SelectItem value="concluido">{t('professor.meusAlunos.filters.statusCompleted')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contador de resultados */}
          {searchTerm || selectedTurma !== 'todas' || selectedCurso !== 'todos' || selectedStatus !== 'todos' ? (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {t('professor.meusAlunos.resultsCount', { count: alunosFiltrados.length })}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTurma('todas');
                  setSelectedCurso('todos');
                  setSelectedStatus('todos');
                }}
              >
                {t('common.actions.clearFilters')}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Tabela de Alunos */}
      {alunosFiltrados.length === 0 ? (
        <EmptyState
          title={t('professor.meusAlunos.emptyTitle')}
          description={
            searchTerm || selectedTurma !== 'todas' || selectedCurso !== 'todos' || selectedStatus !== 'todos'
              ? t('professor.meusAlunos.emptyFiltered')
              : t('professor.meusAlunos.emptyDefault')
          }
          icon={Users}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('professor.meusAlunos.table.student')}</TableHead>
                    <TableHead>{t('professor.meusAlunos.table.cpf')}</TableHead>
                    <TableHead>{t('professor.meusAlunos.table.class')}</TableHead>
                    <TableHead className="text-center">{t('professor.meusAlunos.table.attendance')}</TableHead>
                    <TableHead className="text-center">{t('professor.meusAlunos.table.average')}</TableHead>
                    <TableHead className="text-center">{t('professor.meusAlunos.table.status')}</TableHead>
                    <TableHead className="text-center">{t('professor.meusAlunos.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunosFiltrados.map(item => {
                    if (!item) return null;

                    const { aluno, turma, matricula, frequenciaPercentual, media } = item;

                    return (
                      <TableRow key={`${aluno.id}-${matricula.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {aluno.foto_url ? (
                              <img
                                src={aluno.foto_url}
                                alt={aluno.nome_completo}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="font-semibold text-blue-600">
                                  {aluno.nome_completo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{aluno.nome_completo}</p>
                              <p className="text-sm text-gray-500">{aluno.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatCPF(aluno.cpf)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{turma?.nome}</p>
                            <p className="text-xs text-gray-500">{item.curso?.nome}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold ${getFrequenciaColor(frequenciaPercentual)}`}>
                            {frequenciaPercentual}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold ${getMediaColor(media)}`}>
                            {media.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusMatricula(matricula.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => navigate(`/professor/frequencia`, { 
                                state: { alunoId: aluno.id, turmaId: turma?.id } 
                              })}
                              variant="ghost"
                              size="sm"
                              title={t('professor.meusAlunos.actions.recordAttendance')}
                            >
                              <FileCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => navigate(`/professor/notas`, { 
                                state: { alunoId: aluno.id, turmaId: turma?.id } 
                              })}
                              variant="ghost"
                              size="sm"
                              title={t('professor.meusAlunos.actions.recordGrades')}
                            >
                              <ClipboardList className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Legenda */}
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-700 font-medium">{t('professor.meusAlunos.legend.title')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="text-green-600 font-semibold">{t('professor.meusAlunos.legend.greenLabel')}</span> {t('professor.meusAlunos.legend.greenDesc')}
                    </div>
                    <div>
                      <span className="text-yellow-600 font-semibold">{t('professor.meusAlunos.legend.yellowLabel')}</span> {t('professor.meusAlunos.legend.yellowDesc')}
                    </div>
                    <div>
                      <span className="text-red-600 font-semibold">{t('professor.meusAlunos.legend.redLabel')}</span> {t('professor.meusAlunos.legend.redDesc')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeusAlunosPage;
