// ============================================
// MATERIAL CARD - Card visual para materiais
// ============================================

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  FileText,
  Video,
  Download,
  Eye,
  Heart,
  Clock,
  Calendar,
  Trash2,
  Edit,
  ExternalLink,
  Play
} from 'lucide-react';
import type { Material } from '../../types';
import { formatFileSize, formatDuration } from '../../schemas/materialSchemas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getInitials } from '../../utils/formatters';
import { useMockData } from '../../contexts/MockDataContext';

interface MaterialCardProps {
  material: Material;
  onView?: (material: Material) => void;
  onEdit?: (material: Material) => void;
  onDelete?: (material: Material) => void;
  onDownload?: (material: Material) => void;
  onToggleFavorite?: (material: Material) => void;
  isFavorite?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onToggleFavorite,
  isFavorite = false,
  showActions = true,
  variant = 'default',
}) => {
  const { professores, disciplinas } = useMockData();
  const [imageError, setImageError] = useState(false);

  const professor = professores.find(p => p.id === material.professor_id);
  const disciplina = disciplinas.find(d => d.id === material.disciplina_id);

  const MaterialIcon = material.tipo === 'pdf' ? FileText : Video;

  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-lg ${variant === 'compact' ? 'h-full' : ''}`}>
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {material.thumbnail_url && !imageError ? (
          <img
            src={material.thumbnail_url}
            alt={material.titulo}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MaterialIcon className="h-20 w-20 text-white opacity-50" />
          </div>
        )}
        
        {/* Overlay de play para vídeos */}
        {material.tipo === 'video' && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.18)' }}
          >
            <span
              className="flex items-center justify-center rounded-full bg-white/90 shadow-lg"
              style={{ width: 56, height: 56 }}
            >
              <Play className="h-6 w-6" style={{ color: '#2563eb', fill: '#2563eb' }} />
            </span>
          </div>
        )}

        {/* Badge do Tipo */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className={material.tipo === 'pdf' ? 'bg-red-500' : 'bg-blue-500'}>
            <MaterialIcon className="h-3 w-3 mr-1" />
            {material.tipo.toUpperCase()}
          </Badge>
        </div>

        {/* Botão de Favorito */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(material);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        )}

        {/* Duração/Tamanho */}
        {material.tipo === 'video' && material.duracao_segundos && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-black/70 text-white">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(material.duracao_segundos)}
            </Badge>
          </div>
        )}
        {material.tipo === 'pdf' && material.tamanho_kb && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-black/70 text-white">
              {formatFileSize(material.tamanho_kb)}
            </Badge>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{material.titulo}</CardTitle>
        <CardDescription className="line-clamp-2">
          {material.descricao}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Disciplina e Módulo */}
        <div className="flex flex-wrap gap-2">
          {disciplina && (
            <Badge variant="outline" className="text-xs">
              {disciplina.nome}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            Módulo {material.modulo}
          </Badge>
        </div>

        {/* Tags */}
        {material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {material.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                {tag}
              </Badge>
            ))}
            {material.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                +{material.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Professor e Data */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          {professor && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={professor.foto_url} />
                <AvatarFallback className="text-xs">
                  {getInitials(professor.nome_completo)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{professor.nome_completo.split(' ')[0]}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            {format(material.data_upload, 'dd/MM/yy', { locale: ptBR })}
          </div>
        </div>
      </CardContent>

      {/* Ações */}
      {showActions && (
        <CardFooter className="flex gap-2 pt-3 border-t">
          {onView && (
            <Button
              onClick={() => onView(material)}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Eye className="h-4 w-4" />
              Ver
            </Button>
          )}
          
          {onDownload && material.permite_download && material.tipo === 'pdf' && (
            <Button
              onClick={() => onDownload(material)}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar
            </Button>
          )}

          {material.tipo === 'video' && (
            <Button
              onClick={() => window.open(material.url, '_blank')}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir
            </Button>
          )}
          
          {onEdit && (
            <Button
              onClick={() => onEdit(material)}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              onClick={() => onDelete(material)}
              variant="ghost"
              size="sm"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
