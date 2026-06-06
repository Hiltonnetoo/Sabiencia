// ============================================
// MINHAS NOTAS PAGE (ALUNO) - Boletim do aluno
// ============================================

import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { BoletimCard } from '../../components/notas/BoletimCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FileCheck, Trophy, AlertTriangle, TrendingUp } from 'lucide-react';
import { calcularMedia, obterSituacaoAluno, formatarNota } from '../../schemas/notaSchemas';

export const MinhasNotasPage: React.FC = () => {
  const { user } = useAuth();
  const { notas, disciplinas } = useMockData();

  // Filtrar notas do aluno
  const minhasNotas = useMemo(() => {
    if (!user) return [];
    return notas.filter(n => n.aluno_id === user.id);
  }, [notas, user]);

  // Agrupar por disciplina
  const notasPorDisciplina = useMemo(() => {
    const grupos = new Map<string, typeof minhasNotas>();
    
    minhasNotas.forEach(nota => {
      const disciplinaId = nota.disciplina_id;
      if (!grupos.has(disciplinaId)) {
        grupos.set(disciplinaId, []);
      }
      grupos.get(disciplinaId)!.push(nota);
    });
    
    return grupos;
  }, [minhasNotas]);

  // Calcular estatísticas gerais
  const estatisticasGerais = useMemo(() => {
    const medias: number[] = [];
    let aprovadas = 0;
    let recuperacao = 0;
    let reprovadas = 0;
    
    notasPorDisciplina.forEach(notas => {
      const media = calcularMedia(notas.map(n => ({ nota: n.nota, peso: n.peso })));
      medias.push(media);
      
      const situacao = obterSituacaoAluno(media);
      if (situacao.status === 'aprovado') aprovadas++;
      else if (situacao.status === 'recuperacao') recuperacao++;
      else reprovadas++;
    });
    
    const mediaGeral = medias.length > 0
      ? medias.reduce((acc, m) => acc + m, 0) / medias.length
      : 0;
    
    return {
      mediaGeral: Number(mediaGeral.toFixed(2)),
      totalDisciplinas: notasPorDisciplina.size,
      aprovadas,
      recuperacao,
      reprovadas,
    };
  }, [notasPorDisciplina]);

  const situacaoGeral = obterSituacaoAluno(estatisticasGerais.mediaGeral);

  // Melhores e piores disciplinas
  const rankingDisciplinas = useMemo(() => {
    const ranking: Array<{ disciplina: string; media: number }> = [];
    
    notasPorDisciplina.forEach((notas, disciplinaId) => {
      const disciplina = disciplinas.find(d => d.id === disciplinaId);
      if (!disciplina) return;
      
      const media = calcularMedia(notas.map(n => ({ nota: n.nota, peso: n.peso })));
      ranking.push({ disciplina: disciplina.nome, media });
    });
    
    return ranking.sort((a, b) => b.media - a.media);
  }, [notasPorDisciplina, disciplinas]);

  const melhoresDisciplinas = rankingDisciplinas.slice(0, 3);
  const pioresDisciplinas = rankingDisciplinas.slice(-3).reverse();

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
          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <FileCheck className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Notas</h1>
            <p className="text-gray-600 mt-1">
              Acompanhe seu desempenho acadêmico
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              situacaoGeral.cor === 'green' ? 'text-green-600' :
              situacaoGeral.cor === 'yellow' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {formatarNota(estatisticasGerais.mediaGeral)}
            </div>
            <Badge
              variant={
                situacaoGeral.status === 'aprovado' ? 'default' :
                situacaoGeral.status === 'recuperacao' ? 'secondary' :
                'destructive'
              }
              className="mt-2"
            >
              {situacaoGeral.label}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{estatisticasGerais.totalDisciplinas}</div>
            <p className="text-xs text-gray-500 mt-2">Com notas lançadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aprovado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{estatisticasGerais.aprovadas}</div>
            <p className="text-xs text-gray-500 mt-2">
              Média ≥ 7.0
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recuperação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{estatisticasGerais.recuperacao}</div>
            <p className="text-xs text-gray-500 mt-2">
              {estatisticasGerais.reprovadas > 0 && `+ ${estatisticasGerais.reprovadas} risco`}
              {estatisticasGerais.reprovadas === 0 && 'Média 5.0-6.9'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Painéis de Desempenho */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Melhores Disciplinas */}
        {melhoresDisciplinas.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Melhores Desempenhos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {melhoresDisciplinas.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-600">{index + 1}º</Badge>
                      <span className="font-medium text-green-900">{item.disciplina}</span>
                    </div>
                    <Badge variant="default">
                      {formatarNota(item.media)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disciplinas que Precisam de Atenção */}
        {pioresDisciplinas.some(d => d.media < 7) && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Disciplinas que Precisam de Atenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pioresDisciplinas
                  .filter(d => d.media < 7)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <span className="font-medium text-yellow-900">{item.disciplina}</span>
                      <Badge
                        variant={item.media >= 5 ? 'secondary' : 'destructive'}
                      >
                        {formatarNota(item.media)}
                      </Badge>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-yellow-700 mt-3">
                💡 Dica: Procure materiais de estudo na biblioteca e tire dúvidas com seus professores
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mensagem de Motivação */}
      {estatisticasGerais.mediaGeral >= 8 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <strong>Excelente trabalho!</strong> Você está com ótimo desempenho. Continue se dedicando!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Boletim por Disciplina */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Boletim Detalhado</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from(notasPorDisciplina.entries()).map(([disciplinaId, notas]) => {
            const disciplina = disciplinas.find(d => d.id === disciplinaId);
            if (!disciplina) return null;
            
            return (
              <BoletimCard
                key={disciplinaId}
                disciplina={disciplina}
                notas={notas}
                showDetalhes={true}
              />
            );
          })}
        </div>
      </div>

      {minhasNotas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileCheck className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              Nenhuma nota lançada ainda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MinhasNotasPage;
