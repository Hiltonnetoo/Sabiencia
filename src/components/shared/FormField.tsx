// ============================================
// FORM FIELD - Campo de formulário completo com label e validação
// ============================================

import React, { ReactNode, cloneElement, isValidElement } from 'react';
import { Label } from '../ui/label';
import { cn } from '../ui/utils';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ 
  label, 
  htmlFor, 
  required, 
  error, 
  hint, 
  children,
  className 
}: FormFieldProps) {
  const errorId = `${htmlFor}-error`;
  const hintId = `${htmlFor}-hint`;
  const descriptionIds: string[] = [];
  
  if (error) descriptionIds.push(errorId);
  if (hint) descriptionIds.push(hintId);
  
  const ariaDescribedBy = descriptionIds.length > 0 ? descriptionIds.join(' ') : undefined;
  
  // Clona o children e adiciona aria-describedby e aria-invalid
  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required ? 'true' : 'false',
      })
    : children;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {label}
        {required && (
          <span className="text-red-600" aria-label="obrigatório">*</span>
        )}
      </Label>
      
      {enhancedChildren}
      
      {error && (
        <div 
          id={errorId}
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2 text-sm text-red-600"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      
      {!error && hint && (
        <p id={hintId} className="text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}
