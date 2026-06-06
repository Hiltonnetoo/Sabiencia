import { describe, it, expect } from 'vitest';
import type { Nota, Frequencia } from '../types';
import {
  calculateMedia,
  calculateMediaSimples,
  calcularMediaNotas,
  calcularPercentualFrequencia,
  calculateFrequenciaPercentual,
  calculatePresencasEfetivas,
  calculateSituacao,
  calculateSituacaoCompleta,
  calculatePontosNecessarios,
  calculateDaysBetween,
  calculateProgressBetweenDates,
  isOverdue,
  calculateTotalFaltas,
  calculateTotalPresencas,
  calculateFaltasPermitidas,
  isFrequenciaEmRisco,
  calculateRanking,
  calculateNotasDistribution,
} from './calculations';

// ─── helpers ──────────────────────────────────────────────────────────────────

const makeNota = (nota: number, peso: number): Nota =>
  ({
    id: 'n1',
    aluno_id: 'a1',
    disciplina_id: 'd1',
    turma_id: 't1',
    professor_id: 'p1',
    tipo_avaliacao: 'prova',
    nota,
    peso,
    data_avaliacao: new Date(),
    created_at: new Date(),
  } as Nota);

const makeFrequencia = (status: Frequencia['status']): Frequencia =>
  ({
    id: 'f1',
    aluno_id: 'a1',
    disciplina_id: 'd1',
    turma_id: 't1',
    professor_id: 'p1',
    data_aula: new Date(),
    status,
    created_at: new Date(),
  } as Frequencia);

// ─── calculateMedia ───────────────────────────────────────────────────────────

describe('calculateMedia', () => {
  it('retorna 0 para lista vazia', () => {
    expect(calculateMedia([])).toBe(0);
  });

  it('calcula média ponderada simples', () => {
    const notas = [makeNota(8, 1), makeNota(6, 1)];
    expect(calculateMedia(notas)).toBe(7.0);
  });

  it('respeita pesos diferentes', () => {
    // (10 * 3 + 4 * 1) / (3 + 1) = 34/4 = 8.5
    const notas = [makeNota(10, 3), makeNota(4, 1)];
    expect(calculateMedia(notas)).toBe(8.5);
  });

  it('retorna 0 quando soma dos pesos é zero', () => {
    const notas = [makeNota(8, 0), makeNota(6, 0)];
    expect(calculateMedia(notas)).toBe(0);
  });

  it('retorna nota formatada com 1 casa decimal', () => {
    const notas = [makeNota(7, 2), makeNota(8, 3)];
    const result = calculateMedia(notas);
    expect(result.toString()).toMatch(/^\d+(\.\d)?$/);
  });
});

// ─── calculateMediaSimples ────────────────────────────────────────────────────

describe('calculateMediaSimples', () => {
  it('retorna 0 para lista vazia', () => {
    expect(calculateMediaSimples([])).toBe(0);
  });

  it('calcula média aritmética', () => {
    expect(calculateMediaSimples([6, 8, 10])).toBe(8.0);
  });

  it('lida com decimais', () => {
    expect(calculateMediaSimples([7, 8])).toBe(7.5);
  });
});

// ─── calcularMediaNotas ───────────────────────────────────────────────────────

describe('calcularMediaNotas', () => {
  it('retorna 0 quando todas as notas são null', () => {
    expect(calcularMediaNotas(null, null, null)).toBe(0);
  });

  it('ignora notas nulas', () => {
    // Apenas av1 e av2 presentes: (8 + 6) / 2 = 7.00
    expect(calcularMediaNotas(8, 6, null)).toBe(7.0);
  });

  it('calcula com as 3 notas', () => {
    // (6 + 7 + 8) / 3 = 7.00
    expect(calcularMediaNotas(6, 7, 8)).toBe(7.0);
  });

  it('formata com 2 casas decimais', () => {
    const result = calcularMediaNotas(7, 8, 9);
    expect(result).toBe(8.0);
  });
});

// ─── calcularPercentualFrequencia ─────────────────────────────────────────────

describe('calcularPercentualFrequencia (presencas/total_aulas)', () => {
  it('retorna 0 quando total_aulas é 0', () => {
    expect(calcularPercentualFrequencia(5, 0)).toBe(0);
  });

  it('calcula percentual correto', () => {
    expect(calcularPercentualFrequencia(75, 100)).toBe(75.0);
    expect(calcularPercentualFrequencia(3, 4)).toBe(75.0);
  });

  it('retorna 100 quando todas as aulas têm presença', () => {
    expect(calcularPercentualFrequencia(10, 10)).toBe(100.0);
  });
});

// ─── calculateFrequenciaPercentual ────────────────────────────────────────────

