// ============================================
// CACHE SERVICE - Sistema de Cache em Memória
// ============================================

interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number; // Time to live em ms
}

class CacheService {
  private cache: Map<string, CacheItem<any>>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Armazena um valor no cache
   */
  set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    // Se cache está cheio, remover item mais antigo
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Recupera um valor do cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Verificar se expirou
    const isExpired = Date.now() - item.timestamp > item.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Verifica se uma chave existe no cache e é válida
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove um item do cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Retorna estatísticas do cache
   */
  getStats(): { size: number; maxSize: number; keys: string[] } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Busca com cache automático
   * Se o valor não existe no cache, executa a função e armazena
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await fetchFn();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Busca síncrona com cache
   */
  getOrCompute<T>(
    key: string,
    computeFn: () => T,
    ttl?: number
  ): T {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = computeFn();
    this.set(key, value, ttl);
    return value;
  }
}

// Instância singleton do cache
export const cacheService = new CacheService(200);

// Hook para usar cache em componentes
export function useCachedValue<T>(
  key: string,
  computeFn: () => T,
  ttl?: number
): T {
  return cacheService.getOrCompute(key, computeFn, ttl);
}

// Utilitário para criar chaves de cache
export function createCacheKey(...parts: (string | number)[]): string {
  return parts.join(':');
}
