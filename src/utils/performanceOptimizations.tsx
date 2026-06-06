// ============================================
// PERFORMANCE OPTIMIZATIONS - Utilitários de otimização
// ============================================

import React, { memo, useMemo, useCallback } from 'react';

/**
 * HOC para prevenir re-renders desnecessários
 * Usa shallow comparison por padrão
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) {
  return memo(Component, propsAreEqual);
}

/**
 * Comparador customizado para arrays
 */
export function areArraysEqual<T>(prev: T[], next: T[]): boolean {
  if (prev.length !== next.length) return false;
  
  return prev.every((item, index) => {
    if (typeof item === 'object' && item !== null) {
      return JSON.stringify(item) === JSON.stringify(next[index]);
    }
    return item === next[index];
  });
}

/**
 * Comparador customizado para objetos
 */
export function areObjectsEqual(prev: any, next: any): boolean {
  if (prev === next) return true;
  if (!prev || !next) return false;
  
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  
  if (prevKeys.length !== nextKeys.length) return false;
  
  return prevKeys.every(key => prev[key] === next[key]);
}

/**
 * Hook otimizado para handlers de formulário
 * Previne re-renders ao criar callbacks
 */
export function useOptimizedFormHandlers() {
  const createChangeHandler = useCallback((
    setValue: (value: any) => void,
    transform?: (value: any) => any
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValue(transform ? transform(value) : value);
    };
  }, []);

  const createClickHandler = useCallback((
    action: () => void
  ) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      action();
    };
  }, []);

  return {
    createChangeHandler,
    createClickHandler,
  };
}

/**
 * Hook para memoizar cálculos complexos
 */
export function useComplexMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Componente otimizado para listas
 * Usa React.memo com comparador customizado
 */
interface OptimizedListItemProps<T> {
  item: T;
  renderItem: (item: T, index: number) => React.ReactNode;
  index: number;
  keyExtractor?: (item: T) => string | number;
}

const OptimizedListItemInner = <T,>({
  item,
  renderItem,
  index,
}: OptimizedListItemProps<T>) => {
  return <>{renderItem(item, index)}</>;
};

export const OptimizedListItem = memo(
  OptimizedListItemInner,
  (prev, next) => {
    // Compara apenas o item, não o renderItem
    return JSON.stringify(prev.item) === JSON.stringify(next.item) &&
           prev.index === next.index;
  }
) as typeof OptimizedListItemInner;

/**
 * Hook para debounce de valores (previne re-renders excessivos)
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para throttle de funções (previne execuções excessivas)
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = React.useRef(Date.now());

  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
}

/**
 * Componente wrapper para lazy rendering
 * Renderiza apenas quando visível no viewport
 */
interface LazyRenderProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
}

export const LazyRender: React.FC<LazyRenderProps> = ({
  children,
  placeholder = null,
  rootMargin = '50px',
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : placeholder}
    </div>
  );
};

/**
 * HOC para componentes pesados que raramente mudam
 */
export function withPureComponent<P extends object>(
  Component: React.ComponentType<P>
) {
  return memo(Component, () => true); // Nunca re-renderiza
}

/**
 * Hook para prevenir re-renders durante input typing
 */
export function useOptimizedInput(
  initialValue: string = '',
  onDebouncedChange?: (value: string) => void,
  delay: number = 300
) {
  const [value, setValue] = React.useState(initialValue);
  const debouncedValue = useDebouncedValue(value, delay);

  React.useEffect(() => {
    if (onDebouncedChange && debouncedValue !== initialValue) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, onDebouncedChange, initialValue]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  }, []);

  return {
    value,
    debouncedValue,
    handleChange,
    setValue,
  };
}

/**
 * Utilitário para dividir arrays grandes em chunks
 * Útil para renderização progressiva
 */
export function useChunkedArray<T>(
  array: T[],
  chunkSize: number = 20,
  delay: number = 0
): T[] {
  const [visibleItems, setVisibleItems] = React.useState<T[]>([]);

  React.useEffect(() => {
    let currentIndex = 0;

    const addChunk = () => {
      if (currentIndex < array.length) {
        setVisibleItems(prev => [
          ...prev,
          ...array.slice(currentIndex, currentIndex + chunkSize)
        ]);
        currentIndex += chunkSize;
        
        if (delay > 0) {
          setTimeout(addChunk, delay);
        } else {
          requestAnimationFrame(addChunk);
        }
      }
    };

    setVisibleItems([]);
    addChunk();
  }, [array, chunkSize, delay]);

  return visibleItems;
}
