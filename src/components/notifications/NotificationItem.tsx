// ============================================
// NOTIFICATION ITEM - Item individual de notificação
// ============================================

import { Bell, BookOpen, DollarSign, Settings, MessageSquare, Calendar, FileText, GraduationCap } from 'lucide-react';
import { cn } from '../ui/utils';
import type { Notificacao } from '../../types';

interface NotificationItemProps {
  notification: Notificacao;
  onClick?: () => void;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationItem({ notification, onClick, onMarkAsRead }: NotificationItemProps) {
  const getIconByType = (tipo: string) => {
    const icons = {
      academico: <GraduationCap className="w-4 h-4" />,
      financeiro: <DollarSign className="w-4 h-4" />,
      sistema: <Settings className="w-4 h-4" />,
      comunicado: <MessageSquare className="w-4 h-4" />,
      frequencia: <Calendar className="w-4 h-4" />,
      nota: <FileText className="w-4 h-4" />,
      material: <BookOpen className="w-4 h-4" />,
    };
    return icons[tipo as keyof typeof icons] || <Bell className="w-4 h-4" />;
  };

  const getColorByPriority = (prioridade: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-600',
      success: 'bg-green-100 text-green-600',
      warning: 'bg-yellow-100 text-yellow-600',
      error: 'bg-red-100 text-red-600',
    };
    return colors[prioridade as keyof typeof colors] || colors.info;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const handleClick = () => {
    if (!notification.lida && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
        notification.lida ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
      )}
    >
      <div className={cn('p-2 rounded-lg shrink-0', getColorByPriority(notification.prioridade))}>
        {getIconByType(notification.tipo)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className={cn('text-sm', notification.lida ? 'text-gray-900' : 'text-gray-900 font-semibold')}>
            {notification.titulo}
          </p>
          <span className="text-xs text-gray-500 shrink-0">
            {formatTime(notification.created_at)}
          </span>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2">
          {notification.mensagem}
        </p>
      </div>

      {!notification.lida && (
        <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1" />
      )}
    </div>
  );
}
