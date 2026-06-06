// ============================================
// OPTIMIZED IMAGE - Componente de imagem otimizada
// ============================================

import React, { useState } from 'react';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Componente de imagem otimizada com:
 * - Lazy loading automático
 * - Suporte a WebP
 * - Responsive images (srcset)
 * - Fallback para erro
 * - Loading state
 * 
 * @example
 * <OptimizedImage
 *   src="/images/avatar.jpg"
 *   alt="Avatar do usuário"
 *   width={200}
 *   height={200}
 * />
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fallback = '/placeholder-image.jpg',
  priority = false,
  objectFit = 'cover',
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /**
   * Gera srcset para imagens responsivas
   * Em produção, você geraria múltiplos tamanhos no backend
   */
  const generateSrcSet = (baseSrc: string): string => {
    // Se for Unsplash, podemos usar os parâmetros de resize
    if (baseSrc.includes('unsplash.com')) {
      const sizes = [400, 800, 1200, 1600];
      return sizes
        .map(size => `${baseSrc}&w=${size} ${size}w`)
        .join(', ');
    }
    
    // Para outras imagens, retorna apenas a src original
    return '';
  };

  /**
   * Gera sizes para diferentes breakpoints
   */
  const generateSizes = (): string => {
    if (width) {
      return `${width}px`;
    }
    
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  };

  /**
   * Converte URL para WebP (se possível)
   */
  const getWebPSrc = (src: string): string => {
    // Se for Unsplash, podemos forçar WebP
    if (src.includes('unsplash.com')) {
      return `${src}&fm=webp`;
    }
    
    // Para outras imagens, tentamos substituir a extensão
    if (src.match(/\.(jpg|jpeg|png)$/i)) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return src;
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const imageSrc = hasError ? fallback : src;
  const webpSrc = getWebPSrc(imageSrc);
  const srcSet = generateSrcSet(imageSrc);
  const sizes = generateSizes();

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Picture element com WebP fallback */}
      <picture>
        {/* Fonte WebP (navegadores modernos) */}
        <source 
          type="image/webp" 
          srcSet={srcSet || webpSrc}
          sizes={sizes}
        />
        
        {/* Fonte original (fallback) */}
        <img
          src={imageSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down',
          )}
          style={{ width, height }}
        />
      </picture>
    </div>
  );
};

/**
 * Componente de Avatar otimizado
 */
interface OptimizedAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 64,
  xl: 128,
};

export const OptimizedAvatar: React.FC<OptimizedAvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback = '/default-avatar.png',
}) => {
  const dimension = sizeMap[size];
  
  return (
    <OptimizedImage
      src={src || fallback}
      alt={alt}
      width={dimension}
      height={dimension}
      className="rounded-full"
      objectFit="cover"
      fallback={fallback}
    />
  );
};
