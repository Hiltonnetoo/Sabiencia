// ============================================
// USE FORM VALIDATION - Hook para validação em tempo real
// ============================================

import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface ValidationState {
  isValidating: boolean;
  hasErrors: boolean;
  touchedFields: Set<string>;
}

export function useFormValidation<T extends Record<string, any>>(
  form: UseFormReturn<T>
) {
  const [state, setState] = useState<ValidationState>({
    isValidating: false,
    hasErrors: false,
    touchedFields: new Set(),
  });

  const { formState } = form;

  useEffect(() => {
    setState(prev => ({
      ...prev,
      hasErrors: Object.keys(formState.errors).length > 0,
      isValidating: formState.isValidating,
    }));
  }, [formState.errors, formState.isValidating]);

  const markFieldAsTouched = (fieldName: string) => {
    setState(prev => ({
      ...prev,
      touchedFields: new Set([...prev.touchedFields, fieldName]),
    }));
  };

  const isFieldTouched = (fieldName: string) => {
    return state.touchedFields.has(fieldName) || formState.touchedFields[fieldName as keyof typeof formState.touchedFields];
  };

  const getFieldError = (fieldName: string) => {
    return formState.errors[fieldName as keyof typeof formState.errors];
  };

  const isFieldValid = (fieldName: string) => {
    return isFieldTouched(fieldName) && !getFieldError(fieldName);
  };

  const isFieldInvalid = (fieldName: string) => {
    return isFieldTouched(fieldName) && !!getFieldError(fieldName);
  };

  return {
    ...state,
    markFieldAsTouched,
    isFieldTouched,
    isFieldValid,
    isFieldInvalid,
    getFieldError,
  };
}
