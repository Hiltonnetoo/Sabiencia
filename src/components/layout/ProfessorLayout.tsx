// ============================================
// PROFESSOR LAYOUT - Layout do professor
// ============================================

import React from 'react';
import { BaseLayout } from './BaseLayout';
import { professorNavItems } from '../../config/navigation';

interface ProfessorLayoutProps {
  children: React.ReactNode;
}

export const ProfessorLayout: React.FC<ProfessorLayoutProps> = ({ children }) => {
  return (
    <BaseLayout key="professor-layout" navItems={professorNavItems}>
      {children}
    </BaseLayout>
  );
};

export default ProfessorLayout;
