// ============================================
// QUESTIONÁRIOS PAGE - Criar e Gerenciar Pesquisas de Satisfação
// ============================================

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  ClipboardList,
  Users,
  CheckCircle,
  List,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { toast } from 'sonner';
import type { Questionario, PerguntaQuestionario } from '../../types';

interface QuestionarioCompleto extends Questionario {
  perguntas: PerguntaQuestionario[];
  total_respostas: number;
}

export const QuestionariosPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<Questionario['tipo']>('satisfacao_curso');
  const [anonimo, setAnonimo] = useState(false);
  const [obrigatorio, setObrigatorio] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [publico, setPublico] = useState<Questionario['publico']>('todos');

  // Perguntas
  const [perguntas, setPerguntas] = useState<Array<{
    texto: string;
    tipo: PerguntaQuestionario['tipo'];
    opcoes?: string[];
    obrigatoria: boolean;
  }>>([]);

  const [novaPergunta, setNovaPergunta] = useState('');
  const [tipoPergunta, setTipoPergunta] = useState<PerguntaQuestionario['tipo']>('escala');
  const [opcoesPergunta, setOpcoesPergunta] = useState<string[]>(['']);

  // Questionários mockados
  const questionariosMockados: QuestionarioCompleto[] = [
    {
      id: '1',
      titulo: 'Avaliação de Satisfação do Curso',
      descricao: 'Ajude-nos a melhorar! Avalie sua experiência no curso.',
      tipo: 'satisfacao_curso',
      ativo: true,
      obrigatorio: false,
      anonimo: true,
      data_inicio: new Date('2024-11-01'),
      publico: 'todos',
      created_at: new Date('2024-11-01'),
      perguntas: [
        {
          id: 'p1',
          questionario_id: '1',
          texto: 'Como você avalia o conteúdo do curso?',
          tipo: 'escala',
          escala_min: 1,
          escala_max: 5,
          obrigatoria: true,
          ordem: 1,
          created_at: new Date()
        },
        {
          id: 'p2',
          questionario_id: '1',
          texto: 'Você recomendaria este curso para outros alunos?',
          tipo: 'sim_nao',
          obrigatoria: true,
          ordem: 2,
          created_at: new Date()
        },
        {
          id: 'p3',
          questionario_id: '1',
          texto: 'O que você mais gostou no curso?',
          tipo: 'texto_longo',
          obrigatoria: false,
          ordem: 3,
          created_at: new Date()
        }
      ],
      total_respostas: 87
    },
    {
      id: '2',
      titulo: 'Avaliação dos Professores',
      descricao: 'Avalie a atuação dos professores nas disciplinas',
      tipo: 'avaliacao_professor',
      ativo: true,
      obrigatorio: true,
      anonimo: true,
      data_inicio: new Date('2024-11-15'),
      data_fim: new Date('2024-12-15'),
      publico: 'todos',
      created_at: new Date('2024-11-01'),
      perguntas: [
        {
          id: 'p4',
          questionario_id: '2',
          texto: 'O professor demonstra domínio do conteúdo?',
          tipo: 'escala',
          escala_min: 1,
          escala_max: 10,
          obrigatoria: true,
          ordem: 1,
          created_at: new Date()
        },
        {
          id: 'p5',
          questionario_id: '2',
          texto: 'As aulas são dinâmicas e interessantes?',
          tipo: 'escala',
          escala_min: 1,
          escala_max: 10,
          obrigatoria: true,
          ordem: 2,
          created_at: new Date()
        }
      ],
      total_respostas: 45
    }
  ];

  const adicionarPergunta = () => {
    if (!novaPergunta) {
      toast.error('Digite o texto da pergunta');
      return;
    }

    const pergunta = {
      texto: novaPergunta,
      tipo: tipoPergunta,
      opcoes: tipoPergunta === 'multipla_escolha' ? opcoesPergunta.filter(o => o.trim() !== '') : undefined,
      obrigatoria: true
    };

    setPerguntas([...perguntas, pergunta]);
    setNovaPergunta('');
    setTipoPergunta('escala');
    setOpcoesPergunta(['']);
    toast.success('Pergunta adicionada!');
  };

  const removerPergunta = (index: number) => {
    setPerguntas(perguntas.filter((_, i) => i !== index));
  };

  const handleCriarQuestionario = () => {
    if (!titulo || !descricao || perguntas.length === 0) {
      toast.error('Preencha todos os campos e adicione ao menos uma pergunta');
      return;
    }

    toast.success('Questionário criado com sucesso!');
    setDialogOpen(false);
    // Resetar formulário
    setTitulo('');
    setDescricao('');
    setPerguntas([]);
  };

  const getTipoLabel = (tipo: Questionario['tipo']) => {
    switch (tipo) {
      case 'satisfacao_curso': return 'Satisfação do Curso';
      case 'avaliacao_professor': return 'Avaliação de Professor';
      case 'feedback_instituicao': return 'Feedback Institucional';
      case 'pesquisa_personalizada': return 'Pesquisa Personalizada';
    }
  };

  const getTipoPerguntaLabel = (tipo: PerguntaQuestionario['tipo']) => {
    switch (tipo) {
      case 'multipla_escolha': return 'Múltipla Escolha';
      case 'escala': return 'Escala (1-5 ou 1-10)';
      case 'texto_curto': return 'Texto Curto';
      case 'texto_longo': return 'Texto Longo';
      case 'sim_nao': return 'Sim/Não';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb
        items={[
          { label: 'Início', href: '/gestor/dashboard' },
          { label: 'Questionários', href: '/gestor/questionarios' }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questionários de Avaliação</h1>
          <p className="text-gray-600 mt-1">
            Crie pesquisas de satisfação e colete feedback dos alunos
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Criar Questionário
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Questionários Ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-gray-500">ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Respostas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">132</p>
                <p className="text-xs text-gray-500">respostas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Taxa de Resposta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">76%</p>
                <p className="text-xs text-gray-500">responderam</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Satisfação Média</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">8.5</p>
                <p className="text-xs text-gray-500">de 10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Questionários */}
      <div className="space-y-4">
        {questionariosMockados.map((questionario) => (
          <Card key={questionario.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Título e Badges */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {questionario.titulo}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-700">
                      {getTipoLabel(questionario.tipo)}
                    </Badge>
                    {questionario.obrigatorio && (
                      <Badge className="bg-orange-100 text-orange-700">
                        Obrigatório
                      </Badge>
                    )}
                    {questionario.anonimo && (
                      <Badge variant="outline">
                        Anônimo
                      </Badge>
                    )}
                    {questionario.ativo && (
                      <Badge className="bg-green-100 text-green-700">
                        Ativo
                      </Badge>
                    )}
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-600 mb-4">{questionario.descricao}</p>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Perguntas</p>
                      <p className="font-medium">{questionario.perguntas.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Respostas</p>
                      <p className="font-medium">{questionario.total_respostas}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Período</p>
                      <p className="font-medium">
                        {questionario.data_inicio.toLocaleDateString('pt-BR')}
                        {questionario.data_fim && ` - ${questionario.data_fim.toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>
                  </div>

                  {/* Preview das Perguntas */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      <List className="h-4 w-4 inline mr-2" />
                      Perguntas ({questionario.perguntas.length})
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {questionario.perguntas.slice(0, 3).map((pergunta, index) => (
                        <li key={pergunta.id}>
                          {index + 1}. {pergunta.texto}
                        </li>
                      ))}
                      {questionario.perguntas.length > 3 && (
                        <li className="text-gray-500 italic">
                          + {questionario.perguntas.length - 3} pergunta(s)
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog Criar Questionário */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Questionário</DialogTitle>
            <DialogDescription>
              Configure uma pesquisa de satisfação ou avaliação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Informações Básicas */}
            <div>
              <Label htmlFor="titulo">Título do Questionário *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Avaliação de Satisfação do Curso"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Explique o objetivo da pesquisa..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo de Questionário</Label>
                <Select value={tipo} onValueChange={(v) => setTipo(v as Questionario['tipo'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satisfacao_curso">Satisfação do Curso</SelectItem>
                    <SelectItem value="avaliacao_professor">Avaliação de Professor</SelectItem>
                    <SelectItem value="feedback_instituicao">Feedback Institucional</SelectItem>
                    <SelectItem value="pesquisa_personalizada">Pesquisa Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="publico">Público-alvo</Label>
                <Select value={publico} onValueChange={(v) => setPublico(v as Questionario['publico'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os alunos</SelectItem>
                    <SelectItem value="curso_especifico">Curso específico</SelectItem>
                    <SelectItem value="turma_especifica">Turma específica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Configurações */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonimo">Respostas anônimas</Label>
                  <p className="text-xs text-gray-500">
                    Não armazenar identificação do respondente
                  </p>
                </div>
                <Switch
                  id="anonimo"
                  checked={anonimo}
                  onCheckedChange={setAnonimo}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="obrigatorio">Questionário obrigatório</Label>
                  <p className="text-xs text-gray-500">
                    Alunos devem responder para continuar
                  </p>
                </div>
                <Switch
                  id="obrigatorio"
                  checked={obrigatorio}
                  onCheckedChange={setObrigatorio}
                />
              </div>
            </div>

            {/* Perguntas */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Perguntas ({perguntas.length})</h4>

              {/* Lista de Perguntas Adicionadas */}
              {perguntas.length > 0 && (
                <div className="space-y-2 mb-4">
                  {perguntas.map((pergunta, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {index + 1}. {pergunta.texto}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tipo: {getTipoPerguntaLabel(pergunta.tipo)}
                        </p>
                        {pergunta.opcoes && (
                          <p className="text-xs text-gray-500">
                            Opções: {pergunta.opcoes.join(', ')}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerPergunta(index)}
                        className="text-red-600"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Adicionar Nova Pergunta */}
              <div className="space-y-3 p-4 border-2 border-dashed rounded-lg">
                <div>
                  <Label htmlFor="nova-pergunta">Nova Pergunta</Label>
                  <Input
                    id="nova-pergunta"
                    placeholder="Digite o texto da pergunta..."
                    value={novaPergunta}
                    onChange={(e) => setNovaPergunta(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="tipo-pergunta">Tipo de Resposta</Label>
                  <Select value={tipoPergunta} onValueChange={(v) => setTipoPergunta(v as PerguntaQuestionario['tipo'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escala">Escala (1-5 ou 1-10)</SelectItem>
                      <SelectItem value="sim_nao">Sim/Não</SelectItem>
                      <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                      <SelectItem value="texto_curto">Texto Curto</SelectItem>
                      <SelectItem value="texto_longo">Texto Longo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {tipoPergunta === 'multipla_escolha' && (
                  <div>
                    <Label>Opções de Resposta</Label>
                    {opcoesPergunta.map((opcao, index) => (
                      <Input
                        key={index}
                        placeholder={`Opção ${index + 1}`}
                        value={opcao}
                        onChange={(e) => {
                          const novasOpcoes = [...opcoesPergunta];
                          novasOpcoes[index] = e.target.value;
                          setOpcoesPergunta(novasOpcoes);
                        }}
                        className="mt-2"
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setOpcoesPergunta([...opcoesPergunta, ''])}
                      className="mt-2"
                    >
                      + Adicionar Opção
                    </Button>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={adicionarPergunta}
                  className="w-full gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Adicionar Pergunta
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCriarQuestionario}>
              Criar Questionário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionariosPage;
