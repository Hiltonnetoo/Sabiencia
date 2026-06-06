import React from 'react';
import { Disciplina, Curso } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  BookOpen,
  Clock,
  Eye,
  Pencil,
  Trash2,
  ListOrdered
} from 'lucide-react';

interface DisciplinaCardProps {
  disciplina: Disciplina;
  curso?: Curso;
  onView?: (disciplina: Disciplina) => void;
  onEdit?: (disciplina: Disciplina) => void;
  onDelete?: (disciplina: Disciplina) => void;
}

export function DisciplinaCard({ 
  disciplina, 
  curso,
  onView,
  onEdit,
  onDelete 
}: DisciplinaCardProps) {
  
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{disciplina.nome}</h3>
              <Badge className="bg-blue-100 text-blue-700">
                <ListOrdered className="w-3 h-3 mr-1" />
                {disciplina.ordem}º
              </Badge>
            </div>
            
            {curso && (
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{curso.nome}</p>
              </div>
            )}

            <p className="text-sm text-gray-600 line-clamp-2">
              {disciplina.descricao}
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-600">{disciplina.carga_horaria}h</span>
          </div>
        </div>

        {/* Ementa */}
        {disciplina.ementa && (
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-1">Ementa</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {disciplina.ementa}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-2 pt-4 border-t">
          {onView && (
            <Button 
              onClick={() => onView(disciplina)}
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
              onClick={() => onEdit(disciplina)}
              variant="outline"
              size="sm"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}

          {onDelete && (
            <Button 
              onClick={() => onDelete(disciplina)}
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
