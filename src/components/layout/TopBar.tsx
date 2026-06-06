// ============================================
// TOPBAR - Barra superior com perfil e ações
// ============================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { LogOut, Settings, User, Menu, Database } from 'lucide-react';
import { getInitials, formatCPF } from '../../utils/formatters';
import { getRoleName } from '../../utils/permissions';
import { useNavigate } from 'react-router-dom';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { NotificationPreferences } from '../notifications/NotificationPreferences';
import { GlobalSearch } from '../search/GlobalSearch';
import { SearchButton } from '../search/SearchButton';
import { BackupManager } from '../export/BackupManager';
import { SabienciaMonogramBadge } from '../brand/SabienciaBrand';
import { DemoModeBadge } from '../shared/DemoModeBadge';
import { ThemeToggle } from '../shared/ThemeToggle';

interface TopBarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  onMenuClick, 
  showMenuButton = true 
}) => {
  const { user, logout } = useAuth();
  const { getNotificationsByUser, markNotificationAsRead, markAllNotificationsAsRead } = useMockData();
  const navigate = useNavigate();
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBackupManager, setShowBackupManager] = useState(false);

  const userNotifications = user ? getNotificationsByUser(user.id) : [];

  // Atalho de teclado para busca (Cmd+K ou Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowSearch((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    if (user?.role === 'gestor') navigate('/gestor/perfil');
    if (user?.role === 'professor') navigate('/professor/perfil');
    if (user?.role === 'aluno') navigate('/aluno/perfil');
  };

  if (!user) return null;

  return (
    <header role="banner" className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Botão de menu mobile */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo e nome da escola */}
        <div className="flex items-center gap-2">
          <SabienciaMonogramBadge className="h-8 w-8 rounded-full" labelClassName="text-xs" />
          <div className="hidden md:block">
            <h2 className="font-semibold text-gray-900">Sabiencia</h2>
            <p className="text-xs text-gray-500">Sistema EAD</p>
          </div>
          <DemoModeBadge />
        </div>

        {/* Busca Global */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:block">
          <SearchButton onClick={() => setShowSearch(true)} />
        </div>

        {/* Ações da direita */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Alternar tema */}
          <ThemeToggle />

          {/* Backup Manager (apenas para gestor) */}
          {user.role === 'gestor' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBackupManager(true)}
              title="Backup e Restauração"
              aria-label="Abrir gerenciador de backup e restauração"
            >
              <Database className="h-5 w-5" />
            </Button>
          )}

          {/* Notificações */}
          <NotificationCenter
            notifications={userNotifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={() => user && markAllNotificationsAsRead(user.id)}
            onOpenSettings={() => setShowPreferences(true)}
          />

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="gap-2 px-2"
                aria-label={`Menu do usuário ${user.nome_completo}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.foto_url} alt={user.nome_completo} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {getInitials(user.nome_completo)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user.nome_completo.split(' ')[0]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getRoleName(user.role)}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.nome_completo}</p>
                  <p className="text-xs leading-none text-gray-500">{user.email}</p>
                  <p className="text-xs leading-none text-gray-500">{formatCPF(user.cpf)}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                if (user?.role === 'gestor') navigate('/gestor/configuracoes');
                if (user?.role === 'professor') navigate('/professor/configuracoes');
                if (user?.role === 'aluno') navigate('/aluno/configuracoes');
              }}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dialog de Preferências de Notificações */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preferências de Notificações</DialogTitle>
          </DialogHeader>
          <NotificationPreferences
            onSave={(data) => {
              if (import.meta.env.DEV) {
                console.debug('[TopBar] Preferências de notificação salvas');
              }
              setShowPreferences(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Busca Global */}
      <GlobalSearch open={showSearch} onOpenChange={setShowSearch} />

      {/* Backup Manager */}
      <BackupManager open={showBackupManager} onOpenChange={setShowBackupManager} />
    </header>
  );
};
