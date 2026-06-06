// ============================================
// USE LAZY STATE - Carregamento Preguiçoso de Estado
// ============================================

import { useState, useCallback, useRef } from 'react';

/**
 * Hook para carregar estado sob demanda
 * Útil para dados pesados que nem sempre são necessários
 * 
 * @param initializer - Função que retorna o valor inicial
 * @returns [value, loadValue, isLoaded]
 * 
 * @example
 * const [heavyData, loadHeavyData, isLoaded] = useLazyState(() => {
 *   return computeHeavyData(); // Só executa quando loadHeavyData() é chamado
 * });
 * 
 * // Carregar apenas quando necessário
 * useEffect(() => {
 *   if (shouldLoadData && !isLoaded) {
 *     loadHeavyData();
 *   }
 * }, [shouldLoadData, isLoaded]);
 */
export function useLazyState<T>(
  initializer: () => T
): [T | null, () => void, boolean] {
  const [value, setValue] = useState<T | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const initializerRef = useRef(initializer);

  const loadValue = useCallback(() => {
    if (!isLoaded) {
      const newValue = initializerRef.current();
      setValue(newValue);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  return [value, loadValue, isLoaded];
}

/**
 * Hook para carregar dados assíncronos sob demanda
 */
export function useLazyAsyncState<T>(
  asyncInitializer: () => Promise<T>
): [T | null, () => Promise<void>, boolean, boolean, Error | null] {
  const [value, setValue] = useState<T | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initializerRef = useRef(asyncInitializer);

  const loadValue = useCallback(async () => {
    if (!isLoaded && !isLoading) {
      setIsLoading(true);
      setError(null);
      try {
        const newValue = await initializerRef.current();
        setValue(newValue);
        setIsLoaded(true);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoaded, isLoading]);

  return [value, loadValue, isLoaded, isLoading, error];
}
