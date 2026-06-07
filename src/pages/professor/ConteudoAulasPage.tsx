// ============================================
// CONTEÚDO AULAS PAGE - Gerenciar Vídeo-aulas e Materiais
// ============================================

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Video, 
  FileText, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  PlayCircle,
  Upload,
  BookOpen,
  ClipboardList,
  FileQuestion
} from 'lucide-react';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import type { TipoConteudoAula } from '../../types';

interface NovoConteudo {
  tipo: TipoConteudoAula;
  titulo: string;
  descricao: string;
  url: string;
  duracaoMinutos?: number;
  tamanhoMB?: number;
  visivel: boolean;
  obrigatorio: boolean;
}

export const ConteudoAulasPage: React.FC = () => {
  const { user } = useAuth();
  const { disciplinas, professorTurmaDisciplina } = useMockData();

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tipoConteudo, setTipoConteudo] = useState<TipoConteudoAula>('video');
  
  const [novoConteudo, setNovoConteudo] = useState<NovoConteudo>({
    tipo: 'video',
    titulo: '',
    descricao: '',
    url: '',
    visivel: true,
    obrigatorio: false,
  });

  // Disciplinas que o professor leciona
  const minhasDisciplinas = useMemo(() => {
    if (!user) return [];
    
    const atribuicoes = professorTurmaDisciplina.filter(
      ptd => ptd.professor_id === user.id
    );
    
    const disciplinasIds = [...new Set(atribuicoes.map(a => a.disciplina_id))];
    return disciplinas.filter(d => disciplinasIds.includes(d.id));
  }, [user, professorTurmaDisciplina, disciplinas]);

  // Conteúdos mockados por disciplina
  const conteudosPorDisciplina = useMemo(() => {
    if (!disciplinaSelecionada) return [];

    // Dados mockados de exemplo
    return [
      {
        id: '1',
        modulo: 'Módulo 1: Introdução',
        aula: 'Aula 1.1: Conceitos Básicos',
        conteudos: [
          { id: 'c1', tipo: 'video' as TipoConteudoAula, titulo: 'Vídeo-aula Introdução', url: 'https://youtube.com/watch?v=...', duracao: 45, visivel: true, obrigatorio: true },
          { id: 'c2', tipo: 'pdf' as TipoConteudoAula, titulo: 'Apostila Módulo 1', url: 'https://...', tamanho: 2.5, visivel: true, obrigatorio: true },
          { id: 'c3', tipo: 'atividade' as TipoConteudoAula, titulo: 'Exercícios de Fixação', url: '', visivel: true, obrigatorio: false },
        ]
      },
      {
        id: '2',
        modulo: 'Módulo 1: Introdução',
        aula: 'Aula 1.2: Fundamentos',
        conteudos: [
          { id: 'c4', tipo: 'video' as TipoConteudoAula, titulo: 'Fundamentos Teóricos', url: 'https://youtube.com/watch?v=...', duracao: 60, visivel: true, obrigatorio: true },
          { id: 'c5', tipo: 'teste' as TipoConteudoAula, titulo: 'Quiz Avaliativo', url: '', visivel: true, obrigatorio: true },
        ]
      },
      {
        id: '3',
        modulo: 'Módulo 2: Prática',
        aula: 'Aula 2.1: Exercícios Práticos',
        conteudos: [
          { id: 'c6', tipo: 'video' as TipoConteudoAula, titulo: 'Demonstração Prática', url: 'https://youtube.com/watch?v=...', duracao: 30, visivel: true, obrigatorio: true },
          { id: 'c7', tipo: 'extra' as TipoConteudoAula, titulo: 'Leitura Complementar', url: 'https://...', visivel: true, obrigatorio: false },
        ]
      },
    ];
  }, [disciplinaSelecionada]);

  const handleAdicionarConteudo = () => {
    if (!novoConteudo.titulo || (!novoConteudo.url && tipoConteudo !== 'atividade' && tipoConteudo !== 'teste')) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    toast.success('Conteúdo adicionado com sucesso!');
    setDialogOpen(false);
    setNovoConteudo({
      tipo: 'video',
      titulo: '',
      descricao: '',
      url: '',
      visivel: true,
      obrigatorio: false,
    });
  };

  const getTipoIcon = (tipo: TipoConteudoAula) => {
    switch (tipo) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'atividade': return <ClipboardList className="h-4 w-4" />;
      case 'teste': return <FileQuestion className="h-4 w-4" />;
      case 'extra': return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTipoLabel = (tipo: TipoConteudoAula) => {
    switch (tipo) {
      case 'video': return 'Vídeo-aula';
      case 'pdf': return 'Material PDF';
      case 'atividade': return 'Atividade';
      case 'teste': return 'Teste/Prova';
      case 'extra': return 'Conteúdo Extra';
    }
  };

  const getTipoBadgeColor = (tipo: TipoConteudoAula) => {
    switch (tipo) {
      case 'video': return 'bg-red-100 text-red-700';
      case 'pdf': return 'bg-blue-100 text-blue-700';
      case 'atividade': return 'bg-green-100 text-green-700';
      case 'teste': return 'bg-purple-100 text-purple-700';
      case 'extra': return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Conteúdo das Aulas</h1>
        <p className="text-gray-600 mt-1">
          Adicione vídeo-aulas, materiais, atividades e testes para suas disciplinas
        </p>
      </div>

      {/* Seletor de Disciplina */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione a Disciplina</CardTitle>
          <CardDescription>
            Escolha a disciplina para gerenciar o conteúdo das aulas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={disciplinaSelecionada} onValueChange={setDisciplinaSelecionada}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma disciplina..." />
            </SelectTrigger>
            <SelectContent>
              {minhasDisciplinas.map(disc => (
                <SelectItem key={disc.id} value={disc.id}>
                  {disc.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Conteúdo */}
      {disciplinaSelecionada ? (
        <>
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Vídeo-aulas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Video className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-gray-500">vídeos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Materiais PDF</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-xs text-gray-500">arquivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Atividades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-xs text-gray-500">atividades</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Testes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileQuestion className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-xs text-gray-500">testes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Conteúdos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Conteúdos das Aulas</CardTitle>
                <CardDescription>
                  Organize o conteúdo por módulos e aulas
                </CardDescription>
              </div>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Conteúdo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {conteudosPorDisciplina.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    {/* Módulo e Aula */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">{item.modulo}</p>
                      <h3 className="font-semibold text-gray-900">{item.aula}</h3>
                    </div>

                    {/* Conteúdos */}
                    <div className="space-y-2">
                      {item.conteudos.map((conteudo) => (
                        <div
                          key={conteudo.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded ${getTipoBadgeColor(conteudo.tipo)}`}>
                              {getTipoIcon(conteudo.tipo)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{conteudo.titulo}</p>
                                <Badge variant="outline" className="text-xs">
                                  {getTipoLabel(conteudo.tipo)}
                                </Badge>
                                {conteudo.obrigatorio && (
                                  <Badge className="text-xs bg-orange-100 text-orange-700">
                                    Obrigatório
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                {conteudo.duracao && (
                                  <span className="text-xs text-gray-500">
                                    {conteudo.duracao} min
                                  </span>
                                )}
                                {conteudo.tamanho && (
                                  <span className="text-xs text-gray-500">
                                    {conteudo.tamanho} MB
                                  </span>
                                )}
                                {conteudo.visivel ? (
                                  <span className="text-xs text-green-600 flex items-center gap-1">
                                    <Eye className="h-3 w-3" /> Visível
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <EyeOff className="h-3 w-3" /> Oculto
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Ações */}
                          <div className="flex items-center gap-2">
                            {conteudo.url && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <PlayCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma disciplina
              </h3>
              <p className="text-gray-500">
                Escolha uma disciplina acima para começar a gerenciar o conteúdo das aulas
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog Adicionar Conteúdo */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Conteúdo</DialogTitle>
            <DialogDescription>
              Adicione vídeo-aula, material PDF, atividade ou teste
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Tipo de Conteúdo */}
            <div>
              <Label htmlFor="tipo">Tipo de Conteúdo *</Label>
              <Tabs value={tipoConteudo} onValueChange={(v: string) => {
                setTipoConteudo(v as TipoConteudoAula);
                setNovoConteudo({ ...novoConteudo, tipo: v as TipoConteudoAula });
              }}>
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="video">
                    <Video className="h-4 w-4 mr-2" />
                    Vídeo
                  </TabsTrigger>
                  <TabsTrigger value="pdf">
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </TabsTrigger>
                  <TabsTrigger value="atividade">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Atividade
                  </TabsTrigger>
                  <TabsTrigger value="teste">
                    <FileQuestion className="h-4 w-4 mr-2" />
                    Teste
                  </TabsTrigger>
                  <TabsTrigger value="extra">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Extra
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Introdução à Anatomia"
                value={novoConteudo.titulo}
                onChange={(e) => setNovoConteudo({ ...novoConteudo, titulo: e.target.value })}
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva brevemente o conteúdo..."
                value={novoConteudo.descricao}
                onChange={(e) => setNovoConteudo({ ...novoConteudo, descricao: e.target.value })}
                rows={3}
              />
            </div>

            {/* URL (para vídeos e PDFs) */}
            {(tipoConteudo === 'video' || tipoConteudo === 'pdf' || tipoConteudo === 'extra') && (
              <div>
                <Label htmlFor="url">
                  {tipoConteudo === 'video' ? 'URL do Vídeo (YouTube/Vimeo)' : 'URL do Arquivo'} *
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder={tipoConteudo === 'video' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                  value={novoConteudo.url}
                  onChange={(e) => setNovoConteudo({ ...novoConteudo, url: e.target.value })}
                />
                {tipoConteudo === 'video' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Cole o link do vídeo do YouTube ou Vimeo
                  </p>
                )}
              </div>
            )}

            {/* Upload de arquivo (placeholder) */}
            {(tipoConteudo === 'pdf' || tipoConteudo === 'extra') && (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Ou faça upload do arquivo
                </p>
                <Button variant="outline" size="sm">
                  Escolher Arquivo
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, DOC ou DOCX até 10MB
                </p>
              </div>
            )}

            {/* Configurações */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="visivel">Visível para alunos</Label>
                  <p className="text-xs text-gray-500">
                    Alunos poderão ver este conteúdo
                  </p>
                </div>
                <Switch
                  id="visivel"
                  checked={novoConteudo.visivel}
                  onCheckedChange={(checked: boolean) => setNovoConteudo({ ...novoConteudo, visivel: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="obrigatorio">Conteúdo obrigatório</Label>
                  <p className="text-xs text-gray-500">
                    Marcar como obrigatório para os alunos
                  </p>
                </div>
                <Switch
                  id="obrigatorio"
                  checked={novoConteudo.obrigatorio}
                  onCheckedChange={(checked: boolean) => setNovoConteudo({ ...novoConteudo, obrigatorio: checked })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdicionarConteudo}>
              Adicionar Conteúdo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConteudoAulasPage;
