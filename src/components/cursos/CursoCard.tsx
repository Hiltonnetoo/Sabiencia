// ============================================
// CURSO CARD - Card para exibição de curso
// ============================================

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Clock, Calendar, Users, Edit, Eye, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { Curso } from '../../types';
import { useMockData } from '../../contexts/MockDataContext';

interface CursoCardProps {
  curso: Curso;
  onEdit: (curso: Curso) => void;
  onView: (curso: Curso) => void;
  onToggleStatus: (curso: Curso) => void;
}

export const CursoCard: React.FC<CursoCardProps> = ({
  curso,
  onEdit,
  onView,
  onToggleStatus,
}) => {
  const { turmas, matriculas, disciplinas } = useMockData();

  // Estatísticas do curso
  const turmasAtivas = turmas.filter(t => t.curso_id === curso.id && t.ativa).length;
  const totalTurmas = turmas.filter(t => t.curso_id === curso.id).length;
  
  const alunosMatriculados = matriculas.filter(m => {
    const turma = turmas.find(t => t.id === m.turma_id);
    return turma?.curso_id === curso.id && m.status === 'ativo';
  }).length;

  const totalDisciplinas = disciplinas.filter(d => d.curso_id === curso.id).length;

  return (
    <Card className={`hover:shadow-lg transition-shadow ${!curso.ativo ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{curso.nome}</CardTitle>
              <Badge variant={curso.ativo ? 'default' : 'secondary'}>
                {curso.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {curso.descricao}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(curso)}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(curso)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleStatus(curso)}>
                {curso.ativo ? 'Desativar' : 'Ativar'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações principais */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-gray-500 text-xs">Carga Horária</p>
              <p className="font-medium">{curso.carga_horaria}h</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-gray-500 text-xs">Duração</p>
              <p className="font-medium">{curso.duracao_meses} meses</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-gray-500">Disciplinas</span>
            </div>
            <p className="text-sm font-semibold">{totalDisciplinas}</p>
          </div>

          <div className="text-center border-l">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-gray-500">Turmas</span>
            </div>
            <p className="text-sm font-semibold">
              {turmasAtivas}/{totalTurmas}
            </p>
          </div>

          <div className="text-center border-l">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-green-600" />
              <span className="text-xs text-gray-500">Alunos</span>
            </div>
            <p className="text-sm font-semibold">{alunosMatriculados}</p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(curso)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(curso)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
