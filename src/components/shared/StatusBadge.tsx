// ============================================
// STATUS BADGE - Badge de status com cores
// ============================================

import React from 'react';
import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: any;
  className?: string;
}

const statusConfig = {
  ativo: {
    label: 'Ativo',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  inativo: {
    label: 'Inativo',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
  trancado: {
    label: 'Trancado',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  concluido: {
    label: 'Concluído',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  evadido: {
    label: 'Evadido',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  pendente: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  aprovado: {
    label: 'Aprovado',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  reprovado: {
    label: 'Reprovado',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  pago: {
    label: 'Pago',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  vencido: {
    label: 'Vencido',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  cancelado: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
  em_andamento: {
    label: 'Em Andamento',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status as keyof typeof statusConfig];
  const label = config ? config.label : (status ? String(status).replace('_', ' ') : '');
  const badgeClass = config ? config.className : 'bg-gray-100 text-gray-800 hover:bg-gray-100';

  return (
    <Badge className={`${badgeClass} ${className}`}>
      {label}
    </Badge>
  );
};
