// ============================================
// ALUNOS PAGINATED LIST - Lista de alunos com paginação
// ============================================

import React, { useState, useMemo, useCallback } from 'react';
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
import { Eye, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import type { Aluno } from '../../types';
import { formatCPF, getInitials } from '../../utils/formatters';
import { useMockData } from '../../contexts/MockDataContext';
import { getAlunoDetails } from '../../utils/alunoHelpers';

interface AlunosPaginatedListProps {
  alunos: Aluno[];
  onDelete: (aluno: Aluno) => void;
}

type SortColumn = 'nome_completo' | 'cpf' | 'email';
type SortDirection = 'asc' | 'desc';

export const AlunosPaginatedList: React.FC<AlunosPaginatedListProps> = ({
  alunos,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState<SortColumn>('nome_completo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Obter dados via Context
  const { matriculas, turmas, cursos } = useMockData();

  // OTIMIZAÇÃO: Usar helper para pegar curso e turma do aluno
  const getAlunoDetailsMemo = useCallback((alunoId: string) => {
    return getAlunoDetails(alunoId, matriculas, turmas, cursos);
  }, [matriculas, turmas, cursos]);

  // Ordenar alunos
  const sortedAlunos = useMemo(() => {
    const sorted = [...alunos];

    sorted.sort((a, b) => {
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

    return sorted;
  }, [alunos, sortColumn, sortDirection]);

  // Alternar ordenação
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Ações
  const handleView = (id: string) => {
    navigate(`/gestor/alunos/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/gestor/alunos/${id}/editar`);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Foto</TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('nome_completo')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                Nome
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('cpf')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                CPF
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => handleSort('email')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                Email
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Turma</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAlunos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Nenhum aluno encontrado
              </TableCell>
            </TableRow>
          ) : (
            sortedAlunos.map((aluno) => {
              const details = getAlunoDetailsMemo(aluno.id);

              return (
                <TableRow key={aluno.id}>
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(aluno.id)}
                        className="h-8 w-8 p-0"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(aluno.id)}
                        className="h-8 w-8 p-0"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(aluno)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
