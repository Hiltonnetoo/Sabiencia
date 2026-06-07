// ============================================
// SIDEBAR - Menu lateral navegação
// ============================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../ui/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SabienciaMonogramBadge } from '../brand/SabienciaBrand';

export interface NavItem {
  title: string;
  /** i18n key; falls back to `title` when absent or untranslated. */
  titleKey?: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string;
  children?: NavItem[];
  isHeader?: boolean;
}

interface SidebarProps {
  items: NavItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, isOpen = true, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Menu principal"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header mobile */}
        <div className="flex items-center justify-between h-16 px-4 border-b lg:hidden">
          <div className="flex items-center gap-2">
            <SabienciaMonogramBadge className="h-8 w-8 rounded-full" labelClassName="text-xs" />
            <span className="font-semibold">Menu</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1" aria-label="Navegação principal">
            {items.map((item, index) => {
              if (item.isHeader) {
                return (
                  <div
                    key={index}
                    className="px-3 pt-5 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider select-none"
                  >
                    {item.titleKey ? t(item.titleKey) : item.title}
                  </div>
                );
              }
              return <SidebarItem key={index} item={item} onClose={onClose} />;
            })}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
};

const SidebarItem: React.FC<{ item: NavItem; onClose?: () => void }> = ({
  item,
  onClose
}) => {
  const { t } = useTranslation();
  const Icon = item.icon;
  const label = item.titleKey ? t(item.titleKey) : item.title;

  return (
    <NavLink
      to={item.href || '#'}
      onClick={() => onClose?.()}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100',
          isActive
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-gray-700 hover:text-gray-900'
        )
      }
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span className="flex-1">{label}</span>
      {item.badge && (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
};
