// ============================================
// MATERIAL UPLOAD FORM - Formulário de upload de material
// ============================================

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { 
  materialSchema, 
  type MaterialFormData,
  extractYouTubeID,
  getYouTubeThumbnail,
  isValidYouTubeURL
} from '../../schemas/materialSchemas';
import { Loader2, X, FileText, Video, Link as LinkIcon, Upload } from 'lucide-react';
import type { Material } from '../../types';
import { useMockData } from '../../contexts/MockDataContext';
import { LoadingButton } from '../shared/LoadingButton';

interface MaterialUploadFormProps {
  material?: Material;
  onSubmit: (data: MaterialFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MaterialUploadForm: React.FC<MaterialUploadFormProps> = ({
  material,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { disciplinas } = useMockData();
  const [tagsInput, setTagsInput] = useState('');
  const [previewThumbnail, setPreviewThumbnail] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: material ? {
      titulo: material.titulo,
      descricao: material.descricao,
      tipo: material.tipo,
      disciplina_id: material.disciplina_id,
      modulo: material.modulo,
      url: material.url,
      thumbnail_url: material.thumbnail_url,
      tamanho_kb: material.tamanho_kb,
      duracao_segundos: material.duracao_segundos,
      tags: material.tags,
      visivel_para_alunos: material.visivel_para_alunos,
      permite_download: material.permite_download,
    } : {
      tipo: 'pdf',
      tags: [],
      visivel_para_alunos: true,
      permite_download: true,
    },
  });

  const tipo = watch('tipo');
  const url = watch('url');
  const tags = watch('tags') || [];
  const visivel_para_alunos = watch('visivel_para_alunos');
  const permite_download = watch('permite_download');

  // Auto-gerar thumbnail do YouTube
  useEffect(() => {
    if (tipo === 'video' && url) {
      const videoId = extractYouTubeID(url);
      if (videoId) {
        const thumbnail = getYouTubeThumbnail(videoId);
        setValue('thumbnail_url', thumbnail);
        setPreviewThumbnail(thumbnail);
      }
    }
  }, [tipo, url, setValue]);

  // Adicionar tag
  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setValue('tags', [...tags, trimmedTag]);
    }
    setTagsInput('');
  };

  // Remover tag
  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(t => t !== tagToRemove));
  };

  // Sugestões de módulos
  const modulosSugeridos = [
    'Módulo 1 - Introdução',
    'Módulo 2 - Fundamentos',
    'Módulo 3 - Intermediário',
    'Módulo 4 - Avançado',
    'Módulo 5 - Prática',
    'Material Complementar',
    'Revisão',
    'Avaliação',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Dados principais do material</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo */}
          <div>
            <Label htmlFor="tipo">
              Tipo de Material <span className="text-red-500">*</span>
            </Label>
            <Select
              value={tipo}
              onValueChange={(value) => setValue('tipo', value as 'pdf' | 'video')}
            >
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Vídeo (YouTube)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div>
            <Label htmlFor="titulo">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titulo"
              {...register('titulo')}
              placeholder="Ex: Aula 01 - Introdução à Enfermagem"
            />
            {errors.titulo && (
              <p className="text-sm text-red-500 mt-1">{errors.titulo.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Descreva o conteúdo do material..."
              rows={4}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500 mt-1">{errors.descricao.message}</p>
            )}
          </div>

          {/* Disciplina e Módulo */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="disciplina_id">
                Disciplina <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch('disciplina_id')}
                onValueChange={(value) => setValue('disciplina_id', value)}
              >
                <SelectTrigger id="disciplina_id">
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas
                    .filter(disc => disc?.id && disc.id.trim() !== '')
                    .map(disc => (
                      <SelectItem key={disc.id} value={disc.id}>
                        {disc.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.disciplina_id && (
                <p className="text-sm text-red-500 mt-1">{errors.disciplina_id.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="modulo">
                Módulo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="modulo"
                {...register('modulo')}
                placeholder="Ex: Módulo 1"
                list="modulos-sugeridos"
              />
              <datalist id="modulos-sugeridos">
                {modulosSugeridos.map((mod, idx) => (
                  <option key={idx} value={mod} />
                ))}
              </datalist>
              {errors.modulo && (
                <p className="text-sm text-red-500 mt-1">{errors.modulo.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: ARQUIVO/LINK */}
      <Card>
        <CardHeader>
          <CardTitle>
            {tipo === 'pdf' ? 'Link do PDF' : 'Link do YouTube'}
          </CardTitle>
          <CardDescription>
            {tipo === 'pdf' 
              ? 'Cole o link direto do arquivo PDF (Google Drive, Dropbox, etc.)'
              : 'Cole o link do vídeo no YouTube'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload de Arquivo (PDF) */}
          {tipo === 'pdf' && (
            <div>
              <Label htmlFor="file-upload">
                Fazer Upload do PDF <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 flex items-center gap-4">
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Arquivo
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploading(true);
                      setUploadProgress(0);
                      
                      // Simular upload (em produção, usar Supabase Storage)
                      const interval = setInterval(() => {
                        setUploadProgress((prev) => {
                          if (prev >= 100) {
                            clearInterval(interval);
                            setIsUploading(false);
                            return 100;
                          }
                          return prev + 10;
                        });
                      }, 200);
                      
                      // Simular URL do arquivo
                      setTimeout(() => {
                        setValue('url', `https://exemplo.com/pdfs/${file.name}`);
                        setValue('tamanho_kb', Math.round(file.size / 1024));
                      }, 2100);
                    }
                  }}
                />
              </div>
              
              {/* Barra de Progresso */}
              {isUploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fazendo upload...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          )}

          {/* URL Manual (alternativa) */}
          <div>
            <Label htmlFor="url">
              {tipo === 'pdf' ? 'ou Cole o Link do PDF' : 'Link do YouTube'} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="url"
                {...register('url')}
                placeholder={
                  tipo === 'pdf' 
                    ? 'https://drive.google.com/file/...' 
                    : 'https://www.youtube.com/watch?v=...'
                }
                className="pl-10"
                disabled={isUploading}
              />
            </div>
            {errors.url && (
              <p className="text-sm text-red-500 mt-1">{errors.url.message}</p>
            )}
            {tipo === 'video' && url && !isValidYouTubeURL(url) && (
              <p className="text-sm text-orange-500 mt-1">
                Certifique-se de que é um link válido do YouTube
              </p>
            )}
          </div>

          {/* Preview da Thumbnail (YouTube) */}
          {tipo === 'video' && previewThumbnail && (
            <div>
              <Label>Preview da Thumbnail</Label>
              <img
                src={previewThumbnail}
                alt="Thumbnail"
                className="w-full max-w-md rounded-lg border mt-2"
                onError={() => setPreviewThumbnail('')}
              />
            </div>
          )}

          {/* Tamanho (PDF) */}
          {tipo === 'pdf' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="tamanho_kb">Tamanho (KB) - Opcional</Label>
                <Input
                  id="tamanho_kb"
                  type="number"
                  {...register('tamanho_kb', { valueAsNumber: true })}
                  placeholder="Ex: 2048"
                />
              </div>
            </div>
          )}

          {/* Duração (Vídeo) */}
          {tipo === 'video' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="duracao_segundos">Duração (segundos) - Opcional</Label>
                <Input
                  id="duracao_segundos"
                  type="number"
                  {...register('duracao_segundos', { valueAsNumber: true })}
                  placeholder="Ex: 1800 (30 minutos)"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEÇÃO 3: TAGS E ORGANIZAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle>Tags e Organização</CardTitle>
          <CardDescription>Ajude os alunos a encontrar o material</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tags */}
          <div>
            <Label htmlFor="tags">
              Tags <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Digite uma tag e pressione Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(tagsInput);
                  }
                }}
              />
              
              {/* Tags selecionadas */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {errors.tags && (
                <p className="text-sm text-red-500 mt-1">{errors.tags.message}</p>
              )}

              <p className="text-xs text-gray-500">
                {tags.length}/10 tags • Pressione Enter para adicionar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 4: CONFIGURAÇÕES */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Acesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visível para alunos */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="visivel_para_alunos">Visível para alunos</Label>
              <p className="text-sm text-gray-500">
                Os alunos poderão ver este material na biblioteca
              </p>
            </div>
            <Switch
              id="visivel_para_alunos"
              checked={visivel_para_alunos}
              onCheckedChange={(checked) => setValue('visivel_para_alunos', checked)}
            />
          </div>

          {/* Permite download */}
          {tipo === 'pdf' && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="permite_download">Permitir download</Label>
                <p className="text-sm text-gray-500">
                  Os alunos poderão baixar o arquivo PDF
                </p>
              </div>
              <Switch
                id="permite_download"
                checked={permite_download}
                onCheckedChange={(checked) => setValue('permite_download', checked)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* BOTÕES */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <LoadingButton 
          type="submit" 
          isLoading={isLoading}
          loadingText="Salvando..."
        >
          Salvar Material
        </LoadingButton>
      </div>
    </form>
  );
};
