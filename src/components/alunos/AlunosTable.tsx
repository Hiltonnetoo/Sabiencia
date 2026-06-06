// ============================================
// ALUNOS TABLE - Tabela de alunos com filtros + OTIMIZAÇÕES
// Virtual Scrolling para 100+ alunos + Memoização
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
import { StatusBadge } from '../shared/StatusBadge';
import { Eye, Pencil, Trash2, ArrowUpDown, Users } from 'lucide-react';
import type { Aluno } from '../../types';
import { formatCPF, getInitials } from '../../utils/formatters';
import { EmptyState, SearchEmptyState, FilterEmptyState } from '../shared/EmptyState';
import { getAlunoDetails } from '../../utils/alunoHelpers';
import { VirtualTable, useVirtualScrolling } from '../shared/VirtualTable';
import { useAlunosComMatricula } from '../../hooks/useAlunosComMatricula';

interface AlunosTableProps {
  searchTerm: string;
  statusFilter: string;
  cursoFilter: string;
  onDelete: (aluno: Aluno) => void;
}

type SortColumn = 'nome_completo' | 'cpf' | 'email';
type SortDirection = 'asc' | 'desc';

// OTIMIZAÇÃO: Componente memoizado para linha da tabela
const AlunoRow = memo<{
  aluno: Aluno;
  details: ReturnType<typeof getAlunoDetails>;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (aluno: Aluno) => void;
}>(({ aluno, details, onView, onEdit, onDelete }) => {
  return (
    <TableRow>
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage src={aluno.foto_url} />
          <AvatarFallback className="text-xs">
            {getInitials(aluno.nome_completo)}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">
        {aluno.nome_completo}
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {formatCPF(aluno.cpf)}
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {aluno.email}
      </TableCell>
      <TableCell className="text-sm">
        {details.curso?.nome || '-'}
      </TableCell>
      <TableCell className="text-sm">
        {details.turma?.nome || '-'}
      </TableCell>
      <TableCell>
        <StatusBadge status={details.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(aluno.id)}
            className="h-11 w-11 p-0"
            aria-label={`Visualizar detalhes de ${aluno.nome_completo}`}
          >
            <Eye className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(aluno.id)}
            className="h-11 w-11 p-0"
            aria-label={`Editar cadastro de ${aluno.nome_completo}`}
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(aluno)}
            className="h-11 w-11 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label={`Excluir aluno ${aluno.nome_completo}`}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

AlunoRow.displayName = 'AlunoRow';

export const AlunosTable: React.FC<AlunosTableProps> = ({
  searchTerm,
  statusFilter,
  cursoFilter,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { alunos, getDetails: getAlunoDetailsMemo } = useAlunosComMatricula();
  const [sortColumn, setSortColumn] = useState<SortColumn>('nome_completo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // OTIMIZAÇÃO: Filtrar e ordenar alunos com useMemo
  const filteredAndSortedAlunos = useMemo(() => {
    const filtered = alunos.filter(aluno => {
      // Filtro de busca
      const matchesSearch =
        aluno.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.cpf.includes(searchTerm.replace(/\D/g, ''));

      // Filtro de status
      const details = getAlunoDetailsMemo(aluno.id);
      const matchesStatus =
        statusFilter === 'all' || details.status === statusFilter;

      // Filtro de curso
      const matchesCurso =
        cursoFilter === 'all' || details.curso?.id === cursoFilter;

      return matchesSearch && matchesStatus && matchesCurso;
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
  }, [alunos, searchTerm, statusFilter, cursoFilter, sortColumn, sortDirection, getAlunoDetailsMemo]);

  // ✅ OTIMIZAÇÃO SPRINT 3: Virtual scrolling ativo para 50+ alunos
  // Melhora drasticamente a performance renderizando apenas itens visíveis
  const shouldUseVirtualScrolling = useVirtualScrolling(filteredAndSortedAlunos.length, 50);

  // OTIMIZAÇÃO: Memoizar função de ordenação
  const toggleSort = useCallback((column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  // OTIMIZAÇÃO: Memoizar ações
  const handleView = useCallback((id: string) => {
    navigate(`/gestor/alunos/${id}`);
  }, [navigate]);

  const handleEdit = useCallback((id: string) => {
    navigate(`/gestor/alunos/${id}/editar`);
  }, [navigate]);

  // Função para determinar qual empty state mostrar
  const renderEmptyState = () => {
    // Caso 1: Sem nenhum aluno no sistema
    if (alunos.length === 0) {
      return (
        <EmptyState
          icon={Users}
          title="Nenhum aluno cadastrado"
          description="Comece adicionando o primeiro aluno ao sistema. Você pode cadastrar alunos individualmente ou importar em lote."
          actionLabel="Adicionar Primeiro Aluno"
          onAction={() => navigate('/gestor/alunos/novo')}
          iconColor="blue"
          showCard={false}
        />
      );
    }

    // Caso 2: Tem alunos mas nenhum corresponde à busca
    if (searchTerm && filteredAndSortedAlunos.length === 0) {
      return (
        <SearchEmptyState
          searchTerm={searchTerm}
          onClearSearch={() => window.location.reload()} // Temporário, idealmente seria um callback prop
        />
      );
    }

    // Caso 3: Tem alunos mas nenhum corresponde aos filtros
    if ((statusFilter !== 'all' || cursoFilter !== 'all') && filteredAndSortedAlunos.length === 0) {
      return (
        <FilterEmptyState
          onClearFilters={() => window.location.reload()} // Temporário, idealmente seria um callback prop
        />
      );
    }

    // Caso padrão
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum aluno encontrado
      </div>
    );
  };

  // ✅ SPRINT 3: Render de tabela com cabeçalho compartilhado
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
        <TableHead>Curso</TableHead>
        <TableHead>Turma</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      {filteredAndSortedAlunos.length === 0 ? (
        renderEmptyState()
      ) : shouldUseVirtualScrolling ? (
        // ✅ SPRINT 3: Virtual Scrolling para 50+ alunos
        <div>
          <Table>
            {renderTableHeader()}
          </Table>
          <VirtualTable
            items={filteredAndSortedAlunos}
            itemHeight={73}
            containerHeight={600}
            renderRow={(aluno) => {
              const details = getAlunoDetailsMemo(aluno.id);
              return (
                <Table>
                  <TableBody>
                    <AlunoRow
                      key={aluno.id}
                      aluno={aluno}
                      details={details}
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
        // Tabela normal para menos de 50 alunos
        <Table>
          {renderTableHeader()}
          <TableBody>
            {filteredAndSortedAlunos.map((aluno) => {
              const details = getAlunoDetailsMemo(aluno.id);

              return (
                <AlunoRow
                  key={aluno.id}
                  aluno={aluno}
                  details={details}
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
