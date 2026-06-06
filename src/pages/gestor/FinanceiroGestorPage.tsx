import React, { useState, useMemo } from 'react';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PagamentoCard } from '../../components/financeiro/PagamentoCard';
import { FinanceiroStats } from '../../components/financeiro/FinanceiroStats';
import { PagamentoFilters } from '../../components/financeiro/PagamentoFilters';
import { PagamentoForm } from '../../components/financeiro/PagamentoForm';
import { FinanceiroChart } from '../../components/financeiro/FinanceiroChart';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';
import { 
  DollarSign, 
  Download, 
  FileText, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import type { Pagamento } from '../../types';
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog';
import { exportToPDF, type ExportColumn } from '../../utils/exportService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const FinanceiroGestorPage: React.FC = () => {
  const { user } = useAuth();
  const { pagamentos, alunos, registrarPagamento, cancelarPagamento } = useMockData();
  
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('todos');
  const [mes, setMes] = useState('todos');
  const [ano, setAno] = useState('todos');
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<Pagamento | null>(null);
  const [showRegistroForm, setShowRegistroForm] = useState(false);
  const [pagamentoToCancel, setPagamentoToCancel] = useState<Pagamento | null>(null);

  // Filtrar pagamentos
  const pagamentosFiltrados = useMemo(() => {
    return pagamentos.filter(pag => {
      const aluno = alunos.find(a => a.id === pag.aluno_id);
      
      // Filtro de busca
      if (busca) {
        const buscaLower = busca.toLowerCase();
        const matchNome = aluno?.nome_completo.toLowerCase().includes(buscaLower);
        const matchCPF = aluno?.cpf.includes(busca);
        const matchId = pag.id.toLowerCase().includes(buscaLower);
        
        if (!matchNome && !matchCPF && !matchId) return false;
      }

      // Filtro de status
      if (status !== 'todos') {
        // Verificar se está vencido
        const isVencido = pag.status === 'pendente' && 
          new Date(pag.data_vencimento) < new Date();
        
        if (status === 'vencido') {
          if (!isVencido) return false;
        } else {
          if (pag.status !== status) return false;
        }
      }

      // Filtro de mês
      if (mes && mes !== 'todos') {
        const mesVencimento = new Date(pag.data_vencimento).getMonth() + 1;
        if (mesVencimento !== parseInt(mes)) return false;
      }

      // Filtro de ano
      if (ano && ano !== 'todos') {
        const anoVencimento = new Date(pag.data_vencimento).getFullYear();
        if (anoVencimento !== parseInt(ano)) return false;
      }

      return true;
    });
  }, [pagamentos, alunos, busca, status, mes, ano]);

  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    const receitaTotal = pagamentos.reduce((sum, pag) => 
      pag.status !== 'cancelado' ? sum + pag.valor : sum, 0
    );
    
    const receitaRecebida = pagamentos
      .filter(pag => pag.status === 'pago')
      .reduce((sum, pag) => sum + pag.valor, 0);
    
    const receitaPendente = pagamentos
      .filter(pag => pag.status === 'pendente')
      .reduce((sum, pag) => sum + pag.valor, 0);
    
    const receitaVencida = pagamentos
      .filter(pag => pag.status === 'pendente' && new Date(pag.data_vencimento) < new Date())
      .reduce((sum, pag) => sum + pag.valor, 0);

    // Alunos com status
    const alunosComPagamentos = new Set(pagamentos.map(p => p.aluno_id));
    let inadimplentes = 0;

    alunosComPagamentos.forEach(alunoId => {
      const pagamentosAluno = pagamentos.filter(p => p.aluno_id === alunoId);
      const temVencido = pagamentosAluno.some(p => 
        p.status === 'pendente' && new Date(p.data_vencimento) < new Date()
      );
      if (temVencido) inadimplentes++;
    });

    const alunosAdimplentes = alunosComPagamentos.size - inadimplentes;

    // Previsão do mês atual
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    const previsaoMes = pagamentos
      .filter(pag => {
        const data = new Date(pag.data_vencimento);
        return data.getMonth() === mesAtual && 
               data.getFullYear() === anoAtual &&
               pag.status !== 'cancelado';
      })
      .reduce((sum, pag) => sum + pag.valor, 0);

    return {
      receitaTotal,
      receitaRecebida,
      receitaPendente,
      receitaVencida,
      totalPagamentos: pagamentos.filter(p => p.status !== 'cancelado').length,
      alunosAdimplentes,
      alunosInadimplentes: inadimplentes,
      previsaoMes,
    };
  }, [pagamentos]);

  const handleRegistrarPagamento = (pagamento: Pagamento) => {
    setPagamentoSelecionado(pagamento);
    setShowRegistroForm(true);
  };

  const handleSubmitRegistro = (data: {
    data_pagamento: Date;
    metodo_pagamento: string;
    comprovante_url?: string;
    observacao?: string;
  }) => {
    if (!pagamentoSelecionado) return;

    registrarPagamento(pagamentoSelecionado.id, data);
    toast.success('Pagamento registrado com sucesso!');
    setShowRegistroForm(false);
    setPagamentoSelecionado(null);
  };

  const handleCancelarPagamento = (pagamento: Pagamento) => {
    setPagamentoToCancel(pagamento);
  };

  const handleConfirmCancelar = () => {
    if (pagamentoToCancel) {
      cancelarPagamento(pagamentoToCancel.id, 'Cancelado pelo gestor');
      toast.success('Pagamento cancelado com sucesso!');
      setPagamentoToCancel(null);
    }
  };

  const handleLimparFiltros = () => {
    setBusca('');
    setStatus('todos');
    setMes('todos');
    setAno('todos');
  };

  const handleExportarRelatorio = async () => {
    if (pagamentosFiltrados.length === 0) {
      toast.warning('Não há pagamentos para exportar com os filtros atuais.');
      return;
    }

    const statusLabel: Record<string, string> = {
      pago: 'Pago',
      pendente: 'Pendente',
      vencido: 'Vencido',
      cancelado: 'Cancelado',
    };

    const rows = pagamentosFiltrados.map((pag) => {
      const aluno = alunos.find((a) => a.id === pag.aluno_id);
      const vencido = pag.status === 'pendente' && new Date(pag.data_vencimento) < new Date();
      return {
        aluno: aluno?.nome_completo ?? '—',
        valor: pag.valor,
        vencimento: pag.data_vencimento,
        pagamento: pag.data_pagamento,
        status: vencido ? 'Vencido' : statusLabel[pag.status] ?? pag.status,
      };
    });

    const columns: ExportColumn[] = [
      { header: 'Aluno', key: 'aluno' },
      { header: 'Valor', key: 'valor', format: (v) => formatCurrency(v) },
      { header: 'Vencimento', key: 'vencimento', format: (v) => (v ? formatDate(v) : '—') },
      { header: 'Pagamento', key: 'pagamento', format: (v) => (v ? formatDate(v) : '—') },
      { header: 'Status', key: 'status' },
    ];

    try {
      await exportToPDF(rows, columns, {
        filename: 'relatorio-financeiro',
        title: 'Relatório Financeiro — Sabiencia',
        orientation: 'landscape',
      });
      toast.success('Relatório exportado em PDF!');
    } catch {
      toast.error('Não foi possível gerar o relatório. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
          <p className="text-gray-600 mt-1">
            Controle de pagamentos e receitas da instituição
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportarRelatorio}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {estatisticas.alunosInadimplentes > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Atenção: {estatisticas.alunosInadimplentes} {estatisticas.alunosInadimplentes === 1 ? 'aluno está' : 'alunos estão'} com pagamentos vencidos
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <FinanceiroStats {...estatisticas} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceiroChart pagamentos={pagamentos} tipo="mensal" />
        <FinanceiroChart pagamentos={pagamentos} tipo="status" />
      </div>

      {/* Filtros */}
      <PagamentoFilters
        busca={busca}
        status={status}
        mes={mes}
        ano={ano}
        onBuscaChange={setBusca}
        onStatusChange={setStatus}
        onMesChange={setMes}
        onAnoChange={setAno}
        onLimpar={handleLimparFiltros}
      />

      {/* Lista de Pagamentos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">
              Pagamentos ({pagamentosFiltrados.length})
            </h2>
          </div>
        </div>

        {pagamentosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">
              Nenhum pagamento encontrado
            </h3>
            <p className="text-gray-600">
              {busca || status !== 'todos' || (mes && mes !== 'todos') || (ano && ano !== 'todos')
                ? 'Tente ajustar os filtros de busca'
                : 'Não há pagamentos registrados ainda'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pagamentosFiltrados.map(pagamento => {
              const aluno = alunos.find(a => a.id === pagamento.aluno_id);
              
              return (
                <PagamentoCard
                  key={pagamento.id}
                  pagamento={pagamento}
                  aluno={aluno}
                  onRegistrarPagamento={handleRegistrarPagamento}
                  onCancelar={handleCancelarPagamento}
                  showAlunoInfo={true}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Registro de Pagamento */}
      {pagamentoSelecionado && (
        <PagamentoForm
          pagamento={pagamentoSelecionado}
          open={showRegistroForm}
          onClose={() => {
            setShowRegistroForm(false);
            setPagamentoSelecionado(null);
          }}
          onSubmit={handleSubmitRegistro}
        />
      )}

      {/* Dialog de Confirmação de Cancelamento de Pagamento */}
      <DeleteConfirmDialog
        open={!!pagamentoToCancel}
        onOpenChange={(open) => !open && setPagamentoToCancel(null)}
        onConfirm={handleConfirmCancelar}
        title="Cancelar Pagamento"
        confirmLabel="Confirmar Cancelamento"
        description="Atenção: Ao cancelar este pagamento, o boleto correspondente será invalidado permanentemente. O aluno não receberá mais cobranças para esta parcela, mas o saldo devedor continuará constando no histórico acadêmico até que uma nova negociação seja registrada."
      />
    </div>
  );
};

export default FinanceiroGestorPage;
