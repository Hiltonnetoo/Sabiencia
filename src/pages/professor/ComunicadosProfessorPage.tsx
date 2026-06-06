// ============================================
// PÁGINA: COMUNICADOS DO PROFESSOR
// ============================================

import React, { useState, useMemo } from 'react';
import { Send, Mail, Inbox, Plus } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ComunicadoCard } from '../../components/comunicados/ComunicadoCard';
import { ComunicadoViewDialog } from '../../components/comunicados/ComunicadoViewDialog';
import { ComunicadoFilters } from '../../components/comunicados/ComunicadoFilters';
import { ComunicadoForm } from '../../components/comunicados/ComunicadoForm';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { podeVerComunicado } from '../../schemas/comunicadoSchemas';
import { toast } from 'sonner';
import type { ComunicadoComDetalhes } from '../../types';
import type { ComunicadoFormData } from '../../schemas/comunicadoSchemas';

export const ComunicadosProfessorPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    comunicados, 
    comunicadosLeituras, 
    alunos, 
    professores, 
    turmas, 
    matriculas,
    addComunicado,
    addComunicadoLeitura 
  } = useMockData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
  const [destinatariosFilter, setDestinatariosFilter] = useState('todos');
  const [leituraFilter, setLeituraFilter] = useState('todos');
  const [selectedComunicado, setSelectedComunicado] = useState<ComunicadoComDetalhes | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Preparar comunicados com detalhes e estatísticas
  const comunicadosComDetalhes: ComunicadoComDetalhes[] = useMemo(() => {
    return comunicados.map(com => {
      const remetente = [...alunos, ...professores].find(u => u.id === com.remetente_id);
      const turma = turmas.find(t => t.id === com.turma_id);
      
      // Calcular total de destinatários
      let totalDestinatarios = 0;
      if (com.destinatarios === 'todos_alunos') {
        totalDestinatarios = alunos.filter(a => a.matricula?.status === 'ativo').length;
      } else if (com.destinatarios === 'todos_professores') {
        totalDestinatarios = professores.length;
      } else if (com.destinatarios === 'turma_especifica' && com.turma_id) {
        totalDestinatarios = matriculas.filter(
          m => m.turma_id === com.turma_id && m.status === 'ativo'
        ).length;
      } else if (com.destinatarios === 'individual') {
        totalDestinatarios = 1;
      }

      // Calcular total de leituras
      const totalLeituras = comunicadosLeituras.filter(l => l.comunicado_id === com.id).length;
      
      // Verificar se o professor leu (quando recebe comunicado)
      const leitura = comunicadosLeituras.find(
        l => l.comunicado_id === com.id && l.usuario_id === user?.id
      );

      return {
        ...com,
        remetente,
        turma,
        total_destinatarios: totalDestinatarios,
        total_leituras: totalLeituras,
        lido: !!leitura,
        data_leitura: leitura?.data_leitura
      };
    }).sort((a, b) => new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime());
  }, [comunicados, comunicadosLeituras, user, alunos, professores, turmas, matriculas]);

  // Comunicados enviados pelo professor
  const comunicadosEnviados = useMemo(() => {
    return comunicadosComDetalhes.filter(com => com.remetente_id === user?.id);
  }, [comunicadosComDetalhes, user]);

  // Comunicados recebidos pelo professor
  const comunicadosRecebidos = useMemo(() => {
    return comunicadosComDetalhes.filter(com => 
      podeVerComunicado(com, user?.id || '', 'professor') && com.remetente_id !== user?.id
    );
  }, [comunicadosComDetalhes, user]);

  // Aplicar filtros nos comunicados recebidos
  const comunicadosRecebidosFiltrados = useMemo(() => {
    return comunicadosRecebidos.filter(com => {
      const matchSearch = searchTerm === '' || 
        com.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        com.mensagem.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPrioridade = prioridadeFilter === 'todas' || com.prioridade === prioridadeFilter;
      
      const matchLeitura = 
        leituraFilter === 'todos' ||
        (leituraFilter === 'lidos' && com.lido) ||
        (leituraFilter === 'nao_lidos' && !com.lido);

      return matchSearch && matchPrioridade && matchLeitura;
    });
  }, [comunicadosRecebidos, searchTerm, prioridadeFilter, leituraFilter]);

  // Aplicar filtros nos comunicados enviados
  const comunicadosEnviadosFiltrados = useMemo(() => {
    return comunicadosEnviados.filter(com => {
      const matchSearch = searchTerm === '' || 
        com.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        com.mensagem.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPrioridade = prioridadeFilter === 'todas' || com.prioridade === prioridadeFilter;
      
      const matchDestinatarios = destinatariosFilter === 'todos' || com.destinatarios === destinatariosFilter;

      return matchSearch && matchPrioridade && matchDestinatarios;
    });
  }, [comunicadosEnviados, searchTerm, prioridadeFilter, destinatariosFilter]);

  // Estatísticas
  const totalEnviados = comunicadosEnviados.length;
  const totalRecebidos = comunicadosRecebidos.length;
  const totalNaoLidos = comunicadosRecebidos.filter(c => !c.lido).length;

  // Enviar comunicado
  const handleSubmitComunicado = (data: ComunicadoFormData) => {
    if (!user) return;

    addComunicado({
      ...data,
      remetente_id: user.id,
      data_envio: new Date()
    });

    toast.success('Comunicado enviado com sucesso!');
    setShowForm(false);
  };

  // Marcar como lido
  const handleMarkAsRead = (comunicadoId: string) => {
    if (!user) return;

    addComunicadoLeitura({
      comunicado_id: comunicadoId,
      usuario_id: user.id,
      data_leitura: new Date()
    });

    toast.success('Comunicado marcado como lido!');
  };

  // Visualizar comunicado
  const handleViewComunicado = (comunicado: ComunicadoComDetalhes, isEnviado: boolean) => {
    setSelectedComunicado(comunicado);
    setDialogOpen(true);

    // Marcar como lido automaticamente ao abrir (apenas se for recebido)
    if (!isEnviado && !comunicado.lido && user) {
      handleMarkAsRead(comunicado.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comunicados</h1>
          <p className="text-gray-600 mt-1">
            Envie comunicados para suas turmas e receba avisos da escola
          </p>
        </div>
        
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Comunicado
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enviados por Mim</p>
                <p className="text-2xl font-semibold mt-1">{totalEnviados}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recebidos</p>
                <p className="text-2xl font-semibold mt-1">{totalRecebidos}</p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Não Lidos</p>
                <p className="text-2xl font-semibold mt-1">{totalNaoLidos}</p>
              </div>
              <Inbox className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Novo Comunicado */}
      {showForm && (
        <ComunicadoForm
          onSubmit={handleSubmitComunicado}
          onCancel={() => setShowForm(false)}
          userRole="professor"
          userId={user?.id || ''}
        />
      )}

      {/* Tabs: Enviados e Recebidos */}
      {!showForm && (
        <>
          <Tabs defaultValue="recebidos" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recebidos">
                Recebidos ({totalRecebidos})
              </TabsTrigger>
              <TabsTrigger value="enviados">
                Enviados ({totalEnviados})
              </TabsTrigger>
            </TabsList>

            {/* Tab: Comunicados Recebidos */}
            <TabsContent value="recebidos" className="space-y-4">
              <ComunicadoFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                prioridadeFilter={prioridadeFilter}
                onPrioridadeChange={setPrioridadeFilter}
                destinatariosFilter=""
                onDestinatariosChange={() => {}}
                showDestinatariosFilter={false}
                leituraFilter={leituraFilter}
                onLeituraChange={setLeituraFilter}
                showLeituraFilter={true}
              />

              {comunicadosRecebidosFiltrados.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {searchTerm || prioridadeFilter !== 'todas' || leituraFilter !== 'todos'
                        ? 'Nenhum comunicado encontrado com os filtros aplicados.'
                        : 'Você não tem comunicados recebidos.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {comunicadosRecebidosFiltrados.map(comunicado => (
                    <ComunicadoCard
                      key={comunicado.id}
                      comunicado={comunicado}
                      onView={(com) => handleViewComunicado(com, false)}
                      onMarkAsRead={handleMarkAsRead}
                      showReadStatus={true}
                      showStats={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tab: Comunicados Enviados */}
            <TabsContent value="enviados" className="space-y-4">
              <ComunicadoFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                prioridadeFilter={prioridadeFilter}
                onPrioridadeChange={setPrioridadeFilter}
                destinatariosFilter={destinatariosFilter}
                onDestinatariosChange={setDestinatariosFilter}
                showDestinatariosFilter={true}
                showLeituraFilter={false}
              />

              {comunicadosEnviadosFiltrados.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Send className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {searchTerm || prioridadeFilter !== 'todas' || destinatariosFilter !== 'todos'
                        ? 'Nenhum comunicado encontrado com os filtros aplicados.'
                        : 'Você ainda não enviou nenhum comunicado.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {comunicadosEnviadosFiltrados.map(comunicado => (
                    <ComunicadoCard
                      key={comunicado.id}
                      comunicado={comunicado}
                      onView={(com) => handleViewComunicado(com, true)}
                      showReadStatus={false}
                      showStats={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Dialog de Visualização */}
      <ComunicadoViewDialog
        comunicado={selectedComunicado}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        showReadStatus={selectedComunicado?.remetente_id !== user?.id}
        showStats={selectedComunicado?.remetente_id === user?.id}
      />
    </div>
  );
};

export default ComunicadosProfessorPage;
