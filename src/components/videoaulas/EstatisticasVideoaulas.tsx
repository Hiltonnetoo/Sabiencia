// ============================================
// ESTATÍSTICAS VIDEOAULAS - Exibe progresso por tópico
// ============================================

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BookOpen,
  Target
} from 'lucide-react';
import { formatDuration } from '../../utils/youtube';
import type { TopicoDisciplina, Videoaula, ProgressoVideoaula } from '../../types/videoaulas';

interface EstatisticasVideoaulasProps {
  topicos: TopicoDisciplina[];
  videoaulas: Videoaula[];
  progressos: ProgressoVideoaula[];
  alunoId: string;
  getVideoaulasPorTopico: (topicoId: string) => Videoaula[];
}

export const EstatisticasVideoaulas: React.FC<EstatisticasVideoaulasProps> = ({
  topicos,
  videoaulas,
  progressos,
  alunoId,
  getVideoaulasPorTopico
}) => {
  // Calcular estatísticas gerais
  const totalVideoaulas = videoaulas.length;
  const totalConcluidas = progressos.filter(p => p.aluno_id === alunoId && p.concluida).length;
  const percentualGeral = totalVideoaulas > 0 ? (totalConcluidas / totalVideoaulas) * 100 : 0;
  
  const tempoTotalSegundos = videoaulas.reduce((sum, v) => sum + v.duracao_segundos, 0);
  const tempoAssistidoSegundos = progressos
    .filter(p => p.aluno_id === alunoId)
    .reduce((sum, p) => sum + p.tempo_assistido_segundos, 0);

  // Estatísticas por tópico
  const estatisticasTopicos = topicos
    .sort((a, b) => a.ordem - b.ordem)
    .map(topico => {
      const videoaulasTopico = getVideoaulasPorTopico(topico.id);
      const total = videoaulasTopico.length;
      const concluidas = videoaulasTopico.filter(v => {
        const prog = progressos.find(p => p.aluno_id === alunoId && p.videoaula_id === v.id);
        return prog?.concluida;
      }).length;
      const percentual = total > 0 ? (concluidas / total) * 100 : 0;
      
      const duracaoTotal = videoaulasTopico.reduce((sum, v) => sum + v.duracao_segundos, 0);

      return {
        topico,
        total,
        concluidas,
        percentual,
        duracaoTotal
      };
    });

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Aulas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{totalVideoaulas}</p>
                <p className="text-sm text-gray-500">videoaulas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Aulas Concluídas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{totalConcluidas}</p>
                <p className="text-sm text-gray-500">de {totalVideoaulas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Progresso Geral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{Math.round(percentualGeral)}%</p>
                <p className="text-sm text-gray-500">completado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Tempo Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatDuration(tempoTotalSegundos)}</p>
                <p className="text-sm text-gray-500">de conteúdo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Geral</CardTitle>
          <CardDescription>
            Você concluiu {totalConcluidas} de {totalVideoaulas} videoaulas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Conclusão</span>
              <span className="font-medium">{Math.round(percentualGeral)}%</span>
            </div>
            <Progress value={percentualGeral} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Progresso por Tópico */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progresso por Tópico</CardTitle>
              <CardDescription>
                Acompanhe seu andamento em cada módulo
              </CardDescription>
            </div>
            <BookOpen className="w-5 h-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          {estatisticasTopicos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Nenhum tópico disponível</p>
            </div>
          ) : (
            <div className="space-y-4">
              {estatisticasTopicos.map(({ topico, total, concluidas, percentual, duracaoTotal }) => (
                <div
                  key={topico.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{topico.titulo}</h4>
                      {topico.descricao && (
                        <p className="text-sm text-gray-600 mt-1">{topico.descricao}</p>
                      )}
                    </div>
                    <Badge
                      variant={percentual === 100 ? 'default' : percentual >= 50 ? 'secondary' : 'outline'}
                      className="ml-2"
                    >
                      {Math.round(percentual)}%
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4" />
                          {total} aula{total !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {concluidas} concluída{concluidas !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(duracaoTotal)}
                        </span>
                      </div>
                      <span className="font-medium">
                        {concluidas}/{total}
                      </span>
                    </div>
                    <Progress value={percentual} className="h-2" />
                  </div>

                  {percentual === 100 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Tópico concluído!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Próximos Passos */}
      {percentualGeral < 100 && totalVideoaulas > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle className="text-base text-blue-900">
                  Continue Aprendendo!
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Você está fazendo um ótimo progresso
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-blue-900">
                <strong>{totalVideoaulas - totalConcluidas}</strong> videoaula
                {totalVideoaulas - totalConcluidas !== 1 ? 's' : ''} restante
                {totalVideoaulas - totalConcluidas !== 1 ? 's' : ''} para completar 100%
              </p>
              {estatisticasTopicos.find(e => e.percentual < 100 && e.percentual > 0) && (
                <p className="text-sm text-blue-800">
                  Sugestão: Continue o tópico{' '}
                  <strong>
                    {estatisticasTopicos.find(e => e.percentual < 100 && e.percentual > 0)?.topico.titulo}
                  </strong>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parabéns! */}
      {percentualGeral === 100 && totalVideoaulas > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <CardTitle className="text-base text-green-900">
                  Parabéns! 🎉
                </CardTitle>
                <CardDescription className="text-green-700">
                  Você concluiu todas as videoaulas!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-900">
              Você assistiu todas as {totalVideoaulas} videoaulas disponíveis. 
              Continue revisando o conteúdo e pratique com os exercícios!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
