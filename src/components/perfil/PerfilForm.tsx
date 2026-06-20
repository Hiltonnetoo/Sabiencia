// ============================================
// PERFIL FORM - Formulário de edição de perfil
// ============================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { perfilPessoalSchema, type PerfilPessoalFormData } from '../../schemas/perfilSchemas';
import type { User } from '../../types';
import { LoadingButton } from '../shared/LoadingButton';

interface PerfilFormProps {
  user: User;
  onSave?: (data: PerfilPessoalFormData) => void;
  onCancel?: () => void;
}

export function PerfilForm({ user, onSave, onCancel }: PerfilFormProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PerfilPessoalFormData>({
    resolver: zodResolver(perfilPessoalSchema),
    defaultValues: {
      nome_completo: user.nome_completo,
      email: user.email,
      cpf: user.cpf || '',
      data_nascimento: user.data_nascimento || '',
      telefone: user.telefone || '',
      celular: user.celular || '',
      endereco: user.endereco || '',
      cidade: user.cidade || '',
      estado: user.estado || '',
      cep: user.cep || '',
    },
  });

  const onSubmit = async (data: PerfilPessoalFormData) => {
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onSave?.(data);
      setIsEditing(false);
      toast.success(t('components.perfilForm.profileUpdated'));
    } catch (error) {
      toast.error(t('components.perfilForm.profileUpdateError'));
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-gray-900">{t('components.perfilForm.personalData')}</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            {t('components.perfilForm.editProfile')}
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome_completo">{t('components.perfilForm.fullName')} *</Label>
            <Input
              id="nome_completo"
              {...register('nome_completo')}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
            {errors.nome_completo && (
              <p className="text-sm text-red-600 mt-1">{errors.nome_completo.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">{t('components.perfilForm.email')} *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cpf">{t('common.labels.cpf')}</Label>
            <Input
              id="cpf"
              {...register('cpf')}
              placeholder="000.000.000-00"
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>

          <div>
            <Label htmlFor="data_nascimento">{t('components.perfilForm.birthDate')}</Label>
            <Input
              id="data_nascimento"
              type="date"
              {...register('data_nascimento')}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>
        </div>

        {/* Contatos */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">{t('components.perfilForm.contacts')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">{t('components.perfilForm.phone')}</Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder="(00) 0000-0000"
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div>
              <Label htmlFor="celular">{t('components.perfilForm.mobile')}</Label>
              <Input
                id="celular"
                {...register('celular')}
                placeholder="(00) 00000-0000"
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">{t('components.perfilForm.address')}</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="endereco">{t('components.perfilForm.street')}</Label>
              <Input
                id="endereco"
                {...register('endereco')}
                placeholder={t('components.perfilForm.streetPlaceholder')}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cidade">{t('components.perfilForm.city')}</Label>
                <Input
                  id="cidade"
                  {...register('cidade')}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div>
                <Label htmlFor="estado">{t('components.perfilForm.state')}</Label>
                <Input
                  id="estado"
                  {...register('estado')}
                  placeholder={t('components.perfilForm.statePlaceholder')}
                  maxLength={2}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div>
                <Label htmlFor="cep">{t('components.perfilForm.zipCode')}</Label>
                <Input
                  id="cep"
                  {...register('cep')}
                  placeholder="00000-000"
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        {isEditing && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <LoadingButton 
              type="submit" 
              isLoading={isSubmitting}
              loadingText={t('common.actions.saving')}
            >
              <Save className="w-4 h-4 mr-2" />
              {t('components.perfilForm.saveChanges')}
            </LoadingButton>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              {t('common.actions.cancel')}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
