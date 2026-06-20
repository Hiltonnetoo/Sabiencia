// ============================================
// OBSERVAÇÕES GESTOR PAGE
// ============================================

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ObservacaoCard } from '../../components/observacoes/ObservacaoCard';
import { ObservacaoFilters } from '../../components/observacoes/ObservacaoFilters';
import { ObservacaoForm } from '../../components/observacoes/ObservacaoForm';
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { Observacao } from '../../types';
import type { ObservacaoFormData, ObservacaoFilters as FiltersType } from '../../schemas/observacaoSchemas';

export const ObservacoesGestorPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    observacoes,
    alunos,
    professores,
    disciplinas,
    addObservacao,
    updateObservacao,
    deleteObservacao
  } = useMockData();

  const [filters, setFilters] = useState<FiltersType>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObservacao, setEditingObservacao] = useState<Observacao | undefined>();
  const [deletingObservacao, setDeletingObservacao] = useState<Observacao | undefined>();

  // Filtrar e ordenar observações
  const observacoesFiltradas = useMemo(() => {
    let result = [...observacoes];

    // Aplicar filtros
    if (filters.busca) {
      const searchLower = filters.busca.toLowerCase();
      result = result.filter(obs =>
        obs.conteudo.toLowerCase().includes(searchLower)
      );
    }

    if (filters.aluno_id) {
      result = result.filter(obs => obs.aluno_id === filters.aluno_id);
    }

    if (filters.professor_id) {
      result = result.filter(obs => obs.professor_id === filters.professor_id);
    }

    if (filters.disciplina_id) {
      if (filters.disciplina_id === 'sem-disciplina') {
        result = result.filter(obs => !obs.disciplina_id);
      } else {
        result = result.filter(obs => obs.disciplina_id === filters.disciplina_id);
      }
    }

    if (filters.tipo) {
      result = result.filter(obs => obs.tipo === filters.tipo);
    }

    // Ordenar por data (mais recentes primeiro)
    return result.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [observacoes, filters]);

  const handleSubmit = (data: ObservacaoFormData) => {
    try {
      if (editingObservacao) {
        updateObservacao(editingObservacao.id, data as any);
        toast.success(t('gestor.observacoes.toast.updated'));
      } else {
        addObservacao(data as any);
        toast.success(t('gestor.observacoes.toast.created'));
      }
      setIsFormOpen(false);
      setEditingObservacao(undefined);
    } catch (error) {
      toast.error(t('gestor.observacoes.toast.error'));
    }
  };

  const handleEdit = (observacao: Observacao) => {
    setEditingObservacao(observacao);
    setIsFormOpen(true);
  };

  const handleDelete = (observacao: Observacao) => {
    setDeletingObservacao(observacao);
  };

  const confirmDelete = () => {
    if (deletingObservacao) {
      deleteObservacao(deletingObservacao.id);
      toast.success(t('gestor.observacoes.toast.deleted'));
      setDeletingObservacao(undefined);
    }
  };

  const handleOpenForm = () => {
    setEditingObservacao(undefined);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingObservacao(undefined);
  };

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: observacoesFiltradas.length,
      pedagogicas: observacoesFiltradas.filter(o => o.tipo === 'pedagogica').length,
      comportamentais: observacoesFiltradas.filter(o => o.tipo === 'comportamental').length,
      administrativas: observacoesFiltradas.filter(o => o.tipo === 'administrativa').length,
      visiveis: observacoesFiltradas.filter(o => o.visivel_aluno).length,
      ocultas: observacoesFiltradas.filter(o => !o.visivel_aluno).length,
    };
  }, [observacoesFiltradas]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('gestor.observacoes.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('gestor.observacoes.subtitle')}
          </p>
        </div>
        <Button onClick={handleOpenForm}>
          <Plus className="w-4 h-4 mr-2" />
          {t('gestor.observacoes.new')}
        </Button>
      </div>

      {/* Filtros */}
      <ObservacaoFilters
        filters={filters}
        onFiltersChange={setFilters}
        alunos={alunos}
        professores={professores}
        disciplinas={disciplinas}
        showAlunoFilter={true}
        showProfessorFilter={true}
        showDisciplinaFilter={true}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">{t('gestor.observacoes.stats.total')}</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">{t('gestor.observacoes.stats.pedagogicas')}</p>
            <p className="text-2xl font-semibold text-blue-600">{stats.pedagogicas}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">{t('gestor.observacoes.stats.comportamentais')}</p>
            <p className="text-2xl font-semibold text-green-600">{stats.comportamentais}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">{t('gestor.observacoes.stats.administrativas')}</p>
            <p className="text-2xl font-semibold text-purple-600">{stats.administrativas}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">{t('gestor.observacoes.stats.visiveis')}</p>
            <p className="text-2xl font-semibold text-green-600">{stats.visiveis}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">{t('gestor.observacoes.stats.ocultas')}</p>
            <p className="text-2xl font-semibold text-gray-600">{stats.ocultas}</p>
          </div>
        </div>
      </div>

      {/* Lista de Observações */}
      {observacoesFiltradas.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">{t('gestor.observacoes.emptyTitle')}</h3>
          <p className="text-gray-600 mb-6">
            {filters.busca || filters.aluno_id || filters.professor_id || filters.disciplina_id || filters.tipo
              ? t('gestor.observacoes.emptyFiltered')
              : t('gestor.observacoes.emptyDefault')}
          </p>
          {!filters.busca && !filters.aluno_id && !filters.professor_id && !filters.disciplina_id && !filters.tipo && (
            <Button onClick={handleOpenForm}>
              <Plus className="w-4 h-4 mr-2" />
              {t('gestor.observacoes.registerFirst')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {observacoesFiltradas.map((observacao) => {
            const aluno = alunos.find(a => a.id === observacao.aluno_id);
            const professor = professores.find(p => p.id === observacao.professor_id);
            const disciplina = observacao.disciplina_id 
              ? disciplinas.find(d => d.id === observacao.disciplina_id)
              : undefined;

            return (
              <ObservacaoCard
                key={observacao.id}
                observacao={observacao}
                aluno={aluno}
                professor={professor}
                disciplina={disciplina}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
                showStudent={true}
              />
            );
          })}
        </div>
      )}

      {/* Formulário */}
      <ObservacaoForm
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        onSubmit={handleSubmit}
        observacao={editingObservacao}
        alunos={alunos}
        disciplinas={disciplinas}
        professorId={user.id}
      />

      {/* Confirmação de Exclusão */}
      <DeleteConfirmDialog
        open={!!deletingObservacao}
        onOpenChange={(open) => !open && setDeletingObservacao(undefined)}
        onConfirm={confirmDelete}
        title={t('gestor.observacoes.deleteTitle')}
        description={t('gestor.observacoes.deleteDescription')}
      />
    </div>
  );
};

export default ObservacoesGestorPage;
