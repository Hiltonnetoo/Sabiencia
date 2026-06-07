// ============================================
// FORMATTERS TESTS - Testes dos formatadores
// ============================================

import { describe, it, expect } from 'vitest';
import {
  formatCPF,
  formatPhone,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercentage
} from './formatters';

describe('Formatters', () => {
  describe('formatCPF', () => {
    it('deve formatar CPF com 11 dígitos', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
      expect(formatCPF('00000000001')).toBe('000.000.000-01');
    });

    it('deve retornar string vazia para CPF inválido ou retornar valor parcial', () => {
      expect(formatCPF('')).toBe('');
      expect(formatCPF('123')).toBe('123');
      expect(formatCPF('abc')).toBe('');
    });

    it('deve remover caracteres não numéricos antes de formatar', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
      expect(formatCPF('123 456 789 01')).toBe('123.456.789-01');
    });
  });

  describe('formatPhone', () => {
    it('deve formatar telefone celular (11 dígitos)', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('deve formatar telefone fixo (10 dígitos)', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });

    it('deve retornar string vazia para telefone inválido', () => {
      expect(formatPhone('')).toBe('');
      expect(formatPhone('123')).toBe('');
    });

    it('deve remover caracteres não numéricos', () => {
      expect(formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar valores em Real brasileiro', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('deve formatar valores negativos', () => {
      expect(formatCurrency(-500)).toBe('-R$ 500,00');
    });

    it('deve arredondar casas decimais', () => {
      expect(formatCurrency(10.999)).toBe('R$ 11,00');
      expect(formatCurrency(10.123)).toBe('R$ 10,12');
    });
  });

  describe('formatDate', () => {
    it('deve formatar datas no formato DD/MM/YYYY', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toMatch(/15\/01\/2024/);
    });

    it('deve formatar strings de data', () => {
      expect(formatDate('2024-01-15')).toMatch(/15\/01\/2024/);
    });

    it('deve retornar "-" para data inválida', () => {
      expect(formatDate('')).toBe('-');
      expect(formatDate(null as any)).toBe('-');
      expect(formatDate(undefined as any)).toBe('-');
    });
  });

  describe('formatDateTime', () => {
    it('deve formatar data e hora', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toContain('15/01/2024');
      expect(result).toContain(':');
    });

    it('deve retornar "-" para data inválida', () => {
      expect(formatDateTime('')).toBe('-');
    });
  });

  describe('formatPercentage', () => {
    it('deve formatar porcentagens', () => {
      expect(formatPercentage(0.75)).toBe('75%');
      expect(formatPercentage(1)).toBe('100%');
      expect(formatPercentage(0)).toBe('0%');
    });

    it('deve formatar com casas decimais quando especificado', () => {
      expect(formatPercentage(0.12345, 2)).toBe('12.35%');
      expect(formatPercentage(0.6789, 1)).toBe('67.9%');
    });

    it('deve lidar com valores acima de 100%', () => {
      expect(formatPercentage(1.5)).toBe('150%');
    });
  });
});
