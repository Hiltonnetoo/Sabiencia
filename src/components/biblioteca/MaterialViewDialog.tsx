// ============================================
// MATERIAL VIEW DIALOG - Dialog para visualizar material
// ============================================

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { YouTubePlayer } from './YouTubePlayer';
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Video,
  Calendar,
  Clock,
  Tag,
  BookOpen,
  User
} from 'lucide-react';
import type { Material } from '../../types';
import { formatFileSize, formatDuration } from '../../schemas/materialSchemas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getInitials } from '../../utils/formatters';
import { useMockData } from '../../contexts/MockDataContext';

interface MaterialViewDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (material: Material) => void;
}

export const MaterialViewDialog: React.FC<MaterialViewDialogProps> = ({
  material,
  open,
  onOpenChange,
  onDownload,
}) => {
  const { professores, disciplinas } = useMockData();

  if (!material) return null;

  const professor = professores.find(p => p.id === material.professor_id);
  const disciplina = disciplinas.find(d => d.id === material.disciplina_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${material.tipo === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}`}>
              {material.tipo === 'pdf' ? (
                <FileText className={`h-6 w-6 ${material.tipo === 'pdf' ? 'text-red-600' : 'text-blue-600'}`} />
              ) : (
                <Video className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{material.titulo}</DialogTitle>
              <DialogDescription className="mt-2">
                {material.descricao}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Player de Vídeo ou Thumbnail de PDF */}
          {material.tipo === 'video' ? (
            <YouTubePlayer url={material.url ?? ''} title={material.titulo} />
          ) : material.thumbnail_url ? (
            <img
              src={material.thumbnail_url}
              alt={material.titulo}
              className="w-full rounded-lg border"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FileText className="h-32 w-32 text-white opacity-50" />
            </div>
          )}

          <Separator />

          {/* Informações */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Disciplina */}
            {disciplina && (
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Disciplina</p>
                  <p className="font-medium">{disciplina.nome}</p>
                </div>
              </div>
            )}

            {/* Módulo */}
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Módulo</p>
                <p className="font-medium">{material.modulo}</p>
              </div>
            </div>

            {/* Professor */}
            {professor && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={professor.foto_url} />
                    <AvatarFallback className="text-xs">
                      {getInitials(professor.nome_completo)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-gray-500">Professor</p>
                    <p className="font-medium">{professor.nome_completo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Data de Upload */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Data de Upload</p>
                <p className="font-medium">
                  {format(material.data_upload, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>

            {/* Duração ou Tamanho */}
            {material.tipo === 'video' && material.duracao_segundos && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Duração</p>
                  <p className="font-medium">{formatDuration(material.duracao_segundos)}</p>
                </div>
              </div>
            )}

            {material.tipo === 'pdf' && material.tamanho_kb && (
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Tamanho</p>
                  <p className="font-medium">{formatFileSize(material.tamanho_kb)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {material.tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {material.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Ações */}
          <div className="flex gap-3">
            {material.tipo === 'pdf' && material.permite_download && onDownload && (
              <Button
                onClick={() => onDownload(material)}
                className="flex-1 gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar PDF
              </Button>
            )}

            <Button
              onClick={() => window.open(material.url, '_blank')}
              variant={material.tipo === 'pdf' ? 'outline' : 'default'}
              className={`${material.tipo === 'pdf' && onDownload ? 'flex-1' : 'flex-1'} gap-2`}
            >
              <ExternalLink className="h-4 w-4" />
              {material.tipo === 'pdf' ? 'Abrir em Nova Aba' : 'Abrir no YouTube'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
