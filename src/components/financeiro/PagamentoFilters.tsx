import React from 'react';
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
  
  const meses = [
    { value: 'todos', label: 'Todos os meses' },
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  const anos = [
    { value: 'todos', label: 'Todos os anos' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
  ];

  const hasFilters = busca || status !== 'todos' || (mes && mes !== 'todos') || (ano && ano !== 'todos');

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLimpar}
            className="ml-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="space-y-2">
          <Label htmlFor="busca">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="busca"
              placeholder="Nome do aluno, CPF..."
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mês */}
        <div className="space-y-2">
          <Label htmlFor="mes">Mês</Label>
          <Select value={mes} onValueChange={onMesChange}>
            <SelectTrigger id="mes">
              <SelectValue placeholder="Selecione o mês" />
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
          <Label htmlFor="ano">Ano</Label>
          <Select value={ano} onValueChange={onAnoChange}>
            <SelectTrigger id="ano">
              <SelectValue placeholder="Selecione o ano" />
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
            Filtros ativos: 
            {busca && <span className="ml-2 text-blue-600 font-medium">Busca: "{busca}"</span>}
            {status !== 'todos' && <span className="ml-2 text-blue-600 font-medium">Status: {status}</span>}
            {mes && mes !== 'todos' && <span className="ml-2 text-blue-600 font-medium">Mês: {meses.find(m => m.value === mes)?.label}</span>}
            {ano && ano !== 'todos' && <span className="ml-2 text-blue-600 font-medium">Ano: {ano}</span>}
          </p>
        </div>
      )}
    </Card>
  );
}
