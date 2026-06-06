import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../contexts/MockDataContext';
import { TurmaCard } from '../../components/turmas/TurmaCard';
import { TurmaFilters } from '../../components/turmas/TurmaFilters';
import { TurmaForm } from '../../components/turmas/TurmaForm';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Plus, GraduationCap } from 'lucide-react';
import type { Turma } from '../../types';
import type { TurmaFormData } from '../../schemas/turmaSchemas';

export const TurmasListPage: React.FC = () => {
  const navigate = useNavigate();
  const { turmas, cursos, alunos, addTurma, updateTurma, deleteTurma } = useMockData();
  
  const [busca, setBusca] = useState('');
  const [cursoId, setCursoId] = useState('todos');
  const [periodo, setPeriodo] = useState('todos');
  const [status, setStatus] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);

  // Filtrar turmas
  const turmasFiltradas = useMemo(() => {
    return turmas.filter(turma => {
      // Filtro de busca
      if (busca) {
        const buscaLower = busca.toLowerCase();
        const matchNome = turma.nome.toLowerCase().includes(buscaLower);
        if (!matchNome) return false;
      }

      // Filtro de curso
      if (cursoId !== 'todos' && turma.curso_id !== cursoId) {
        return false;
      }

      // Filtro de período
      if (periodo !== 'todos' && turma.periodo !== periodo) {
        return false;
      }

      // Filtro de status
      if (status !== 'todos') {
        const isAtiva = turma.ativa && new Date(turma.data_fim) > new Date();
        if (status === 'ativa' && !isAtiva) return false;
        if (status === 'inativa' && isAtiva) return false;
      }

      return true;
    });
  }, [turmas, busca, cursoId, periodo, status]);

  // Contar alunos por turma
  const getAlunosPorTurma = (turmaId: string) => {
    return alunos.filter(aluno => aluno.turma_id === turmaId).length;
  };

  const handleLimparFiltros = () => {
    setBusca('');
    setCursoId('todos');
    setPeriodo('todos');
    setStatus('todos');
  };

  const handleNovaTurma = () => {
    setSelectedTurma(null);
    setShowForm(true);
  };

  const handleEditarTurma = (turma: Turma) => {
    setSelectedTurma(turma);
    setShowForm(true);
  };

  const handleVisualizarTurma = (turma: Turma) => {
    navigate(`/gestor/turmas/${turma.id}`);
  };

  const handleDeletarTurma = (turma: Turma) => {
    const alunosNaTurma = getAlunosPorTurma(turma.id);
    
    if (alunosNaTurma > 0) {
      toast.error(`Não é possível excluir. Existem ${alunosNaTurma} aluno(s) matriculado(s) nesta turma.`);
      return;
    }

    if (confirm(`Tem certeza que deseja excluir a turma "${turma.nome}"?`)) {
      deleteTurma(turma.id);
      toast.success('Turma excluída com sucesso!');
    }
  };

  const handleSubmitForm = (data: TurmaFormData) => {
    if (selectedTurma) {
      updateTurma(selectedTurma.id, data as any);
      toast.success('Turma atualizada com sucesso!');
    } else {
      addTurma(data as any);
      toast.success('Turma criada com sucesso!');
    }
    setShowForm(false);
    setSelectedTurma(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Turmas</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie as turmas dos cursos
          </p>
        </div>

        <Button onClick={handleNovaTurma}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Turma
        </Button>
      </div>

      {/* Filtros */}
      <TurmaFilters
        busca={busca}
        curso_id={cursoId}
        periodo={periodo}
        status={status}
        cursos={cursos}
        onBuscaChange={setBusca}
        onCursoChange={setCursoId}
        onPeriodoChange={setPeriodo}
        onStatusChange={setStatus}
        onLimpar={handleLimparFiltros}
      />

      {/* Lista de Turmas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Turmas ({turmasFiltradas.length})
          </h2>
        </div>

        {turmasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">
              Nenhuma turma encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {busca || cursoId !== 'todos' || periodo !== 'todos' || status !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira turma'}
            </p>
            {!busca && cursoId === 'todos' && periodo === 'todos' && status === 'todos' && (
              <Button onClick={handleNovaTurma}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Turma
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {turmasFiltradas.map(turma => {
              const curso = cursos.find(c => c.id === turma.curso_id);
              const totalAlunos = getAlunosPorTurma(turma.id);

              return (
                <TurmaCard
                  key={turma.id}
                  turma={turma}
                  curso={curso}
                  totalAlunos={totalAlunos}
                  onView={handleVisualizarTurma}
                  onEdit={handleEditarTurma}
                  onDelete={handleDeletarTurma}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <TurmaForm
          turma={selectedTurma || undefined}
          cursos={cursos}
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedTurma(null);
          }}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  );
};

export default TurmasListPage;
