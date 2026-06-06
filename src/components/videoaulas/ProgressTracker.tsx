// ============================================
// PROGRESS TRACKER - Rastreador de progresso de videoaulas
// ============================================

import React from 'react';
import { CheckCircle, Clock, PlayCircle } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { formatDuration } from '../../utils/youtube';
import type { Videoaula, ProgressoVideoaula } from '../../types/videoaulas';

interface ProgressTrackerProps {
  videoaulas: Videoaula[];
  progressos: ProgressoVideoaula[];
  className?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  videoaulas,
  progressos,
  className = ''
}) => {
  // Calcular estatísticas
  const totalAulas = videoaulas.length;
  const aulasAssistidas = progressos.filter(p => p.percentual_assistido > 0).length;
  const aulasConcluidas = progressos.filter(p => p.concluida).length;
  const percentualGeral = totalAulas > 0 ? (aulasConcluidas / totalAulas) * 100 : 0;

  const tempoTotalSegundos = videoaulas.reduce((sum, v) => sum + v.duracao_segundos, 0);
  const tempoAssistidoSegundos = progressos.reduce((sum, p) => sum + p.tempo_assistido_segundos, 0);

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Título */}
          <div>
            <h3 className="font-semibold text-gray-900">Progresso Geral</h3>
            <p className="text-sm text-gray-600 mt-1">
              Acompanhe seu progresso no curso
            </p>
          </div>

          {/* Barra de Progresso Geral */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Conclusão</span>
              <span className="font-medium text-gray-900">
                {Math.round(percentualGeral)}%
              </span>
            </div>
            <Progress value={percentualGeral} className="h-3" />
          </div>

          {/* Grid de Estatísticas */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Total de Aulas */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PlayCircle className="w-4 h-4" />
                <span>Total de Aulas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalAulas}</p>
            </div>

            {/* Aulas Concluídas */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Concluídas</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{aulasConcluidas}</p>
            </div>

            {/* Tempo Total */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Tempo Total</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatDuration(tempoTotalSegundos)}
              </p>
            </div>

            {/* Tempo Assistido */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Assistido</span>
              </div>
              <p className="text-lg font-semibold text-blue-600">
                {formatDuration(tempoAssistidoSegundos)}
              </p>
            </div>
          </div>

          {/* Badges de Status */}
          <div className="flex gap-2 pt-2 border-t">
            <Badge variant={aulasConcluidas === totalAulas ? 'default' : 'secondary'}>
              {aulasConcluidas === totalAulas ? 'Completo! 🎉' : 'Em Andamento'}
            </Badge>
            {aulasAssistidas > 0 && aulasAssistidas !== aulasConcluidas && (
              <Badge variant="outline">
                {aulasAssistidas} em progresso
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// MINI PROGRESS INDICATOR
// ============================================

interface MiniProgressProps {
  progresso?: ProgressoVideoaula;
  duracao: number;
}

export const MiniProgress: React.FC<MiniProgressProps> = ({ progresso, duracao }) => {
  if (!progresso || progresso.percentual_assistido === 0) {
    return (
      <Badge variant="outline" className="gap-1">
        <PlayCircle className="w-3 h-3" />
        Não assistida
      </Badge>
    );
  }

  if (progresso.concluida) {
    return (
      <Badge variant="default" className="gap-1 bg-green-600">
        <CheckCircle className="w-3 h-3" />
        Concluída
      </Badge>
    );
  }

  return (
    <div className="space-y-1">
      <Badge variant="secondary" className="gap-1">
        <Clock className="w-3 h-3" />
        {Math.round(progresso.percentual_assistido)}% assistido
      </Badge>
      <Progress value={progresso.percentual_assistido} className="h-1" />
    </div>
  );
};
