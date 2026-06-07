// ============================================
// CURSOS LIST PAGE - Listagem de cursos
// OTIMIZADO: Com memoização e filtros avançados
// ============================================

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Search, 
  TrendingUp,
  Clock,
  Users,
  Filter
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { EmptyState, SearchEmptyState } from '../../components/shared/EmptyState';
import { CursoCard } from '../../components/cursos/CursoCard';
import { CursoForm } from '../../components/cursos/CursoForm';
import { CursoFilters } from '../../components/cursos/CursoFilters';
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog';
import type { Curso } from '../../types';
import type { CursoFormData } from '../../schemas/cursoSchemas';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export const CursosListPage: React.FC = () => {
  const {
    cursos, 
    turmas, 
    matriculas, 
    disciplinas,
    addCurso,
    updateCurso,
    deleteCurso 
  } = useMockData();

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ativo: 'todos',
    cargaHorariaMin: '',
    cargaHorariaMax: '',
    duracaoMin: '',
    duracaoMax: '',
  });

  // Estados de modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState<Curso | null>(null);
  const [viewCurso, setViewCurso] = useState<Curso | null>(null);

  // OTIMIZADO: Memoizar dados filtrados
  const cursosFiltered = useMemo(() => {
    let result = [...cursos];

    // Filtro de busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        curso =>
          curso.nome.toLowerCase().includes(search) ||
          curso.descricao.toLowerCase().includes(search)
      );
    }

    // Filtro de status
    if (filters.ativo !== 'todos') {
      result = result.filter(curso => 
        filters.ativo === 'ativo' ? curso.ativo : !curso.ativo
      );
    }

    // Filtro de carga horária
    if (filters.cargaHorariaMin) {
      result = result.filter(curso => 
        curso.carga_horaria >= parseInt(filters.cargaHorariaMin)
      );
    }
    if (filters.cargaHorariaMax) {
      result = result.filter(curso => 
        curso.carga_horaria <= parseInt(filters.cargaHorariaMax)
      );
    }

    // Filtro de duração
    if (filters.duracaoMin) {
      result = result.filter(curso => 
        curso.duracao_meses >= parseInt(filters.duracaoMin)
      );
    }
    if (filters.duracaoMax) {
      result = result.filter(curso => 
        curso.duracao_meses <= parseInt(filters.duracaoMax)
      );
    }

    return result;
  }, [cursos, searchTerm, filters]);

  // OTIMIZADO: Memoizar estatísticas
  const estatisticas = useMemo(() => {
    const cursosAtivos = cursos.filter(c => c.ativo).length;
    const totalHoras = cursos.reduce((acc, c) => acc + c.carga_horaria, 0);
    const mediaDuracao = cursos.length > 0 
      ? Math.round(cursos.reduce((acc, c) => acc + c.duracao_meses, 0) / cursos.length)
      : 0;

    const turmasAtivas = turmas.filter(t => t.ativa).length;
    const alunosMatriculados = matriculas.filter(m => m.status === 'ativo').length;

    return {
      cursosAtivos,
      totalHoras,
      mediaDuracao,
      turmasAtivas,
      alunosMatriculados,
    };
  }, [cursos, turmas, matriculas]);

  // Handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      ativo: 'todos',
      cargaHorariaMin: '',
      cargaHorariaMax: '',
      duracaoMin: '',
      duracaoMax: '',
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.ativo !== 'todos' ||
           filters.cargaHorariaMin !== '' ||
           filters.cargaHorariaMax !== '' ||
           filters.duracaoMin !== '' ||
           filters.duracaoMax !== '';
  }, [filters]);

  const handleCreateCurso = () => {
    setSelectedCurso(undefined);
    setIsFormOpen(true);
  };

  const handleEditCurso = (curso: Curso) => {
    setSelectedCurso(curso);
    setIsFormOpen(true);
  };

  const handleViewCurso = (curso: Curso) => {
    setViewCurso(curso);
  };

  const handleToggleStatus = (curso: Curso) => {
    updateCurso(curso.id, { ativo: !curso.ativo });
    toast.success(
      curso.ativo 
        ? 'Curso desativado com sucesso' 
        : 'Curso ativado com sucesso'
    );
  };

  const handleFormSubmit = async (data: CursoFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay

      if (selectedCurso) {
        updateCurso(selectedCurso.id, data as any);
        toast.success('Curso atualizado com sucesso!');
      } else {
        addCurso(data as any);
        toast.success('Curso criado com sucesso!');
      }
      
      setIsFormOpen(false);
      setSelectedCurso(undefined);
    } catch (error) {
      toast.error('Erro ao salvar curso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCurso = async () => {
    if (!cursoToDelete) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteCurso(cursoToDelete.id);
      toast.success('Curso excluído com sucesso!');
      setCursoToDelete(null);
    } catch (error) {
      toast.error('Erro ao excluir curso');
    } finally {
      setIsLoading(false);
    }
  };

  // Estatísticas do curso para visualização
  const getCursoStats = (curso: Curso) => {
    const turmasCurso = turmas.filter(t => t.curso_id === curso.id);
    const turmasAtivas = turmasCurso.filter(t => t.ativa).length;
    const alunosAtivos = matriculas.filter(m => {
      const turma = turmas.find(t => t.id === m.turma_id);
      return turma?.curso_id === curso.id && m.status === 'ativo';
    }).length;
    const totalDisciplinas = disciplinas.filter(d => d.curso_id === curso.id).length;

    return { turmasCurso: turmasCurso.length, turmasAtivas, alunosAtivos, totalDisciplinas };
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os cursos oferecidos pela instituição
          </p>
        </div>
        <Button onClick={handleCreateCurso} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total de Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{cursos.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {estatisticas.cursosAtivos} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Carga Horária Total</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{estatisticas.totalHoras.toLocaleString()}h</div>
            <p className="text-xs text-gray-500 mt-1">
              Em todos os cursos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Duração Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{estatisticas.mediaDuracao}</div>
            <p className="text-xs text-gray-500 mt-1">
              Meses por curso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Turmas Ativas</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{estatisticas.turmasAtivas}</div>
            <p className="text-xs text-gray-500 mt-1">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{estatisticas.alunosMatriculados}</div>
            <p className="text-xs text-gray-500 mt-1">
              Matriculados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={hasActiveFilters ? 'default' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="w-full sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Ativos
            </Badge>
          )}
        </Button>
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <CursoFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Lista de Cursos */}
      {cursosFiltered.length === 0 ? (
        searchTerm || hasActiveFilters ? (
          <SearchEmptyState 
            searchTerm={searchTerm}
            onClearSearch={() => {
              setSearchTerm('');
              handleClearFilters();
            }}
          />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Nenhum curso cadastrado"
            description="Comece criando o primeiro curso da instituição"
            actionLabel="Criar Primeiro Curso"
            onAction={handleCreateCurso}
          />
        )
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cursosFiltered.map((curso) => (
            <CursoCard
              key={curso.id}
              curso={curso}
              onEdit={handleEditCurso}
              onView={handleViewCurso}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Formulário de Curso */}
      <CursoForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCurso(undefined);
        }}
        onSubmit={handleFormSubmit}
        curso={selectedCurso}
        isLoading={isLoading}
      />

      {/* Dialog de Visualização */}
      <Dialog open={!!viewCurso} onOpenChange={() => setViewCurso(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewCurso?.nome}</DialogTitle>
            <DialogDescription>Detalhes do curso</DialogDescription>
          </DialogHeader>
          {viewCurso && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Descrição</h4>
                <p className="text-sm text-gray-600">{viewCurso.descricao}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Carga Horária
                  </h4>
                  <p className="text-2xl">{viewCurso.carga_horaria}h</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Duração
                  </h4>
                  <p className="text-2xl">{viewCurso.duracao_meses} meses</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Estatísticas</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const stats = getCursoStats(viewCurso);
                    return (
                      <>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <div className="text-2xl mb-1">{stats.totalDisciplinas}</div>
                            <p className="text-xs text-gray-500">Disciplinas</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <div className="text-2xl mb-1">{stats.turmasAtivas}/{stats.turmasCurso}</div>
                            <p className="text-xs text-gray-500">Turmas Ativas</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <div className="text-2xl mb-1">{stats.alunosAtivos}</div>
                            <p className="text-xs text-gray-500">Alunos Ativos</p>
                          </CardContent>
                        </Card>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge variant={viewCurso.ativo ? 'default' : 'secondary'}>
                  {viewCurso.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
                <Button onClick={() => {
                  setViewCurso(null);
                  handleEditCurso(viewCurso);
                }}>
                  Editar Curso
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <DeleteConfirmDialog
        open={!!cursoToDelete}
        onOpenChange={(open) => !open && setCursoToDelete(null)}
        onConfirm={handleDeleteCurso}
        title="Excluir Curso"
        description={`Tem certeza que deseja excluir o curso "${cursoToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        itemName={cursoToDelete?.nome}
      />
    </div>
  );
};

export default CursosListPage;
