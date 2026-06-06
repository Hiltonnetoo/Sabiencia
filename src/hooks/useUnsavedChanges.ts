// ============================================
// USE UNSAVED CHANGES - Hook para detectar mudanças não salvas
// ============================================

import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

interface UseUnsavedChangesOptions {
  when: boolean;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Hook para prevenir navegação quando há mudanças não salvas
 * 
 * @example
 * const { isDirty } = useForm();
 * useUnsavedChanges({
 *   when: isDirty,
 *   message: 'Você tem alterações não salvas. Deseja sair mesmo assim?'
 * });
 */
export const useUnsavedChanges = ({
  when,
  message = 'Você tem alterações não salvas. Deseja sair mesmo assim?',
  onConfirm,
  onCancel,
}: UseUnsavedChangesOptions) => {
  
  // Prevenir fechamento da aba/janela
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when, message]);

  // Prevenir navegação interna (React Router)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname
  );

  const confirm = () => {
    if (blocker.state === 'blocked') {
      onConfirm?.();
      blocker.proceed();
    }
  };

  const cancel = () => {
    if (blocker.state === 'blocked') {
      onCancel?.();
      blocker.reset();
    }
  };

  return {
    showDialog: blocker.state === 'blocked',
    confirm,
    cancel,
  };
};
