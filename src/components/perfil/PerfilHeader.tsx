// ============================================
// PERFIL HEADER - Cabeçalho do perfil
// ============================================

import { useState } from 'react';
import { Camera, User } from 'lucide-react';
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
  const [fotoUrl, setFotoUrl] = useState(user.foto_url || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      aluno: 'Aluno',
      professor: 'Professor',
      gestor: 'Gestor/CEO',
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
        toast.error('Por favor, selecione um arquivo de imagem');
        return;
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      // Simular upload
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setFotoUrl(url);
        onFotoChange?.(url);
        setIsDialogOpen(false);
        toast.success('Foto atualizada com sucesso!');
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
                <DialogTitle>Atualizar Foto de Perfil</DialogTitle>
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
                        <span>Escolher Foto</span>
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
                      PNG, JPG ou JPEG (máx. 5MB)
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
              <p className="text-sm text-blue-100">Tipo de Conta</p>
              <p className="font-semibold">{getRoleLabel(user.role)}</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-100">Status</p>
              <p className="font-semibold">
                {user.ativo ? 'Ativo' : 'Inativo'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
