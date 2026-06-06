// ============================================
// OBSERVACAO CARD - Card de observação
// ============================================

import { Eye, EyeOff, FileText, Heart, Briefcase, Edit, Trash2, User, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { Observacao, Aluno, Professor, Disciplina } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ObservacaoCardProps {
  observacao: Observacao;
  aluno?: Aluno;
  professor?: Professor;
  disciplina?: Disciplina;
  onEdit?: (observacao: Observacao) => void;
  onDelete?: (observacao: Observacao) => void;
  showActions?: boolean;
  showStudent?: boolean;
}

const tipoConfig = {
  pedagogica: {
    label: 'Pedagógica',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800'
  },
  comportamental: {
    label: 'Comportamental',
    icon: Heart,
    color: 'bg-green-100 text-green-800'
  },
  administrativa: {
    label: 'Administrativa',
    icon: Briefcase,
    color: 'bg-purple-100 text-purple-800'
  }
};

export function ObservacaoCard({
  observacao,
  aluno,
  professor,
  disciplina,
  onEdit,
  onDelete,
  showActions = true,
  showStudent = true
}: ObservacaoCardProps) {
  const config = tipoConfig[observacao.tipo];
  const Icon = config.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${config.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={config.color}>{config.label}</Badge>
                {observacao.visivel_aluno ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Eye className="w-3 h-3 mr-1" />
                    Visível
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Oculta
                  </Badge>
                )}
              </div>
              {showStudent && aluno && (
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="truncate">{aluno.nome_completo}</span>
                </div>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex gap-1 shrink-0">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(observacao)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(observacao)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-gray-700 whitespace-pre-wrap">{observacao.conteudo}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-4 text-sm text-gray-500 w-full">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="truncate">
              {professor?.nome_completo || 'Professor não encontrado'}
            </span>
          </div>
          {disciplina && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="truncate">{disciplina.nome}</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(observacao.created_at)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
