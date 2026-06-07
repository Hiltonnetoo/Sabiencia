// ============================================
// VIDEOAULAS DIALOG - Dialog para assistir videoaulas
// ============================================

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { VideoPlayer } from './VideoPlayer';
import { NotasAula } from './NotasAula';
import { QuizAulaComponent } from './QuizAula';
import { PlayCircle, Clock, Download, FileText, ArrowLeft, CheckCircle, Search, X } from 'lucide-react';
import { formatDuration } from '../../utils/youtube';
import type { Videoaula, TopicoDisciplina } from '../../types/videoaulas';

interface VideoaulasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disciplinaNome: string;
  topicos: TopicoDisciplina[];
  videoaulas: Videoaula[];
  getVideoaulasPorTopico: (topicoId: string) => Videoaula[];
  progressos: any[];
  getProgressoAluno: (alunoId: string, videoaulaId: string) => any;
  alunoId: string;
  onSalvarProgresso: (progresso: any) => void;
  onMarcarComoConcluida: (alunoId: string, videoaulaId: string) => void;
  getAnotacoesPorVideoaula: (videoaulaId: string, alunoId: string) => any[];
  onSalvarAnotacao: (anotacao: any) => void;
  onEditarAnotacao: (anotacaoId: string, conteudo: string) => void;
  onDeletarAnotacao: (anotacaoId: string) => void;
  getQuizPorVideoaula: (videoaulaId: string) => any;
  getRespostasQuiz: (quizId: string, alunoId: string) => any[];
  onSubmeterQuiz: (resposta: any, alunoId: string) => void;
}

