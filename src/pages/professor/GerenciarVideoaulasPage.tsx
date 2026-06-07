// ============================================
// GERENCIAR VIDEOAULAS PAGE - Página para professor/gestor gerenciar videoaulas com tópicos
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { useVideoaulas } from '../../contexts/VideoaulasContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  FolderPlus,
  FileText,
  Upload,
  GripVertical,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { toast } from 'sonner';
import { extractYouTubeId, formatDuration } from '../../utils/youtube';
import { validarTopico, validarVideoaula } from '../../utils/validations';
import type { Videoaula, TopicoDisciplina, MaterialAnexo } from '../../types/videoaulas';

export const GerenciarVideoaulasPage: React.FC = () => {
  const { user } = useAuth();
  const { disciplinas } = useMockData();
  const {
    videoaulas,
    getTopicosPorDisciplina,
    getVideoaulasPorTopico,
    criarTopico,
    editarTopico,
    deletarTopico,
    criarVideoaula, 
    editarVideoaula, 
    deletarVideoaula 
  } = useVideoaulas();

  // States
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('');
  const [dialogTopicoAberto, setDialogTopicoAberto] = useState(false);
  const [dialogVideoaulaAberto, setDialogVideoaulaAberto] = useState(false);
  const [topicoEditando, setTopicoEditando] = useState<TopicoDisciplina | null>(null);
  const [videoaulaEditando, setVideoaulaEditando] = useState<Videoaula | null>(null);
  const [topicoSelecionadoParaVideoaula, setTopicoSelecionadoParaVideoaula] = useState<string>('');

  // Form state - Tópico
  const [formTopico, setFormTopico] = useState({
    titulo: '',
    descricao: ''
  });

  // Form state - Videoaula
  const [formVideoaula, setFormVideoaula] = useState({
    titulo: '',
    descricao: '',
    youtube_url: '',
    visivel: true
  });

  const [youtubeIdExtraido, setYoutubeIdExtraido] = useState('');
  const [duracaoEstimada, setDuracaoEstimada] = useState(0);
  const [materiaisAnexos, setMateriaisAnexos] = useState<MaterialAnexo[]>([]);

  // Dados da disciplina selecionada
  const topicosDisciplina = disciplinaSelecionada 
    ? getTopicosPorDisciplina(disciplinaSelecionada).sort((a, b) => a.ordem - b.ordem)
    : [];

  const disciplinaObj = disciplinas.find(d => d.id === disciplinaSelecionada);

  // ============================================
  // HANDLERS - TÓPICOS
  // ============================================

  const handleAbrirDialogTopico = (topico?: TopicoDisciplina) => {
    if (topico) {
      setTopicoEditando(topico);
      setFormTopico({
        titulo: topico.titulo,
        descricao: topico.descricao || ''
      });
    } else {
      setTopicoEditando(null);
      setFormTopico({
        titulo: '',
        descricao: ''
      });
    }
    setDialogTopicoAberto(true);
  };

  const handleSalvarTopico = () => {
    if (!disciplinaSelecionada) {
      toast.error('Selecione uma disciplina primeiro');
      return;
    }

    const erros = validarTopico(formTopico);
    if (erros.length > 0) {
      toast.error(erros.join('\n'));
      return;
    }

    if (topicoEditando) {
      editarTopico(topicoEditando.id, formTopico);
    } else {
      const novaOrdem = topicosDisciplina.length + 1;
      criarTopico({
        disciplina_id: disciplinaSelecionada,
        titulo: formTopico.titulo,
        descricao: formTopico.descricao,
        ordem: novaOrdem
      });
    }

    setDialogTopicoAberto(false);
    setTopicoEditando(null);
  };

  const handleDeletarTopico = (topicoId: string, titulo: string) => {
    const videoaulasTopico = getVideoaulasPorTopico(topicoId);
    
    if (videoaulasTopico.length > 0) {
      toast.error(`Não é possível excluir o tópico "${titulo}" pois ele contém ${videoaulasTopico.length} videoaula(s)`);
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o tópico "${titulo}"?`)) {
      deletarTopico(topicoId);
    }
  };

  const handleMoverTopico = (topicoId: string, direcao: 'up' | 'down') => {
    const topicoIndex = topicosDisciplina.findIndex(t => t.id === topicoId);
    if (topicoIndex === -1) return;

    const novoIndex = direcao === 'up' ? topicoIndex - 1 : topicoIndex + 1;
    if (novoIndex < 0 || novoIndex >= topicosDisciplina.length) return;

    const topicoAtual = topicosDisciplina[topicoIndex];
    const topicoTroca = topicosDisciplina[novoIndex];

    editarTopico(topicoAtual.id, { ordem: topicoTroca.ordem });
    editarTopico(topicoTroca.id, { ordem: topicoAtual.ordem });

    toast.success('Ordem do tópico atualizada');
  };

  // ============================================
  // HANDLERS - VIDEOAULAS
  // ============================================

  const handleAbrirDialogVideoaula = (topicoId: string, videoaula?: Videoaula) => {
    setTopicoSelecionadoParaVideoaula(topicoId);

    if (videoaula) {
      setVideoaulaEditando(videoaula);
      setFormVideoaula({
        titulo: videoaula.titulo,
        descricao: videoaula.descricao,
        youtube_url: videoaula.youtube_url,
        visivel: videoaula.visivel
      });
      setYoutubeIdExtraido(videoaula.youtube_id);
      setDuracaoEstimada(videoaula.duracao_segundos);
      setMateriaisAnexos(videoaula.materiais_anexos);
    } else {
      setVideoaulaEditando(null);
      setFormVideoaula({
        titulo: '',
        descricao: '',
        youtube_url: '',
        visivel: true
      });
      setYoutubeIdExtraido('');
      setDuracaoEstimada(0);
      setMateriaisAnexos([]);
    }
    setDialogVideoaulaAberto(true);
  };

  const handleYouTubeUrlChange = (url: string) => {
    setFormVideoaula({ ...formVideoaula, youtube_url: url });
    
    if (url) {
      const id = extractYouTubeId(url);
      if (id) {
        setYoutubeIdExtraido(id);
        // Estimativa de duração (em produção real, usaria a API do YouTube)
        setDuracaoEstimada(1800); // 30 min default
      } else {
        setYoutubeIdExtraido('');
        setDuracaoEstimada(0);
      }
    } else {
      setYoutubeIdExtraido('');
      setDuracaoEstimada(0);
    }
  };

  const handleSalvarVideoaula = () => {
    if (!disciplinaSelecionada) {
      toast.error('Selecione uma disciplina primeiro');
      return;
    }

    if (!topicoSelecionadoParaVideoaula) {
      toast.error('Selecione um tópico');
      return;
    }

    const erros = validarVideoaula(formVideoaula);
    if (erros.length > 0) {
      toast.error(erros.join('\n'));
      return;
    }

    if (!youtubeIdExtraido) {
      toast.error('Não foi possível extrair o ID do vídeo do YouTube');
      return;
    }

    const videoaulasTopico = getVideoaulasPorTopico(topicoSelecionadoParaVideoaula);
    const novaOrdem = videoaulaEditando 
      ? videoaulaEditando.ordem_dentro_topico 
      : videoaulasTopico.length + 1;

    if (videoaulaEditando) {
      // Editar
      editarVideoaula(videoaulaEditando.id, {
        ...formVideoaula,
        youtube_id: youtubeIdExtraido,
        duracao_segundos: duracaoEstimada,
        materiais_anexos: materiaisAnexos,
        thumbnail_url: `https://img.youtube.com/vi/${youtubeIdExtraido}/hqdefault.jpg`
      });
    } else {
      // Criar
      criarVideoaula({
        disciplina_id: disciplinaSelecionada,
        topico_id: topicoSelecionadoParaVideoaula,
        titulo: formVideoaula.titulo,
        descricao: formVideoaula.descricao,
        youtube_url: formVideoaula.youtube_url,
        youtube_id: youtubeIdExtraido,
        duracao_segundos: duracaoEstimada,
        ordem_dentro_topico: novaOrdem,
        thumbnail_url: `https://img.youtube.com/vi/${youtubeIdExtraido}/hqdefault.jpg`,
        materiais_anexos: materiaisAnexos,
        visivel: formVideoaula.visivel,
        criado_por: user?.id || ''
      } as any);
    }

    setDialogVideoaulaAberto(false);
    setVideoaulaEditando(null);
  };

  const handleDeletarVideoaula = (videoaulaId: string, titulo: string) => {
    if (confirm(`Tem certeza que deseja excluir a videoaula "${titulo}"?`)) {
      deletarVideoaula(videoaulaId);
    }
  };

  const handleToggleVisibilidade = (videoaula: Videoaula) => {
    editarVideoaula(videoaula.id, { visivel: !videoaula.visivel });
    toast.success(videoaula.visivel ? 'Videoaula ocultada dos alunos' : 'Videoaula visível para alunos');
  };

  const handleAdicionarMaterial = () => {
    const novoMaterial: MaterialAnexo = {
      id: `m${Date.now()}`,
      tipo: 'pdf',
      titulo: 'Novo Material',
      url: '#',
      tamanho_kb: 0
    };
    setMateriaisAnexos([...materiaisAnexos, novoMaterial]);
  };

  const handleRemoverMaterial = (materialId: string) => {
    setMateriaisAnexos(materiaisAnexos.filter(m => m.id !== materialId));
  };

  const handleMoverVideoaula = (videoaulaId: string, topicoId: string, direcao: 'up' | 'down') => {
    const videoaulasTopico = getVideoaulasPorTopico(topicoId)
      .sort((a, b) => a.ordem_dentro_topico - b.ordem_dentro_topico);
    
    const videoaulaIndex = videoaulasTopico.findIndex(v => v.id === videoaulaId);
    if (videoaulaIndex === -1) return;

    const novoIndex = direcao === 'up' ? videoaulaIndex - 1 : videoaulaIndex + 1;
    if (novoIndex < 0 || novoIndex >= videoaulasTopico.length) return;

    const videoaulaAtual = videoaulasTopico[videoaulaIndex];
    const videoaulaTroca = videoaulasTopico[novoIndex];

    editarVideoaula(videoaulaAtual.id, { ordem_dentro_topico: videoaulaTroca.ordem_dentro_topico });
    editarVideoaula(videoaulaTroca.id, { ordem_dentro_topico: videoaulaAtual.ordem_dentro_topico });

    toast.success('Ordem da videoaula atualizada');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Videoaulas</h1>
        <p className="text-gray-600 mt-1">
          Organize suas videoaulas por tópicos e disciplinas
        </p>
      </div>

      {/* Seleção de Disciplina */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione a Disciplina</CardTitle>
          <CardDescription>
            Escolha uma disciplina para gerenciar seus tópicos e videoaulas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={disciplinaSelecionada} onValueChange={setDisciplinaSelecionada}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma disciplina" />
            </SelectTrigger>
            <SelectContent>
              {disciplinas.map(d => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Conteúdo da Disciplina */}
      {disciplinaSelecionada && disciplinaObj && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{disciplinaObj.nome}</CardTitle>
                <CardDescription>
                  {topicosDisciplina.length} tópico{topicosDisciplina.length !== 1 ? 's' : ''} • {' '}
                  {videoaulas.filter(v => v.disciplina_id === disciplinaSelecionada).length} videoaula
                  {videoaulas.filter(v => v.disciplina_id === disciplinaSelecionada).length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Button onClick={() => handleAbrirDialogTopico()} className="gap-2">
                <FolderPlus className="w-4 h-4" />
                Novo Tópico
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {topicosDisciplina.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FolderPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm mb-4">Nenhum tópico criado ainda</p>
                <Button onClick={() => handleAbrirDialogTopico()} variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Criar primeiro tópico
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" className="space-y-2">
                {topicosDisciplina.map((topico, index) => {
                  const videoaulasTopico = getVideoaulasPorTopico(topico.id)
                    .sort((a, b) => a.ordem_dentro_topico - b.ordem_dentro_topico);

                  return (
                    <AccordionItem key={topico.id} value={topico.id} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{topico.titulo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {videoaulasTopico.length} aula{videoaulasTopico.length !== 1 ? 's' : ''}
                            </Badge>
                            {/* Botões de ação */}
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              {index > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMoverTopico(topico.id, 'up')}
                                  title="Mover para cima"
                                >
                                  <MoveUp className="w-4 h-4" />
                                </Button>
                              )}
                              {index < topicosDisciplina.length - 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMoverTopico(topico.id, 'down')}
                                  title="Mover para baixo"
                                >
                                  <MoveDown className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAbrirDialogTopico(topico)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletarTopico(topico.id, topico.titulo)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-3">
                        {topico.descricao && (
                          <p className="text-sm text-gray-600 mb-4">{topico.descricao}</p>
                        )}

                        {/* Botão Adicionar Videoaula */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirDialogVideoaula(topico.id)}
                          className="gap-2 mb-3"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar Videoaula
                        </Button>

                        {/* Lista de Videoaulas */}
                        {videoaulasTopico.length === 0 ? (
                          <div className="text-center py-6 text-gray-400 text-sm">
                            Nenhuma videoaula neste tópico
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {videoaulasTopico.map((videoaula, vIndex) => (
                              <div
                                key={videoaula.id}
                                className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  {/* Thumbnail */}
                                  <div className="w-20 h-14 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {videoaula.thumbnail_url ? (
                                      <img 
                                        src={videoaula.thumbnail_url} 
                                        alt={videoaula.titulo}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <PlayCircle className="w-8 h-8 text-gray-400" />
                                    )}
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium text-gray-900">{videoaula.titulo}</h4>
                                      {!videoaula.visivel && (
                                        <Badge variant="secondary" className="gap-1">
                                          <EyeOff className="w-3 h-3" />
                                          Oculto
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                      <span>{formatDuration(videoaula.duracao_segundos)}</span>
                                      {videoaula.materiais_anexos.length > 0 && (
                                        <span className="flex items-center gap-1">
                                          <FileText className="w-3 h-3" />
                                          {videoaula.materiais_anexos.length} material
                                          {videoaula.materiais_anexos.length !== 1 ? 'is' : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Ações */}
                                  <div className="flex items-center gap-1">
                                    {vIndex > 0 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMoverVideoaula(videoaula.id, topico.id, 'up')}
                                        title="Mover para cima"
                                      >
                                        <MoveUp className="w-4 h-4" />
                                      </Button>
                                    )}
                                    {vIndex < videoaulasTopico.length - 1 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMoverVideoaula(videoaula.id, topico.id, 'down')}
                                        title="Mover para baixo"
                                      >
                                        <MoveDown className="w-4 h-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleToggleVisibilidade(videoaula)}
                                      title={videoaula.visivel ? 'Ocultar dos alunos' : 'Tornar visível'}
                                    >
                                      {videoaula.visivel ? (
                                        <Eye className="w-4 h-4" />
                                      ) : (
                                        <EyeOff className="w-4 h-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleAbrirDialogVideoaula(topico.id, videoaula)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeletarVideoaula(videoaula.id, videoaula.titulo)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog - Criar/Editar Tópico */}
      <Dialog open={dialogTopicoAberto} onOpenChange={setDialogTopicoAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {topicoEditando ? 'Editar Tópico' : 'Novo Tópico'}
            </DialogTitle>
            <DialogDescription>
              {topicoEditando 
                ? 'Edite as informações do tópico'
                : 'Crie um novo tópico para organizar suas videoaulas'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Título do Tópico *</Label>
              <Input
                value={formTopico.titulo}
                onChange={(e) => setFormTopico({ ...formTopico, titulo: e.target.value })}
                placeholder="Ex: Módulo 1 - Fundamentos"
              />
            </div>

            <div>
              <Label>Descrição (opcional)</Label>
              <Textarea
                value={formTopico.descricao}
                onChange={(e) => setFormTopico({ ...formTopico, descricao: e.target.value })}
                placeholder="Descreva brevemente o conteúdo deste tópico..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogTopicoAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarTopico}>
              {topicoEditando ? 'Salvar Alterações' : 'Criar Tópico'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Criar/Editar Videoaula */}
      <Dialog open={dialogVideoaulaAberto} onOpenChange={setDialogVideoaulaAberto}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {videoaulaEditando ? 'Editar Videoaula' : 'Nova Videoaula'}
            </DialogTitle>
            <DialogDescription>
              {videoaulaEditando 
                ? 'Edite as informações da videoaula'
                : 'Adicione uma nova videoaula do YouTube'
              }
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
              <TabsTrigger value="materiais">
                Materiais
                {materiaisAnexos.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {materiaisAnexos.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-4 mt-4">
              <div>
                <Label>Título da Videoaula *</Label>
                <Input
                  value={formVideoaula.titulo}
                  onChange={(e) => setFormVideoaula({ ...formVideoaula, titulo: e.target.value })}
                  placeholder="Ex: 1 - Introdução aos Números Reais"
                />
              </div>

              <div>
                <Label>Descrição *</Label>
                <Textarea
                  value={formVideoaula.descricao}
                  onChange={(e) => setFormVideoaula({ ...formVideoaula, descricao: e.target.value })}
                  placeholder="Descreva o conteúdo da videoaula..."
                  rows={3}
                />
              </div>

              <div>
                <Label>URL do YouTube *</Label>
                <Input
                  value={formVideoaula.youtube_url}
                  onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {youtubeIdExtraido && (
                  <Alert className="mt-2">
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      Vídeo identificado: {youtubeIdExtraido}
                    </AlertDescription>
                  </Alert>
                )}
                {formVideoaula.youtube_url && !youtubeIdExtraido && (
                  <Alert className="mt-2" variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      URL inválida. Use URLs do YouTube no formato: https://www.youtube.com/watch?v=ID ou https://youtu.be/ID
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visivel"
                  checked={formVideoaula.visivel}
                  onChange={(e) => setFormVideoaula({ ...formVideoaula, visivel: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="visivel" className="cursor-pointer">
                  Visível para alunos
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="materiais" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Adicione materiais de apoio (PDFs, slides, etc.)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAdicionarMaterial}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Material
                </Button>
              </div>

              {materiaisAnexos.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhum material adicionado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {materiaisAnexos.map((material, index) => (
                    <div
                      key={material.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <Input
                          value={material.titulo}
                          onChange={(e) => {
                            const novos = [...materiaisAnexos];
                            novos[index].titulo = e.target.value;
                            setMateriaisAnexos(novos);
                          }}
                          placeholder="Nome do material"
                          className="mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={material.tipo}
                            onValueChange={(v: string) => {
                              const novos = [...materiaisAnexos];
                              novos[index].tipo = v as any;
                              setMateriaisAnexos(novos);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="ppt">PowerPoint</SelectItem>
                              <SelectItem value="doc">Word</SelectItem>
                              <SelectItem value="video">Vídeo</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={material.url}
                            onChange={(e) => {
                              const novos = [...materiaisAnexos];
                              novos[index].url = e.target.value;
                              setMateriaisAnexos(novos);
                            }}
                            placeholder="URL do arquivo"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoverMaterial(material.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogVideoaulaAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarVideoaula}>
              {videoaulaEditando ? 'Salvar Alterações' : 'Criar Videoaula'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarVideoaulasPage;