// ============================================
// LOADING BUTTON - Botão com feedback visual
// Previne cliques duplicados e mostra estado de carregamento
// ============================================

import React from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

/**
 * Botão com estado de carregamento integrado
 * 
 * @example
 * ```tsx
 * const [isSubmitting, setIsSubmitting] = useState(false);
 * 
 * <LoadingButton 
 *   isLoading={isSubmitting}
 *   loadingText="Salvando..."
 *   onClick={handleSave}
 * >
 *   Salvar
 * </LoadingButton>
 * ```
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button 
      disabled={disabled || isLoading} 
      className={className}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
