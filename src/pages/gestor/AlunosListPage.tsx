// ============================================
// ALUNOS LIST PAGE - Página de listagem de alunos
// ============================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      toast.success(t('gestor.alunosList.deleteSuccess', { name: alunoToDelete.nome_completo }));
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
    { header: t('gestor.alunosList.exportColumns.name'), key: 'nome_completo', width: 25 },
    { header: t('gestor.alunosList.exportColumns.cpf'), key: 'cpf', width: 15, format: formatCPF },
    { header: t('gestor.alunosList.exportColumns.email'), key: 'email', width: 25 },
    { header: t('gestor.alunosList.exportColumns.phone'), key: 'telefone', width: 15, format: formatPhone },
    {
      header: t('gestor.alunosList.exportColumns.birthDate'),
      key: 'data_nascimento',
      width: 15,
      format: (date) => new Date(date).toLocaleDateString()
    },
    { header: t('gestor.alunosList.exportColumns.status'), key: 'status', width: 12 },
    {
      header: t('gestor.alunosList.exportColumns.enrollmentDate'),
      key: 'data_matricula',
      width: 15,
      format: (date) => new Date(date).toLocaleDateString()
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
      description: t('gestor.alunosList.shortcuts.refreshList'),
    },
  ]);

  // Lista de atalhos para ajuda
  const shortcutsList = [
    { keys: 'Ctrl + N', description: t('gestor.alunosList.shortcuts.newStudent'), category: t('gestor.alunosList.shortcuts.categoryActions') },
    { keys: 'Ctrl + R', description: t('gestor.alunosList.shortcuts.refreshList'), category: t('gestor.alunosList.shortcuts.categoryActions') },
    { keys: 'Shift + ?', description: t('gestor.alunosList.shortcuts.showShortcuts'), category: t('gestor.alunosList.shortcuts.categoryHelp') },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('gestor.alunosList.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('gestor.alunosList.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <KeyboardShortcutsHelp shortcuts={shortcutsList} />
          <ExportButton
            title={t('gestor.alunosList.exportTitle')}
            data={filteredAlunos}
            columns={exportColumns}
            filename="alunos"
          />
          <Button onClick={handleNovoAluno} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('gestor.alunosList.newStudent')}
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
              <CardTitle>{t('gestor.alunosList.totalStudents')}</CardTitle>
              <CardDescription>
                {t('gestor.alunosList.totalStudentsDesc', { filtered: filteredAlunos.length, total: alunos.length })}
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
          <CardTitle>{t('gestor.alunosList.studentsListTitle')}</CardTitle>
          <CardDescription>
            {t('gestor.alunosList.studentsFound', { count: pagination.totalItems })}
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
        title={t('gestor.alunosList.deleteDialogTitle')}
        itemName={alunoToDelete?.nome_completo}
        description={t('gestor.alunosList.deleteDialogDesc')}
      />
    </div>
  );
};

export default AlunosListPage;
