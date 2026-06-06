// ============================================
// PHONE INPUT - Input com máscara de telefone
// ============================================

import React, { forwardRef } from 'react';
import { InputWithValidation } from './InputWithValidation';
import { useInputMask } from '../../hooks/useInputMask';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  showValidation?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ error, showValidation = true, onChange, ...props }, ref) => {
    const { applyMask } = useInputMask();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyMask(e.target.value, 'telefone');
      e.target.value = maskedValue;
      onChange?.(e);
    };

    return (
      <InputWithValidation
        ref={ref}
        type="text"
        error={error}
        showValidation={showValidation}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
        maxLength={15}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
