import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../contexts/MockDataContext';
import { DisciplinaCard } from '../../components/disciplinas/DisciplinaCard';
import { DisciplinaFilters } from '../../components/disciplinas/DisciplinaFilters';
import { DisciplinaForm } from '../../components/disciplinas/DisciplinaForm';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Plus, BookOpen } from 'lucide-react';
import type { Disciplina } from '../../types';
import type { DisciplinaFormData } from '../../schemas/disciplinaSchemas';

export const DisciplinasListPage: React.FC = () => {
  const navigate = useNavigate();
  const { disciplinas, cursos, addDisciplina, updateDisciplina, deleteDisciplina } = useMockData();
  
  const [busca, setBusca] = useState('');
  const [cursoId, setCursoId] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);

  // Filtrar disciplinas
  const disciplinasFiltradas = useMemo(() => {
    return disciplinas.filter(disciplina => {
      // Filtro de busca
      if (busca) {
        const buscaLower = busca.toLowerCase();
        const matchNome = disciplina.nome.toLowerCase().includes(buscaLower);
        const matchDescricao = disciplina.descricao.toLowerCase().includes(buscaLower);
        if (!matchNome && !matchDescricao) return false;
      }

      // Filtro de curso
      if (cursoId !== 'todos' && disciplina.curso_id !== cursoId) {
        return false;
      }

      return true;
    }).sort((a, b) => a.ordem - b.ordem); // Ordenar por ordem
  }, [disciplinas, busca, cursoId]);

  const handleLimparFiltros = () => {
    setBusca('');
    setCursoId('todos');
  };

  const handleNovaDisciplina = () => {
    setSelectedDisciplina(null);
    setShowForm(true);
  };

  const handleEditarDisciplina = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    setShowForm(true);
  };

  const handleVisualizarDisciplina = (disciplina: Disciplina) => {
    navigate(`/gestor/disciplinas/${disciplina.id}`);
  };

  const handleDeletarDisciplina = (disciplina: Disciplina) => {
    // TODO: Verificar se há materiais ou notas associadas
    
    if (confirm(`Tem certeza que deseja excluir a disciplina "${disciplina.nome}"?`)) {
      deleteDisciplina(disciplina.id);
      toast.success('Disciplina excluída com sucesso!');
    }
  };

  const handleSubmitForm = (data: DisciplinaFormData) => {
    if (selectedDisciplina) {
      updateDisciplina(selectedDisciplina.id, data);
      toast.success('Disciplina atualizada com sucesso!');
    } else {
      addDisciplina(data);
      toast.success('Disciplina criada com sucesso!');
    }
    setShowForm(false);
    setSelectedDisciplina(null);
  };

  // Agrupar disciplinas por curso
  const disciplinasPorCurso = useMemo(() => {
    const grupos: { [cursoId: string]: Disciplina[] } = {};
    
    disciplinasFiltradas.forEach(disciplina => {
      if (!grupos[disciplina.curso_id]) {
        grupos[disciplina.curso_id] = [];
      }
      grupos[disciplina.curso_id].push(disciplina);
    });
    
    return grupos;
  }, [disciplinasFiltradas]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Disciplinas</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie as disciplinas dos cursos
          </p>
        </div>

        <Button onClick={handleNovaDisciplina}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Disciplina
        </Button>
      </div>

      {/* Filtros */}
      <DisciplinaFilters
        busca={busca}
        curso_id={cursoId}
        cursos={cursos}
        onBuscaChange={setBusca}
        onCursoChange={setCursoId}
        onLimpar={handleLimparFiltros}
      />

      {/* Lista de Disciplinas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Disciplinas ({disciplinasFiltradas.length})
          </h2>
        </div>

        {disciplinasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">
              Nenhuma disciplina encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {busca || cursoId !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira disciplina'}
            </p>
            {!busca && cursoId === 'todos' && (
              <Button onClick={handleNovaDisciplina}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Disciplina
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(disciplinasPorCurso).map(([cursoIdKey, disciplinasCurso]) => {
              const curso = cursos.find(c => c.id === cursoIdKey);
              
              return (
                <div key={cursoIdKey}>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      {curso?.nome || 'Curso não encontrado'}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({disciplinasCurso.length} {disciplinasCurso.length === 1 ? 'disciplina' : 'disciplinas'})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {disciplinasCurso.map(disciplina => (
                      <DisciplinaCard
                        key={disciplina.id}
                        disciplina={disciplina}
                        curso={curso}
                        onView={handleVisualizarDisciplina}
                        onEdit={handleEditarDisciplina}
                        onDelete={handleDeletarDisciplina}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <DisciplinaForm
          disciplina={selectedDisciplina || undefined}
          cursos={cursos}
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedDisciplina(null);
          }}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  );
};

export default DisciplinasListPage;
