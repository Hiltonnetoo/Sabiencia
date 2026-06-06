// ============================================
// USE FOCUS TRAP - Hook para trappear foco em modais
// ============================================

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para trappear o foco dentro de um elemento (modal, dialog, etc)
 * Garante que o Tab só navegue entre elementos dentro do container
 * 
 * @example
 * const trapRef = useFocusTrap(isOpen);
 * 
 * return (
 *   <div ref={trapRef}>
 *     <input />
 *     <button>Fechar</button>
 *   </div>
 * );
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  active: boolean = true,
  options: {
    initialFocus?: boolean;
    returnFocus?: boolean;
    escapeDeactivates?: boolean;
    onEscape?: () => void;
  } = {}
) {
  const {
    initialFocus = true,
    returnFocus = true,
    escapeDeactivates = true,
    onEscape,
  } = options;

  const ref = useRef<T>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  /**
   * Obtém todos os elementos focáveis dentro do container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!ref.current) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    const elements = ref.current.querySelectorAll<HTMLElement>(focusableSelectors);
    return Array.from(elements).filter(element => {
      return (
        element.offsetParent !== null &&
        !element.hasAttribute('aria-hidden') &&
        element.getAttribute('tabindex') !== '-1'
      );
    });
  }, []);

  /**
   * Handler para tecla Tab
   */
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (!active || e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab no primeiro elemento -> vai para o último
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
      return;
    }

    // Tab no último elemento -> vai para o primeiro
    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
      return;
    }
  }, [active, getFocusableElements]);

  /**
   * Handler para tecla Escape
   */
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (!active || !escapeDeactivates || e.key !== 'Escape') return;
    
    e.preventDefault();
    onEscape?.();
  }, [active, escapeDeactivates, onEscape]);

  /**
   * Ativa o focus trap
   */
  useEffect(() => {
    if (!active || !ref.current) return;

    // Salva o elemento que tinha foco antes
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Foca no primeiro elemento focável
    if (initialFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Pequeno delay para garantir que o modal renderizou
        setTimeout(() => {
          focusableElements[0].focus();
        }, 0);
      }
    }

    // Adiciona listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);

      // Retorna o foco para o elemento anterior
      if (returnFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [
    active,
    initialFocus,
    returnFocus,
    handleTabKey,
    handleEscapeKey,
    getFocusableElements,
  ]);

  return ref;
}

/**
 * Hook simples para restaurar foco
 */
export function useRestoreFocus(active: boolean = true) {
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active) {
      previousFocus.current = document.activeElement as HTMLElement;
    }

    return () => {
      if (active && previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [active]);
}

/**
 * Hook para focar elemento ao montar
 */
export function useAutoFocus<T extends HTMLElement = HTMLElement>(
  active: boolean = true,
  delay: number = 0
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const timeoutId = setTimeout(() => {
      ref.current?.focus();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [active, delay]);

  return ref;
}
