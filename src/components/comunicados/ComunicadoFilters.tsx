// ============================================
// COMPONENTE: FILTROS DE COMUNICADOS
// ============================================

import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { Search, Filter } from 'lucide-react';
import type { TipoComunicado, PrioridadeComunicado } from '../../types';

interface ComunicadoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  prioridadeFilter: string;
  onPrioridadeChange: (value: string) => void;
  destinatariosFilter: string;
  onDestinatariosChange: (value: string) => void;
  showDestinatariosFilter?: boolean;
  leituraFilter?: string;
  onLeituraChange?: (value: string) => void;
  showLeituraFilter?: boolean;
}

export function ComunicadoFilters({
  searchTerm,
  onSearchChange,
  prioridadeFilter,
  onPrioridadeChange,
  destinatariosFilter,
  onDestinatariosChange,
  showDestinatariosFilter = true,
  leituraFilter,
  onLeituraChange,
  showLeituraFilter = false
}: ComunicadoFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Busca */}
          <div className="space-y-2">
            <Label htmlFor="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Buscar por título ou mensagem..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Filtros em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="prioridade" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Prioridade
              </Label>
              <Select value={prioridadeFilter} onValueChange={onPrioridadeChange}>
                <SelectTrigger id="prioridade">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Destinatários */}
            {showDestinatariosFilter && (
              <div className="space-y-2">
                <Label htmlFor="destinatarios">
                  Destinatários
                </Label>
                <Select value={destinatariosFilter} onValueChange={onDestinatariosChange}>
                  <SelectTrigger id="destinatarios">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="todos_alunos">Todos os Alunos</SelectItem>
                    <SelectItem value="todos_professores">Todos os Professores</SelectItem>
                    <SelectItem value="turma_especifica">Turma Específica</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status de Leitura */}
            {showLeituraFilter && onLeituraChange && (
              <div className="space-y-2">
                <Label htmlFor="leitura">
                  Status de Leitura
                </Label>
                <Select value={leituraFilter} onValueChange={onLeituraChange}>
                  <SelectTrigger id="leitura">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="lidos">Lidos</SelectItem>
                    <SelectItem value="nao_lidos">Não Lidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
