// ============================================
// CEP INPUT - Input com busca automática de endereço
// ============================================

import React, { forwardRef, useRef, useState } from 'react';
import { InputWithValidation } from './InputWithValidation';
import { useInputMask } from '../../hooks/useInputMask';
import { MapPin } from 'lucide-react';

interface CEPInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  showValidation?: boolean;
  onAddressFound?: (address: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
  }) => void;
}

export const CEPInput = forwardRef<HTMLInputElement, CEPInputProps>(
  ({ error, showValidation = true, onChange, onAddressFound, ...props }, ref) => {
    const { applyMask, removeMask } = useInputMask();
    const [isSearching, setIsSearching] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const searchCEP = async (cep: string) => {
      const cleanCEP = removeMask(cep);

      if (cleanCEP.length !== 8) {
        setIsValid(false);
        return;
      }

      // Cancela requisição anterior antes de iniciar nova
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setIsSearching(true);

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`, {
          signal: abortRef.current.signal,
        });
        const data = await response.json();

        if (!data.erro) {
          setIsValid(true);
          onAddressFound?.({
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          });
        } else {
          setIsValid(false);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Erro ao buscar CEP:', error);
        setIsValid(false);
      } finally {
        setIsSearching(false);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyMask(e.target.value, 'cep');
      e.target.value = maskedValue;
      onChange?.(e);

      const cleanValue = removeMask(maskedValue);
      if (cleanValue.length === 8) {
        searchCEP(maskedValue);
      } else {
        setIsValid(false);
      }
    };

    return (
      <div className="relative">
        <InputWithValidation
          ref={ref}
          type="text"
          error={error}
          isValid={isValid}
          isValidating={isSearching}
          showValidation={showValidation}
          onChange={handleChange}
          placeholder="00000-000"
          maxLength={9}
          hint={isSearching ? "Buscando endereço..." : undefined}
          {...props}
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <style>{`
          input[type="text"] {
            padding-left: 2.5rem;
          }
        `}</style>
      </div>
    );
  }
);

CEPInput.displayName = 'CEPInput';
