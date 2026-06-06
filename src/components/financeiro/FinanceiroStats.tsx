import React from 'react';
import { Card } from '../ui/card';
import { formatCurrency } from '../../utils/formatters';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Users 
} from 'lucide-react';

interface FinanceiroStatsProps {
  receitaTotal: number;
  receitaRecebida: number;
  receitaPendente: number;
  receitaVencida: number;
  totalPagamentos: number;
  alunosAdimplentes: number;
  alunosInadimplentes: number;
  previsaoMes: number;
}

export function FinanceiroStats({
  receitaTotal,
  receitaRecebida,
  receitaPendente,
  receitaVencida,
  totalPagamentos,
  alunosAdimplentes,
  alunosInadimplentes,
  previsaoMes
}: FinanceiroStatsProps) {
  
  const percentualRecebido = receitaTotal > 0 
    ? (receitaRecebida / receitaTotal) * 100 
    : 0;

  const percentualInadimplencia = receitaTotal > 0
    ? (receitaVencida / receitaTotal) * 100
    : 0;

  const stats = [
    {
      titulo: 'Receita Total',
      valor: receitaTotal,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      descricao: `${totalPagamentos} pagamentos`,
    },
    {
      titulo: 'Receita Recebida',
      valor: receitaRecebida,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      descricao: `${percentualRecebido.toFixed(1)}% do total`,
      trend: percentualRecebido >= 80 ? 'up' : 'down',
    },
    {
      titulo: 'Receita Pendente',
      valor: receitaPendente,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      descricao: 'Aguardando pagamento',
    },
    {
      titulo: 'Receita Vencida',
      valor: receitaVencida,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      descricao: `${percentualInadimplencia.toFixed(1)}% inadimplência`,
      trend: 'down',
    },
    {
      titulo: 'Alunos Adimplentes',
      valor: alunosAdimplentes,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      descricao: 'Sem pendências',
      isCount: true,
    },
    {
      titulo: 'Alunos Inadimplentes',
      valor: alunosInadimplentes,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      descricao: 'Com pagamentos vencidos',
      isCount: true,
    },
    {
      titulo: 'Previsão do Mês',
      valor: previsaoMes,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      descricao: 'Receita esperada',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  {stat.trend && (
                    <TrendingUp 
                      className={`w-4 h-4 ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'
                      }`} 
                    />
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-1">{stat.titulo}</p>
                
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.isCount ? stat.valor : formatCurrency(stat.valor)}
                </p>
                
                <p className="text-xs text-gray-500">{stat.descricao}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
