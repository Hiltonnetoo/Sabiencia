// ============================================
// BASE LAYOUT - Layout base com sidebar e topbar
// ============================================

import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar, NavItem } from './Sidebar';

interface BaseLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children, navItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white focus:top-4 focus:left-4 focus:rounded-lg focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>

      {/* Sidebar with navigation landmark */}
      <Sidebar 
        items={navItems} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* TopBar with banner landmark */}
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={true}
        />

        {/* Page Content with main landmark */}
        <main id="main-content" role="main" className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
