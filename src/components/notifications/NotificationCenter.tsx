// ============================================
// NOTIFICATION CENTER - Centro de notificações
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Filter, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { NotificationItem } from './NotificationItem';
import { toast } from 'sonner';
import type { Notificacao } from '../../types';

interface NotificationCenterProps {
  notifications: Notificacao[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onOpenSettings?: () => void;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenSettings,
}: NotificationCenterProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'nao_lidas'>('todos');

  const unreadCount = notifications.filter((n) => !n.lida).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'nao_lidas') return !n.lida;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.();
    toast.success('Todas as notificações marcadas como lidas');
  };

  const handleNotificationClick = (notification: Notificacao) => {
    if (notification.link) {
      // Verificar se é link interno ou externo
      if (notification.link.startsWith('/')) {
        // Link interno - usar React Router (mantém estado SPA)
        navigate(notification.link);
      } else {
        // Link externo - usar window.location
        window.location.href = notification.link;
      }
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[400px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-600">
                {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter(filter === 'todos' ? 'nao_lidas' : 'todos')}
              className="h-8 px-2"
            >
              <Filter className="w-4 h-4" />
            </Button>
            
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-8 px-2"
              >
                <CheckCheck className="w-4 h-4" />
              </Button>
            )}
            
            {onOpenSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenSettings();
                  setIsOpen(false);
                }}
                className="h-8 px-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="p-2 space-y-1">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === 'nao_lidas' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </p>
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Footer */}
        <div className="p-3 bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              // Implementar navegação para página de notificações completa (se necessário)
              setIsOpen(false);
            }}
          >
            Ver todas as notificações
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
