// ============================================
// RELATÓRIO CARD - Card de relatório
// ============================================

import { FileText, Download, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatDate } from '../../utils/formatters';
import type { TipoRelatorio } from '../../schemas/relatorioSchemas';

interface RelatorioCardProps {
  tipo: TipoRelatorio;
  titulo: string;
  descricao: string;
  periodo?: string;
  dataGeracao?: Date;
  metricas?: {
    label: string;
    valor: string | number;
    variacao?: number;
    tipo?: 'positivo' | 'negativo' | 'neutro';
  }[];
  onVisualizar?: () => void;
  onExportar?: () => void;
}

const TIPO_LABELS: Record<TipoRelatorio, string> = {
  desempenho_aluno: 'Desempenho do Aluno',
  desempenho_turma: 'Desempenho da Turma',
  frequencia: 'Frequência',
  financeiro: 'Financeiro',
  disciplina: 'Por Disciplina',
  observacoes: 'Observações',
  geral: 'Relatório Geral',
};

const TIPO_COLORS: Record<TipoRelatorio, string> = {
  desempenho_aluno: 'bg-blue-100 text-blue-700',
  desempenho_turma: 'bg-green-100 text-green-700',
  frequencia: 'bg-purple-100 text-purple-700',
  financeiro: 'bg-yellow-100 text-yellow-700',
  disciplina: 'bg-pink-100 text-pink-700',
  observacoes: 'bg-indigo-100 text-indigo-700',
  geral: 'bg-gray-100 text-gray-700',
};

export function RelatorioCard({
  tipo,
  titulo,
  descricao,
  periodo,
  dataGeracao,
  metricas,
  onVisualizar,
  onExportar,
}: RelatorioCardProps) {
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-gray-900 mb-1">{titulo}</h3>
            <p className="text-sm text-gray-600">{descricao}</p>
          </div>
        </div>
        <Badge variant="secondary" className={TIPO_COLORS[tipo]}>
          {TIPO_LABELS[tipo]}
        </Badge>
      </div>

      {/* Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        {periodo && (
          <span>Período: <strong>{periodo}</strong></span>
        )}
        {dataGeracao && (
          <span>Gerado em: <strong>{formatDate(dataGeracao)}</strong></span>
        )}
      </div>

      {/* Métricas */}
      {metricas && metricas.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {metricas.map((metrica, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">{metrica.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-900">{metrica.valor}</p>
                {metrica.variacao !== undefined && metrica.variacao !== 0 && (
                  <span className={`text-xs flex items-center gap-0.5 ${
                    metrica.tipo === 'positivo' 
                      ? 'text-green-600' 
                      : metrica.tipo === 'negativo'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {metrica.variacao > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(metrica.variacao)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        {onVisualizar && (
          <Button
            variant="outline"
            size="sm"
            onClick={onVisualizar}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
        )}
        {onExportar && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportar}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        )}
      </div>
    </div>
  );
}
