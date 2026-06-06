// ============================================
// MEDIA THUMBNAILS - Geração de thumbnails consistentes para a Biblioteca
// - Vídeos do YouTube: usa `hqdefault.jpg` (sempre disponível, ao contrário
//   de `maxresdefault.jpg`, que retorna 404 em muitos vídeos).
// - PDFs / materiais: gera um thumbnail SVG embutido (data URI) com a marca,
//   sem depender de serviços externos (que podem ficar indisponíveis).
// ============================================

/** Extrai o ID de 11 caracteres de uma URL do YouTube. */
export const getYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/|\/v\/)([\w-]{11})/);
  return match ? match[1] : null;
};

/** Thumbnail confiável do YouTube (16:9) a partir da URL do vídeo. */
export const getYouTubeThumbnail = (url: string): string => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Gera um thumbnail SVG branded (16:9) como data URI.
 * Usado para PDFs e materiais sem imagem própria — garante uma
 * apresentação consistente e profissional, sem imagens quebradas.
 */
export const generateDocThumbnail = (
  title: string,
  kind: 'PDF' | 'DOC' | 'MATERIAL' = 'PDF'
): string => {
  const label = escapeXml(title.length > 48 ? `${title.slice(0, 45)}…` : title);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <g transform="translate(540 230)" fill="none" stroke="#ffffff" stroke-width="10" stroke-linejoin="round" opacity="0.95">
    <path d="M40 0 H150 L200 50 V210 H40 Z" fill="rgba(255,255,255,0.12)"/>
    <path d="M150 0 V50 H200"/>
    <line x1="70" y1="90" x2="170" y2="90"/>
    <line x1="70" y1="125" x2="170" y2="125"/>
    <line x1="70" y1="160" x2="140" y2="160"/>
  </g>
  <text x="640" y="540" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="700"
        fill="#ffffff" text-anchor="middle">${label}</text>
  <text x="640" y="600" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600"
        fill="rgba(255,255,255,0.7)" letter-spacing="3" text-anchor="middle">${kind} · SABIENCIA</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