export const VideoaulasDialog: React.FC<VideoaulasDialogProps> = ({
  open,
  onOpenChange,
  disciplinaNome,
  topicos,
  videoaulas,
  getVideoaulasPorTopico,
  progressos,
  getProgressoAluno,
  alunoId,
  onSalvarProgresso,
  onMarcarComoConcluida,
  getAnotacoesPorVideoaula,
  onSalvarAnotacao,
  onEditarAnotacao,
  onDeletarAnotacao,
  getQuizPorVideoaula,
  getRespostasQuiz,
  onSubmeterQuiz
}) => {
  const [videoaulaSelecionada, setVideoaulaSelecionada] = useState<Videoaula | null>(null);
  const [abaSelecionada, setAbaSelecionada] = useState('video');
  const [currentTime, setCurrentTime] = useState(0);
  const [, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectVideoaula = (videoaula: Videoaula) => {
    setVideoaulaSelecionada(videoaula);
    setAbaSelecionada('video');
  };

  const handleVoltar = () => {
    setVideoaulaSelecionada(null);
  };

  const handleProgress = (current: number, total: number) => {
    setCurrentTime(current);
    setDuration(total);

    if (!videoaulaSelecionada) return;

    // Salvar progresso a cada 10 segundos
    if (Math.floor(current) % 10 === 0) {
      const percentual = total > 0 ? (current / total) * 100 : 0;
      onSalvarProgresso({
        aluno_id: alunoId,
        videoaula_id: videoaulaSelecionada.id,
        tempo_assistido_segundos: Math.floor(current),
        ultima_posicao_segundos: Math.floor(current),
        concluida: percentual >= 95,
        percentual_assistido: Math.round(percentual)
      });
    }
  };

  const handleComplete = () => {
    if (!videoaulaSelecionada) return;
    onMarcarComoConcluida(alunoId, videoaulaSelecionada.id);
  };

  const progresso = videoaulaSelecionada 
    ? getProgressoAluno(alunoId, videoaulaSelecionada.id)
    : undefined;

  const anotacoes = videoaulaSelecionada
    ? getAnotacoesPorVideoaula(videoaulaSelecionada.id, alunoId)
    : [];

  const quiz = videoaulaSelecionada ? getQuizPorVideoaula(videoaulaSelecionada.id) : undefined;
  const respostasQuiz = quiz ? getRespostasQuiz(quiz.id, alunoId) : [];

  // Ordenar tópicos
  const topicosSorted = [...topicos].sort((a, b) => a.ordem - b.ordem);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{disciplinaNome}</DialogTitle>
          <DialogDescription>
            {videoaulaSelecionada 
              ? 'Assistindo videoaula'
              : 'Selecione uma aula para assistir'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {videoaulaSelecionada ? (
            /* Visualização de Videoaula */
            <div className="space-y-6">
              {/* Botão Voltar */}
              <Button
                variant="outline"
                onClick={handleVoltar}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para lista de aulas
              </Button>

              {/* Título da Aula */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {progresso?.concluida && (
                    <Badge className="gap-1 bg-green-600">
                      <CheckCircle className="w-3 h-3" />
                      Concluída
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {videoaulaSelecionada.titulo}
                </h2>
                <p className="text-gray-600 mt-1">
                  {videoaulaSelecionada.descricao}
                </p>
              </div>

              {/* Tabs: Vídeo, Materiais, Anotações, Quiz */}
              <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="video" className="gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Vídeo
                  </TabsTrigger>
                  <TabsTrigger value="materiais" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Materiais
                    {videoaulaSelecionada.materiais_anexos.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {videoaulaSelecionada.materiais_anexos.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="anotacoes" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Anotações
                    {anotacoes.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {anotacoes.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  {quiz && (
                    <TabsTrigger value="quiz" className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Quiz
                    </TabsTrigger>
                  )}
                </TabsList>

                {/* Tab: Vídeo */}
                <TabsContent value="video" className="space-y-6">
                  <VideoPlayer
                    videoId={videoaulaSelecionada.youtube_id}
                    onProgress={handleProgress}
                    onComplete={handleComplete}
                    savedPosition={progresso?.ultima_posicao_segundos}
                  />

                  {/* Ações */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Duração: {formatDuration(videoaulaSelecionada.duracao_segundos)}
                    </div>
                    {!progresso?.concluida && (
                      <Button
                        variant="outline"
                        onClick={() => onMarcarComoConcluida(alunoId, videoaulaSelecionada.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marcar como concluída
                      </Button>
                    )}
                  </div>
                </TabsContent>

                {/* Tab: Materiais */}
                <TabsContent value="materiais">
                  <Card>
                    <CardContent className="pt-6">
                      {videoaulaSelecionada.materiais_anexos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">Nenhum material disponível</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {videoaulaSelecionada.materiais_anexos.map(material => (
                            <div
                              key={material.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{material.titulo}</p>
                                  <p className="text-xs text-gray-500">
                                    {material.tipo.toUpperCase()}
                                    {material.tamanho_kb && ` • ${(material.tamanho_kb / 1024).toFixed(1)} MB`}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                                Baixar
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Anotações */}
                <TabsContent value="anotacoes">
                  <NotasAula
                    videoaulaId={videoaulaSelecionada.id}
                    alunoId={alunoId}
                    anotacoes={anotacoes}
                    onSalvarAnotacao={onSalvarAnotacao}
                    onDeletarAnotacao={onDeletarAnotacao}
                    onEditarAnotacao={onEditarAnotacao}
                    currentTime={currentTime}
                  />
                </TabsContent>

                {/* Tab: Quiz */}
                {quiz && (
                  <TabsContent value="quiz">
                    <QuizAulaComponent
                      quiz={quiz}
                      respostasAnteriores={respostasQuiz}
                      onSubmitQuiz={(resposta) => onSubmeterQuiz(resposta, alunoId)}
                    />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          ) : (
            /* Lista de Tópicos e Videoaulas */
            <div className="space-y-4">
              {/* Campo de Busca */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar videoaulas..."
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {topicosSorted.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Nenhuma videoaula disponível ainda</p>
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {topicosSorted.map(topico => {
                    const videoaulasTopico = getVideoaulasPorTopico(topico.id)
                      .sort((a, b) => a.ordem_dentro_topico - b.ordem_dentro_topico)
                      .filter(v => {
                        if (!searchTerm) return true;
                        const termo = searchTerm.toLowerCase();
                        return v.titulo.toLowerCase().includes(termo) || 
                               v.descricao.toLowerCase().includes(termo);
                      });

                    if (videoaulasTopico.length === 0) return null;

                    return (
                      <AccordionItem key={topico.id} value={topico.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-semibold text-gray-900">{topico.titulo}</span>
                            <Badge variant="outline">
                              {videoaulasTopico.length} aula{videoaulasTopico.length > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-2">
                          {videoaulasTopico.map(videoaula => {
                            const prog = getProgressoAluno(alunoId, videoaula.id);
                            return (
                              <div
                                key={videoaula.id}
                                onClick={() => handleSelectVideoaula(videoaula)}
                                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  {/* Icon/Thumbnail */}
                                  <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                    <PlayCircle className="w-6 h-6 text-blue-600" />
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                      {videoaula.titulo}
                                      {prog?.concluida && (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      )}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(videoaula.duracao_segundos)}
                                      </span>
                                      {videoaula.materiais_anexos.length > 0 && (
                                        <span className="flex items-center gap-1">
                                          <FileText className="w-3 h-3" />
                                          {videoaula.materiais_anexos.length} material{videoaula.materiais_anexos.length > 1 ? 'is' : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Progress */}
                                  {prog && !prog.concluida && (
                                    <div className="text-xs text-gray-500">
                                      {prog.percentual_assistido}%
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};