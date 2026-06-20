// ============================================
// PROFESSORES LIST PAGE - Página de listagem de professores
// ============================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      toast.success(t('gestor.professoresList.deleted', { name: professorToDelete.nome_completo }));
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
    { header: t('gestor.professoresList.export.name'), key: 'nome_completo', width: 25 },
    { header: t('common.labels.cpf'), key: 'cpf', width: 15, format: formatCPF },
    { header: t('gestor.professoresList.export.email'), key: 'email', width: 25 },
    { header: t('gestor.professoresList.export.phone'), key: 'telefone', width: 15, format: formatPhone },
    {
      header: t('gestor.professoresList.export.specialties'),
      key: 'especialidades',
      width: 30,
      format: (esp) => Array.isArray(esp) ? esp.join(', ') : esp
    },
    { header: t('gestor.professoresList.export.status'), key: 'status', width: 12 },
    {
      header: t('gestor.professoresList.export.hireDate'),
      key: 'data_contratacao',
      width: 15,
      format: (date) => new Date(date).toLocaleDateString()
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
    { keys: 'Ctrl + N', description: t('gestor.professoresList.shortcuts.new'), category: t('gestor.professoresList.shortcuts.actions') },
    { keys: 'Shift + ?', description: t('gestor.professoresList.shortcuts.show'), category: t('gestor.professoresList.shortcuts.help') },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('gestor.professoresList.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('gestor.professoresList.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <KeyboardShortcutsHelp shortcuts={shortcutsList} />
          <ExportButton
            title={t('gestor.professoresList.exportTitle')}
            data={getFilteredProfessores()}
            columns={exportColumns}
            filename="professores"
          />
          <Button onClick={handleNovoProfessor} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('gestor.professoresList.new')}
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
              <CardTitle>{t('gestor.professoresList.totalTitle')}</CardTitle>
              <CardDescription>{t('gestor.professoresList.totalDescription')}</CardDescription>
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
          <CardTitle>{t('common.actions.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Busca */}
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('gestor.professoresList.searchPlaceholder')}
              className="md:col-span-1"
            />

            {/* Filtro de Especialidade */}
            <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('gestor.professoresList.allSpecialties')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('gestor.professoresList.allSpecialties')}</SelectItem>
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
                <SelectValue placeholder={t('common.labels.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.labels.allStatuses')}</SelectItem>
                <SelectItem value="ativo">{t('common.status.active')}</SelectItem>
                <SelectItem value="inativo">{t('common.status.inactive')}</SelectItem>
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
        title={t('gestor.professoresList.deleteTitle')}
        itemName={professorToDelete?.nome_completo}
        description={t('gestor.professoresList.deleteDescription')}
      />
    </div>
  );
};

export default ProfessoresListPage;
