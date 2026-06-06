// ============================================
// GESTOR LAYOUT - Layout do gestor
// ============================================

import React from 'react';
import { BaseLayout } from './BaseLayout';
import { gestorNavItems } from '../../config/navigation';

interface GestorLayoutProps {
  children: React.ReactNode;
}

export const GestorLayout: React.FC<GestorLayoutProps> = ({ children }) => {
  return (
    <BaseLayout key="gestor-layout" navItems={gestorNavItems}>
      {children}
    </BaseLayout>
  );
};

export default GestorLayout;
