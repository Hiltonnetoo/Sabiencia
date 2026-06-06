// ============================================
// USE INPUT MASK - Hook para máscaras de input
// ============================================

import { ChangeEvent } from 'react';

type MaskType = 'cpf' | 'telefone' | 'cep' | 'data' | 'currency' | 'number';

export function useInputMask() {
  const masks = {
    cpf: (value: string) => {
      return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    },

    telefone: (value: string) => {
      return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    },

    cep: (value: string) => {
      return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
    },

    data: (value: string) => {
      return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\/\d{4})\d+?$/, '$1');
    },

    currency: (value: string) => {
      const number = value.replace(/\D/g, '');
      const amount = Number(number) / 100;
      return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },

    number: (value: string) => {
      return value.replace(/\D/g, '');
    },
  };

  const applyMask = (value: string, maskType: MaskType): string => {
    const maskFunction = masks[maskType];
    return maskFunction ? maskFunction(value) : value;
  };

  const handleMaskedChange = (
    e: ChangeEvent<HTMLInputElement>,
    maskType: MaskType,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
  ) => {
    const maskedValue = applyMask(e.target.value, maskType);
    e.target.value = maskedValue;
    onChange(e);
  };

  const removeMask = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  return {
    applyMask,
    handleMaskedChange,
    removeMask,
  };
}
