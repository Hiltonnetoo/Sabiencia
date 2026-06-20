import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Search, X, Filter } from 'lucide-react';

interface PagamentoFiltersProps {
  busca: string;
  status: string;
  mes: string;
  ano: string;
  onBuscaChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMesChange: (value: string) => void;
  onAnoChange: (value: string) => void;
  onLimpar: () => void;
}

export function PagamentoFilters({
  busca,
  status,
  mes,
  ano,
  onBuscaChange,
  onStatusChange,
  onMesChange,
  onAnoChange,
  onLimpar
}: PagamentoFiltersProps) {
  const { t } = useTranslation();

  const meses = [
    { value: 'todos', label: t('components.pagamentoFilters.allMonths') },
    { value: '1', label: t('components.pagamentoFilters.months.1') },
    { value: '2', label: t('components.pagamentoFilters.months.2') },
    { value: '3', label: t('components.pagamentoFilters.months.3') },
    { value: '4', label: t('components.pagamentoFilters.months.4') },
    { value: '5', label: t('components.pagamentoFilters.months.5') },
    { value: '6', label: t('components.pagamentoFilters.months.6') },
    { value: '7', label: t('components.pagamentoFilters.months.7') },
    { value: '8', label: t('components.pagamentoFilters.months.8') },
    { value: '9', label: t('components.pagamentoFilters.months.9') },
    { value: '10', label: t('components.pagamentoFilters.months.10') },
    { value: '11', label: t('components.pagamentoFilters.months.11') },
    { value: '12', label: t('components.pagamentoFilters.months.12') },
  ];

  const anos = [
    { value: 'todos', label: t('components.pagamentoFilters.allYears') },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
  ];

  const hasFilters = busca || status !== 'todos' || (mes && mes !== 'todos') || (ano && ano !== 'todos');

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">{t('common.actions.filters')}</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLimpar}
            className="ml-auto"
          >
            <X className="w-4 h-4 mr-2" />
            {t('common.actions.clear')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="space-y-2">
          <Label htmlFor="busca">{t('components.pagamentoFilters.search')}</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="busca"
              placeholder={t('components.pagamentoFilters.searchPlaceholder')}
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">{t('common.labels.status')}</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder={t('components.pagamentoFilters.selectStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">{t('common.actions.all')}</SelectItem>
              <SelectItem value="pendente">{t('components.pagamentoCard.status.pendente')}</SelectItem>
              <SelectItem value="pago">{t('components.pagamentoCard.status.pago')}</SelectItem>
              <SelectItem value="vencido">{t('components.pagamentoCard.status.vencido')}</SelectItem>
              <SelectItem value="cancelado">{t('components.pagamentoCard.status.cancelado')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mês */}
        <div className="space-y-2">
          <Label htmlFor="mes">{t('components.pagamentoFilters.month')}</Label>
          <Select value={mes} onValueChange={onMesChange}>
            <SelectTrigger id="mes">
              <SelectValue placeholder={t('components.pagamentoFilters.selectMonth')} />
            </SelectTrigger>
            <SelectContent>
              {meses.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ano */}
        <div className="space-y-2">
          <Label htmlFor="ano">{t('components.pagamentoFilters.year')}</Label>
          <Select value={ano} onValueChange={onAnoChange}>
            <SelectTrigger id="ano">
              <SelectValue placeholder={t('components.pagamentoFilters.selectYear')} />
            </SelectTrigger>
            <SelectContent>
              {anos.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info de filtros ativos */}
      {hasFilters && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            {t('components.pagamentoFilters.activeFilters')}
            {busca && <span className="ml-2 text-blue-600 font-medium">{t('components.pagamentoFilters.filterSearch', { value: busca })}</span>}
            {status !== 'todos' && <span className="ml-2 text-blue-600 font-medium">{t('components.pagamentoFilters.filterStatus', { value: status })}</span>}
            {mes && mes !== 'todos' && <span className="ml-2 text-blue-600 font-medium">{t('components.pagamentoFilters.filterMonth', { value: meses.find(m => m.value === mes)?.label })}</span>}
            {ano && ano !== 'todos' && <span className="ml-2 text-blue-600 font-medium">{t('components.pagamentoFilters.filterYear', { value: ano })}</span>}
          </p>
        </div>
      )}
    </Card>
  );
}
