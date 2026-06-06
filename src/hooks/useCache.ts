// ============================================
// USE CACHE - Hook para cache automático em componentes
// ============================================

import { useEffect, useState, useCallback, useMemo } from 'react';
import { cacheService, createCacheKey } from '../utils/cacheService';

interface UseCacheOptions<T> {
  key: string;
  fetchFn: () => Promise<T> | T;
  ttl?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook para cache automático com React
 * 
 * @example
 * const { data, isLoading, refetch } = useCache({
 *   key: 'alunos-list',
 *   fetchFn: () => fetchAlunos(),
 *   ttl: 5 * 60 * 1000, // 5 minutos
 * });
 */
export function useCache<T>({
  key,
  fetchFn,
  ttl = 5 * 60 * 1000,
  enabled = true,
  onSuccess,
  onError,
}: UseCacheOptions<T>) {
  const [data, setData] = useState<T | null>(() => cacheService.get<T>(key));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Tenta buscar do cache primeiro
      if (!skipCache) {
        const cached = cacheService.get<T>(key);
        if (cached !== null) {
          setData(cached);
          setIsLoading(false);
          onSuccess?.(cached);
          return;
        }
      }

      // Se não tem no cache, busca
      const result = await fetchFn();
      cacheService.set(key, result, ttl);
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetchFn, ttl, enabled, onSuccess, onError]);

  // Busca inicial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch manual (ignora cache)
  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Invalida o cache
  const invalidate = useCallback(() => {
    cacheService.delete(key);
    setData(null);
  }, [key]);

  // Atualiza o cache manualmente
  const updateCache = useCallback((newData: T) => {
    cacheService.set(key, newData, ttl);
    setData(newData);
  }, [key, ttl]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
    updateCache,
  };
}

/**
 * Hook para cache de lista com filtros
 */
interface UseCachedListOptions<T> {
  baseKey: string;
  fetchFn: () => Promise<T[]>;
  filters?: Record<string, any>;
  ttl?: number;
}

export function useCachedList<T>({
  baseKey,
  fetchFn,
  filters = {},
  ttl,
}: UseCachedListOptions<T>) {
  const cacheKey = useMemo(() => {
    const filterKeys = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    
    return createCacheKey(baseKey, filterKeys || 'all');
  }, [baseKey, filters]);

  return useCache({
    key: cacheKey,
    fetchFn,
    ttl,
  });
}

/**
 * Hook para cache de paginação
 */
interface UseCachedPaginationOptions<T> {
  baseKey: string;
  fetchFn: (page: number, pageSize: number) => Promise<T[]>;
  page: number;
  pageSize: number;
  ttl?: number;
}

export function useCachedPagination<T>({
  baseKey,
  fetchFn,
  page,
  pageSize,
  ttl,
}: UseCachedPaginationOptions<T>) {
  const cacheKey = useMemo(() => {
    return createCacheKey(baseKey, page, pageSize);
  }, [baseKey, page, pageSize]);

  const wrappedFetchFn = useCallback(() => {
    return fetchFn(page, pageSize);
  }, [fetchFn, page, pageSize]);

  return useCache({
    key: cacheKey,
    fetchFn: wrappedFetchFn,
    ttl,
  });
}

/**
 * Hook para invalidar múltiplas chaves de cache
 */
export function useCacheInvalidation() {
  const invalidatePattern = useCallback((pattern: string) => {
    const stats = cacheService.getStats();
    const keysToInvalidate = stats.keys.filter(key => key.includes(pattern));
    
    keysToInvalidate.forEach(key => {
      cacheService.delete(key);
    });
    
    return keysToInvalidate.length;
  }, []);

  const invalidateAll = useCallback(() => {
    cacheService.clear();
  }, []);

  return {
    invalidatePattern,
    invalidateAll,
  };
}

/**
 * Hook para estatísticas do cache (debug)
 */
export function useCacheStats() {
  const [stats, setStats] = useState(cacheService.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(cacheService.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}
