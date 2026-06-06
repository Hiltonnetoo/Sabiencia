// ============================================
// SCREEN READER ONLY - Componente para conteúdo apenas para leitores de tela
// ============================================

import React from 'react';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Componente que renderiza conteúdo visível apenas para screen readers
 * 
 * @example
 * <ScreenReaderOnly>
 *   Este texto só será lido por screen readers
 * </ScreenReaderOnly>
 */
export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  as: Component = 'span' 
}) => {
  return (
    <Component
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Component>
  );
};

/**
 * Componente para anúncios dinâmicos (aria-live)
 */
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = true,
  relevant = 'all',
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * Componente para anúncios importantes (aria-live assertive)
 */
export const AlertLiveRegion: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <LiveRegion politeness="assertive">
      {children}
    </LiveRegion>
  );
};

/**
 * Hook para anunciar mensagens dinamicamente
 */
export const useAnnouncer = () => {
  const [announcement, setAnnouncement] = React.useState('');

  const announce = React.useCallback((message: string, assertive = false) => {
    // Limpa primeiro para forçar re-anúncio
    setAnnouncement('');
    
    // Usa timeout para garantir que o screen reader detecte a mudança
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);

    // Limpa após 3 segundos
    setTimeout(() => {
      setAnnouncement('');
    }, 3100);
  }, []);

  const AnnouncerComponent = React.useMemo(() => {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {announcement}
      </div>
    );
  }, [announcement]);

  return {
    announce,
    AnnouncerComponent,
  };
};
