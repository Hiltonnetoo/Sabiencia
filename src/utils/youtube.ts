// ============================================
// YOUTUBE UTILS - Utilitários para YouTube
// ============================================

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 * Suporta formatos:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Regex para capturar o ID do vídeo
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Apenas o ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Formata segundos em HH:MM:SS ou MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Gera URL de thumbnail do YouTube
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const qualities = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    maxres: 'maxresdefault.jpg'
  };

  return `https://img.youtube.com/vi/${videoId}/${qualities[quality]}`;
}

/**
 * Valida se uma URL do YouTube é válida
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Converte URL do YouTube para formato embed
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay = false, controls = true, modestbranding = true): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: controls ? '1' : '0',
    modestbranding: modestbranding ? '1' : '0',
    rel: '0', // Não mostrar vídeos relacionados
    showinfo: '0', // Não mostrar informações
    fs: '1', // Permitir fullscreen
    enablejsapi: '1' // Habilitar API JavaScript
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
