// ============================================
// DEMO MODE BADGE - Indicador discreto de ambiente de demonstração
// Exibido apenas quando o sistema roda em modo 'demo' (local/offline).
// ============================================

import React from 'react';
import { FlaskConical } from 'lucide-react';
import { isDemoMode } from '../../config/appMode';

export const DemoModeBadge: React.FC = () => {
  if (!isDemoMode()) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700"
      title="O sistema está rodando em modo demonstração local (persistência no navegador sem backend remoto)."
    >
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      Demo
    </span>
  );
};

export default DemoModeBadge;
