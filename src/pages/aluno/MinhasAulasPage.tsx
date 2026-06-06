// ============================================
// MINHAS AULAS PAGE - Página de aulas do aluno
// ============================================

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { useVideoaulas } from '../../contexts/VideoaulasContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { VideoaulasDialog } from '../../components/videoaulas/VideoaulasDialog';
import { EstatisticasVideoaulas } from '../../components/videoaulas/EstatisticasVideoaulas';
import { 
  Video, 
  Clock, 
  Calendar,
  BookOpen,
  User,
  FileText,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { EmptyState } from '../../components/shared/EmptyState';
import { formatDate, formatPercent } from '../../utils/formatters';
import { formatDuration } from '../../utils/youtube';
import { calculateFrequenciaPercentual } from '../../utils/calculations';
import type { Disciplina, Professor, Frequencia, Material } from '../../types';
import type { Videoaula } from '../../types/videoaulas';

interface AulaData {
  disciplina: Disciplina;
  professor: Professor;
  totalAulas: number;
  aulasRealizadas: number;
  presencas: number;
  percentualFrequencia: number;
  materiaisDisponiveis: Material[];
  ultimaAula?: Date;
  proximaAula?: Date;
  videoaulas: Videoaula[];
}

export const MinhasAulasPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    matriculas, 
    turmas, 
    disciplinas, 
    professores, 
    professorTurmaDisciplina,
    frequencias,
    materiais
  } = useMockData();

  const { videoaulas } = useVideoaulas();

  const {
    topicos,
    progressos,
    getTopicosPorDisciplina,
    getVideoaulasPorTopico,
    getProgressoAluno,
    salvarProgresso,
    marcarComoConcluida,
    getAnotacoesPorVideoaula,
    salvarAnotacao,
    editarAnotacao,
    deletarAnotacao,
    getQuizPorVideoaula,
    getRespostasQuiz,
    submeterQuiz
  } = useVideoaulas();

  const [abaSelecionada, setAbaSelecionada] = useState<'todas' | 'em-andamento' | 'concluidas'>('todas');
  const [disciplinaDialog, setDisciplinaDialog] = useState<Disciplina | null>(null);
  const [showVideoaulasDialog, setShowVideoaulasDialog] = useState(false);

  // Buscar dados do aluno
  const minhasAulas = useMemo<AulaData[]>(() => {
    if (!user) return [];

    // Encontrar matrícula ativa do aluno
    const matriculaAtiva = matriculas.find(
      m => m.aluno_id === user.id && m.status === 'ativo'
    );

    if (!matriculaAtiva) return [];

    // Encontrar turma
    const minhaTurma = turmas.find(t => t.id === matriculaAtiva.turma_id);
    if (!minhaTurma) return [];

    // Encontrar disciplinas e professores da turma
    const disciplinasTurma = professorTurmaDisciplina.filter(
      ptd => ptd.turma_id === minhaTurma.id
    );

    // Montar dados de cada aula
    return disciplinasTurma.map(ptd => {
      const disciplina = disciplinas.find(d => d.id === ptd.disciplina_id);
      const professor = professores.find(p => p.id === ptd.professor_id);

      if (!disciplina || !professor) return null;

      // Frequências desta disciplina
      const frequenciasDisciplina = frequencias.filter(
        f => f.disciplina_id === disciplina.id && f.aluno_id === user.id
      );

      // Calcular estatísticas
      const totalAulas = frequenciasDisciplina.length;
      const presencas = frequenciasDisciplina.filter(f => f.status === 'presente').length;
      const percentualFrequencia = totalAulas > 0 
        ? (presencas / totalAulas) * 100 
        : 0;

      // Materiais disponíveis
      const materiaisDisponiveis = materiais.filter(
        m => m.disciplina_id === disciplina.id && m.visivel_alunos
      );

      // Última e próxima aula
      const datasAulas = frequenciasDisciplina
        .map(f => new Date(f.data_aula))
        .sort((a, b) => a.getTime() - b.getTime());

      const hoje = new Date();
      const aulasPassadas = datasAulas.filter(d => d < hoje);
      const aulasFuturas = datasAulas.filter(d => d >= hoje);

      const ultimaAula = aulasPassadas.length > 0 
        ? aulasPassadas[aulasPassadas.length - 1] 
        : undefined;
      const proximaAula = aulasFuturas.length > 0 
        ? aulasFuturas[0] 
        : undefined;

      // Videoaulas
      const videoaulasDisciplina = videoaulas.filter(
        v => v.disciplina_id === disciplina.id
      );

      return {
        disciplina,
        professor,
        totalAulas,
        aulasRealizadas: presencas,
        presencas,
        percentualFrequencia,
        materiaisDisponiveis,
        ultimaAula,
        proximaAula,
        videoaulas: videoaulasDisciplina
      };
    }).filter((aula): aula is AulaData => aula !== null);
  }, [user, matriculas, turmas, disciplinas, professores, professorTurmaDisciplina, frequencias, materiais, videoaulas]);

  // Filtrar aulas por aba
  const aulasFiltradas = useMemo(() => {
    if (abaSelecionada === 'em-andamento') {
      return minhasAulas.filter(aula => aula.proximaAula);
    }
    if (abaSelecionada === 'concluidas') {
      return minhasAulas.filter(aula => !aula.proximaAula && aula.totalAulas > 0);
    }
    return minhasAulas;
  }, [minhasAulas, abaSelecionada]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalDisciplinas = minhasAulas.length;
    const totalAulas = minhasAulas.reduce((sum, aula) => sum + aula.totalAulas, 0);
    const totalPresencas = minhasAulas.reduce((sum, aula) => sum + aula.presencas, 0);
    const mediaFrequencia = totalAulas > 0 ? (totalPresencas / totalAulas) * 100 : 0;
    const totalMateriais = minhasAulas.reduce((sum, aula) => sum + aula.materiaisDisponiveis.length, 0);

    return {
      totalDisciplinas,
      totalAulas,
      totalPresencas,
      mediaFrequencia,
      totalMateriais
    };
  }, [minhasAulas]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb
        items={[
          { label: 'Início', href: '/aluno/dashboard' },
          { label: 'Minhas Aulas', href: '/aluno/aulas' }
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Aulas</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe suas disciplinas, frequência e materiais de estudo
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Disciplinas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{estatisticas.totalDisciplinas}</p>
                <p className="text-sm text-gray-500">disciplinas ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Aulas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{estatisticas.totalAulas}</p>
                <p className="text-sm text-gray-500">aulas realizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Frequência Geral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPercent(estatisticas.mediaFrequencia)}
                </p>
                <p className="text-sm text-gray-500">{estatisticas.totalPresencas} presenças</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Materiais Disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{estatisticas.totalMateriais}</p>
                <p className="text-sm text-gray-500">arquivos e vídeos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={abaSelecionada} onValueChange={(v) => setAbaSelecionada(v as any)}>
        <TabsList>
          <TabsTrigger value="todas">
            Todas ({minhasAulas.length})
          </TabsTrigger>
          <TabsTrigger value="em-andamento">
            Em Andamento ({minhasAulas.filter(a => a.proximaAula).length})
          </TabsTrigger>
          <TabsTrigger value="concluidas">
            Concluídas ({minhasAulas.filter(a => !a.proximaAula && a.totalAulas > 0).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={abaSelecionada} className="space-y-4 mt-6">
          {aulasFiltradas.length === 0 ? (
            <EmptyState
              icon={Video}
              title="Nenhuma aula encontrada"
              description={
                abaSelecionada === 'em-andamento'
                  ? "Você não possui aulas em andamento no momento."
                  : abaSelecionada === 'concluidas'
                  ? "Você ainda não concluiu nenhuma disciplina."
                  : "Você ainda não possui aulas cadastradas."
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {aulasFiltradas.map((aula) => (
                <Card key={aula.disciplina.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {aula.disciplina.nome}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Prof. {aula.professor.nome_completo}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={
                          aula.percentualFrequencia >= 75 
                            ? 'default' 
                            : aula.percentualFrequencia >= 50 
                            ? 'secondary' 
                            : 'destructive'
                        }
                      >
                        {formatPercent(aula.percentualFrequencia)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progresso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Frequência</span>
                        <span className="font-medium">
                          {aula.presencas} de {aula.totalAulas} aulas
                        </span>
                      </div>
                      <Progress 
                        value={aula.percentualFrequencia} 
                        className="h-2"
                      />
                    </div>

                    {/* Informações das Aulas */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      {aula.ultimaAula && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Última aula
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(aula.ultimaAula)}
                          </p>
                        </div>
                      )}
                      
                      {aula.proximaAula && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Próxima aula
                          </p>
                          <p className="text-sm font-medium text-blue-600">
                            {formatDate(aula.proximaAula)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Materiais */}
                    {aula.materiaisDisponiveis.length > 0 && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>
                              {aula.materiaisDisponiveis.length} material
                              {aula.materiaisDisponiveis.length !== 1 ? 'is' : ''} disponível
                              {aula.materiaisDisponiveis.length !== 1 ? 'is' : ''}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/aluno/materiais?disciplina=${aula.disciplina.id}`)}
                          >
                            Ver materiais
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/aluno/frequencia?disciplina=${aula.disciplina.id}`)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Ver Frequência
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/aluno/notas?disciplina=${aula.disciplina.id}`)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Notas
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setDisciplinaDialog(aula.disciplina);
                          setShowVideoaulasDialog(true);
                        }}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Ver Aulas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Avisos de Frequência */}
      {minhasAulas.some(aula => aula.percentualFrequencia < 75) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <CardTitle className="text-base text-yellow-900">
                  Atenção à Frequência
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  Você possui disciplinas com frequência abaixo de 75%
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {minhasAulas
                .filter(aula => aula.percentualFrequencia < 75)
                .map(aula => (
                  <div 
                    key={aula.disciplina.id} 
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{aula.disciplina.nome}</p>
                      <p className="text-sm text-gray-600">
                        Frequência: {formatPercent(aula.percentualFrequencia)}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      Atenção
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Videoaulas */}
      {disciplinaDialog && user && (
        <VideoaulasDialog
          open={showVideoaulasDialog}
          onOpenChange={setShowVideoaulasDialog}
          disciplinaNome={disciplinaDialog.nome}
          topicos={getTopicosPorDisciplina(disciplinaDialog.id)}
          videoaulas={videoaulas.filter(v => v.disciplina_id === disciplinaDialog.id)}
          getVideoaulasPorTopico={getVideoaulasPorTopico}
          progressos={progressos}
          getProgressoAluno={getProgressoAluno}
          alunoId={user.id}
          onSalvarProgresso={salvarProgresso}
          onMarcarComoConcluida={marcarComoConcluida}
          getAnotacoesPorVideoaula={getAnotacoesPorVideoaula}
          onSalvarAnotacao={salvarAnotacao}
          onEditarAnotacao={editarAnotacao}
          onDeletarAnotacao={deletarAnotacao}
          getQuizPorVideoaula={getQuizPorVideoaula}
          getRespostasQuiz={getRespostasQuiz}
          onSubmeterQuiz={submeterQuiz}
        />
      )}
    </div>
  );
};

export default MinhasAulasPage;