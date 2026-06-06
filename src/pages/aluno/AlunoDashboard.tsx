// ============================================
// ALUNO DASHBOARD - Dashboard do aluno
// OTIMIZADO: Com useMemo para prevenir recálculos desnecessários
// ============================================

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  BookOpen, 
  FileCheck,
  Calendar,
  DollarSign,
  ArrowRight,
  Video,
  FileText,
  Award,
  AlertCircle,
  CheckCircle,
  Bell
} from 'lucide-react';
import { mockData } from '../../data/mockData';
import { 
  calculateFrequenciaPercentual, 
  calculateMedia,
  calculateSituacao,
  calculateProgressBetweenDates
} from '../../utils/calculations';
import { formatCurrency, formatDate, formatRelativeTime, formatPercent } from '../../utils/formatters';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';

export const AlunoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  // OTIMIZADO: Memoizar cálculos para prevenir recálculos em cada render
  const dadosAluno = useMemo(() => {
    // Encontrar matrícula do aluno
    const matricula = mockData.matriculas.find(m => m.aluno_id === user.id);
    const turma = matricula ? mockData.turmas.find(t => t.id === matricula.turma_id) : null;
    const curso = turma ? mockData.cursos.find(c => c.id === turma.curso_id) : null;

    // Disciplinas do curso
    const disciplinasCurso = curso 
      ? mockData.disciplinas.filter(d => d.curso_id === curso.id)
      : [];

    // Notas do aluno
    const minhasNotas = mockData.notas.filter(n => n.aluno_id === user.id);
    
    // Calcular média geral
    const mediaGeral = minhasNotas.length > 0 ? calculateMedia(minhasNotas) : 0;
    const situacao = calculateSituacao(mediaGeral);

    // Frequência do aluno
    const minhaFrequencia = mockData.frequencias.filter(f => f.aluno_id === user.id);
    const percentualFrequencia = calculateFrequenciaPercentual(minhaFrequencia);

    // Materiais disponíveis
    const materiaisDisponiveis = mockData.materiais.filter(m => 
      disciplinasCurso.some(d => d.id === m.disciplina_id) && m.visivel_alunos
    );

    // Pagamentos
    const meusPagamentos = mockData.pagamentos.filter(p => p.aluno_id === user.id);
    const pagamentosPendentes = meusPagamentos.filter(p => 
      p.status === 'pendente' || p.status === 'vencido'
    );
    const proximoPagamento = [...pagamentosPendentes].sort((a, b) => 
      new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime()
    )[0];

    // Comunicados
    const comunicadosParaMim = [...mockData.comunicados]
      .filter(c => 
        c.destinatarios === 'todos_alunos' || 
        (c.destinatarios === 'turma_especifica' && c.turma_id === matricula?.turma_id)
      )
      .sort((a, b) => new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime())
      .slice(0, 3);

    // Progresso do curso
    const progressoCurso = turma 
      ? calculateProgressBetweenDates(turma.data_inicio, turma.data_fim)
      : 0;

    return {
      matricula,
      turma,
      curso,
      disciplinasCurso,
      minhasNotas,
      mediaGeral,
      situacao,
      minhaFrequencia,
      percentualFrequencia,
      materiaisDisponiveis,
      meusPagamentos,
      pagamentosPendentes,
      proximoPagamento,
      comunicadosParaMim,
      progressoCurso
    };
  }, [user.id]);

  const {
    matricula,
    turma,
    curso,
    disciplinasCurso,
    minhasNotas,
    mediaGeral,
    situacao,
    minhaFrequencia,
    percentualFrequencia,
    materiaisDisponiveis,
    meusPagamentos,
    pagamentosPendentes,
    proximoPagamento,
    comunicadosParaMim,
    progressoCurso
  } = dadosAluno;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {user.nome_completo.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {curso?.nome} - {turma?.nome}
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Média Geral */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaGeral.toFixed(1)}</div>
            <div className="flex items-center gap-1 mt-1">
              {situacao === 'aprovado' ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertCircle className="h-3 w-3 text-yellow-600" />
              )}
              <p className={`text-xs ${
                situacao === 'aprovado' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {situacao === 'aprovado' ? 'Aprovado' : 'Recuperação'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Frequência */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequência</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentualFrequencia.toFixed(1)}%</div>
            <p className={`text-xs mt-1 ${
              percentualFrequencia >= 75 ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentualFrequencia >= 75 ? 'Dentro do mínimo' : 'Abaixo do mínimo'}
            </p>
          </CardContent>
        </Card>

        {/* Materiais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materiaisDisponiveis.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Disponíveis para download
            </p>
          </CardContent>
        </Card>

        {/* Financeiro */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Pagamento</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proximoPagamento ? formatCurrency(proximoPagamento.valor) : '-'}
            </div>
            <p className={`text-xs mt-1 ${
              proximoPagamento?.status === 'vencido' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {proximoPagamento 
                ? `Venc: ${formatDate(proximoPagamento.data_vencimento)}`
                : 'Nenhum pendente'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso do Curso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progresso do Curso</CardTitle>
              <CardDescription>{curso?.nome}</CardDescription>
            </div>
            <Badge variant="secondary">{formatPercent(progressoCurso)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressoCurso} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Início: {turma && formatDate(turma.data_inicio)}</span>
            <span>Término: {turma && formatDate(turma.data_fim)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Informações */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Desempenho por Disciplina */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Disciplina</CardTitle>
            <CardDescription>Suas notas nas disciplinas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disciplinasCurso.slice(0, 5).map(disciplina => {
                const notasDisciplina = minhasNotas.filter(n => n.disciplina_id === disciplina.id);
                const media = notasDisciplina.length > 0 ? calculateMedia(notasDisciplina) : 0;
                const sit = calculateSituacao(media);

                return (
                  <div key={disciplina.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{disciplina.nome}</span>
                      <Badge 
                        variant={sit === 'aprovado' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {media.toFixed(1)}
                      </Badge>
                    </div>
                    <Progress 
                      value={(media / 10) * 100} 
                      className={`h-2 ${
                        sit === 'aprovado' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/aluno/notas')}
            >
              Ver todas as notas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Comunicados */}
        <Card>
          <CardHeader>
            <CardTitle>Comunicados</CardTitle>
            <CardDescription>Mensagens da escola</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {comunicadosParaMim.map(comunicado => (
                <div 
                  key={comunicado.id} 
                  className="border-b last:border-0 pb-3 last:pb-0 cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                  onClick={() => navigate('/aluno/comunicados')}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm">{comunicado.titulo}</h4>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(comunicado.data_envio)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {comunicado.mensagem}
                  </p>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/aluno/comunicados')}
            >
              Ver todos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
          <CardDescription>Navegue rapidamente pelas funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/aluno/aulas')}
            >
              <Video className="h-4 w-4 mr-2" />
              Assistir Aulas
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/aluno/materiais')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Baixar Materiais
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/aluno/notas')}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Ver Notas
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/aluno/financeiro')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pagamentos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlunoDashboard;
