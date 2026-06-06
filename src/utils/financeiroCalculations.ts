import type { Pagamento, StatusPagamento } from '../types';

/** Multa por atraso sobre o valor original (padrão 2%). */
export function calcularMulta(valor: number, percentualMulta: number = 2): number {
  if (valor < 0 || percentualMulta < 0) return 0;
  return Number(((valor * percentualMulta) / 100).toFixed(2));
}

/** Juros de mora diários (padrão 0.0333% ao dia ≈ 1% ao mês). */
export function calcularJurosMora(
  valor: number,
  diasAtraso: number,
  taxaDiariaPercent: number = 0.0333
): number {
  if (valor < 0 || diasAtraso <= 0 || taxaDiariaPercent < 0) return 0;
  return Number(((valor * taxaDiariaPercent * diasAtraso) / 100).toFixed(2));
}

/** Valor atualizado de um pagamento vencido (principal + multa + juros). */
export function calcularValorAtualizado(
  pagamento: Pagamento,
  dataReferencia: Date = new Date()
): number {
  if (pagamento.status !== 'vencido') return pagamento.valor;

  const vencimento = new Date(pagamento.data_vencimento);
  const diffMs = dataReferencia.getTime() - vencimento.getTime();
  const diasAtraso = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const multa = calcularMulta(pagamento.valor);
  const juros = calcularJurosMora(pagamento.valor, diasAtraso);

  return Number((pagamento.valor + multa + juros).toFixed(2));
}

/** Total a receber: soma de pagamentos pendentes e vencidos. */
export function calcularTotalReceber(pagamentos: Pagamento[]): number {
  return pagamentos
    .filter((p) => p.status === 'pendente' || p.status === 'vencido')
    .reduce((acc, p) => acc + p.valor, 0);
}

/** Conta pagamentos por status. */
export function contarPorStatus(
  pagamentos: Pagamento[],
  status: StatusPagamento
): number {
  return pagamentos.filter((p) => p.status === status).length;
}

/** Taxa de inadimplência: (vencidos / total ativo) × 100. */
export function calcularTaxaInadimplencia(pagamentos: Pagamento[]): number {
  const ativos = pagamentos.filter(
    (p) => p.status === 'pendente' || p.status === 'vencido'
  );
  if (ativos.length === 0) return 0;
  const vencidos = ativos.filter((p) => p.status === 'vencido').length;
  return Number(((vencidos / ativos.length) * 100).toFixed(1));
}

/** Receita realizada: soma de pagamentos com status 'pago'. */
export function calcularReceitaRealizada(pagamentos: Pagamento[]): number {
  return pagamentos
    .filter((p) => p.status === 'pago')
    .reduce((acc, p) => acc + p.valor, 0);
}
