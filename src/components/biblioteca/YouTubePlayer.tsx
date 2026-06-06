// ============================================
// YOUTUBE PLAYER - Player incorporado do YouTube
// ============================================

import React from 'react';
import { extractYouTubeID, getYouTubeEmbedURL } from '../../schemas/materialSchemas';
import { Card, CardContent } from '../ui/card';
import { AlertCircle } from 'lucide-react';

interface YouTubePlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  url,
  title = 'Vídeo',
  className = '',
}) => {
  const videoId = extractYouTubeID(url);

  if (!videoId) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center gap-3 p-6">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <p className="font-medium text-red-900">Erro ao carregar vídeo</p>
            <p className="text-sm text-red-600">URL do YouTube inválida</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const embedUrl = getYouTubeEmbedURL(videoId);

  return (
    <div className={`relative ${className}`} style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg"
      />
    </div>
  );
};
