// ============================================
// PÁGINA: COMUNICADOS DO GESTOR
// ============================================

import React, { useState, useMemo } from 'react';
import { Send, TrendingUp, Users, Eye, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { ComunicadoCard } from '../../components/comunicados/ComunicadoCard';
import { ComunicadoViewDialog } from '../../components/comunicados/ComunicadoViewDialog';
import { ComunicadoFilters } from '../../components/comunicados/ComunicadoFilters';
import { ComunicadoForm } from '../../components/comunicados/ComunicadoForm';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { ComunicadoComDetalhes } from '../../types';
import type { ComunicadoFormData } from '../../schemas/comunicadoSchemas';

export const ComunicadosGestorPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    comunicados, 
    comunicadosLeituras, 
    alunos, 
    professores, 
    turmas, 
    matriculas,
    addComunicado 
  } = useMockData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
  const [destinatariosFilter, setDestinatariosFilter] = useState('todos');
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

      return {
        ...com,
        remetente,
        turma,
        total_destinatarios: totalDestinatarios,
        total_leituras: totalLeituras
      };
    }).sort((a, b) => new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime());
  }, [comunicados, comunicadosLeituras, alunos, professores, turmas, matriculas]);

  // Aplicar filtros
  const comunicadosFiltrados = useMemo(() => {
    return comunicadosComDetalhes.filter(com => {
      const matchSearch = searchTerm === '' || 
        com.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        com.mensagem.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPrioridade = prioridadeFilter === 'todas' || com.prioridade === prioridadeFilter;
      
      const matchDestinatarios = destinatariosFilter === 'todos' || com.destinatarios === destinatariosFilter;

      return matchSearch && matchPrioridade && matchDestinatarios;
    });
  }, [comunicadosComDetalhes, searchTerm, prioridadeFilter, destinatariosFilter]);

  // Estatísticas gerais
  const totalComunicados = comunicados.length;
  const totalEnviadosHoje = comunicados.filter(c => {
    const hoje = new Date();
    const dataEnvio = new Date(c.data_envio);
    return dataEnvio.toDateString() === hoje.toDateString();
  }).length;

  // Taxa média de leitura
  const taxaMediaLeitura = useMemo(() => {
    const comunicadosComDestinatarios = comunicadosComDetalhes.filter(c => c.total_destinatarios! > 0);
    if (comunicadosComDestinatarios.length === 0) return 0;
    
    const somaPercentuais = comunicadosComDestinatarios.reduce((acc, com) => {
      const percentual = (com.total_leituras! / com.total_destinatarios!) * 100;
      return acc + percentual;
    }, 0);
    
    return Math.round(somaPercentuais / comunicadosComDestinatarios.length);
  }, [comunicadosComDetalhes]);

  // Comunicados com baixa taxa de leitura (menos de 50%)
  const comunicadosBaixaLeitura = useMemo(() => {
    return comunicadosComDetalhes.filter(com => {
      if (!com.total_destinatarios || com.total_destinatarios === 0) return false;
      const percentual = (com.total_leituras! / com.total_destinatarios!) * 100;
      return percentual < 50;
    }).length;
  }, [comunicadosComDetalhes]);

  // Enviar comunicado
  const handleSubmitComunicado = (data: ComunicadoFormData) => {
    if (!user) return;

    addComunicado({
      ...data,
      remetente_id: user.id,
      data_envio: new Date()
    } as any);

    toast.success('Comunicado enviado com sucesso!');
    setShowForm(false);
  };

  // Visualizar comunicado
  const handleViewComunicado = (comunicado: ComunicadoComDetalhes) => {
    setSelectedComunicado(comunicado);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comunicados</h1>
          <p className="text-gray-600 mt-1">
            Envie comunicados e acompanhe o engajamento dos destinatários
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enviados</p>
                <p className="text-2xl font-semibold mt-1">{totalComunicados}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enviados Hoje</p>
                <p className="text-2xl font-semibold mt-1">{totalEnviadosHoje}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa Média de Leitura</p>
                <p className="text-2xl font-semibold mt-1">{taxaMediaLeitura}%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Baixa Leitura</p>
                <p className="text-2xl font-semibold mt-1">{comunicadosBaixaLeitura}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comunicados com Baixa Taxa de Leitura */}
      {comunicadosBaixaLeitura > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-orange-800">
              <Users className="h-4 w-4" />
              Atenção: {comunicadosBaixaLeitura} comunicado(s) com baixa taxa de leitura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700">
              Alguns comunicados foram lidos por menos de 50% dos destinatários. 
              Considere reenviar ou entrar em contato diretamente.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Novo Comunicado */}
      {showForm && (
        <ComunicadoForm
          onSubmit={handleSubmitComunicado}
          onCancel={() => setShowForm(false)}
          userRole="gestor"
          userId={user?.id || ''}
        />
      )}

      {/* Lista de Comunicados */}
      {!showForm && (
        <>
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

          <div>
            <h2 className="mb-4">Todos os Comunicados ({comunicadosFiltrados.length})</h2>

            {comunicadosFiltrados.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {searchTerm || prioridadeFilter !== 'todas' || destinatariosFilter !== 'todos'
                      ? 'Nenhum comunicado encontrado com os filtros aplicados.'
                      : 'Nenhum comunicado foi enviado ainda.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {comunicadosFiltrados.map(comunicado => (
                  <ComunicadoCard
                    key={comunicado.id}
                    comunicado={comunicado}
                    onView={handleViewComunicado}
                    showReadStatus={false}
                    showStats={true}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Dialog de Visualização */}
      <ComunicadoViewDialog
        comunicado={selectedComunicado}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        showReadStatus={false}
        showStats={true}
      />
    </div>
  );
};

export default ComunicadosGestorPage;
