// ============================================
// USE UNDOABLE ACTION - Hook para ações reversíveis
// ============================================

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UndoableActionOptions<T> {
  action: (item: T) => void | Promise<void>;
  undo: (item: T) => void | Promise<void>;
  successMessage?: string;
  undoMessage?: string;
  undoTimeoutMs?: number;
}

/**
 * Hook para executar ações que podem ser desfeitas
 * Útil para exclusões, arquivamentos, etc.
 * 
 * @example
 * const { executeAction } = useUndoableAction({
 *   action: (aluno) => deleteAluno(aluno.id),
 *   undo: (aluno) => restoreAluno(aluno),
 *   successMessage: 'Aluno excluído',
 * });
 * 
 * // Depois:
 * executeAction(aluno);
 */
export const useUndoableAction = <T,>({
  action,
  undo,
  successMessage = 'Ação executada',
  undoMessage = 'Ação desfeita',
  undoTimeoutMs = 10000, // 10 segundos para desfazer
}: UndoableActionOptions<T>) => {
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pendingItemRef = useRef<T | null>(null);

  const executeAction = useCallback(
    async (item: T) => {
      // Se já há uma ação pendente, executa ela imediatamente
      if (pendingItemRef.current && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        await action(pendingItemRef.current);
        pendingItemRef.current = null;
      }

      // Marca como pendente
      setIsPending(true);
      pendingItemRef.current = item;

      // Executa a ação visualmente (otimista)
      await action(item);

      // Mostra toast com opção de desfazer
      const toastId = toast.success(successMessage, {
        description: 'Clique em "Desfazer" para reverter',
        duration: undoTimeoutMs,
        action: {
          label: 'Desfazer',
          onClick: async () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            
            // Desfaz a ação
            await undo(item);
            pendingItemRef.current = null;
            setIsPending(false);
            
            toast.success(undoMessage);
          },
        },
      });

      // Timeout para confirmar a ação
      timeoutRef.current = setTimeout(() => {
        pendingItemRef.current = null;
        setIsPending(false);
        toast.dismiss(toastId);
      }, undoTimeoutMs);
    },
    [action, undo, successMessage, undoMessage, undoTimeoutMs]
  );

  return {
    executeAction,
    isPending,
  };
};
