// ============================================
// GESTOR DASHBOARD - Dashboard principal do gestor
// OTIMIZADO: Com useMemo para prevenir recálculos desnecessários
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  AlertCircle,
  UserPlus,
  ArrowRight,
  Calendar,
  BookOpen,
  FileText
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { useDashboardStats } from '../../hooks/useDashboardStats';

export const GestorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { estatisticas, ultimasMatriculas, ultimosComunicados, alunos, turmas } = useDashboardStats();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Alunos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalAlunos}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{estatisticas.novosAlunosMes} este mês
            </p>
          </CardContent>
        </Card>

        {/* Total Professores */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.totalProfessores}</div>
            <p className="text-xs text-gray-500 mt-1">
              {estatisticas.totalTurmas} turmas ativas
            </p>
          </CardContent>
        </Card>

        {/* Frequência Geral */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequência Geral</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.frequenciaGeral.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">
              Últimos 60 dias
            </p>
          </CardContent>
        </Card>

        {/* Financeiro */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(estatisticas.totalReceber)}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {estatisticas.pagamentosVencidos} vencidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Informações */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Últimas Matrículas */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Matrículas</CardTitle>
            <CardDescription>Novos alunos matriculados recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ultimasMatriculas.map(matricula => {
                const aluno = alunos.find(a => a.id === matricula.aluno_id);
                const turma = turmas.find(t => t.id === matricula.turma_id);
                
                if (!aluno || !turma) return null;

                return (
                  <div key={matricula.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{aluno.nome_completo}</p>
                        <p className="text-xs text-gray-500">{turma.nome}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {matricula.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(matricula.data_matricula)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/gestor/alunos')}
            >
              Ver todos os alunos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Últimos Comunicados */}
        <Card>
          <CardHeader>
            <CardTitle>Comunicados Recentes</CardTitle>
            <CardDescription>Últimas mensagens enviadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ultimosComunicados.map(comunicado => (
                <div key={comunicado.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm">{comunicado.titulo}</h4>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(comunicado.data_envio)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {comunicado.mensagem}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {comunicado.destinatarios.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/gestor/comunicados')}
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
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/gestor/alunos')}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/gestor/professores')}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Professores
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/gestor/comunicados')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Enviar Comunicado
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/gestor/relatorios')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/gestor/financeiro')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Ver Financeiro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestorDashboard;
