import React, { useMemo } from 'react';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PagamentoCard } from '../../components/financeiro/PagamentoCard';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { formatCurrency } from '../../utils/formatters';
import { 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Calendar
} from 'lucide-react';

export const FinanceiroAlunoPage: React.FC = () => {
  const { user } = useAuth();
  const { pagamentos, alunos } = useMockData();
  
  const aluno = useMemo(() => {
    return alunos.find(a => a.id === user?.id);
  }, [alunos, user]);

  // Filtrar pagamentos do aluno
  const meusPagamentos = useMemo(() => {
    if (!user) return [];
    
    return pagamentos
      .filter(pag => pag.aluno_id === user.id)
      .sort((a, b) => 
        new Date(b.data_vencimento).getTime() - new Date(a.data_vencimento).getTime()
      );
  }, [pagamentos, user]);

  // Estatísticas do aluno
  const estatisticas = useMemo(() => {
    const total = meusPagamentos.reduce((sum, pag) => 
      pag.status !== 'cancelado' ? sum + pag.valor : sum, 0
    );
    
    const pago = meusPagamentos
      .filter(pag => pag.status === 'pago')
      .reduce((sum, pag) => sum + pag.valor, 0);
    
    const pendente = meusPagamentos
      .filter(pag => pag.status === 'pendente')
      .reduce((sum, pag) => sum + pag.valor, 0);
    
    const vencido = meusPagamentos
      .filter(pag => pag.status === 'pendente' && new Date(pag.data_vencimento) < new Date())
      .reduce((sum, pag) => sum + pag.valor, 0);

    const totalPagamentos = meusPagamentos.filter(p => p.status !== 'cancelado').length;
    const pagosPagamentos = meusPagamentos.filter(p => p.status === 'pago').length;
    const percentualPago = totalPagamentos > 0 ? (pagosPagamentos / totalPagamentos) * 100 : 0;

    const proximoVencimento = meusPagamentos
      .filter(pag => pag.status === 'pendente')
      .sort((a, b) => 
        new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime()
      )[0];

    return {
      total,
      pago,
      pendente,
      vencido,
      percentualPago,
      proximoVencimento,
      totalPagamentos,
      pagosPagamentos,
    };
  }, [meusPagamentos]);

  const temPagamentosVencidos = estatisticas.vencido > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Financeiro</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe seus pagamentos e pendências
        </p>
      </div>

      {/* Alerta de Inadimplência */}
      {temPagamentosVencidos && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 h-4" />
          <AlertDescription>
            Você possui {formatCurrency(estatisticas.vencido)} em pagamentos vencidos. 
            Entre em contato com a secretaria para regularizar sua situação.
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(estatisticas.total)}</p>
          <p className="text-xs text-gray-500 mt-2">
            {estatisticas.totalPagamentos} {estatisticas.totalPagamentos === 1 ? 'pagamento' : 'pagamentos'}
          </p>
        </Card>

        {/* Pago */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <Badge variant="default" className="bg-green-50 text-green-600">
              {estatisticas.percentualPago.toFixed(0)}%
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pago</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(estatisticas.pago)}</p>
          <p className="text-xs text-gray-500 mt-2">
            {estatisticas.pagosPagamentos} de {estatisticas.totalPagamentos} pagos
          </p>
        </Card>

        {/* Pendente */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-yellow-50">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pendente</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(estatisticas.pendente)}</p>
          <p className="text-xs text-gray-500 mt-2">Aguardando pagamento</p>
        </Card>

        {/* Vencido */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Vencido</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(estatisticas.vencido)}</p>
          <p className="text-xs text-red-600 mt-2">Regularize sua situação</p>
        </Card>
      </div>

      {/* Progresso de Pagamentos */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Progresso de Pagamentos</h3>
            <p className="text-sm text-gray-600 mt-1">
              {estatisticas.pagosPagamentos} de {estatisticas.totalPagamentos} pagamentos realizados
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {estatisticas.percentualPago.toFixed(0)}%
            </p>
          </div>
        </div>
        <Progress value={estatisticas.percentualPago} className="h-3" />
      </Card>

      {/* Próximo Vencimento */}
      {estatisticas.proximoVencimento && (
        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-yellow-50">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Próximo Vencimento</h3>
              <p className="text-sm text-gray-600 mb-3">
                Vencimento em {new Date(estatisticas.proximoVencimento.data_vencimento).toLocaleDateString('pt-BR')}
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(estatisticas.proximoVencimento.valor)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="text-sm font-medium text-gray-900">
                    {estatisticas.proximoVencimento.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de Pagamentos */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">
          Histórico de Pagamentos ({meusPagamentos.length})
        </h2>

        {meusPagamentos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">
              Nenhum pagamento encontrado
            </h3>
            <p className="text-gray-600">
              Você ainda não possui pagamentos registrados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {meusPagamentos.map(pagamento => (
              <PagamentoCard
                key={pagamento.id}
                pagamento={pagamento}
                aluno={aluno}
                showAlunoInfo={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceiroAlunoPage;
