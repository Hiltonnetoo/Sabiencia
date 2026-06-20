// ============================================
// QUIZ AULA - Questionário após videoaula
// ============================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CheckCircle, XCircle, Trophy, RefreshCw, Info } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import type { QuizAula, RespostaQuiz, RespostaPergunta } from '../../types/videoaulas';

interface QuizAulaProps {
  quiz: QuizAula;
  respostasAnteriores?: RespostaQuiz[];
  onSubmitQuiz: (resposta: Omit<RespostaQuiz, 'id' | 'data_realizacao'>) => void;
  className?: string;
}

export const QuizAulaComponent: React.FC<QuizAulaProps> = ({
  quiz,
  respostasAnteriores = [],
  onSubmitQuiz,
  className = ''
}) => {
  const { t } = useTranslation();
  const [respostas, setRespostas] = useState<{ [questaoId: string]: string }>({});
  const [mostrandoResultado, setMostrandoResultado] = useState(false);
  const [resultado, setResultado] = useState<RespostaQuiz | null>(null);
  const [inicioQuiz, setInicioQuiz] = useState<Date | null>(null);

  const tentativasRealizadas = respostasAnteriores.length;
  const ultimaTentativa = respostasAnteriores.length > 0 
    ? respostasAnteriores[respostasAnteriores.length - 1]
    : null;

  const podeRefazer = quiz.permite_refazer && 
    (!quiz.max_tentativas || tentativasRealizadas < quiz.max_tentativas);

  const handleIniciarQuiz = () => {
    setRespostas({});
    setMostrandoResultado(false);
    setResultado(null);
    setInicioQuiz(new Date());
  };

  const handleRespostaChange = (questaoId: string, resposta: string) => {
    setRespostas(prev => ({
      ...prev,
      [questaoId]: resposta
    }));
  };

  const handleSubmit = () => {
    // Verificar se todas as questões foram respondidas
    const questoesNaoRespondidas = quiz.questoes.filter(q => !respostas[q.id]);
    if (questoesNaoRespondidas.length > 0) {
      toast.error(t('components.videoaulas.quiz.answerAllQuestions', { count: questoesNaoRespondidas.length }));
      return;
    }

    // Calcular nota
    const respostasPergunta: RespostaPergunta[] = quiz.questoes.map(questao => {
      const respostaAluno = respostas[questao.id];
      let correta = false;
      let pontosObtidos = 0;

      if (questao.tipo === 'multipla_escolha' || questao.tipo === 'verdadeiro_falso') {
        correta = respostaAluno === questao.resposta_correta;
        pontosObtidos = correta ? questao.peso : 0;
      } else if (questao.tipo === 'dissertativa') {
        // Dissertativas precisam de correção manual, por enquanto não pontua
        correta = false;
        pontosObtidos = 0;
      }

      return {
        questao_id: questao.id,
        resposta: respostaAluno,
        correta,
        pontos_obtidos: pontosObtidos
      };
    });

    const pesoTotal = quiz.questoes.reduce((sum, q) => sum + q.peso, 0);
    const pontosObtidos = respostasPergunta.reduce((sum, r) => sum + r.pontos_obtidos, 0);
    const nota = pesoTotal > 0 ? (pontosObtidos / pesoTotal) * 100 : 0;
    const aprovado = nota >= quiz.nota_minima_aprovacao;

    const tempoGastoSegundos = inicioQuiz 
      ? Math.floor((new Date().getTime() - inicioQuiz.getTime()) / 1000)
      : 0;

    const novoResultado: Omit<RespostaQuiz, 'id' | 'data_realizacao'> = {
      quiz_id: quiz.id,
      aluno_id: '', // Será preenchido pelo contexto
      respostas: respostasPergunta,
      nota: Math.round(nota),
      aprovado,
      tentativa: tentativasRealizadas + 1,
      tempo_gasto_segundos: tempoGastoSegundos
    };

    setResultado(novoResultado as RespostaQuiz);
    setMostrandoResultado(true);
    onSubmitQuiz(novoResultado);

    if (aprovado) {
      toast.success(t('components.videoaulas.quiz.passedToast', { value: Math.round(nota) }));
    } else {
      toast.error(t('components.videoaulas.quiz.failedToast'));
    }
  };

  // Se já respondeu e não pode refazer, mostrar último resultado
  if (ultimaTentativa && !podeRefazer && !mostrandoResultado) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{quiz.titulo}</CardTitle>
              <CardDescription>{quiz.descricao}</CardDescription>
            </div>
            <Badge variant={ultimaTentativa.aprovado ? 'default' : 'destructive'}>
              {ultimaTentativa.aprovado ? t('components.videoaulas.quiz.approved') : t('components.videoaulas.quiz.failed')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResultadoQuiz resultado={ultimaTentativa} quiz={quiz} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              {quiz.titulo}
            </CardTitle>
            <CardDescription>{quiz.descricao}</CardDescription>
          </div>
          {tentativasRealizadas > 0 && (
            <Badge variant="outline">
              {quiz.max_tentativas
                ? t('components.videoaulas.quiz.attemptOf', { current: tentativasRealizadas + 1, max: quiz.max_tentativas })
                : t('components.videoaulas.quiz.attempt', { current: tentativasRealizadas + 1 })}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info */}
        {!inicioQuiz && (
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <ul className="text-sm space-y-1 mt-2">
                <li>• <strong>{quiz.questoes.length}</strong> {t('components.videoaulas.quiz.questionsCount', { count: quiz.questoes.length })}</li>
                <li>• {t('components.videoaulas.quiz.minPassGrade', { value: quiz.nota_minima_aprovacao })}</li>
                {quiz.max_tentativas && (
                  <li>• {t('components.videoaulas.quiz.maxAttempts', { count: quiz.max_tentativas })}</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {!mostrandoResultado ? (
          <>
            {/* Questões */}
            {inicioQuiz ? (
              <div className="space-y-6">
                {quiz.questoes.map((questao, index) => (
                  <div key={questao.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{questao.pergunta}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('components.videoaulas.quiz.weightPoints', { count: questao.peso })}
                        </p>
                      </div>
                    </div>

                    {/* Múltipla Escolha */}
                    {questao.tipo === 'multipla_escolha' && questao.opcoes && (
                      <RadioGroup
                        value={respostas[questao.id]}
                        onValueChange={(value) => handleRespostaChange(questao.id, value)}
                      >
                        <div className="space-y-2">
                          {questao.opcoes.map((opcao) => (
                            <div key={opcao.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={opcao.id} id={`${questao.id}-${opcao.id}`} />
                              <Label
                                htmlFor={`${questao.id}-${opcao.id}`}
                                className="cursor-pointer flex-1"
                              >
                                {opcao.texto}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    )}

                    {/* Verdadeiro/Falso */}
                    {questao.tipo === 'verdadeiro_falso' && (
                      <RadioGroup
                        value={respostas[questao.id]}
                        onValueChange={(value) => handleRespostaChange(questao.id, value)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id={`${questao.id}-true`} />
                            <Label htmlFor={`${questao.id}-true`} className="cursor-pointer">
                              {t('components.videoaulas.quiz.true')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id={`${questao.id}-false`} />
                            <Label htmlFor={`${questao.id}-false`} className="cursor-pointer">
                              {t('components.videoaulas.quiz.false')}
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    )}

                    {/* Dissertativa */}
                    {questao.tipo === 'dissertativa' && (
                      <Textarea
                        placeholder={t('components.videoaulas.quiz.answerPlaceholder')}
                        value={respostas[questao.id] || ''}
                        onChange={(e) => handleRespostaChange(questao.id, e.target.value)}
                        rows={4}
                      />
                    )}
                  </div>
                ))}

                <Button onClick={handleSubmit} className="w-full" size="lg">
                  {t('components.videoaulas.quiz.submitAnswers')}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button onClick={handleIniciarQuiz} size="lg" className="gap-2">
                  <Trophy className="w-5 h-5" />
                  {tentativasRealizadas > 0 ? t('components.videoaulas.quiz.tryAgain') : t('components.videoaulas.quiz.startQuiz')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <ResultadoQuiz resultado={resultado!} quiz={quiz} />
            {podeRefazer && (
              <Button
                onClick={handleIniciarQuiz}
                variant="outline"
                className="w-full gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {t('components.videoaulas.quiz.tryAgain')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================
// RESULTADO DO QUIZ
// ============================================

interface ResultadoQuizProps {
  resultado: RespostaQuiz;
  quiz: QuizAula;
}

const ResultadoQuiz: React.FC<ResultadoQuizProps> = ({ resultado, quiz }) => {
  const { t } = useTranslation();
  const questoesCorretas = resultado.respostas.filter(r => r.correta).length;
  const totalQuestoes = quiz.questoes.length;

  return (
    <div className="space-y-4">
      {/* Header do Resultado */}
      <div className="text-center p-6 rounded-lg" style={{
        background: resultado.aprovado 
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      }}>
        {resultado.aprovado ? (
          <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
        ) : (
          <XCircle className="w-16 h-16 text-white mx-auto mb-3" />
        )}
        <h3 className="text-2xl font-bold text-white mb-2">
          {resultado.aprovado ? t('components.videoaulas.quiz.resultPassedTitle') : t('components.videoaulas.quiz.resultFailedTitle')}
        </h3>
        <p className="text-white/90 mb-4">
          {resultado.aprovado
            ? t('components.videoaulas.quiz.resultPassedMessage')
            : t('components.videoaulas.quiz.resultFailedMessage', { value: quiz.nota_minima_aprovacao })
          }
        </p>
        <div className="inline-block px-6 py-3 bg-white/20 rounded-lg backdrop-blur">
          <p className="text-4xl font-bold text-white">{resultado.nota}%</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{questoesCorretas}</p>
            <p className="text-sm text-gray-600">{t('components.videoaulas.quiz.correct')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{totalQuestoes - questoesCorretas}</p>
            <p className="text-sm text-gray-600">{t('components.videoaulas.quiz.wrong')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{t('components.videoaulas.quiz.timeMin', { value: Math.floor(resultado.tempo_gasto_segundos / 60) })}</p>
            <p className="text-sm text-gray-600">{t('components.videoaulas.quiz.time')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">{t('components.videoaulas.quiz.hits')}</span>
          <span className="font-medium">{t('components.videoaulas.quiz.hitsOf', { correct: questoesCorretas, total: totalQuestoes })}</span>
        </div>
        <Progress value={(questoesCorretas / totalQuestoes) * 100} className="h-2" />
      </div>

      {/* Revisão das Questões (opcional - pode mostrar só se errou) */}
      {!resultado.aprovado && (
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-semibold text-gray-900">{t('components.videoaulas.quiz.review')}</h4>
          {quiz.questoes.map((questao, index) => {
            const respostaAluno = resultado.respostas.find(r => r.questao_id === questao.id);
            if (!respostaAluno || respostaAluno.correta) return null;

            return (
              <div key={questao.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {t('components.videoaulas.quiz.questionNumber', { number: index + 1, question: questao.pergunta })}
                    </p>
                    {questao.explicacao && (
                      <p className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border border-gray-200">
                        <strong>{t('components.videoaulas.quiz.explanation')}</strong> {questao.explicacao}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};