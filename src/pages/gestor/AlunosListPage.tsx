// ============================================
// ALUNOS LIST PAGE - Página de listagem de alunos
// ============================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AlunosPaginatedList } from '../../components/alunos/AlunosPaginatedList';
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog';
import { ExportButton } from '../../components/export/ExportButton';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { AlunosAdvancedFilters, AlunosFilterConfig } from '../../components/alunos/AlunosAdvancedFilters';
import { usePagination } from '../../hooks/usePagination';
import { PaginationControls } from '../../components/shared/PaginationControls';
import { Plus, Users } from 'lucide-react';
import type { Aluno } from '../../types';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { formatCPF, formatPhone } from '../../utils/formatters';
import { ExportColumn } from '../../utils/exportService';
import { useKeyboardShortcuts, commonShortcuts } from '../../hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from '../../components/shared/KeyboardShortcutsHelp';

export const AlunosListPage: React.FC = () => {
  const navigate = useNavigate();
  const { alunos, turmas, matriculas, deleteAluno } = useMockData();

  // Estados de filtros
  const [filters, setFilters] = useState<AlunosFilterConfig>({
    searchTerm: '',
    status: [],
    cursos: [],
    turmas: [],
    dateRange: { from: undefined, to: undefined },
    estadoCivil: 'todos',
    sexo: 'todos',
  });

  // Estado do modal de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alunoToDelete, setAlunoToDelete] = useState<Aluno | null>(null);

  // Abrir modal de exclusão
  const handleDeleteClick = (aluno: Aluno) => {
    setAlunoToDelete(aluno);
    setDeleteDialogOpen(true);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (alunoToDelete) {
      deleteAluno(alunoToDelete.id);
      toast.success(`Aluno ${alunoToDelete.nome_completo} excluído com sucesso!`);
      setDeleteDialogOpen(false);
      setAlunoToDelete(null);
    }
  };

  // Navegar para criar novo aluno
  const handleNovoAluno = () => {
    navigate('/gestor/alunos/novo');
  };

  // Colunas para exportação
  const exportColumns: ExportColumn[] = [
    { header: 'Nome', key: 'nome_completo', width: 25 },
    { header: 'CPF', key: 'cpf', width: 15, format: formatCPF },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Telefone', key: 'telefone', width: 15, format: formatPhone },
    { 
      header: 'Data Nascimento', 
      key: 'data_nascimento', 
      width: 15,
      format: (date) => new Date(date).toLocaleDateString('pt-BR')
    },
    { header: 'Status', key: 'status', width: 12 },
    { 
      header: 'Data Matrícula', 
      key: 'data_matricula', 
      width: 15,
      format: (date) => new Date(date).toLocaleDateString('pt-BR')
    },
  ];

  // Filtrar alunos
  const filteredAlunos = useMemo(() => {
    return alunos.filter(aluno => {
      // Busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          aluno.nome_completo.toLowerCase().includes(searchLower) ||
          aluno.cpf.includes(searchLower) ||
          aluno.email.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status
      if (filters.status.length > 0) {
        const matricula = matriculas.find(m => m.aluno_id === aluno.id);
        if (!matricula || !filters.status.includes(matricula.status)) {
          return false;
        }
      }

      // Cursos
      if (filters.cursos.length > 0) {
        const matricula = matriculas.find(m => m.aluno_id === aluno.id);
        if (!matricula) return false;
        
        const turma = turmas.find(t => t.id === matricula.turma_id);
        if (!turma || !filters.cursos.includes(turma.curso_id)) {
          return false;
        }
      }

      // Turmas
      if (filters.turmas.length > 0) {
        const matricula = matriculas.find(m => m.aluno_id === aluno.id);
        if (!matricula || !filters.turmas.includes(matricula.turma_id)) {
          return false;
        }
      }

      // Sexo
      if (filters.sexo !== 'todos' && aluno.sexo !== filters.sexo) {
        return false;
      }

      // Estado Civil
      if (filters.estadoCivil !== 'todos' && aluno.estado_civil !== filters.estadoCivil) {
        return false;
      }

      // Data Range
      if (filters.dateRange.from || filters.dateRange.to) {
        const matricula = matriculas.find(m => m.aluno_id === aluno.id);
        if (!matricula) return false;

        const dataMatricula = new Date(matricula.data_matricula);
        
        if (filters.dateRange.from && dataMatricula < filters.dateRange.from) {
          return false;
        }
        
        if (filters.dateRange.to && dataMatricula > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [alunos, filters, matriculas, turmas]);

  // Paginação
  const pagination = usePagination(filteredAlunos, {
    initialPage: 1,
    initialPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
  });

  // Atalhos de teclado
  useKeyboardShortcuts([
    commonShortcuts.new(handleNovoAluno),
    {
      key: 'r',
      ctrl: true,
      action: (e) => {
        e.preventDefault();
        window.location.reload();
      },
      description: 'Atualizar lista',
    },
  ]);

  // Lista de atalhos para ajuda
  const shortcutsList = [
    { keys: 'Ctrl + N', description: 'Novo aluno', category: 'Ações' },
    { keys: 'Ctrl + R', description: 'Atualizar lista', category: 'Ações' },
    { keys: 'Shift + ?', description: 'Mostrar atalhos', category: 'Ajuda' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os alunos cadastrados no sistema
          </p>
        </div>
        <div className="flex gap-2">
          <KeyboardShortcutsHelp shortcuts={shortcutsList} />
          <ExportButton
            title="Alunos"
            data={filteredAlunos}
            columns={exportColumns}
            filename="alunos"
          />
          <Button onClick={handleNovoAluno} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Total de Alunos</CardTitle>
              <CardDescription>
                {filteredAlunos.length} de {alunos.length} alunos
              </CardDescription>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {filteredAlunos.length}
          </div>
        </CardHeader>
      </Card>

      {/* Filtros Avançados */}
      <AlunosAdvancedFilters onFiltersChange={setFilters} />

      {/* Tabela com Paginação */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            {pagination.totalItems} aluno{pagination.totalItems !== 1 ? 's' : ''} encontrado{pagination.totalItems !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <AlunosPaginatedList
            alunos={pagination.currentItems}
            onDelete={handleDeleteClick}
          />
        </CardContent>
        {pagination.totalItems > 0 && (
          <div className="border-t p-4">
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              onPageChange={pagination.goToPage}
              onPageSizeChange={pagination.setPageSize}
              onFirstPage={pagination.firstPage}
              onLastPage={pagination.lastPage}
              onNextPage={pagination.nextPage}
              onPreviousPage={pagination.previousPage}
              getPageNumbers={pagination.getPageNumbers}
              className="w-full"
            />
          </div>
        )}
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Aluno"
        itemName={alunoToDelete?.nome_completo}
        description="Esta ação irá excluir permanentemente o aluno e todos os seus dados associados (matrículas, notas, frequências, etc.). Esta operação não pode ser desfeita."
      />
    </div>
  );
};

export default AlunosListPage;
