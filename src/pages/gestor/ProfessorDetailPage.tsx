// ============================================
// PROFESSOR DETAIL PAGE - Página de detalhes do professor
// ============================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMockData } from '../../contexts/MockDataContext';
import { getTurmasProfessor } from '../../utils/professorHelpers';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Edit, Mail, Phone, GraduationCap, BookOpen, Users, FileText, Plus, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { formatCPF, getInitials } from '../../utils/formatters';
import type { Professor } from '../../types';

export const ProfessorDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProfessorById, professorTurmaDisciplina, turmas, disciplinas, matriculas, materiais, cursos } = useMockData();

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('ID do professor não fornecido');
      navigate('/gestor/professores');
      return;
    }

    const professorData = getProfessorById(id);
    if (!professorData) {
      toast.error('Professor não encontrado');
      navigate('/gestor/professores');
      return;
    }

    setProfessor(professorData);
    setIsLoading(false);
  }, [id, getProfessorById, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!professor) {
    return null;
  }

  // Buscar atribuições do professor
  const atribuicoes = professorTurmaDisciplina.filter(
    p => p.professor_id === id
  );

  // Buscar turmas únicas
  const turmasIds = [...new Set(atribuicoes.map(a => a.turma_id))];
  const turmasProfessor = turmas.filter(t => turmasIds.includes(t.id));

  // Buscar disciplinas únicas
  const disciplinasIds = [...new Set(atribuicoes.map(a => a.disciplina_id))];
  const disciplinasProfessor = disciplinas.filter(d => disciplinasIds.includes(d.id));

  // Contar alunos
  const alunosIds = new Set<string>();
  turmasIds.forEach(turmaId => {
    const matriculasTemp = matriculas.filter(m => m.turma_id === turmaId);
    matriculasTemp.forEach(m => alunosIds.add(m.aluno_id));
  });

  // Contar materiais
  const materiaisCount = materiais.filter(m => m.professor_id === id).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/gestor/professores')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalhes do Professor</h1>
            <p className="text-gray-600 mt-1">Informações completas do cadastro</p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/gestor/professores/${id}/editar`)}
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
                <AvatarImage src={professor.foto_url} />
                <AvatarFallback className="text-3xl">
                  {getInitials(professor.nome_completo)}
                </AvatarFallback>
              </Avatar>
              {professor.ativo ? (
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
              )}
            </div>

            {/* Informações Principais */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{professor.nome_completo}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {formatCPF(professor.cpf)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {professor.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {professor.telefone}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-500 mb-2">Formação</p>
                <p className="font-medium">{professor.formacao}</p>
              </div>

              {professor.registro_profissional && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Registro Profissional</p>
                  <p className="font-medium">{professor.registro_profissional}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Turmas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{turmasProfessor.length}</div>
            <p className="text-xs text-gray-500 mt-1">turmas ativas</p>
          </CardContent>
        </Card>

        {/* Disciplinas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disciplinasProfessor.length}</div>
            <p className="text-xs text-gray-500 mt-1">disciplinas</p>
          </CardContent>
        </Card>

        {/* Alunos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alunosIds.size}</div>
            <p className="text-xs text-gray-500 mt-1">alunos</p>
          </CardContent>
        </Card>

        {/* Materiais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materiaisCount}</div>
            <p className="text-xs text-gray-500 mt-1">publicados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Especialidades */}
        <Card>
          <CardHeader>
            <CardTitle>Especialidades</CardTitle>
            <CardDescription>Áreas de atuação do professor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {professor.especialidades.map((esp) => (
                <Badge key={esp} variant="secondary" className="text-sm">
                  {esp}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Turmas */}
        <Card>
          <CardHeader>
            <CardTitle>Turmas</CardTitle>
            <CardDescription>Turmas que o professor leciona</CardDescription>
          </CardHeader>
          <CardContent>
            {turmasProfessor.length > 0 ? (
              <div className="space-y-2">
                {turmasProfessor.map((turma) => {
                  const curso = cursos.find(c => c.id === turma.curso_id);
                  return (
                    <div
                      key={turma.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{turma.nome}</p>
                        <p className="text-sm text-gray-600">{curso?.nome}</p>
                      </div>
                      <Badge variant="outline">{turma.periodo}</Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma turma atribuída</p>
            )}
          </CardContent>
        </Card>

        {/* Disciplinas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Disciplinas</CardTitle>
            <CardDescription>Disciplinas que o professor ministra</CardDescription>
          </CardHeader>
          <CardContent>
            {disciplinasProfessor.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2">
                {disciplinasProfessor.map((disciplina) => {
                  const curso = cursos.find(c => c.id === disciplina.curso_id);
                  return (
                    <div
                      key={disciplina.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <p className="font-medium">{disciplina.nome}</p>
                      <p className="text-sm text-gray-600">{curso?.nome}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {disciplina.carga_horaria}h
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma disciplina atribuída</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorDetailPage;