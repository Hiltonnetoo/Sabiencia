// ============================================
// PERFIL HEADER - Cabeçalho do perfil
// ============================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';
import type { User as UserType } from '../../types';

interface PerfilHeaderProps {
  user: UserType;
  onFotoChange?: (url: string) => void;
}

export function PerfilHeader({ user, onFotoChange }: PerfilHeaderProps) {
  const { t } = useTranslation();
  const [fotoUrl, setFotoUrl] = useState(user.foto_url || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      aluno: t('components.perfilHeader.roleStudent'),
      professor: t('components.perfilHeader.roleTeacher'),
      gestor: t('components.perfilHeader.roleManager'),
    };
    return labels[role] || role;
  };

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error(t('components.perfilHeader.invalidFileType'));
        return;
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('components.perfilHeader.fileTooLarge'));
        return;
      }

      // Simular upload
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setFotoUrl(url);
        onFotoChange?.(url);
        setIsDialogOpen(false);
        toast.success(t('components.perfilHeader.photoUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
      <div className="flex items-center gap-6">
        {/* Avatar com botão de edição */}
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={fotoUrl} alt={user.nome_completo} />
            <AvatarFallback className="text-3xl bg-blue-500 text-white">
              {getInitials(user.nome_completo)}
            </AvatarFallback>
          </Avatar>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('components.perfilHeader.updatePhoto')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={fotoUrl} alt={user.nome_completo} />
                    <AvatarFallback className="text-3xl bg-blue-500 text-white">
                      {getInitials(user.nome_completo)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="foto-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        <Camera className="w-4 h-4" />
                        <span>{t('components.perfilHeader.choosePhoto')}</span>
                      </div>
                      <input
                        id="foto-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                    
                    <p className="text-sm text-gray-500 text-center">
                      {t('components.perfilHeader.photoHint')}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Informações */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{user.nome_completo}</h1>
          <p className="text-blue-100 mb-4">{user.email}</p>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-100">{t('components.perfilHeader.accountType')}</p>
              <p className="font-semibold">{getRoleLabel(user.role)}</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-100">{t('components.perfilHeader.status')}</p>
              <p className="font-semibold">
                {user.ativo ? t('components.perfilHeader.active') : t('components.perfilHeader.inactive')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
