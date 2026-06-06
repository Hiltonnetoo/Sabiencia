// ============================================
// BOLETIM CARD - Visualização de notas do aluno
// ============================================

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Trophy, AlertTriangle, TrendingUp } from 'lucide-react';
import { calcularMedia, obterSituacaoAluno, formatarNota, notaPorExtenso } from '../../schemas/notaSchemas';
import type { Nota, Disciplina } from '../../types';

interface BoletimCardProps {
  disciplina: Disciplina;
  notas: Nota[];
  showDetalhes?: boolean;
}

export const BoletimCard: React.FC<BoletimCardProps> = ({
  disciplina,
  notas,
  showDetalhes = true,
}) => {
  // Calcular média ponderada
  const media = calcularMedia(notas.map(n => ({ nota: n.nota, peso: n.peso })));
  const situacao = obterSituacaoAluno(media);

  // Ordenar notas por data
  const notasOrdenadas = [...notas].sort((a, b) => 
    a.data_avaliacao.getTime() - b.data_avaliacao.getTime()
  );

  // Nota mais alta e mais baixa
  const notaMaisAlta = Math.max(...notas.map(n => n.nota));
  const notaMaisBaixa = Math.min(...notas.map(n => n.nota));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{disciplina.nome}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {notas.length} avaliação{notas.length !== 1 ? 'ões' : ''} realizada{notas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Badge
            variant={
              situacao.status === 'aprovado' ? 'default' :
              situacao.status === 'recuperacao' ? 'secondary' :
              'destructive'
            }
          >
            {situacao.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Média Final */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Média Final</p>
            <p className="text-xs text-gray-500 mt-1">{notaPorExtenso(media)}</p>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-bold ${
              situacao.cor === 'green' ? 'text-green-600' :
              situacao.cor === 'yellow' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {formatarNota(media)}
            </p>
            <p className="text-xs text-gray-500">de 10.0</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="h-4 w-4 text-green-600" />
              <span className="text-xs text-gray-600">Maior Nota</span>
            </div>
            <p className="text-xl font-bold text-green-600">{formatarNota(notaMaisAlta)}</p>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs text-gray-600">Menor Nota</span>
            </div>
            <p className="text-xl font-bold text-red-600">{formatarNota(notaMaisBaixa)}</p>
          </div>
        </div>

        {/* Detalhes das Avaliações */}
        {showDetalhes && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Avaliações</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Nota</TableHead>
                  <TableHead className="text-center">Peso</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notasOrdenadas.map((nota, index) => (
                  <TableRow key={nota.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{nota.tipo_avaliacao}</p>
                        {nota.observacao && (
                          <p className="text-xs text-gray-500 mt-1">{nota.observacao}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          nota.nota >= 7 ? 'default' :
                          nota.nota >= 5 ? 'secondary' :
                          'destructive'
                        }
                      >
                        {formatarNota(nota.nota)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-600">
                      {nota.peso}
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-500">
                      {nota.data_avaliacao.toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Mensagem de situação */}
        {situacao.status === 'aprovado' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Parabéns! Você está aprovado nesta disciplina
            </p>
          </div>
        )}

        {situacao.status === 'recuperacao' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Você está em recuperação nesta disciplina
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Necessário obter nota {formatarNota(7 - media)} ou mais na prova de recuperação
            </p>
          </div>
        )}

        {situacao.status === 'reprovado' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Atenção: Risco de reprovação nesta disciplina
            </p>
            <p className="text-xs text-red-700 mt-1">
              Converse com seu professor sobre atividades de recuperação
            </p>
          </div>
        )}

        {/* Dica de melhoria */}
        {media < 7 && media >= 5 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Continue se esforçando!
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Você precisa de mais {formatarNota(7 - media)} pontos para atingir a média 7.0
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
