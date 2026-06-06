import React from 'react';
import { Turma, Curso } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate } from '../../utils/formatters';
import { 
  Calendar, 
  Clock,
  Users,
  BookOpen,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';

interface TurmaCardProps {
  turma: Turma;
  curso?: Curso;
  totalAlunos?: number;
  onView?: (turma: Turma) => void;
  onEdit?: (turma: Turma) => void;
  onDelete?: (turma: Turma) => void;
}

export function TurmaCard({ 
  turma, 
  curso,
  totalAlunos = 0,
  onView,
  onEdit,
  onDelete 
}: TurmaCardProps) {
  
  const getPeriodoBadge = (periodo: string) => {
    const configs = {
      manha: { label: 'Manhã', color: 'bg-yellow-100 text-yellow-700' },
      tarde: { label: 'Tarde', color: 'bg-orange-100 text-orange-700' },
      noite: { label: 'Noite', color: 'bg-indigo-100 text-indigo-700' },
      integral: { label: 'Integral', color: 'bg-purple-100 text-purple-700' },
    };
    
    const config = configs[periodo as keyof typeof configs];
    
    return (
      <Badge className={`${config.color}`}>
        <Clock className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const isAtiva = turma.ativa && new Date(turma.data_fim) > new Date();
  const isFinalizada = new Date(turma.data_fim) < new Date();

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{turma.nome}</h3>
            </div>
            
            {curso && (
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{curso.nome}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {getPeriodoBadge(turma.periodo)}
              {isAtiva ? (
                <Badge className="bg-green-100 text-green-700">Ativa</Badge>
              ) : isFinalizada ? (
                <Badge className="bg-gray-100 text-gray-700">Finalizada</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700">Inativa</Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-600">{totalAlunos}</span>
          </div>
        </div>

        {/* Informações */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Início</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(turma.data_inicio)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Término</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(turma.data_fim)}
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 pt-4 border-t">
          {onView && (
            <Button 
              onClick={() => onView(turma)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          )}

          {onEdit && (
            <Button 
              onClick={() => onEdit(turma)}
              variant="outline"
              size="sm"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}

          {onDelete && (
            <Button 
              onClick={() => onDelete(turma)}
              variant="ghost"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