describe('calculateFrequenciaPercentual', () => {
  it('retorna 0 para lista vazia', () => {
    expect(calculateFrequenciaPercentual([])).toBe(0);
  });

  it('conta presentes e justificados como presença', () => {
    const f = [
      makeFrequencia('presente'),
      makeFrequencia('justificado'),
      makeFrequencia('ausente'),
      makeFrequencia('ausente'),
    ];
    // 2 em 4 = 50%
    expect(calculateFrequenciaPercentual(f)).toBe(50.0);
  });

  it('retorna 100 quando todos presentes', () => {
    const f = [makeFrequencia('presente'), makeFrequencia('presente')];
    expect(calculateFrequenciaPercentual(f)).toBe(100.0);
  });

  it('retorna 0 quando todos ausentes', () => {
    const f = [makeFrequencia('ausente'), makeFrequencia('ausente')];
    expect(calculateFrequenciaPercentual(f)).toBe(0.0);
  });
});

// ─── calculatePresencasEfetivas ───────────────────────────────────────────────

describe('calculatePresencasEfetivas', () => {
  it('não conta justificados como presença efetiva', () => {
    const f = [makeFrequencia('presente'), makeFrequencia('justificado'), makeFrequencia('ausente')];
    // apenas 1 presente em 3 = 33.3%
    expect(calculatePresencasEfetivas(f)).toBe(33.3);
  });

  it('retorna 0 para lista vazia', () => {
    expect(calculatePresencasEfetivas([])).toBe(0);
  });
});

// ─── calculateSituacao ────────────────────────────────────────────────────────

describe('calculateSituacao', () => {
  it('aprovado quando média >= notaMinima', () => {
    expect(calculateSituacao(6.0)).toBe('aprovado');
    expect(calculateSituacao(10.0)).toBe('aprovado');
  });

  it('recuperação quando média está entre (notaMinima - 1) e notaMinima', () => {
    expect(calculateSituacao(5.0)).toBe('recuperacao');
    expect(calculateSituacao(5.5)).toBe('recuperacao');
  });

  it('reprovado quando média < (notaMinima - 1)', () => {
    expect(calculateSituacao(4.9)).toBe('reprovado');
    expect(calculateSituacao(0)).toBe('reprovado');
  });

  it('respeita nota mínima customizada', () => {
    expect(calculateSituacao(7.0, 7.0)).toBe('aprovado');
    expect(calculateSituacao(6.5, 7.0)).toBe('recuperacao');
    expect(calculateSituacao(5.9, 7.0)).toBe('reprovado');
  });
});

// ─── calculateSituacaoCompleta ────────────────────────────────────────────────

describe('calculateSituacaoCompleta', () => {
  it('reprovado_frequencia quando frequência abaixo do mínimo', () => {
    expect(calculateSituacaoCompleta(9, 70)).toBe('reprovado_frequencia');
  });

  it('aprovado quando nota e frequência suficientes', () => {
    expect(calculateSituacaoCompleta(8, 80)).toBe('aprovado');
  });

  it('recuperacao por nota insuficiente com frequência OK', () => {
    expect(calculateSituacaoCompleta(5.5, 80)).toBe('recuperacao');
  });

  it('reprovado_nota com frequência OK e nota baixa', () => {
    expect(calculateSituacaoCompleta(4, 80)).toBe('reprovado_nota');
  });

  it('frequência tem precedência sobre nota', () => {
    // Nota excelente, mas frequência baixa → reprovado_frequencia
    expect(calculateSituacaoCompleta(10, 50)).toBe('reprovado_frequencia');
  });
});

// ─── calculatePontosNecessarios ───────────────────────────────────────────────

describe('calculatePontosNecessarios', () => {
  it('retorna 0 quando não há peso restante', () => {
    const notas = [makeNota(8, 2)];
    expect(calculatePontosNecessarios(notas, 6, 0)).toBe(0);
  });

  it('calcula pontos necessários para aprovação', () => {
    // Aluno tem 4.0 (peso 1). Precisa de 6.0 com peso total 2.
    // (6 * 2) - (4 * 1) = 12 - 4 = 8 → 8 / 1 = 8.0
    const notas = [makeNota(4, 1)];
    expect(calculatePontosNecessarios(notas, 6, 1)).toBe(8.0);
  });

  it('retorna 0 quando aluno já está aprovado', () => {
    // Aluno tem 9 (peso 2). Precisa de 6 no total com peso 3.
    // (6 * 3) - (9 * 2) = 18 - 18 = 0
    const notas = [makeNota(9, 2)];
    expect(calculatePontosNecessarios(notas, 6, 1)).toBe(0);
  });
});

// ─── calculateDaysBetween ─────────────────────────────────────────────────────

describe('calculateDaysBetween', () => {
  it('retorna 0 para mesma data', () => {
    const d = new Date('2024-01-01');
    expect(calculateDaysBetween(d, d)).toBe(0);
  });

  it('calcula diferença em dias corretamente', () => {
    expect(calculateDaysBetween('2024-01-01', '2024-01-10')).toBe(9);
  });

  it('é simétrico (valor absoluto)', () => {
    const a = '2024-06-01';
    const b = '2024-06-15';
    expect(calculateDaysBetween(a, b)).toBe(calculateDaysBetween(b, a));
  });
});

// ─── calculateProgressBetweenDates ───────────────────────────────────────────

