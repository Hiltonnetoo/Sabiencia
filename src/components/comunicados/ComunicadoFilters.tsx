// ============================================
// COMPONENTE: FILTROS DE COMUNICADOS
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Busca */}
          <div className="space-y-2">
            <Label htmlFor="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t('components.comunicados.filters.search')}
            </Label>
            <Input
              id="search"
              type="text"
              placeholder={t('components.comunicados.filters.searchPlaceholder')}
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
                {t('components.comunicados.filters.priority')}
              </Label>
              <Select value={prioridadeFilter} onValueChange={onPrioridadeChange}>
                <SelectTrigger id="prioridade">
                  <SelectValue placeholder={t('components.comunicados.filters.allPriorities')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">{t('components.comunicados.filters.allPriorities')}</SelectItem>
                  <SelectItem value="urgente">{t('components.comunicados.priority.urgente')}</SelectItem>
                  <SelectItem value="alta">{t('components.comunicados.priority.alta')}</SelectItem>
                  <SelectItem value="normal">{t('components.comunicados.priority.normal')}</SelectItem>
                  <SelectItem value="baixa">{t('components.comunicados.priority.baixa')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Destinatários */}
            {showDestinatariosFilter && (
              <div className="space-y-2">
                <Label htmlFor="destinatarios">
                  {t('components.comunicados.filters.recipients')}
                </Label>
                <Select value={destinatariosFilter} onValueChange={onDestinatariosChange}>
                  <SelectTrigger id="destinatarios">
                    <SelectValue placeholder={t('components.comunicados.filters.allRecipients')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">{t('components.comunicados.recipients.all')}</SelectItem>
                    <SelectItem value="todos_alunos">{t('components.comunicados.recipients.allStudents')}</SelectItem>
                    <SelectItem value="todos_professores">{t('components.comunicados.recipients.allTeachers')}</SelectItem>
                    <SelectItem value="turma_especifica">{t('components.comunicados.recipients.specificClass')}</SelectItem>
                    <SelectItem value="individual">{t('components.comunicados.recipients.individual')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status de Leitura */}
            {showLeituraFilter && onLeituraChange && (
              <div className="space-y-2">
                <Label htmlFor="leitura">
                  {t('components.comunicados.filters.readStatus')}
                </Label>
                <Select value={leituraFilter} onValueChange={onLeituraChange}>
                  <SelectTrigger id="leitura">
                    <SelectValue placeholder={t('components.comunicados.filters.allRecipients')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">{t('components.comunicados.recipients.all')}</SelectItem>
                    <SelectItem value="lidos">{t('components.comunicados.filters.read')}</SelectItem>
                    <SelectItem value="nao_lidos">{t('components.comunicados.filters.unread')}</SelectItem>
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
