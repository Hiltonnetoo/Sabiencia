// ============================================
// PROFESSORES LIST PAGE - Página de listagem de professores
// ============================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { SearchBar } from '../../components/shared/SearchBar';
import { ProfessoresTable } from '../../components/professores/ProfessoresTable';
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog';
import { ExportButton } from '../../components/export/ExportButton';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { Plus, Users } from 'lucide-react';
import type { Professor } from '../../types';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import { formatCPF, formatPhone } from '../../utils/formatters';
import { ExportColumn } from '../../utils/exportService';
import { useKeyboardShortcuts, commonShortcuts } from '../../hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from '../../components/shared/KeyboardShortcutsHelp';

export const ProfessoresListPage: React.FC = () => {
  const navigate = useNavigate();
  const { professores, deleteProfessor } = useMockData();

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [especialidadeFilter, setEspecialidadeFilter] = useState('all');

  // Estado do modal de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState<Professor | null>(null);

  // Extrair todas as especialidades únicas
  const especialidadesUnicas = useMemo(() => {
    const especialidades = new Set<string>();
    professores.forEach(prof => {
      prof.especialidades.forEach(esp => {
        if (esp && esp.trim() !== '') {
          especialidades.add(esp);
        }
      });
    });
    return Array.from(especialidades).sort();
  }, [professores]);

  // Abrir modal de exclusão
  const handleDeleteClick = (professor: Professor) => {
    setProfessorToDelete(professor);
    setDeleteDialogOpen(true);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (professorToDelete) {
      deleteProfessor(professorToDelete.id);
      toast.success(`Professor ${professorToDelete.nome_completo} excluído com sucesso!`);
      setDeleteDialogOpen(false);
      setProfessorToDelete(null);
    }
  };

  // Navegar para criar novo professor
  const handleNovoProfessor = () => {
    navigate('/gestor/professores/novo');
  };

  // Colunas para exportação
  const exportColumns: ExportColumn[] = [
    { header: 'Nome', key: 'nome_completo', width: 25 },
    { header: 'CPF', key: 'cpf', width: 15, format: formatCPF },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Telefone', key: 'telefone', width: 15, format: formatPhone },
    { 
      header: 'Especialidades', 
      key: 'especialidades', 
      width: 30,
      format: (esp) => Array.isArray(esp) ? esp.join(', ') : esp
    },
    { header: 'Status', key: 'status', width: 12 },
    { 
      header: 'Data Contratação', 
      key: 'data_contratacao', 
      width: 15,
      format: (date) => new Date(date).toLocaleDateString('pt-BR')
    },
  ];

  // Filtrar professores para exportação
  const getFilteredProfessores = () => {
    return professores.filter(prof => {
      const matchSearch = !searchTerm || 
        prof.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.cpf.includes(searchTerm);
      const matchStatus = statusFilter === 'all' || prof.status === statusFilter;
      const matchEspecialidade = especialidadeFilter === 'all' || 
        prof.especialidades.includes(especialidadeFilter);
      return matchSearch && matchStatus && matchEspecialidade;
    });
  };

  // Atalhos de teclado
  useKeyboardShortcuts([
    commonShortcuts.new(handleNovoProfessor),
  ]);

  // Lista de atalhos para ajuda
  const shortcutsList = [
    { keys: 'Ctrl + N', description: 'Novo professor', category: 'Ações' },
    { keys: 'Shift + ?', description: 'Mostrar atalhos', category: 'Ajuda' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professores</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os professores cadastrados no sistema
          </p>
        </div>
        <div className="flex gap-2">
          <KeyboardShortcutsHelp shortcuts={shortcutsList} />
          <ExportButton
            title="Professores"
            data={getFilteredProfessores()}
            columns={exportColumns}
            filename="professores"
          />
          <Button onClick={handleNovoProfessor} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Professor
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Total de Professores</CardTitle>
              <CardDescription>Professores cadastrados no sistema</CardDescription>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {professores.length}
          </div>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Busca */}
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nome ou CPF..."
              className="md:col-span-1"
            />

            {/* Filtro de Especialidade */}
            <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as especialidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {especialidadesUnicas.map(esp => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro de Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-6">
          <ProfessoresTable
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            especialidadeFilter={especialidadeFilter}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Professor"
        itemName={professorToDelete?.nome_completo}
        description="Esta ação irá excluir permanentemente o professor e remover suas atribuições de turmas e disciplinas. Esta operação não pode ser desfeita."
      />
    </div>
  );
};

export default ProfessoresListPage;
