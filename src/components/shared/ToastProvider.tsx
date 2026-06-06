// ============================================
// TOAST PROVIDER - Provider para notificações toast
// Usa Sonner para feedback visual de ações
// ============================================

import { Toaster } from '../ui/sonner';

/**
 * Provider de Toast/Notificações
 * 
 * Configuração centralizada para notificações de feedback visual
 * usando a biblioteca Sonner integrada com Shadcn/UI
 * 
 * @example
 * ```tsx
 * // No App.tsx ou layout principal
 * import { ToastProvider } from './components/shared/ToastProvider';
 * 
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <ToastProvider />
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Usar em componentes
 * import { toast } from 'sonner';
 * 
 * toast.success('Operação realizada com sucesso!');
 * toast.error('Erro ao processar');
 * toast.info('Informação importante');
 * toast.warning('Atenção!');
 * ```
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:shadow-lg',
          title: 'text-sm',
          description: 'text-xs text-gray-600',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
    />
  );
}
