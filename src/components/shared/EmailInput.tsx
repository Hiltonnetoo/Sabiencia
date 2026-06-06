// ============================================
// EMAIL INPUT - Input com validação de email em tempo real
// ============================================

import React, { forwardRef, useState, useEffect } from 'react';
import { InputWithValidation } from './InputWithValidation';
import { Mail } from 'lucide-react';

interface EmailInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  showValidation?: boolean;
  onValidEmail?: (email: string) => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ error, showValidation = true, onChange, onValidEmail, value, ...props }, ref) => {
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
      const emailValue = (value as string) || '';
      
      if (emailValue.length > 0) {
        const valid = validateEmail(emailValue);
        setIsValid(valid);
        
        if (valid) {
          onValidEmail?.(emailValue);
        }
      } else {
        setIsValid(false);
      }
    }, [value, onValidEmail]);

    return (
      <div className="relative">
        <InputWithValidation
          ref={ref}
          type="email"
          error={error}
          isValid={isValid}
          showValidation={showValidation}
          onChange={onChange}
          value={value}
          placeholder="exemplo@email.com"
          {...props}
        />
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <style>{`
          input[type="email"] {
            padding-left: 2.5rem;
          }
        `}</style>
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';
