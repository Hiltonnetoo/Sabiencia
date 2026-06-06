// ============================================
// CPF INPUT - Input com validação de CPF em tempo real
// ============================================

import React, { forwardRef, useState, useEffect } from 'react';
import { InputWithValidation } from './InputWithValidation';
import { useInputMask } from '../../hooks/useInputMask';

interface CPFInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  showValidation?: boolean;
  onValidCPF?: (cpf: string) => void;
}

const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

export const CPFInput = forwardRef<HTMLInputElement, CPFInputProps>(
  ({ error, showValidation = true, onChange, onValidCPF, value, ...props }, ref) => {
    const { applyMask } = useInputMask();
    const [isValid, setIsValid] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    useEffect(() => {
      const cpfValue = (value as string) || '';
      const cleanCPF = cpfValue.replace(/\D/g, '');
      
      if (cleanCPF.length === 11) {
        const valid = validateCPF(cpfValue);
        setIsValid(valid);
        
        if (valid) {
          onValidCPF?.(cleanCPF);
        }
      } else {
        setIsValid(false);
      }
    }, [value, onValidCPF]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyMask(e.target.value, 'cpf');
      e.target.value = maskedValue;
      setInternalValue(maskedValue);
      onChange?.(e);
    };

    return (
      <InputWithValidation
        ref={ref}
        type="text"
        error={error}
        isValid={isValid}
        showValidation={showValidation}
        onChange={handleChange}
        value={value}
        placeholder="000.000.000-00"
        maxLength={14}
        {...props}
      />
    );
  }
);

CPFInput.displayName = 'CPFInput';
