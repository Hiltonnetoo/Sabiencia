// ============================================
// DEMO MODE BADGE - Indicador discreto de ambiente de demonstração
// Só aparece quando VITE_DEMO_MODE === 'true'.
// ============================================

import React from 'react';
import { FlaskConical } from 'lucide-react';

export const DemoModeBadge: React.FC = () => {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700"
      title="O sistema está rodando com dados de demonstração (sem backend de produção)."
    >
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      Demo
    </span>
  );
};

export default DemoModeBadge;
