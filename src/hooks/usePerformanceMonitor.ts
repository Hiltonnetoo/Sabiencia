// ============================================
// USE PERFORMANCE MONITOR - Monitoramento de Performance
// ============================================

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
}

/**
 * Hook para monitorar performance de componentes
 * Útil para debug e otimização
 * 
 * @param componentName - Nome do componente
 * @param enabled - Se o monitoramento está ativo (padrão: apenas em dev)
 * 
 * @example
 * function MyComponent() {
 *   usePerformanceMonitor('MyComponent');
 *   // ...
 * }
 */
export function usePerformanceMonitor(
  componentName: string,
  enabled: boolean = process.env.NODE_ENV === 'development'
) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;

    // Log apenas se render demorou mais de 16ms (60fps)
    if (renderTime > 16) {
      console.warn(
        `⚠️ Slow render detected in ${componentName}:`,
        `${renderTime.toFixed(2)}ms`,
        `(render #${renderCount.current})`
      );
    }

    // Reset timer para próximo render
    startTime.current = performance.now();
  });

  // Log on unmount
  useEffect(() => {
    if (!enabled) return;

    return () => {
      console.log(
        `📊 ${componentName} unmounted after ${renderCount.current} renders`
      );
    };
  }, [componentName, enabled]);
}

/**
 * Hook para medir tempo de operações assíncronas
 */
export function useAsyncPerformance() {
  const measureAsync = async <T,>(
    operationName: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await asyncFn();
      const duration = performance.now() - start;
      
      console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };

  return { measureAsync };
}

/**
 * Hook para detectar re-renders desnecessários
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>({});

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`🔄 ${name} re-rendered because:`, changedProps);
      }
    }

    previousProps.current = props;
  });
}
