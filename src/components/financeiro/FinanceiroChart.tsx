import React, { useMemo, useEffect, useState } from 'react';
import { Pagamento } from '../../types';
import { Card } from '../ui/card';
 
import { formatCurrency } from '../../utils/formatters';

interface FinanceiroChartProps {
  pagamentos: Pagamento[];
  tipo: 'mensal' | 'status';
}

export function FinanceiroChart({ pagamentos, tipo }: FinanceiroChartProps) {
  const [Recharts, setRecharts] = useState<any>(null);
  useEffect(() => {
    let mounted = true;
    import('recharts').then((mod) => {
      if (mounted) setRecharts(mod);
    });
    return () => { mounted = false; };
  }, []);
  if (!Recharts) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px] text-gray-500">Carregando gráfico...</div>
      </Card>
    );
  }
  // Garantir que pagamentos seja sempre um array válido
  const safePagamentos = Array.isArray(pagamentos) ? pagamentos : [];
  
  // Se não houver pagamentos, renderizar estado vazio para ambos os tipos
  if (safePagamentos.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          {tipo === 'mensal' ? 'Receita Mensal' : 'Distribuição por Status'}
        </h3>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          Nenhum pagamento cadastrado
        </div>
      </Card>
    );
  }
  
  const dadosMensais = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dadosPorMes: Record<string, { mes: string; recebido: number; pendente: number; vencido: number }> = {};

    safePagamentos.forEach(pag => {
      const data = new Date(pag.data_vencimento);
      const mesAno = `${meses[data.getMonth()]}/${data.getFullYear().toString().slice(2)}`;
      
      if (!dadosPorMes[mesAno]) {
        dadosPorMes[mesAno] = { mes: mesAno, recebido: 0, pendente: 0, vencido: 0 };
      }

      if (pag.status === 'pago') {
        dadosPorMes[mesAno].recebido += pag.valor;
      } else if (pag.status === 'pendente') {
        dadosPorMes[mesAno].pendente += pag.valor;
      } else if (pag.status === 'vencido') {
        dadosPorMes[mesAno].vencido += pag.valor;
      }
    });

    return Object.values(dadosPorMes).sort((a, b) => {
      const [mesA, anoA] = a.mes.split('/');
      const [mesB, anoB] = b.mes.split('/');
      return anoA === anoB 
        ? meses.indexOf(mesA) - meses.indexOf(mesB)
        : parseInt(anoA) - parseInt(anoB);
    });
  }, [safePagamentos]);

  const dadosStatus = useMemo(() => {
    const totais = { pago: 0, pendente: 0, vencido: 0, cancelado: 0 };

    safePagamentos.forEach(pag => {
      if (pag.status in totais) {
        totais[pag.status as keyof typeof totais] += pag.valor;
      }
    });

    return [
      { name: 'Pago', value: totais.pago, color: '#16a34a' },
      { name: 'Pendente', value: totais.pendente, color: '#eab308' },
      { name: 'Vencido', value: totais.vencido, color: '#dc2626' },
      { name: 'Cancelado', value: totais.cancelado, color: '#6b7280' },
    ].filter(item => item.value > 0);
  }, [safePagamentos]);

  if (tipo === 'mensal') {
    // Se não houver dados, mostrar mensagem
    if (dadosMensais.length === 0) {
      return (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Receita Mensal</h3>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            Nenhum dado disponível
          </div>
        </Card>
      );
    }
    
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Receita Mensal</h3>
        <Recharts.ResponsiveContainer width="100%" height={300}>
          <Recharts.BarChart data={dadosMensais}>
            <Recharts.CartesianGrid strokeDasharray="3 3" />
            <Recharts.XAxis dataKey="mes" />
            <Recharts.YAxis tickFormatter={(value: number) => `R$ ${(value / 1000).toFixed(0)}k`} />
            <Recharts.Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Recharts.Legend />
            <Recharts.Bar dataKey="recebido" name="Recebido" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Recharts.Bar dataKey="pendente" name="Pendente" fill="#eab308" radius={[4, 4, 0, 0]} />
            <Recharts.Bar dataKey="vencido" name="Vencido" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </Recharts.BarChart>
        </Recharts.ResponsiveContainer>
      </Card>
    );
  }

  if (tipo === 'status') {
    // Se não houver dados, mostrar mensagem
    if (dadosStatus.length === 0) {
      return (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            Nenhum dado disponível
          </div>
        </Card>
      );
    }
    
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
        <Recharts.ResponsiveContainer width="100%" height={300}>
          <Recharts.PieChart>
            <Recharts.Pie
              data={dadosStatus}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: { name: string; value: number }) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {dadosStatus.map((entry: { name: string; value: number; color: string }, index: number) => (
                <Recharts.Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
              ))}
            </Recharts.Pie>
            <Recharts.Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px' }}
            />
          </Recharts.PieChart>
        </Recharts.ResponsiveContainer>
        
        {/* Legenda personalizada */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {dadosStatus.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.name}: <span className="font-medium">{formatCurrency(item.value)}</span>
              </span>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Fallback para tipo desconhecido
  return (
    <Card className="p-6">
      <div className="text-gray-500">Tipo de gráfico não suportado</div>
    </Card>
  );
}
