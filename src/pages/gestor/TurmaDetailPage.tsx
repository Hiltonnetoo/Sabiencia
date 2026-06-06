// ============================================
// TURMA DETAIL PAGE - Detalhes da Turma (Gestor)
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { ArrowLeft, Calendar, Users, GraduationCap, Clock, Award, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCPF, getInitials } from '../../utils/formatters';

export const TurmaDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { turmas, cursos, alunos } = useMockData();

  const [turma, setTurma] = useState<any>(null);
  const [curso, setCurso] = useState<any>(null);
  const [alunosTurma, setAlunosTurma] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('ID da turma não fornecido');
      navigate('/gestor/turmas');
      return;
    }

    const turmaData = turmas.find(t => t.id === id);
    if (!turmaData) {
      toast.error('Turma não encontrada');
      navigate('/gestor/turmas');
      return;
    }

    setTurma(turmaData);

    // Buscar curso correspondente
    const cursoData = cursos.find(c => c.id === turmaData.curso_id);
    setCurso(cursoData || null);

    // Filtrar alunos matriculados nesta turma
    const alunosData = alunos.filter(a => a.turma_id === id);
    setAlunosTurma(alunosData);

    setIsLoading(false);
  }, [id, turmas, cursos, alunos, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!turma) {
    return null;
  }

  const isAtiva = turma.ativa && new Date(turma.data_fim) > new Date();

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb customLabel={turma.nome} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/gestor/turmas')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{turma.nome}</h1>
            <p className="text-gray-600 mt-1">Gerenciamento e informações da turma</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isAtiva ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inativa</Badge>
          )}
        </div>
      </div>

      {/* Resumo da Turma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Dados da Turma
          </CardTitle>
          <CardDescription>Informações básicas de vinculação e cronograma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <span className="text-sm text-gray-500 block mb-1">Curso Vinculado</span>
              <p className="font-semibold text-gray-900">{curso?.nome || 'Não associado'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 block mb-1">Período/Turno</span>
              <p className="font-semibold text-gray-900 capitalize">{turma.periodo}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500 block mb-1">Início das Aulas</span>
              <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                {format(new Date(turma.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 block mb-1">Fim das Aulas</span>
              <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                {format(new Date(turma.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Matriculados</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alunosTurma.length}</div>
            <p className="text-xs text-gray-500 mt-1">Capacidade total ativa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Período Vigente</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{turma.periodo}</div>
            <p className="text-xs text-gray-500 mt-1">Horário de aulas padrão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificação Estimada</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1200h</div>
            <p className="text-xs text-gray-500 mt-1">Carga horária total estimada</p>
          </CardContent>
        </Card>
      </div>

      {/* Listagem de Alunos da Turma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Alunos Matriculados ({alunosTurma.length})
          </CardTitle>
          <CardDescription>Estudantes pertencentes a esta turma</CardDescription>
        </CardHeader>
        <CardContent>
          {alunosTurma.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum aluno matriculado nesta turma ainda.</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunosTurma.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={aluno.foto_url} />
                          <AvatarFallback className="text-xs">
                            {getInitials(aluno.nome_completo)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{aluno.nome_completo}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatCPF(aluno.cpf)}</TableCell>
                      <TableCell className="text-sm text-gray-600">{aluno.email}</TableCell>
                      <TableCell>
                        {aluno.ativo ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/gestor/alunos/${aluno.id}`)}
                        >
                          Ver Perfil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TurmaDetailPage;
