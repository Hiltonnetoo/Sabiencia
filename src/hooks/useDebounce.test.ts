// ============================================
// USEDEBOUNCE TESTS - Testes do hook de debounce
// ============================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('deve debounce mudanças de valor', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Mudar valor
    rerender({ value: 'updated', delay: 500 });

    // Ainda deve ter o valor antigo
    expect(result.current).toBe('initial');

    // Avançar tempo
    vi.advanceTimersByTime(500);

    // Aguardar atualização
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('deve cancelar debounce anterior em mudanças rápidas', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Primeira mudança
    rerender({ value: 'first', delay: 500 });
    vi.advanceTimersByTime(200);

    // Segunda mudança antes do debounce completar
    rerender({ value: 'second', delay: 500 });
    vi.advanceTimersByTime(200);

    // Terceira mudança
    rerender({ value: 'third', delay: 500 });

    // Avançar tempo completo
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      // Deve ter apenas o último valor
      expect(result.current).toBe('third');
    });
  });

  it('deve funcionar com diferentes tipos de valores', async () => {
    // Testar com número
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    numberRerender({ value: 42, delay: 300 });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(numberResult.current).toBe(42);
    });

    // Testar com objeto
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: { name: 'initial' }, delay: 300 } }
    );

    objectRerender({ value: { name: 'updated' }, delay: 300 });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(objectResult.current).toEqual({ name: 'updated' });
    });
  });

  it('deve respeitar delays diferentes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    rerender({ value: 'updated', delay: 1000 });

    // Avançar menos que o delay
    vi.advanceTimersByTime(500);
    expect(result.current).toBe('initial');

    // Avançar o resto
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('deve atualizar imediatamente com delay 0', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'updated', delay: 0 });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('deve limpar timeout ao desmontar', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useDebounce('value', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('deve lidar com valores undefined e null', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial' as string | null, delay: 300 } }
    );

    rerender({ value: null, delay: 300 });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    rerender({ value: undefined as any, delay: 300 });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toBeUndefined();
    });
  });

  it('deve funcionar com arrays', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: [1, 2, 3], delay: 300 } }
    );

    rerender({ value: [4, 5, 6], delay: 300 });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(result.current).toEqual([4, 5, 6]);
    });
  });
});
