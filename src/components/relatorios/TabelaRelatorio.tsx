// ============================================
// TABELA RELATÓRIO - Tabela genérica para relatórios
// OTIMIZADO: React.memo + useMemo para evitar re-renders desnecessários
// ============================================

import React, { useMemo, memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';

interface Coluna {
  key: string;
  label: string;
  tipo?: 'text' | 'number' | 'badge' | 'percentage';
  badge?: {
    variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>;
    labels?: Record<string, string>;
  };
}

interface TabelaRelatorioProps {
  titulo?: string;
  colunas: Coluna[];
  dados: any[];
  emptyMessage?: string;
}

// Função pura fora do componente — não recriada em cada render
function formatarValor(valor: any, coluna: Coluna): React.ReactNode {
  if (valor === null || valor === undefined) {
    return '-';
  }

  switch (coluna.tipo) {
    case 'number':
      return typeof valor === 'number' ? valor.toFixed(2) : valor;

    case 'percentage':
      return typeof valor === 'number' ? `${valor.toFixed(1)}%` : valor;

    case 'badge':
      if (coluna.badge) {
        const variant = coluna.badge.variants[valor] || 'default';
        const label = coluna.badge.labels?.[valor] || valor;
        return <Badge variant={variant}>{label}</Badge>;
      }
      return <Badge>{valor}</Badge>;

    default:
      return valor;
  }
}

export const TabelaRelatorio = memo(function TabelaRelatorio({
  titulo,
  colunas,
  dados,
  emptyMessage = 'Nenhum dado encontrado',
}: TabelaRelatorioProps) {

  // Memoizar linhas para evitar recriação quando o pai re-renderiza sem mudança nos dados
  const rows = useMemo(() =>
    dados.map((item, index) => (
      <TableRow key={index}>
        {colunas.map((coluna) => (
          <TableCell key={coluna.key}>
            {formatarValor(item[coluna.key], coluna)}
          </TableCell>
        ))}
      </TableRow>
    )),
    [dados, colunas]
  );

  if (dados.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        {titulo && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-gray-900">{titulo}</h3>
          </div>
        )}
        <div className="p-12 text-center text-gray-600">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {titulo && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">{titulo}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {colunas.map((coluna) => (
                <TableHead key={coluna.key}>{coluna.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
