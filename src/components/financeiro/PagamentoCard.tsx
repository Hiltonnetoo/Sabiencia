import React from 'react';
import { Pagamento, Aluno } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  Calendar, 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';

interface PagamentoCardProps {
  pagamento: Pagamento;
  aluno?: Aluno;
  onRegistrarPagamento?: (pagamento: Pagamento) => void;
  onVisualizarComprovante?: (pagamento: Pagamento) => void;
  onCancelar?: (pagamento: Pagamento) => void;
  showAlunoInfo?: boolean;
}

export function PagamentoCard({ 
  pagamento, 
  aluno,
  onRegistrarPagamento,
  onVisualizarComprovante,
  onCancelar,
  showAlunoInfo = true
}: PagamentoCardProps) {
  
  const getStatusBadge = (status: string) => {
    const configs = {
      pago: { variant: 'default' as const, icon: CheckCircle2, label: 'Pago', color: 'text-green-600 bg-green-50' },
      pendente: { variant: 'secondary' as const, icon: Clock, label: 'Pendente', color: 'text-yellow-600 bg-yellow-50' },
      vencido: { variant: 'destructive' as const, icon: AlertCircle, label: 'Vencido', color: 'text-red-600 bg-red-50' },
      cancelado: { variant: 'outline' as const, icon: XCircle, label: 'Cancelado', color: 'text-gray-600 bg-gray-50' },
    };
    
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const isVencido = pagamento.status === 'pendente' && 
    new Date(pagamento.data_vencimento) < new Date();

  const diasAtraso = isVencido 
    ? Math.floor((new Date().getTime() - new Date(pagamento.data_vencimento).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {showAlunoInfo && aluno && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {aluno.nome_completo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{aluno.nome_completo}</p>
                  <p className="text-sm text-gray-500">{aluno.cpf}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(pagamento.valor)}
              </span>
            </div>
            <p className="text-sm text-gray-500">ID: {pagamento.id}</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(pagamento.status)}
            {isVencido && (
              <span className="text-xs text-red-600 font-medium">
                {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'} de atraso
              </span>
            )}
          </div>
        </div>

        {/* Informações */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Vencimento</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(pagamento.data_vencimento)}
              </p>
            </div>
          </div>

          {pagamento.data_pagamento && (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Pagamento</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(pagamento.data_pagamento)}
                </p>
              </div>
            </div>
          )}

          {pagamento.metodo_pagamento && (
            <div className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Método</p>
                <p className="text-sm font-medium text-gray-900">
                  {pagamento.metodo_pagamento}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Observação */}
        {pagamento.observacao && (
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-1">Observação</p>
            <p className="text-sm text-gray-700">{pagamento.observacao}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-2 pt-4 border-t">
          {pagamento.status === 'pendente' && onRegistrarPagamento && (
            <Button 
              onClick={() => onRegistrarPagamento(pagamento)}
              size="sm"
              className="flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Registrar Pagamento
            </Button>
          )}

          {pagamento.comprovante_url && onVisualizarComprovante && (
            <Button 
              onClick={() => onVisualizarComprovante(pagamento)}
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Comprovante
            </Button>
          )}

          {pagamento.comprovante_url && (
            <Button 
              onClick={() => window.open(pagamento.comprovante_url, '_blank')}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}

          {pagamento.status === 'pendente' && onCancelar && (
            <Button 
              onClick={() => onCancelar(pagamento)}
              variant="ghost"
              size="sm"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
