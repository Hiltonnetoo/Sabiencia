// ============================================
// EVENTOS ALUNO PAGE - Visualizar e Inscrever-se em Eventos
// ============================================

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Calendar,
  MapPin,
  Users,
  Award,
  Clock,
  UserCheck
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
  emitirCertificado: boolean;
  inscrito?: boolean;
}

export const EventosAlunoPage: React.FC = () => {
  const [abaSelecionada, setAbaSelecionada] = useState<'disponiveis' | 'inscritos'>('disponiveis');

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
      emitirCertificado: true,
      inscrito: false
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
      emitirCertificado: true,
      inscrito: true
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
      emitirCertificado: false,
      inscrito: true
    }
  ];

  const eventosDisponiveis = eventosMockados.filter(e => !e.inscrito);
  const eventosInscritos = eventosMockados.filter(e => e.inscrito);

  const handleInscrever = (eventoId: string) => {
    toast.success('Inscrição realizada com sucesso!', {
      description: 'Você receberá um e-mail de confirmação em breve.',
    });
  };

  const handleCancelarInscricao = (eventoId: string) => {
    toast.info('Inscrição cancelada', {
      description: 'Sua inscrição foi cancelada com sucesso.',
    });
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEvento = (evento: Evento, inscrito: boolean) => (
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
              {inscrito && (
                <Badge className="bg-green-100 text-green-700">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Inscrito
                </Badge>
              )}
            </div>

            <p className="text-gray-600 mb-4">
              {evento.descricao}
            </p>

            {/* Detalhes */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <div>
                  <p className="font-medium text-gray-900">Data e Hora</p>
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

              {evento.vagasLimitadas && evento.totalVagas && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <div>
                    <p className="font-medium text-gray-900">Vagas</p>
                    <p>
                      {evento.inscritos} / {evento.totalVagas}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Progresso de Vagas */}
            {evento.vagasLimitadas && evento.totalVagas && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Vagas preenchidas</span>
                  <span>{Math.round((evento.inscritos / evento.totalVagas) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      evento.inscritos / evento.totalVagas >= 0.9
                        ? 'bg-red-600'
                        : evento.inscritos / evento.totalVagas >= 0.7
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{
                      width: `${(evento.inscritos / evento.totalVagas) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Link/Endereço */}
            {inscrito && evento.localTipo === 'online' && evento.localLink && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="font-medium text-blue-900 mb-1">Link do Evento:</p>
                <a href={evento.localLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {evento.localLink}
                </a>
              </div>
            )}

            {inscrito && evento.localTipo === 'presencial' && evento.localEndereco && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                <p className="font-medium text-green-900 mb-1">Local do Evento:</p>
                <p className="text-green-700">{evento.localEndereco}</p>
              </div>
            )}
          </div>

          {/* Botão de Ação */}
          <div className="ml-4">
            {inscrito ? (
              <Button 
                variant="outline"
                onClick={() => handleCancelarInscricao(evento.id)}
                className="text-red-600 hover:bg-red-50"
              >
                Cancelar Inscrição
              </Button>
            ) : evento.vagasLimitadas && evento.totalVagas && evento.inscritos >= evento.totalVagas ? (
              <Button disabled>
                Vagas Esgotadas
              </Button>
            ) : (
              <Button onClick={() => handleInscrever(evento.id)}>
                Inscrever-se
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Eventos e Atividades</h1>
        <p className="text-gray-600 mt-1">
          Participe de palestras, workshops e atividades extracurriculares
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Eventos Disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{eventosDisponiveis.length}</p>
                <p className="text-xs text-gray-500">para se inscrever</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Minhas Inscrições</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{eventosInscritos.length}</p>
                <p className="text-xs text-gray-500">eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Certificados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-gray-500">emitido</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Eventos */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={abaSelecionada} onValueChange={(v) => setAbaSelecionada(v as any)}>
            <TabsList>
              <TabsTrigger value="disponiveis">
                Disponíveis ({eventosDisponiveis.length})
              </TabsTrigger>
              <TabsTrigger value="inscritos">
                Minhas Inscrições ({eventosInscritos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="disponiveis" className="space-y-4 mt-6">
              {eventosDisponiveis.length > 0 ? (
                eventosDisponiveis.map((evento) => renderEvento(evento, false))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum evento disponível
                  </h3>
                  <p className="text-gray-500">
                    Novos eventos serão divulgados em breve
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inscritos" className="space-y-4 mt-6">
              {eventosInscritos.length > 0 ? (
                eventosInscritos.map((evento) => renderEvento(evento, true))
              ) : (
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Você ainda não está inscrito em nenhum evento
                  </h3>
                  <p className="text-gray-500">
                    Navegue pela aba "Disponíveis" para se inscrever
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventosAlunoPage;
