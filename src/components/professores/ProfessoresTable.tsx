// ============================================
// PROFESSORES TABLE - Tabela de professores + OTIMIZAÇÕES
// Memoização e Callbacks Otimizados
// ============================================

import React, { useMemo, useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Eye, Pencil, Trash2, ArrowUpDown, GraduationCap } from 'lucide-react';
import type { Professor } from '../../types';
import { formatCPF, getInitials } from '../../utils/formatters';
import { useMockData } from '../../contexts/MockDataContext';
import { getTurmasProfessor } from '../../utils/professorHelpers';
import { EmptyState, SearchEmptyState, FilterEmptyState } from '../shared/EmptyState';
import { VirtualTable, useVirtualScrolling } from '../shared/VirtualTable';

interface ProfessoresTableProps {
  searchTerm: string;
  statusFilter: string;
  especialidadeFilter: string;
  onDelete: (professor: Professor) => void;
}

type SortColumn = 'nome_completo' | 'cpf' | 'email';
type SortDirection = 'asc' | 'desc';

// ✅ SPRINT 3: Professor Row memoizado para performance
interface ProfessorRowProps {
  professor: Professor;
  turmas: any[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (professor: Professor) => void;
}

const ProfessorRow = memo<ProfessorRowProps>(({ professor, turmas, onView, onEdit, onDelete }) => {
  return (
    <TableRow>
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage src={professor.foto_url} />
          <AvatarFallback className="text-xs">
            {getInitials(professor.nome_completo)}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">
        {professor.nome_completo}
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {formatCPF(professor.cpf)}
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {professor.email}
      </TableCell>
      <TableCell className="text-sm">
        <div className="flex flex-wrap gap-1">
          {professor.especialidades.slice(0, 2).map((esp, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {esp}
            </Badge>
          ))}
          {professor.especialidades.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{professor.especialidades.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm">
        {turmas.length > 0 ? (
          <Badge variant="outline">{turmas.length} turma(s)</Badge>
        ) : (
          <span className="text-gray-600">-</span>
        )}
      </TableCell>
      <TableCell>
        {professor.ativo ? (
          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(professor.id)}
            className="h-11 w-11 p-0"
            aria-label={`Visualizar detalhes de ${professor.nome_completo}`}
          >
            <Eye className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(professor.id)}
            className="h-11 w-11 p-0"
            aria-label={`Editar cadastro de ${professor.nome_completo}`}
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(professor)}
            className="h-11 w-11 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label={`Excluir professor ${professor.nome_completo}`}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

ProfessorRow.displayName = 'ProfessorRow';

export const ProfessoresTable: React.FC<ProfessoresTableProps> = ({
  searchTerm,
  statusFilter,
  especialidadeFilter,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { professores, turmas, professorTurmaDisciplina } = useMockData();
  const [sortColumn, setSortColumn] = useState<SortColumn>('nome_completo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // OTIMIZAÇÃO: Usar helper para pegar turmas do professor
  const getTurmasProfessorMemo = useCallback((professorId: string) => {
    return getTurmasProfessor(professorId, turmas, professorTurmaDisciplina);
  }, [turmas, professorTurmaDisciplina]);

  // Filtrar e ordenar professores
  const filteredAndSortedProfessores = useMemo(() => {
    const filtered = professores.filter(professor => {
      // Filtro de busca
      const cleanCPFSearch = searchTerm.replace(/\D/g, '');
      const matchesSearch =
        professor.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cleanCPFSearch !== '' && professor.cpf.includes(cleanCPFSearch));

      // Filtro de status
      const matchesStatus =
        statusFilter === 'all' || statusFilter === 'todos' || 
        (statusFilter === 'ativo' && professor.ativo) ||
        (statusFilter === 'inativo' && !professor.ativo);

      // Filtro de especialidade
      const normalizeStr = (str: string) =>
        str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const matchesEspecialidade =
        especialidadeFilter === 'all' || especialidadeFilter === 'todos' ||
        professor.especialidades.some(esp => normalizeStr(esp) === normalizeStr(especialidadeFilter));

      return matchesSearch && matchesStatus && matchesEspecialidade;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'nome_completo':
          comparison = a.nome_completo.localeCompare(b.nome_completo);
          break;
        case 'cpf':
          comparison = a.cpf.localeCompare(b.cpf);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [professores, searchTerm, statusFilter, especialidadeFilter, sortColumn, sortDirection]);

  // ✅ SPRINT 3: Virtual scrolling para 30+ professores
  const shouldUseVirtualScrolling = useVirtualScrolling(filteredAndSortedProfessores.length, 30);

  // Alternar ordenação
  const toggleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Ações
  const handleView = (id: string) => {
    navigate(`/gestor/professores/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/gestor/professores/${id}/editar`);
  };

  // Renderizar empty state apropriado
  const renderEmptyState = () => {
    if (professores.length === 0) {
      return (
        <EmptyState
          icon={GraduationCap}
          title="Nenhum professor cadastrado"
          description="Comece adicionando professores ao sistema para que possam gerenciar turmas e disciplinas."
          actionLabel="Adicionar Professor"
          onAction={() => navigate('/gestor/professores/novo')}
          iconColor="purple"
          showCard={false}
        />
      );
    }

    if (searchTerm && filteredAndSortedProfessores.length === 0) {
      return (
        <SearchEmptyState
          searchTerm={searchTerm}
          onClearSearch={() => window.location.reload()}
        />
      );
    }

    if ((statusFilter !== 'all' && statusFilter !== 'todos' || especialidadeFilter !== 'all' && especialidadeFilter !== 'todos') && filteredAndSortedProfessores.length === 0) {
      return (
        <FilterEmptyState
          onClearFilters={() => window.location.reload()}
        />
      );
    }

    return null;
  };

  // ✅ SPRINT 3: Render de cabeçalho compartilhado
  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">#</TableHead>
        <TableHead>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSort('nome_completo')}
            className="h-8 px-2 -ml-2"
          >
            Nome
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSort('cpf')}
            className="h-8 px-2 -ml-2"
          >
            CPF
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSort('email')}
            className="h-8 px-2 -ml-2"
          >
            Email
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </TableHead>
        <TableHead>Especialidades</TableHead>
        <TableHead>Turmas</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      {filteredAndSortedProfessores.length === 0 ? (
        renderEmptyState()
      ) : shouldUseVirtualScrolling ? (
        // ✅ SPRINT 3: Virtual Scrolling para 30+ professores
        <div>
          <Table>
            {renderTableHeader()}
          </Table>
          <VirtualTable
            items={filteredAndSortedProfessores}
            itemHeight={73}
            containerHeight={600}
            renderRow={(professor) => {
              const turmas = getTurmasProfessorMemo(professor.id);
              return (
                <Table>
                  <TableBody>
                    <ProfessorRow
                      key={professor.id}
                      professor={professor}
                      turmas={turmas}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={onDelete}
                    />
                  </TableBody>
                </Table>
              );
            }}
          />
        </div>
      ) : (
        // Tabela normal para menos de 30 professores
        <Table>
          {renderTableHeader()}
          <TableBody>
            {filteredAndSortedProfessores.map((professor) => {
              const turmas = getTurmasProfessorMemo(professor.id);

              return (
                <ProfessorRow
                  key={professor.id}
                  professor={professor}
                  turmas={turmas}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={onDelete}
                />
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
