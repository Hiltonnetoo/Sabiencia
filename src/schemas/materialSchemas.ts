// ============================================
// MATERIAL SCHEMAS - Validação de materiais e biblioteca
// ============================================

import { z } from 'zod';

// ==================== VALIDADORES CUSTOMIZADOS ====================

// Validar URL do YouTube
const validateYouTubeURL = (url: string): boolean => {
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]{11}/,
  ];
  return patterns.some(pattern => pattern.test(url));
};

// Extrair ID do vídeo do YouTube
export const extractYouTubeID = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

// Validar URL de PDF
const validatePDFURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// ==================== SCHEMAS ====================

// Schema base de endereço comum
const enderecoSchema = z.object({
  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
});

// Schema de Material
export const materialSchema = z.object({
  titulo: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(200, 'O título deve ter no máximo 200 caracteres'),
  
  descricao: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  
  tipo: z.enum(['pdf', 'video'], {
    errorMap: () => ({ message: 'Tipo deve ser PDF ou Vídeo' }),
  }),
  
  disciplina_id: z
    .string()
    .min(1, 'Selecione uma disciplina'),
  
  modulo: z
    .string()
    .min(1, 'O módulo é obrigatório')
    .max(100, 'O módulo deve ter no máximo 100 caracteres'),
  
  url: z
    .string()
    .url('URL inválida')
    .refine(
      (url) => {
        // Validar se é PDF ou vídeo do YouTube baseado no tipo
        return true; // Validação específica será feita no formulário
      },
      { message: 'URL inválida para o tipo selecionado' }
    ),
  
  thumbnail_url: z
    .string()
    .url('URL da thumbnail inválida')
    .optional()
    .or(z.literal('')),
  
  tamanho_kb: z
    .number()
    .min(0, 'Tamanho deve ser positivo')
    .optional(),
  
  duracao_segundos: z
    .number()
    .min(0, 'Duração deve ser positiva')
    .optional(),
  
  tags: z
    .array(z.string())
    .min(1, 'Adicione pelo menos uma tag')
    .max(10, 'Máximo de 10 tags'),
  
  visivel_para_alunos: z.boolean().default(true),
  
  permite_download: z.boolean().default(true),
});

// Schema para criação de material
export const createMaterialSchema = materialSchema;

// Schema para atualização de material (todos campos opcionais)
export const updateMaterialSchema = materialSchema.partial();

// Schema de Módulo
export const moduloSchema = z.object({
  nome: z
    .string()
    .min(3, 'O nome do módulo deve ter pelo menos 3 caracteres')
    .max(100, 'O nome do módulo deve ter no máximo 100 caracteres'),
  
  descricao: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .optional(),
  
  ordem: z
    .number()
    .min(1, 'A ordem deve ser maior que 0')
    .max(100, 'A ordem deve ser menor que 100'),
  
  disciplina_id: z
    .string()
    .min(1, 'Selecione uma disciplina'),
  
  ativo: z.boolean().default(true),
});

// Schema de Favorito
export const favoritoSchema = z.object({
  aluno_id: z.string(),
  material_id: z.string(),
});

// ==================== TYPES ====================

export type MaterialFormData = z.infer<typeof materialSchema>;
export type CreateMaterialData = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialData = z.infer<typeof updateMaterialSchema>;
export type ModuloFormData = z.infer<typeof moduloSchema>;
export type FavoritoData = z.infer<typeof favoritoSchema>;

// ==================== HELPERS ====================

/**
 * Valida URL de YouTube
 */
export const isValidYouTubeURL = (url: string): boolean => {
  return validateYouTubeURL(url);
};

/**
 * Valida URL de PDF
 */
export const isValidPDFURL = (url: string): boolean => {
  return validatePDFURL(url);
};

/**
 * Gera thumbnail do YouTube a partir do ID
 */
export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

/**
 * Gera URL embed do YouTube
 */
export const getYouTubeEmbedURL = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (kb: number): string => {
  if (kb < 1024) return `${kb} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

/**
 * Formata duração de vídeo
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
