// ============================================
// USE REDUCED MOTION - Hook para detectar preferência de movimento
// ============================================

import { useState, useEffect } from 'react';

/**
 * Hook para detectar se o usuário prefere animações reduzidas
 * Respeita a preferência de acessibilidade do sistema
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * 
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { y: -10 }}
 * />
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Verifica suporte a matchMedia
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Define estado inicial
    setPrefersReducedMotion(mediaQuery.matches);

    // Listener para mudanças
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Adiciona listener (compatível com navegadores antigos)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores antigos
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook para detectar preferência de alto contraste
 */
export function useHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersHighContrast;
}

/**
 * Hook para detectar modo escuro
 */
export function usePrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersDark;
}

/**
 * Retorna duração de animação segura
 * 0ms se usuário prefere movimento reduzido, valor normal caso contrário
 */
export function useSafeAnimationDuration(
  normalDuration: number = 300
): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 0 : normalDuration;
}

/**
 * Retorna propriedades de transição seguras
 */
export function useSafeTransition(
  normalTransition: string = 'all 0.3s ease'
): string {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 'none' : normalTransition;
}

/**
 * Hook combinado para todas as preferências de acessibilidade
 */
export function useAccessibilityPreferences() {
  const reducedMotion = useReducedMotion();
  const highContrast = useHighContrast();
  const darkMode = usePrefersDark();

  return {
    reducedMotion,
    highContrast,
    darkMode,
    animationDuration: reducedMotion ? 0 : 300,
    transition: reducedMotion ? 'none' : 'all 0.3s ease',
  };
}
