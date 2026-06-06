// ============================================
// PÁGINA: COMUNICADOS DO ALUNO
// ============================================

import React, { useState, useMemo } from 'react';
import { Bell, Mail, Inbox } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ComunicadoCard } from '../../components/comunicados/ComunicadoCard';
import { ComunicadoViewDialog } from '../../components/comunicados/ComunicadoViewDialog';
import { ComunicadoFilters } from '../../components/comunicados/ComunicadoFilters';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { podeVerComunicado } from '../../schemas/comunicadoSchemas';
import { toast } from 'sonner';
import type { ComunicadoComDetalhes } from '../../types';

export const ComunicadosAlunoPage: React.FC = () => {
  const { user } = useAuth();
  const { comunicados, comunicadosLeituras, alunos, professores, turmas, addComunicadoLeitura } = useMockData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
  const [leituraFilter, setLeituraFilter] = useState('todos');
  const [selectedComunicado, setSelectedComunicado] = useState<ComunicadoComDetalhes | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Encontrar matrícula do aluno para pegar a turma
  const aluno = alunos.find(a => a.id === user?.id);
  const matricula = aluno?.matricula;
  const turmaId = matricula?.turma_id;

  // Preparar comunicados com detalhes e status de leitura
  const comunicadosComDetalhes: ComunicadoComDetalhes[] = useMemo(() => {
    return comunicados
      .filter(com => podeVerComunicado(com, user?.id || '', 'aluno', turmaId))
      .map(com => {
        const leitura = comunicadosLeituras.find(
          l => l.comunicado_id === com.id && l.usuario_id === user?.id
        );
        
        const remetente = [...alunos, ...professores].find(u => u.id === com.remetente_id);
        const turma = turmas.find(t => t.id === com.turma_id);

        return {
          ...com,
          remetente,
          turma,
          lido: !!leitura,
          data_leitura: leitura?.data_leitura
        };
      })
      .sort((a, b) => new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime());
  }, [comunicados, comunicadosLeituras, user, turmaId, alunos, professores, turmas]);

  // Aplicar filtros
  const comunicadosFiltrados = useMemo(() => {
    return comunicadosComDetalhes.filter(com => {
      // Filtro de busca
      const matchSearch = searchTerm === '' || 
        com.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        com.mensagem.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de prioridade
      const matchPrioridade = prioridadeFilter === 'todas' || com.prioridade === prioridadeFilter;

      // Filtro de leitura
      const matchLeitura = 
        leituraFilter === 'todos' ||
        (leituraFilter === 'lidos' && com.lido) ||
        (leituraFilter === 'nao_lidos' && !com.lido);

      return matchSearch && matchPrioridade && matchLeitura;
    });
  }, [comunicadosComDetalhes, searchTerm, prioridadeFilter, leituraFilter]);

  // Estatísticas
  const totalComunicados = comunicadosComDetalhes.length;
  const totalNaoLidos = comunicadosComDetalhes.filter(c => !c.lido).length;
  const totalUrgentes = comunicadosComDetalhes.filter(c => c.prioridade === 'urgente' && !c.lido).length;

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
  const handleViewComunicado = (comunicado: ComunicadoComDetalhes) => {
    setSelectedComunicado(comunicado);
    setDialogOpen(true);

    // Marcar como lido automaticamente ao abrir
    if (!comunicado.lido && user) {
      handleMarkAsRead(comunicado.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Comunicados</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe os avisos e comunicados da escola
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Comunicados</p>
                <p className="text-2xl font-semibold mt-1">{totalComunicados}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
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

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgentes Não Lidos</p>
                <p className="text-2xl font-semibold mt-1">{totalUrgentes}</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de comunicados urgentes */}
      {totalUrgentes > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <Bell className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Você tem <strong>{totalUrgentes}</strong> comunicado(s) urgente(s) não lido(s). 
            Por favor, leia com atenção!
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
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

      {/* Lista de Comunicados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2">
            Comunicados Recebidos
            {totalNaoLidos > 0 && (
              <Badge variant="default">{totalNaoLidos} novos</Badge>
            )}
          </h2>
        </div>

        {comunicadosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {searchTerm || prioridadeFilter !== 'todas' || leituraFilter !== 'todos'
                  ? 'Nenhum comunicado encontrado com os filtros aplicados.'
                  : 'Você ainda não recebeu nenhum comunicado.'}
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
                onMarkAsRead={handleMarkAsRead}
                showReadStatus={true}
                showStats={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog de Visualização */}
      <ComunicadoViewDialog
        comunicado={selectedComunicado}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        showReadStatus={true}
        showStats={false}
      />
    </div>
  );
};

export default ComunicadosAlunoPage;
