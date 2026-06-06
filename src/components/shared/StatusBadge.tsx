// ============================================
// STATUS BADGE - Badge de status com cores
// ============================================

import React from 'react';
import { Badge } from '../ui/badge';
import type { StatusMatricula } from '../../types';

interface StatusBadgeProps {
  status: StatusMatricula | 'ativo' | 'inativo';
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
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.ativo;

  return (
    <Badge className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
};
