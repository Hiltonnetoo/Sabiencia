// ============================================
// MEUS ALUNOS PAGE - Lista de alunos das turmas do professor
// FUNCIONALIDADE: Exibe todos os alunos matriculados nas turmas que o professor leciona
// ============================================

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
        <h1 className="text-3xl font-bold text-gray-900">Meus Alunos</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe o desempenho dos alunos das suas turmas
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalAlunos}</div>
            <p className="text-xs text-gray-500 mt-1">
              {estatisticas.alunosAtivos} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequência Média</CardTitle>
            <FileCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.frequenciaMedia}%</div>
            <p className="text-xs text-gray-500 mt-1">
              Das aulas ministradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.mediaGeral}</div>
            <p className="text-xs text-gray-500 mt-1">
              Nota média das turmas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas</CardTitle>
            <GraduationCap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minhasTurmas.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Que você leciona
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <CardTitle>Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar aluno, CPF ou turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filtro por Turma */}
            <Select value={selectedTurma} onValueChange={setSelectedTurma}>
              <SelectTrigger>
                <SelectValue placeholder="Turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as turmas</SelectItem>
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
                <SelectValue placeholder="Curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cursos</SelectItem>
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
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="trancado">Trancados</SelectItem>
                <SelectItem value="concluido">Concluídos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contador de resultados */}
          {searchTerm || selectedTurma !== 'todas' || selectedCurso !== 'todos' || selectedStatus !== 'todos' ? (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {alunosFiltrados.length} aluno(s) encontrado(s)
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
                Limpar filtros
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Tabela de Alunos */}
      {alunosFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum aluno encontrado"
          description={
            searchTerm || selectedTurma !== 'todas' || selectedCurso !== 'todos' || selectedStatus !== 'todos'
              ? "Tente ajustar os filtros para encontrar alunos"
              : "Não há alunos matriculados nas suas turmas"
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
                    <TableHead>Aluno</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead className="text-center">Frequência</TableHead>
                    <TableHead className="text-center">Média</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
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
                              title="Lançar Frequência"
                            >
                              <FileCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => navigate(`/professor/notas`, { 
                                state: { alunoId: aluno.id, turmaId: turma?.id } 
                              })}
                              variant="ghost"
                              size="sm"
                              title="Lançar Notas"
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
                  <p className="text-sm text-gray-700 font-medium">Legenda:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="text-green-600 font-semibold">Verde:</span> Frequência ≥ 75% ou Média ≥ 7.0
                    </div>
                    <div>
                      <span className="text-yellow-600 font-semibold">Amarelo:</span> Frequência 60-74% ou Média 5.0-6.9
                    </div>
                    <div>
                      <span className="text-red-600 font-semibold">Vermelho:</span> Frequência {'<'} 60% ou Média {'<'} 5.0
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
