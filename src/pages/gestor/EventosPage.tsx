// ============================================
// EVENTOS PAGE - Gerenciar Eventos e Atividades Extracurriculares
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Calendar,
  Plus,
  MapPin,
  Users,
  Video as VideoIcon,
  Edit,
  Trash2,
  Eye,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { toast } from 'sonner';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'palestra' | 'workshop' | 'aula_ao_vivo' | 'evento_social' | 'extracurricular';
  dataInicio: Date;
  dataFim: Date;
  localTipo: 'online' | 'presencial';
  localLink?: string;
  localEndereco?: string;
  vagasLimitadas: boolean;
  totalVagas?: number;
  inscritos: number;
  publico: 'todos' | 'curso_especifico' | 'turma_especifica';
  emitirCertificado: boolean;
  ativo: boolean;
}

export const EventosPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<'ativos' | 'passados'>('ativos');

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<Evento['tipo']>('extracurricular');
  const [dataInicio, setDataInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [localTipo, setLocalTipo] = useState<'online' | 'presencial'>('online');
  const [localLink, setLocalLink] = useState('');
  const [localEndereco, setLocalEndereco] = useState('');
  const [vagasLimitadas, setVagasLimitadas] = useState(false);
  const [totalVagas, setTotalVagas] = useState('');
  const [publico, setPublico] = useState<Evento['publico']>('todos');
  const [emitirCertificado, setEmitirCertificado] = useState(false);

  // Eventos mockados
  const eventosMockados: Evento[] = [
    {
      id: '1',
      titulo: 'Palestra: Tendências em Enfermagem 2024',
      descricao: 'Discussão sobre as principais tendências e inovações na área de enfermagem para 2024.',
      tipo: 'palestra',
      dataInicio: new Date('2024-12-20T19:00:00'),
      dataFim: new Date('2024-12-20T21:00:00'),
      localTipo: 'online',
      localLink: 'https://meet.google.com/abc-defg-hij',
      vagasLimitadas: true,
      totalVagas: 100,
      inscritos: 45,
      publico: 'todos',
      emitirCertificado: true,
      ativo: true
    },
    {
      id: '2',
      titulo: 'Workshop: Técnicas de Primeiros Socorros',
      descricao: 'Workshop prático sobre técnicas essenciais de primeiros socorros.',
      tipo: 'workshop',
      dataInicio: new Date('2024-12-15T14:00:00'),
      dataFim: new Date('2024-12-15T17:00:00'),
      localTipo: 'presencial',
      localEndereco: 'Laboratório de Práticas - Bloco A, Sala 101',
      vagasLimitadas: true,
      totalVagas: 30,
      inscritos: 28,
      publico: 'curso_especifico',
      emitirCertificado: true,
      ativo: true
    },
    {
      id: '3',
      titulo: 'Confraternização de Fim de Ano',
      descricao: 'Evento de confraternização para celebrar o fim do ano letivo com todos os alunos e professores.',
      tipo: 'evento_social',
      dataInicio: new Date('2024-12-18T18:00:00'),
      dataFim: new Date('2024-12-18T22:00:00'),
      localTipo: 'presencial',
      localEndereco: 'Salão de Eventos - Campus Principal',
      vagasLimitadas: false,
      inscritos: 120,
      publico: 'todos',
      emitirCertificado: false,
      ativo: true
    }
  ];

  const handleCriarEvento = () => {
    if (!titulo || !dataInicio || !horaInicio || !dataFim || !horaFim) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (localTipo === 'online' && !localLink) {
      toast.error('Informe o link do evento online');
      return;
    }

    if (localTipo === 'presencial' && !localEndereco) {
      toast.error('Informe o endereço do evento');
      return;
    }

    toast.success('Evento criado com sucesso!');
    setDialogOpen(false);
    // Resetar formulário
    setTitulo('');
    setDescricao('');
    setDataInicio('');
    setHoraInicio('');
    setDataFim('');
    setHoraFim('');
    setLocalLink('');
    setLocalEndereco('');
    setVagasLimitadas(false);
    setTotalVagas('');
    setEmitirCertificado(false);
  };

  const getTipoLabel = (tipo: Evento['tipo']) => {
    switch (tipo) {
      case 'palestra': return 'Palestra';
      case 'workshop': return 'Workshop';
      case 'aula_ao_vivo': return 'Aula ao Vivo';
      case 'evento_social': return 'Evento Social';
      case 'extracurricular': return 'Extracurricular';
    }
  };

  const getTipoBadgeColor = (tipo: Evento['tipo']) => {
    switch (tipo) {
      case 'palestra': return 'bg-blue-100 text-blue-700';
      case 'workshop': return 'bg-purple-100 text-purple-700';
      case 'aula_ao_vivo': return 'bg-red-100 text-red-700';
      case 'evento_social': return 'bg-green-100 text-green-700';
      case 'extracurricular': return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos e Atividades</h1>
          <p className="text-gray-600 mt-1">
            Gerencie eventos, palestras, workshops e atividades extracurriculares
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Criar Evento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Eventos Ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-gray-500">eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Inscritos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">193</p>
                <p className="text-xs text-gray-500">participantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Eventos Online</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <VideoIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-gray-500">eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Com Certificado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-gray-500">eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Cadastrados</CardTitle>
          <CardDescription>
            Gerencie todos os eventos da instituição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={abaSelecionada} onValueChange={(v) => setAbaSelecionada(v as any)}>
            <TabsList>
              <TabsTrigger value="ativos">Ativos (3)</TabsTrigger>
              <TabsTrigger value="passados">Finalizados (12)</TabsTrigger>
            </TabsList>

            <TabsContent value="ativos" className="space-y-4 mt-6">
              {eventosMockados.map((evento) => (
                <Card key={evento.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      {/* Informações do Evento */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {evento.titulo}
                          </h3>
                          <Badge className={getTipoBadgeColor(evento.tipo)}>
                            {getTipoLabel(evento.tipo)}
                          </Badge>
                          {evento.emitirCertificado && (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <Award className="h-3 w-3 mr-1" />
                              Certificado
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4">
                          {evento.descricao}
                        </p>

                        {/* Detalhes */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <div>
                              <p className="font-medium text-gray-900">Data</p>
                              <p>{formatarData(evento.dataInicio)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <div>
                              <p className="font-medium text-gray-900">Local</p>
                              <p>{evento.localTipo === 'online' ? 'Online' : 'Presencial'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <div>
                              <p className="font-medium text-gray-900">Inscritos</p>
                              <p>
                                {evento.inscritos}
                                {evento.vagasLimitadas && evento.totalVagas 
                                  ? ` / ${evento.totalVagas}`
                                  : ''}
                              </p>
                            </div>
                          </div>

                          {evento.vagasLimitadas && evento.totalVagas && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">Vagas</p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{
                                      width: `${(evento.inscritos / evento.totalVagas) * 100}%`
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Link/Endereço */}
                        {evento.localTipo === 'online' && evento.localLink && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                            <p className="text-gray-600">
                              <strong>Link:</strong>{' '}
                              <a href={evento.localLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                {evento.localLink}
                              </a>
                            </p>
                          </div>
                        )}

                        {evento.localTipo === 'presencial' && evento.localEndereco && (
                          <div className="mt-3 p-2 bg-green-50 rounded text-sm">
                            <p className="text-gray-600">
                              <strong>Endereço:</strong> {evento.localEndereco}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 ml-4">
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
            </TabsContent>

            <TabsContent value="passados">
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Eventos Finalizados
                </h3>
                <p className="text-gray-500">
                  12 eventos já foram realizados
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog Criar Evento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Evento</DialogTitle>
            <DialogDescription>
              Crie palestras, workshops e atividades extracurriculares
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Título */}
            <div>
              <Label htmlFor="titulo">Título do Evento *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Workshop de Primeiros Socorros"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o evento e seus objetivos..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
              />
            </div>

            {/* Tipo */}
            <div>
              <Label htmlFor="tipo">Tipo de Evento *</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as Evento['tipo'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="palestra">Palestra</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="aula_ao_vivo">Aula ao Vivo</SelectItem>
                  <SelectItem value="evento_social">Evento Social</SelectItem>
                  <SelectItem value="extracurricular">Atividade Extracurricular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data-inicio">Data de Início *</Label>
                <Input
                  id="data-inicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hora-inicio">Hora de Início *</Label>
                <Input
                  id="hora-inicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data-fim">Data de Término *</Label>
                <Input
                  id="data-fim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hora-fim">Hora de Término *</Label>
                <Input
                  id="hora-fim"
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </div>
            </div>

            {/* Local */}
            <div>
              <Label>Local do Evento *</Label>
              <Tabs value={localTipo} onValueChange={(v) => setLocalTipo(v as 'online' | 'presencial')}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="online">
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Online
                  </TabsTrigger>
                  <TabsTrigger value="presencial">
                    <MapPin className="h-4 w-4 mr-2" />
                    Presencial
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="online" className="mt-3">
                  <Input
                    placeholder="Link da reunião online (Google Meet, Zoom, etc)"
                    value={localLink}
                    onChange={(e) => setLocalLink(e.target.value)}
                  />
                </TabsContent>

                <TabsContent value="presencial" className="mt-3">
                  <Input
                    placeholder="Endereço completo do evento"
                    value={localEndereco}
                    onChange={(e) => setLocalEndereco(e.target.value)}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Vagas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="vagas-limitadas">Limitar vagas</Label>
                  <p className="text-xs text-gray-500">
                    Definir número máximo de participantes
                  </p>
                </div>
                <Switch
                  id="vagas-limitadas"
                  checked={vagasLimitadas}
                  onCheckedChange={setVagasLimitadas}
                />
              </div>

              {vagasLimitadas && (
                <div>
                  <Label htmlFor="total-vagas">Número de Vagas</Label>
                  <Input
                    id="total-vagas"
                    type="number"
                    placeholder="Ex: 50"
                    value={totalVagas}
                    onChange={(e) => setTotalVagas(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Público */}
            <div>
              <Label htmlFor="publico">Público-alvo</Label>
              <Select value={publico} onValueChange={(v) => setPublico(v as Evento['publico'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os usuários</SelectItem>
                  <SelectItem value="curso_especifico">Curso específico</SelectItem>
                  <SelectItem value="turma_especifica">Turma específica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Certificado */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <Label htmlFor="certificado">Emitir certificado de participação</Label>
                <p className="text-xs text-gray-500">
                  Os participantes receberão certificado digital
                </p>
              </div>
              <Switch
                id="certificado"
                checked={emitirCertificado}
                onCheckedChange={setEmitirCertificado}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCriarEvento}>
              Criar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventosPage;
