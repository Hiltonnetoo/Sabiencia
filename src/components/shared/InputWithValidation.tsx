// ============================================
// INPUT WITH VALIDATION - Input com feedback visual
// ============================================

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { Input } from '../ui/input';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

interface InputWithValidationProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  isValid?: boolean;
  isValidating?: boolean;
  showValidation?: boolean;
  hint?: string;
}

export const InputWithValidation = forwardRef<HTMLInputElement, InputWithValidationProps>(
  ({ 
    error, 
    isValid, 
    isValidating, 
    showValidation = true,
    hint,
    className,
    ...props 
  }, ref) => {
    const hasError = !!error;
    const showSuccess = isValid && !hasError && showValidation;
    const showError = hasError && showValidation;

    return (
      <div className="relative">
        <Input
          ref={ref}
          className={cn(
            className,
            hasError && 'border-red-500 focus-visible:ring-red-500',
            showSuccess && 'border-green-500 focus-visible:ring-green-500'
          )}
          aria-invalid={hasError}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {/* Ícone de validação */}
        {showValidation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isValidating && (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            )}
            {!isValidating && showSuccess && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
            {!isValidating && showError && (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
        )}

        {/* Mensagem de erro */}
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}

        {/* Hint/Dica */}
        {hint && !error && (
          <p className="text-sm text-gray-500 mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

InputWithValidation.displayName = 'InputWithValidation';
