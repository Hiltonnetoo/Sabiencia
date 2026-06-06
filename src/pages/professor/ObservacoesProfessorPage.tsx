// ============================================
// OBSERVAÇÕES PROFESSOR PAGE
// ============================================

import React, { useState, useMemo } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ObservacaoCard } from '../../components/observacoes/ObservacaoCard';
import { ObservacaoFilters } from '../../components/observacoes/ObservacaoFilters';
import { ObservacaoForm } from '../../components/observacoes/ObservacaoForm';
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { Observacao } from '../../types';
import type { ObservacaoFormData, ObservacaoFilters as FiltersType } from '../../schemas/observacaoSchemas';

export const ObservacoesProfessorPage: React.FC = () => {
  const { user } = useAuth();
  const {
    observacoes,
    alunos,
    professores,
    disciplinas,
    matriculas,
    professorTurmaDisciplina,
    addObservacao,
    updateObservacao,
    deleteObservacao
  } = useMockData();

  const [filters, setFilters] = useState<FiltersType>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObservacao, setEditingObservacao] = useState<Observacao | undefined>();
  const [deletingObservacao, setDeletingObservacao] = useState<Observacao | undefined>();

  // Filtrar alunos das turmas do professor
  const alunosDoProfessor = useMemo(() => {
    if (!user) return [];
    
    const turmasIds = professorTurmaDisciplina
      .filter(ptd => ptd.professor_id === user.id)
      .map(ptd => ptd.turma_id);
    
    const alunosIds = matriculas
      .filter(m => turmasIds.includes(m.turma_id) && m.status === 'ativo')
      .map(m => m.aluno_id);
    
    return alunos.filter(a => alunosIds.includes(a.id));
  }, [user, alunos, matriculas, professorTurmaDisciplina]);

  // Filtrar disciplinas do professor
  const disciplinasDoProfessor = useMemo(() => {
    if (!user) return [];
    
    const disciplinasIds = professorTurmaDisciplina
      .filter(ptd => ptd.professor_id === user.id)
      .map(ptd => ptd.disciplina_id);
    
    return disciplinas.filter(d => disciplinasIds.includes(d.id));
  }, [user, disciplinas, professorTurmaDisciplina]);

  // Filtrar observações do professor
  const observacoesFiltradas = useMemo(() => {
    if (!user) return [];

    let result = observacoes.filter(obs => obs.professor_id === user.id);

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
  }, [observacoes, filters, user]);

  const handleSubmit = (data: ObservacaoFormData) => {
    try {
      if (editingObservacao) {
        updateObservacao(editingObservacao.id, data);
        toast.success('Observação atualizada com sucesso!');
      } else {
        addObservacao(data);
        toast.success('Observação registrada com sucesso!');
      }
      setIsFormOpen(false);
      setEditingObservacao(undefined);
    } catch (error) {
      toast.error('Erro ao salvar observação. Tente novamente.');
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
      toast.success('Observação excluída com sucesso!');
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

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Observações dos Alunos</h1>
          <p className="text-gray-600 mt-1">
            Registre observações pedagógicas, comportamentais e administrativas
          </p>
        </div>
        <Button onClick={handleOpenForm}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Observação
        </Button>
      </div>

      {/* Filtros */}
      <ObservacaoFilters
        filters={filters}
        onFiltersChange={setFilters}
        alunos={alunosDoProfessor}
        disciplinas={disciplinasDoProfessor}
        showProfessorFilter={false}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {observacoesFiltradas.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pedagógicas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {observacoesFiltradas.filter(o => o.tipo === 'pedagogica').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Comportamentais</p>
              <p className="text-2xl font-semibold text-gray-900">
                {observacoesFiltradas.filter(o => o.tipo === 'comportamental').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Administrativas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {observacoesFiltradas.filter(o => o.tipo === 'administrativa').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Observações */}
      {observacoesFiltradas.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Nenhuma observação encontrada</h3>
          <p className="text-gray-600 mb-6">
            {filters.busca || filters.aluno_id || filters.disciplina_id || filters.tipo
              ? 'Tente ajustar os filtros para encontrar observações.'
              : 'Comece registrando observações sobre seus alunos.'}
          </p>
          {!filters.busca && !filters.aluno_id && !filters.disciplina_id && !filters.tipo && (
            <Button onClick={handleOpenForm}>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Primeira Observação
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
        alunos={alunosDoProfessor}
        disciplinas={disciplinasDoProfessor}
        professorId={user.id}
      />

      {/* Confirmação de Exclusão */}
      <DeleteConfirmDialog
        open={!!deletingObservacao}
        onOpenChange={(open) => !open && setDeletingObservacao(undefined)}
        onConfirm={confirmDelete}
        title="Excluir Observação"
        description="Tem certeza que deseja excluir esta observação? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default ObservacoesProfessorPage;
