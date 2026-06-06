// ============================================
// MINHA FREQUÊNCIA PAGE (ALUNO) - Visualização de frequência
// ============================================

import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { FrequenciaCard } from '../../components/frequencia/FrequenciaCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { calcularPercentualPresenca, obterStatusFrequencia } from '../../schemas/frequenciaSchemas';

export const MinhaFrequenciaPage: React.FC = () => {
  const { user } = useAuth();
  const { frequencias, disciplinas, matriculas } = useMockData();

  // Filtrar frequências do aluno
  const minhasFrequencias = useMemo(() => {
    if (!user) return [];
    return frequencias.filter(f => f.aluno_id === user.id);
  }, [frequencias, user]);

  // Agrupar por disciplina
  const frequenciasPorDisciplina = useMemo(() => {
    const grupos = new Map<string, typeof minhasFrequencias>();
    
    minhasFrequencias.forEach(freq => {
      const disciplinaId = freq.disciplina_id;
      if (!grupos.has(disciplinaId)) {
        grupos.set(disciplinaId, []);
      }
      grupos.get(disciplinaId)!.push(freq);
    });
    
    return grupos;
  }, [minhasFrequencias]);

  // Calcular estatísticas gerais
  const estatisticasGerais = useMemo(() => {
    const total = minhasFrequencias.length;
    const presencas = minhasFrequencias.filter(f => f.status === 'presente').length;
    const ausencias = minhasFrequencias.filter(f => f.status === 'ausente').length;
    const justificadas = minhasFrequencias.filter(f => f.status === 'justificado').length;
    const percentual = calcularPercentualPresenca(total, presencas + justificadas);
    
    return { total, presencas, ausencias, justificadas, percentual };
  }, [minhasFrequencias]);

  const statusGeral = obterStatusFrequencia(estatisticasGerais.percentual);

  // Disciplinas com frequência crítica
  const disciplinasCriticas = useMemo(() => {
    const criticas: Array<{ disciplina: string; percentual: number }> = [];
    
    frequenciasPorDisciplina.forEach((freqs, disciplinaId) => {
      const total = freqs.length;
      const presencas = freqs.filter(f => f.status !== 'ausente').length;
      const percentual = calcularPercentualPresenca(total, presencas);
      
      if (percentual < 75) {
        const disciplina = disciplinas.find(d => d.id === disciplinaId);
        if (disciplina) {
          criticas.push({ disciplina: disciplina.nome, percentual });
        }
      }
    });
    
    return criticas.sort((a, b) => a.percentual - b.percentual);
  }, [frequenciasPorDisciplina, disciplinas]);

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">Você precisa estar logado para acessar esta página</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minha Frequência</h1>
            <p className="text-gray-600 mt-1">
              Acompanhe sua presença nas aulas
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Frequência Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              statusGeral.cor === 'green' ? 'text-green-600' :
              statusGeral.cor === 'yellow' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {estatisticasGerais.percentual}%
            </div>
            <Badge
              variant={
                statusGeral.cor === 'green' ? 'default' :
                statusGeral.cor === 'yellow' ? 'secondary' :
                'destructive'
              }
              className="mt-2"
            >
              {statusGeral.label}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total de Aulas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{estatisticasGerais.total}</div>
            <p className="text-xs text-gray-500 mt-2">Registradas no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Presenças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{estatisticasGerais.presencas}</div>
            <p className="text-xs text-gray-500 mt-2">
              + {estatisticasGerais.justificadas} justificadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Faltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{estatisticasGerais.ausencias}</div>
            <p className="text-xs text-gray-500 mt-2">
              {estatisticasGerais.ausencias === 0 ? 'Parabéns!' : 'Sem justificativa'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Frequência Crítica */}
      {disciplinasCriticas.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atenção: Disciplinas com Frequência Crítica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-800 mb-3">
              Você está abaixo dos 75% de frequência necessários nas seguintes disciplinas:
            </p>
            <div className="space-y-2">
              {disciplinasCriticas.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <span className="font-medium text-red-900">{item.disciplina}</span>
                  <Badge variant="destructive">
                    {item.percentual}% de frequência
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-red-700 mt-3">
              ⚠️ Frequência abaixo de 75% pode resultar em reprovação por falta!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dica */}
      {estatisticasGerais.percentual >= 75 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <strong>Parabéns!</strong> Sua frequência está adequada. Continue assim!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Frequência por Disciplina */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequência por Disciplina</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from(frequenciasPorDisciplina.entries()).map(([disciplinaId, freqs]) => {
            const disciplina = disciplinas.find(d => d.id === disciplinaId);
            if (!disciplina) return null;
            
            return (
              <FrequenciaCard
                key={disciplinaId}
                disciplina={disciplina}
                frequencias={freqs}
                showDetalhes={true}
              />
            );
          })}
        </div>
      </div>

      {minhasFrequencias.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              Nenhuma frequência registrada ainda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MinhaFrequenciaPage;
