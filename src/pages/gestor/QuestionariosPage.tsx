// ============================================
// QUESTIONÁRIOS PAGE - Criar e Gerenciar Pesquisas de Satisfação
// ============================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader } from '../../components/ui/card';
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
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<Questionario['tipo']>('satisfacao_curso');
  const [anonimo, setAnonimo] = useState(false);
  const [obrigatorio, setObrigatorio] = useState(false);
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
      toast.error(t('gestor.questionarios.toast.typeQuestion'));
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
    toast.success(t('gestor.questionarios.toast.questionAdded'));
  };

  const removerPergunta = (index: number) => {
    setPerguntas(perguntas.filter((_, i) => i !== index));
  };

  const handleCriarQuestionario = () => {
    if (!titulo || !descricao || perguntas.length === 0) {
      toast.error(t('gestor.questionarios.toast.fillAndAddQuestion'));
      return;
    }

    toast.success(t('gestor.questionarios.toast.created'));
    setDialogOpen(false);
    // Resetar formulário
    setTitulo('');
    setDescricao('');
    setPerguntas([]);
  };

  const getTipoLabel = (tipo: Questionario['tipo']) => {
    return t(`gestor.questionarios.types.${tipo}`);
  };

  const getTipoPerguntaLabel = (tipo: PerguntaQuestionario['tipo']) => {
    return t(`gestor.questionarios.questionTypes.${tipo}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('gestor.questionarios.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('gestor.questionarios.subtitle')}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('gestor.questionarios.createButton')}
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('gestor.questionarios.stats.activeSurveys')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-gray-500">{t('gestor.questionarios.stats.active')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('gestor.questionarios.stats.totalResponses')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">132</p>
                <p className="text-xs text-gray-500">{t('gestor.questionarios.stats.responses')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('gestor.questionarios.stats.responseRate')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">76%</p>
                <p className="text-xs text-gray-500">{t('gestor.questionarios.stats.responded')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('gestor.questionarios.stats.averageSatisfaction')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">8.5</p>
                <p className="text-xs text-gray-500">{t('gestor.questionarios.stats.outOf10')}</p>
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
                        {t('gestor.questionarios.badges.required')}
                      </Badge>
                    )}
                    {questionario.anonimo && (
                      <Badge variant="outline">
                        {t('gestor.questionarios.badges.anonymous')}
                      </Badge>
                    )}
                    {questionario.ativo && (
                      <Badge className="bg-green-100 text-green-700">
                        {t('common.status.active')}
                      </Badge>
                    )}
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-600 mb-4">{questionario.descricao}</p>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('gestor.questionarios.fields.questions')}</p>
                      <p className="font-medium">{questionario.perguntas.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('gestor.questionarios.fields.responses')}</p>
                      <p className="font-medium">{questionario.total_respostas}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('gestor.questionarios.fields.period')}</p>
                      <p className="font-medium">
                        {questionario.data_inicio.toLocaleDateString()}
                        {questionario.data_fim && ` - ${questionario.data_fim.toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  {/* Preview das Perguntas */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      <List className="h-4 w-4 inline mr-2" />
                      {t('gestor.questionarios.questionsCount', { count: questionario.perguntas.length })}
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {questionario.perguntas.slice(0, 3).map((pergunta, index) => (
                        <li key={pergunta.id}>
                          {index + 1}. {pergunta.texto}
                        </li>
                      ))}
                      {questionario.perguntas.length > 3 && (
                        <li className="text-gray-500 italic">
                          {t('gestor.questionarios.moreQuestions', { count: questionario.perguntas.length - 3 })}
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
            <DialogTitle>{t('gestor.questionarios.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('gestor.questionarios.dialog.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Informações Básicas */}
            <div>
              <Label htmlFor="titulo">{t('gestor.questionarios.dialog.titleLabel')}</Label>
              <Input
                id="titulo"
                placeholder={t('gestor.questionarios.dialog.titlePlaceholder')}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="descricao">{t('gestor.questionarios.dialog.descriptionLabel')}</Label>
              <Textarea
                id="descricao"
                placeholder={t('gestor.questionarios.dialog.descriptionPlaceholder')}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">{t('gestor.questionarios.dialog.typeLabel')}</Label>
                <Select value={tipo} onValueChange={(v) => setTipo(v as Questionario['tipo'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satisfacao_curso">{t('gestor.questionarios.types.satisfacao_curso')}</SelectItem>
                    <SelectItem value="avaliacao_professor">{t('gestor.questionarios.types.avaliacao_professor')}</SelectItem>
                    <SelectItem value="feedback_instituicao">{t('gestor.questionarios.types.feedback_instituicao')}</SelectItem>
                    <SelectItem value="pesquisa_personalizada">{t('gestor.questionarios.types.pesquisa_personalizada')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="publico">{t('gestor.questionarios.dialog.audienceLabel')}</Label>
                <Select value={publico} onValueChange={(v) => setPublico(v as Questionario['publico'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">{t('gestor.questionarios.dialog.audience.all')}</SelectItem>
                    <SelectItem value="curso_especifico">{t('gestor.questionarios.dialog.audience.specificCourse')}</SelectItem>
                    <SelectItem value="turma_especifica">{t('gestor.questionarios.dialog.audience.specificClass')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Configurações */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonimo">{t('gestor.questionarios.dialog.anonymousLabel')}</Label>
                  <p className="text-xs text-gray-500">
                    {t('gestor.questionarios.dialog.anonymousHint')}
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
                  <Label htmlFor="obrigatorio">{t('gestor.questionarios.dialog.requiredLabel')}</Label>
                  <p className="text-xs text-gray-500">
                    {t('gestor.questionarios.dialog.requiredHint')}
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
              <h4 className="font-medium mb-3">{t('gestor.questionarios.dialog.questionsTitle', { count: perguntas.length })}</h4>

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
                          {t('gestor.questionarios.dialog.questionTypeLabel', { type: getTipoPerguntaLabel(pergunta.tipo) })}
                        </p>
                        {pergunta.opcoes && (
                          <p className="text-xs text-gray-500">
                            {t('gestor.questionarios.dialog.optionsLabel', { options: pergunta.opcoes.join(', ') })}
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
                  <Label htmlFor="nova-pergunta">{t('gestor.questionarios.dialog.newQuestionLabel')}</Label>
                  <Input
                    id="nova-pergunta"
                    placeholder={t('gestor.questionarios.dialog.newQuestionPlaceholder')}
                    value={novaPergunta}
                    onChange={(e) => setNovaPergunta(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="tipo-pergunta">{t('gestor.questionarios.dialog.answerTypeLabel')}</Label>
                  <Select value={tipoPergunta} onValueChange={(v) => setTipoPergunta(v as PerguntaQuestionario['tipo'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escala">{t('gestor.questionarios.questionTypes.escala')}</SelectItem>
                      <SelectItem value="sim_nao">{t('gestor.questionarios.questionTypes.sim_nao')}</SelectItem>
                      <SelectItem value="multipla_escolha">{t('gestor.questionarios.questionTypes.multipla_escolha')}</SelectItem>
                      <SelectItem value="texto_curto">{t('gestor.questionarios.questionTypes.texto_curto')}</SelectItem>
                      <SelectItem value="texto_longo">{t('gestor.questionarios.questionTypes.texto_longo')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {tipoPergunta === 'multipla_escolha' && (
                  <div>
                    <Label>{t('gestor.questionarios.dialog.answerOptionsLabel')}</Label>
                    {opcoesPergunta.map((opcao, index) => (
                      <Input
                        key={index}
                        placeholder={t('gestor.questionarios.dialog.optionPlaceholder', { number: index + 1 })}
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
                      {t('gestor.questionarios.dialog.addOption')}
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
                  {t('gestor.questionarios.dialog.addQuestion')}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button onClick={handleCriarQuestionario}>
              {t('gestor.questionarios.createButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionariosPage;
