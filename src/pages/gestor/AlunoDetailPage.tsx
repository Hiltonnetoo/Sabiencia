// ============================================
// ALUNO DETAIL PAGE - Página de detalhes do aluno
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, User, GraduationCap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCPF, getInitials } from '../../utils/formatters';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import type { Aluno, Matricula } from '../../types';

export const AlunoDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getAlunoById, matriculas, turmas, cursos, frequencias, notas, pagamentos } = useMockData();

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [matricula, setMatricula] = useState<Matricula | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('ID do aluno não fornecido');
      navigate('/gestor/alunos');
      return;
    }

    const alunoData = getAlunoById(id);
    if (!alunoData) {
      toast.error('Aluno não encontrado');
      navigate('/gestor/alunos');
      return;
    }

    setAluno(alunoData);

    // Buscar matrícula
    const matriculaData = matriculas.find(m => m.aluno_id === id);
    setMatricula(matriculaData || null);

    setIsLoading(false);
  }, [id, getAlunoById, navigate, matriculas]);

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

  if (!aluno) {
    return null;
  }

  // Buscar informações relacionadas
  const turma = matricula ? turmas.find(t => t.id === matricula.turma_id) : null;
  const curso = turma ? cursos.find(c => c.id === turma.curso_id) : null;

  // Calcular estatísticas
  const studentFrequencias = frequencias.filter(f => f.aluno_id === id);
  const presencas = studentFrequencias.filter(f => f.status === 'presente').length;
  const frequenciaPercentual = studentFrequencias.length > 0 
    ? Math.round((presencas / studentFrequencias.length) * 100)
    : 0;

  const studentNotas = notas.filter(n => n.aluno_id === id);
  const mediaGeral = studentNotas.length > 0
    ? studentNotas.reduce((acc, n) => acc + n.nota, 0) / studentNotas.length
    : 0;

  const studentPagamentos = pagamentos.filter(p => p.aluno_id === id);
  const pagamentosPendentes = studentPagamentos.filter(p => p.status === 'pendente').length;
  const pagamentosVencidos = studentPagamentos.filter(p => p.status === 'vencido').length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb customLabel={aluno.nome_completo} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/gestor/alunos')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalhes do Aluno</h1>
            <p className="text-gray-600 mt-1">Informações completas do cadastro</p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/gestor/alunos/${id}/editar`)}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Card Principal - Foto e Dados Básicos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-32 w-32">
                <AvatarImage src={aluno.foto_url} />
                <AvatarFallback className="text-3xl">
                  {getInitials(aluno.nome_completo)}
                </AvatarFallback>
              </Avatar>
              {matricula && <StatusBadge status={matricula.status} />}
            </div>

            {/* Informações Principais */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{aluno.nome_completo}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {formatCPF(aluno.cpf)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {aluno.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {aluno.telefone}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                {/* Curso */}
                {curso && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <GraduationCap className="h-4 w-4" />
                      Curso
                    </div>
                    <p className="font-medium">{curso.nome}</p>
                  </div>
                )}

                {/* Turma */}
                {turma && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <BookOpen className="h-4 w-4" />
                      Turma
                    </div>
                    <p className="font-medium">{turma.nome}</p>
                  </div>
                )}

                {/* Data de Matrícula */}
                {matricula && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4" />
                      Matrícula
                    </div>
                    <p className="font-medium">
                      {format(matricula.data_matricula, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Frequência */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Frequência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frequenciaPercentual}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {presencas} de {studentFrequencias.length} aulas
            </p>
          </CardContent>
        </Card>

        {/* Média Geral */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaGeral.toFixed(1)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {studentNotas.length} avaliações
            </p>
          </CardContent>
        </Card>

        {/* Pagamentos Pendentes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pend. Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagamentosPendentes}</div>
            <p className="text-xs text-gray-500 mt-1">
              {pagamentosVencidos} vencidos
            </p>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aluno.ativo ? (
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">RG</p>
              <p className="font-medium">{aluno.rg || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data de Nascimento</p>
              <p className="font-medium">
                {format(aluno.data_nascimento, 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sexo</p>
              <p className="font-medium">
                {aluno.sexo === 'M' ? 'Masculino' : aluno.sexo === 'F' ? 'Feminino' : aluno.sexo || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado Civil</p>
              <p className="font-medium">{aluno.estado_civil || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Responsável */}
        <Card>
          <CardHeader>
            <CardTitle>Responsável</CardTitle>
            <CardDescription>Informações do responsável (se menor de idade)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{aluno.nome_responsavel || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{aluno.telefone_responsavel || '-'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            {aluno.endereco ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">
                    {aluno.endereco.rua}, {aluno.endereco.numero}
                    {aluno.endereco.complemento && ` - ${aluno.endereco.complemento}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {aluno.endereco.bairro} - {aluno.endereco.cidade}/{aluno.endereco.estado}
                  </p>
                  <p className="text-sm text-gray-600">CEP: {aluno.endereco.cep}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Nenhum endereço cadastrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlunoDetailPage;
