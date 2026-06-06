// ============================================
// FREQUÊNCIA CARD - Visualização de frequência do aluno
// ============================================

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Check, X, FileQuestion, TrendingUp, TrendingDown } from 'lucide-react';
import { calcularPercentualPresenca, obterStatusFrequencia } from '../../schemas/frequenciaSchemas';
import type { Frequencia, Disciplina } from '../../types';

interface FrequenciaCardProps {
  disciplina: Disciplina;
  frequencias: Frequencia[];
  showDetalhes?: boolean;
}

export const FrequenciaCard: React.FC<FrequenciaCardProps> = ({
  disciplina,
  frequencias,
  showDetalhes = false,
}) => {
  // Calcular estatísticas
  const total = frequencias.length;
  const presencas = frequencias.filter(f => f.status === 'presente').length;
  const ausencias = frequencias.filter(f => f.status === 'ausente').length;
  const justificadas = frequencias.filter(f => f.status === 'justificado').length;

  const percentual = calcularPercentualPresenca(total, presencas + justificadas);
  const statusInfo = obterStatusFrequencia(percentual);

  // Últimas 5 frequências (para exibição de tendência)
  const ultimasFrequencias = frequencias
    .sort((a, b) => b.data_aula.getTime() - a.data_aula.getTime())
    .slice(0, 5);

  // Calcular tendência (comparar últimas 3 com as 3 anteriores)
  const recentes = frequencias.slice(0, 3);
  const anteriores = frequencias.slice(3, 6);
  const percentualRecente = calcularPercentualPresenca(
    recentes.length,
    recentes.filter(f => f.status !== 'ausente').length
  );
  const percentualAnterior = calcularPercentualPresenca(
    anteriores.length,
    anteriores.filter(f => f.status !== 'ausente').length
  );
  const tendencia = percentualRecente > percentualAnterior ? 'up' : percentualRecente < percentualAnterior ? 'down' : 'stable';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{disciplina.nome}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {total} aulas registradas
            </p>
          </div>
          <Badge
            variant={statusInfo.cor === 'green' ? 'default' : statusInfo.cor === 'yellow' ? 'secondary' : 'destructive'}
          >
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Percentual de presença */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Frequência</span>
            <span className={`text-2xl font-bold ${
              statusInfo.cor === 'green' ? 'text-green-600' :
              statusInfo.cor === 'yellow' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {percentual}%
            </span>
          </div>
          <Progress value={percentual} className="h-2" />
          <p className="text-xs text-gray-500">
            Mínimo necessário: 75% para aprovação
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-xs text-gray-600">Presentes</span>
            </div>
            <p className="text-xl font-bold text-green-600">{presencas}</p>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <X className="h-4 w-4 text-red-600" />
              <span className="text-xs text-gray-600">Faltas</span>
            </div>
            <p className="text-xl font-bold text-red-600">{ausencias}</p>
          </div>

          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FileQuestion className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-gray-600">Justificadas</span>
            </div>
            <p className="text-xl font-bold text-yellow-600">{justificadas}</p>
          </div>
        </div>

        {/* Tendência */}
        {tendencia !== 'stable' && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            tendencia === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {tendencia === 'up' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {tendencia === 'up' ? 'Frequência melhorando' : 'Atenção: frequência caindo'}
            </span>
          </div>
        )}

        {/* Últimas frequências (detalhes) */}
        {showDetalhes && ultimasFrequencias.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Últimas aulas</p>
            <div className="space-y-2">
              {ultimasFrequencias.map(freq => (
                <div
                  key={freq.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm text-gray-600">
                    {freq.data_aula.toLocaleDateString('pt-BR')}
                  </span>
                  <Badge
                    variant={
                      freq.status === 'presente' ? 'default' :
                      freq.status === 'justificado' ? 'secondary' :
                      'destructive'
                    }
                    className="text-xs"
                  >
                    {freq.status === 'presente' ? 'Presente' :
                     freq.status === 'justificado' ? 'Justificado' :
                     'Ausente'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerta de risco */}
        {percentual < 75 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ Atenção: Você está abaixo dos 75% de frequência necessários para aprovação
            </p>
            <p className="text-xs text-red-600 mt-1">
              {percentual < 60 && 'Risco de reprovação por falta!'}
              {percentual >= 60 && percentual < 75 && `Precisa melhorar em ${(75 - percentual).toFixed(1)}%`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
