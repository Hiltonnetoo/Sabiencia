// ============================================
// VIDEO PLAYER - Player customizado com YouTube embedd invisível
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { getYouTubeEmbedUrl, formatDuration } from '../../utils/youtube';

interface VideoPlayerProps {
  videoId: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  savedPosition?: number; // Posição salva para continuar
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  onProgress,
  onComplete,
  savedPosition = 0,
  className = ''
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Inicializar YouTube IFrame API
  useEffect(() => {
    let mounted = true;

    // Carregar API do YouTube
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Encadeia com callback anterior para suportar múltiplos players simultâneos
    const prevApiReady = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (typeof prevApiReady === 'function') prevApiReady();
      // Só inicializa se o componente ainda estiver montado
      if (mounted) initPlayer();
    };

    // Se API já estiver carregada
    if ((window as any).YT && (window as any).YT.Player) {
      if (mounted) initPlayer();
    }

    return () => {
      mounted = false;
      // Limpar intervalo independentemente do estado do player
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      // Destruir player para liberar recursos do YouTube
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  const initPlayer = () => {
    if (!iframeRef.current) return;

    playerRef.current = new (window as any).YT.Player(iframeRef.current, {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0, // Esconder controles nativos
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 1,
        enablejsapi: 1
      },
      events: {
        onReady: handlePlayerReady,
        onStateChange: handlePlayerStateChange
      }
    });
  };

  const handlePlayerReady = (event: any) => {
    setIsReady(true);
    const duration = event.target.getDuration();
    setDuration(duration);

    // Ir para posição salva
    if (savedPosition > 0) {
      event.target.seekTo(savedPosition, true);
      setCurrentTime(savedPosition);
    }
  };

  const handlePlayerStateChange = (event: any) => {
    const state = event.data;

    // -1: não iniciado, 0: finalizado, 1: reproduzindo, 2: pausado, 3: buffering, 5: video cued
    if (state === 1) {
      // Reproduzindo
      setIsPlaying(true);
      startProgressTracking();
    } else if (state === 2) {
      // Pausado
      setIsPlaying(false);
      stopProgressTracking();
    } else if (state === 0) {
      // Finalizado
      setIsPlaying(false);
      stopProgressTracking();
      if (onComplete) {
        onComplete();
      }
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(current);
        setDuration(total);

        if (onProgress) {
          onProgress(current, total);
        }
      }
    }, 1000); // Atualizar a cada segundo
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!playerRef.current) return;
    const newTime = value[0];
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!playerRef.current) return;
    const newVolume = value[0];
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    if (!playerRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;
    if (iframeRef.current.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(true)} // Sempre mostrar por enquanto
    >
      {/* Player do YouTube (invisível para o usuário) */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 w-full h-full"
          src={getYouTubeEmbedUrl(videoId, false, false)}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Controles Customizados */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Barra de Progresso */}
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/80 mt-1">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              disabled={!isReady}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            {/* Skip -10s */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(-10)}
              disabled={!isReady}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            {/* Skip +10s */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(10)}
              disabled={!isReady}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <div className="w-20 hidden md:block">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white">Carregando player...</div>
        </div>
      )}
    </div>
  );
};
