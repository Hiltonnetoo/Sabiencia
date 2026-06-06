// ============================================
// ALUNO LAYOUT - Layout do aluno
// ============================================

import React from 'react';
import { BaseLayout } from './BaseLayout';
import { alunoNavItems } from '../../config/navigation';

interface AlunoLayoutProps {
  children: React.ReactNode;
}

export const AlunoLayout: React.FC<AlunoLayoutProps> = ({ children }) => {
  return (
    <BaseLayout key="aluno-layout" navItems={alunoNavItems}>
      {children}
    </BaseLayout>
  );
};

export default AlunoLayout;
