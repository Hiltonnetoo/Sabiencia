// ============================================
// GRÁFICO DESEMPENHO - Visualização de dados
// ============================================

import React, { useEffect, useState } from 'react';

interface GraficoDesempenhoProps {
  tipo: 'line' | 'bar' | 'pie';
  dados: any[];
  titulo?: string;
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
];

export function GraficoDesempenho({
  tipo,
  dados,
  titulo,
  dataKey = 'value',
  xAxisKey = 'name',
  colors = DEFAULT_COLORS,
}: GraficoDesempenhoProps) {
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
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Carregando gráfico...</p>
      </div>
    );
  }
  
  // Sanitizar dados: remover NaN, Infinity, null, undefined
  const dadosSanitizados = dados?.filter(item => {
    const value = item[dataKey];
    return (
      item != null &&
      value != null &&
      typeof value === 'number' &&
      !isNaN(value) &&
      isFinite(value)
    );
  }).map(item => ({
    ...item,
    [dataKey]: Number(item[dataKey].toFixed(2)), // Arredondar para 2 casas decimais
  })) || [];
  
  if (!dadosSanitizados || dadosSanitizados.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Sem dados para exibir</p>
      </div>
    );
  }

  // Renderizar o gráfico apropriado
  let chartContent;
  
  if (tipo === 'line') {
    chartContent = (
      <Recharts.LineChart data={dadosSanitizados}>
        <Recharts.CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <Recharts.XAxis 
          dataKey={xAxisKey} 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Recharts.YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Recharts.Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Recharts.Legend />
        <Recharts.Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={colors[0]} 
          strokeWidth={2}
          dot={{ fill: colors[0], r: 4 }}
          activeDot={{ r: 6 }}
        />
      </Recharts.LineChart>
    );
  } else if (tipo === 'bar') {
    chartContent = (
      <Recharts.BarChart data={dadosSanitizados}>
        <Recharts.CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <Recharts.XAxis 
          dataKey={xAxisKey} 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Recharts.YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Recharts.Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Recharts.Legend />
        <Recharts.Bar 
          dataKey={dataKey} 
          fill={colors[0]}
          radius={[4, 4, 0, 0]}
        />
      </Recharts.BarChart>
    );
  } else if (tipo === 'pie') {
    chartContent = (
      <Recharts.PieChart>
        <Recharts.Pie
          data={dadosSanitizados}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry: Record<string, any>) => `${entry[xAxisKey]}: ${entry[dataKey]}`}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {dadosSanitizados.map((entry, index) => (
            <Recharts.Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Recharts.Pie>
        <Recharts.Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Recharts.Legend />
      </Recharts.PieChart>
    );
  } else {
    // Tipo de gráfico não suportado
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Tipo de gráfico não suportado</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {titulo && (
        <h3 className="text-gray-900 mb-4">{titulo}</h3>
      )}
      
      <Recharts.ResponsiveContainer width="100%" height={300}>
        {chartContent}
      </Recharts.ResponsiveContainer>
    </div>
  );
}