describe('calculateProgressBetweenDates', () => {
  it('retorna 0 quando não começou', () => {
    const start = '2024-12-01';
    const end = '2024-12-31';
    const now = '2024-11-30';
    expect(calculateProgressBetweenDates(start, end, now)).toBe(0);
  });

  it('retorna 100 quando já terminou', () => {
    const start = '2024-01-01';
    const end = '2024-01-31';
    const now = '2024-02-01';
    expect(calculateProgressBetweenDates(start, end, now)).toBe(100);
  });

  it('retorna 0 para intervalo inválido (end <= start)', () => {
    expect(calculateProgressBetweenDates('2024-01-10', '2024-01-01', '2024-01-05')).toBe(0);
  });

  it('retorna progresso proporcional', () => {
    const start = '2024-01-01';
    const end = '2024-01-11'; // 10 dias
    const now = '2024-01-06'; // 5 dias = 50%
    const result = calculateProgressBetweenDates(start, end, now);
    expect(result).toBeGreaterThanOrEqual(49);
    expect(result).toBeLessThanOrEqual(51);
  });
});

// ─── isOverdue ────────────────────────────────────────────────────────────────

describe('isOverdue', () => {
  it('retorna true para data no passado', () => {
    expect(isOverdue('2020-01-01')).toBe(true);
  });

  it('retorna false para data no futuro', () => {
    expect(isOverdue('2099-12-31')).toBe(false);
  });
});

// ─── calculateTotalFaltas / calculateTotalPresencas ──────────────────────────

describe('calculateTotalFaltas', () => {
  it('conta apenas ausentes', () => {
    const f = [
      makeFrequencia('ausente'),
      makeFrequencia('presente'),
      makeFrequencia('ausente'),
      makeFrequencia('justificado'),
    ];
    expect(calculateTotalFaltas(f)).toBe(2);
  });

  it('retorna 0 para lista vazia', () => {
    expect(calculateTotalFaltas([])).toBe(0);
  });
});

describe('calculateTotalPresencas', () => {
  it('conta apenas status presente (não justificado)', () => {
    const f = [
      makeFrequencia('presente'),
      makeFrequencia('justificado'),
      makeFrequencia('ausente'),
    ];
    expect(calculateTotalPresencas(f)).toBe(1);
  });
});

// ─── calculateFaltasPermitidas ────────────────────────────────────────────────

describe('calculateFaltasPermitidas', () => {
  it('calcula faltas permitidas corretamente', () => {
    // 100 aulas, 75% mínimo → pode faltar até 25
    expect(calculateFaltasPermitidas(100, 75)).toBe(25);
    // 40 aulas, 75% mínimo → pode faltar até 10
    expect(calculateFaltasPermitidas(40, 75)).toBe(10);
  });

  it('usa 75% como padrão', () => {
    expect(calculateFaltasPermitidas(20)).toBe(5);
  });
});

// ─── isFrequenciaEmRisco ──────────────────────────────────────────────────────

describe('isFrequenciaEmRisco', () => {
  it('detecta risco quando frequência < mínimo + 5%', () => {
    // 70% de frequência → risco (75% + 5% = 80%)
    const f = Array.from({ length: 10 }, (_, i) =>
      makeFrequencia(i < 7 ? 'presente' : 'ausente')
    );
    expect(isFrequenciaEmRisco(f)).toBe(true);
  });

  it('não detecta risco quando frequência confortável', () => {
    const f = Array.from({ length: 10 }, (_, i) =>
      makeFrequencia(i < 9 ? 'presente' : 'ausente')
    );
    expect(isFrequenciaEmRisco(f)).toBe(false);
  });
});

// ─── calculateRanking ────────────────────────────────────────────────────────

describe('calculateRanking', () => {
  it('ordena do maior para o menor', () => {
    const alunos = [
      { id: 'a', media: 7 },
      { id: 'b', media: 9 },
      { id: 'c', media: 5 },
    ];
    const ranking = calculateRanking(alunos);
    expect(ranking[0]).toMatchObject({ id: 'b', posicao: 1 });
    expect(ranking[1]).toMatchObject({ id: 'a', posicao: 2 });
    expect(ranking[2]).toMatchObject({ id: 'c', posicao: 3 });
  });

  it('retorna lista vazia para entrada vazia', () => {
    expect(calculateRanking([])).toEqual([]);
  });
});

// ─── calculateNotasDistribution ──────────────────────────────────────────────

describe('calculateNotasDistribution', () => {
  it('distribui notas nas faixas corretas', () => {
    const notas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const dist = calculateNotasDistribution(notas);

    expect(dist.find((d) => d.faixa === '0-2')?.quantidade).toBe(2); // 0 e 1
    expect(dist.find((d) => d.faixa === '2-4')?.quantidade).toBe(2); // 2 e 3
    expect(dist.find((d) => d.faixa === '4-6')?.quantidade).toBe(2); // 4 e 5
    expect(dist.find((d) => d.faixa === '6-8')?.quantidade).toBe(2); // 6 e 7
    expect(dist.find((d) => d.faixa === '8-10')?.quantidade).toBe(3); // 8, 9 e 10
  });

  it('retorna quantidades zeradas para lista vazia', () => {
    const dist = calculateNotasDistribution([]);
    expect(dist.every((d) => d.quantidade === 0)).toBe(true);
  });
});
