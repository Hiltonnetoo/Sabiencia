import { describe, it, expect } from 'vitest';
import type { Pagamento } from '../types';
import {
  calcularMulta,
  calcularJurosMora,
  calcularValorAtualizado,
  calcularTotalReceber,
  contarPorStatus,
  calcularTaxaInadimplencia,
  calcularReceitaRealizada,
} from './financeiroCalculations';

// ─── helpers ──────────────────────────────────────────────────────────────────

const makePagamento = (
  status: Pagamento['status'],
  valor: number = 100,
  diasAtrasados: number = 0
): Pagamento => {
  const vencimento = new Date();
  vencimento.setDate(vencimento.getDate() - diasAtrasados);
  return {
    id: 'p1',
    aluno_id: 'a1',
    valor,
    data_vencimento: vencimento,
    status,
    created_at: new Date(),
  } as Pagamento;
};

// ─── calcularMulta ────────────────────────────────────────────────────────────

describe('calcularMulta', () => {
  it('calcula 2% sobre o valor por padrão', () => {
    expect(calcularMulta(100)).toBe(2.0);
    expect(calcularMulta(500)).toBe(10.0);
  });

  it('respeita percentual customizado', () => {
    expect(calcularMulta(200, 5)).toBe(10.0);
  });

  it('retorna 0 para valor zero', () => {
    expect(calcularMulta(0)).toBe(0);
  });

  it('retorna 0 para valores ou percentuais negativos', () => {
    expect(calcularMulta(-100)).toBe(0);
    expect(calcularMulta(100, -1)).toBe(0);
  });

  it('retorna valor com 2 casas decimais', () => {
    const result = calcularMulta(33.33);
    expect(result.toString()).toMatch(/^\d+\.\d{2}$/);
  });
});

// ─── calcularJurosMora ────────────────────────────────────────────────────────

describe('calcularJurosMora', () => {
  it('calcula juros para 30 dias (≈1% ao mês)', () => {
    // 100 * 0.0333% * 30 = 0.999 ≈ R$ 1,00
    const result = calcularJurosMora(100, 30);
    expect(result).toBeCloseTo(1.0, 1);
  });

  it('retorna 0 para zero dias de atraso', () => {
    expect(calcularJurosMora(500, 0)).toBe(0);
  });

  it('retorna 0 para dias negativos', () => {
    expect(calcularJurosMora(500, -5)).toBe(0);
  });

  it('retorna 0 para valor negativo', () => {
    expect(calcularJurosMora(-100, 10)).toBe(0);
  });

  it('cresce proporcionalmente ao número de dias', () => {
    const j30 = calcularJurosMora(100, 30);
    const j60 = calcularJurosMora(100, 60);
    expect(j60).toBeCloseTo(j30 * 2, 1);
  });
});

// ─── calcularValorAtualizado ──────────────────────────────────────────────────

describe('calcularValorAtualizado', () => {
  it('retorna valor original para pagamento pendente', () => {
    const p = makePagamento('pendente', 200);
    expect(calcularValorAtualizado(p)).toBe(200);
  });

  it('retorna valor original para pagamento pago', () => {
    const p = makePagamento('pago', 200);
    expect(calcularValorAtualizado(p)).toBe(200);
  });

  it('acrescenta multa + juros para pagamento vencido', () => {
    const p = makePagamento('vencido', 100, 30);
    const atualizado = calcularValorAtualizado(p);
    // multa: R$2, juros ≈ R$1 → atualizado > 100
    expect(atualizado).toBeGreaterThan(100);
  });

  it('usa data de referência fornecida', () => {
    // Pagamento vencido há 0 dias (hoje): multa + 0 juros
    const p = makePagamento('vencido', 100, 0);
    const hoje = new Date();
    const atualizado = calcularValorAtualizado(p, hoje);
    // multa de 2% + juros de 0 dias
    expect(atualizado).toBeGreaterThanOrEqual(102);
  });
});

// ─── calcularTotalReceber ─────────────────────────────────────────────────────

describe('calcularTotalReceber', () => {
  it('soma pendentes e vencidos', () => {
    const pagamentos: Pagamento[] = [
      makePagamento('pendente', 100),
      makePagamento('vencido', 50),
      makePagamento('pago', 200),
      makePagamento('cancelado', 80),
    ];
    expect(calcularTotalReceber(pagamentos)).toBe(150);
  });

  it('retorna 0 para lista vazia', () => {
    expect(calcularTotalReceber([])).toBe(0);
  });

  it('retorna 0 quando todos estão pagos', () => {
    const pagamentos = [makePagamento('pago', 100), makePagamento('pago', 200)];
    expect(calcularTotalReceber(pagamentos)).toBe(0);
  });
});

// ─── contarPorStatus ──────────────────────────────────────────────────────────

describe('contarPorStatus', () => {
  it('conta corretamente por status', () => {
    const pagamentos: Pagamento[] = [
      makePagamento('pago'),
      makePagamento('pago'),
      makePagamento('vencido'),
      makePagamento('pendente'),
    ];
    expect(contarPorStatus(pagamentos, 'pago')).toBe(2);
    expect(contarPorStatus(pagamentos, 'vencido')).toBe(1);
    expect(contarPorStatus(pagamentos, 'pendente')).toBe(1);
    expect(contarPorStatus(pagamentos, 'cancelado')).toBe(0);
  });

  it('retorna 0 para lista vazia', () => {
    expect(contarPorStatus([], 'pago')).toBe(0);
  });
});

// ─── calcularTaxaInadimplencia ────────────────────────────────────────────────

describe('calcularTaxaInadimplencia', () => {
  it('calcula porcentagem de vencidos sobre ativos', () => {
    const pagamentos: Pagamento[] = [
      makePagamento('vencido'),
      makePagamento('pendente'),
      makePagamento('pago'),
    ];
    // 1 vencido / 2 ativos (vencido + pendente) = 50%
    expect(calcularTaxaInadimplencia(pagamentos)).toBe(50.0);
  });

  it('retorna 0 sem pagamentos ativos', () => {
    const pagamentos: Pagamento[] = [makePagamento('pago'), makePagamento('cancelado')];
    expect(calcularTaxaInadimplencia(pagamentos)).toBe(0);
  });

  it('retorna 0 para lista vazia', () => {
    expect(calcularTaxaInadimplencia([])).toBe(0);
  });
});

// ─── calcularReceitaRealizada ─────────────────────────────────────────────────

describe('calcularReceitaRealizada', () => {
  it('soma apenas pagamentos com status pago', () => {
    const pagamentos: Pagamento[] = [
      makePagamento('pago', 300),
      makePagamento('pago', 200),
      makePagamento('pendente', 100),
    ];
    expect(calcularReceitaRealizada(pagamentos)).toBe(500);
  });

  it('retorna 0 para lista vazia', () => {
    expect(calcularReceitaRealizada([])).toBe(0);
  });
});
