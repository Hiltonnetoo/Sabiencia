// ============================================
// PROFESSOR DASHBOARD - Dashboard do professor
// OTIMIZADO: useMemo + Map O(1) para prevenir O(N²) em lookups
// ============================================

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  BookOpen,
  FileCheck,
  Calendar,
  ArrowRight,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';
import { mockData } from '../../data/mockData';
import { calculateFrequenciaPercentual, calculateMedia } from '../../utils/calculations';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';

export const ProfessorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  // Mapas O(1) memoizados — evitam O(N²) nos lookups de render
  const dadosProfessor = useMemo(() => {
    // Construir Maps para lookup O(1)
    const turmasMap      = new Map(mockData.turmas.map(t => [t.id, t]));
    const disciplinasMap = new Map(mockData.disciplinas.map(d => [d.id, d]));
    const alunosMap      = new Map(mockData.alunos.map(a => [a.id, a]));
    const cursosMap      = new Map(mockData.cursos.map(c => [c.id, c]));

    // Pré-computar contagem de alunos ativos por turma (O(matriculas))
    const alunosPorTurmaMap = new Map<string, number>();
    for (const m of mockData.matriculas) {
      if (m.status === 'ativo') {
        alunosPorTurmaMap.set(m.turma_id, (alunosPorTurmaMap.get(m.turma_id) || 0) + 1);
      }
    }

    const minhasAtribuicoes = mockData.professorTurmaDisciplina.filter(
      ptd => ptd.professor_id === user.id
    );

    const minhasTurmaIds = new Set(minhasAtribuicoes.map(a => a.turma_id));

    const minhasTurmas = [...minhasTurmaIds]
      .map(turmaId => turmasMap.get(turmaId))
      .filter(Boolean);

    const minhasDisciplinas = [...new Set(minhasAtribuicoes.map(a => a.disciplina_id))]
      .map(discId => disciplinasMap.get(discId))
      .filter(Boolean);

    const meusAlunos = mockData.matriculas
      .filter(m => minhasTurmaIds.has(m.turma_id) && m.status === 'ativo')
      .map(m => alunosMap.get(m.aluno_id))
      .filter(Boolean);

    const meusMateriais = mockData.materiais.filter(m => m.professor_id === user.id);

    const minhasObservacoes = [...mockData.observacoes]
      .filter(o => o.professor_id === user.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    const totalObservacoes = mockData.observacoes.filter(o => o.professor_id === user.id).length;

    const comunicados = [...mockData.comunicados]
      .filter(c => c.remetente_id === user.id)
      .sort((a, b) => new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime())
      .slice(0, 3);

    return {
      minhasTurmas,
      minhasDisciplinas,
      meusAlunos,
      meusMateriais,
      minhasObservacoes,
      totalObservacoes,
      comunicados,
      cursosMap,
      alunosMap,
      alunosPorTurmaMap,
    };
  }, [user.id]);

  const {
    minhasTurmas,
    minhasDisciplinas,
    meusAlunos,
    meusMateriais,
    minhasObservacoes,
    totalObservacoes,
    comunicados,
    cursosMap,
    alunosMap,
    alunosPorTurmaMap,
  } = dadosProfessor;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, Professor(a)!</h1>
        <p className="text-gray-500 mt-1">Visão geral das suas turmas e atividades</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Minhas Turmas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minhas Turmas</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minhasTurmas.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {meusAlunos.length} alunos no total
            </p>
          </CardContent>
        </Card>

        {/* Disciplinas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minhasDisciplinas.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Que você leciona
            </p>
          </CardContent>
        </Card>

        {/* Materiais */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meusMateriais.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Materiais postados
            </p>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Observações</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObservacoes}</div>
            <p className="text-xs text-gray-500 mt-1">
              Registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Minhas Turmas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Minhas Turmas</CardTitle>
            <CardDescription>Turmas onde você leciona</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {minhasTurmas.slice(0, 4).map(turma => {
                if (!turma) return null;

                // O(1) via Map — sem find() no render
                const curso = cursosMap.get(turma.curso_id);
                const alunosTurma = alunosPorTurmaMap.get(turma.id) || 0;

                return (
                  <div
                    key={turma.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/professor/turmas')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{turma.nome}</p>
                        <p className="text-xs text-gray-500">{curso?.nome}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{alunosTurma} alunos</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate('/professor/turmas')}
            >
              Ver todas as turmas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Últimas Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações Recentes</CardTitle>
            <CardDescription>Últimas anotações sobre alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {minhasObservacoes.map(obs => {
                // O(1) via Map — sem find() no render
                const aluno = alunosMap.get(obs.aluno_id);
                if (!aluno) return null;

                return (
                  <div key={obs.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{aluno.nome_completo}</p>
                      <Badge variant="outline" className="text-xs">
                        {obs.tipo}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                      {obs.conteudo}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(obs.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate('/professor/observacoes')}
            >
              Ver todas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate('/professor/notas')}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Lançar Notas
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate('/professor/frequencia')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Registrar Frequência
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate('/professor/materiais')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Adicionar Material
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate('/professor/comunicados')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar Comunicado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;
