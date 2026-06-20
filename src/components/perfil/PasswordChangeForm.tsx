// ============================================
// PASSWORD CHANGE FORM - Formulário de alteração de senha
// ============================================

import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { alterarSenhaSchema, type AlterarSenhaFormData } from '../../schemas/perfilSchemas';
import { LoadingButton } from '../shared/LoadingButton';
import { PasswordStrengthIndicator } from '../shared/PasswordStrengthIndicator';
import { InputWithValidation } from '../shared/InputWithValidation';
import { FormField } from '../shared/FormField';

interface PasswordChangeFormProps {
  onSave?: (data: AlterarSenhaFormData) => void;
  onCancel?: () => void;
}

export function PasswordChangeForm({ onSave, onCancel }: PasswordChangeFormProps) {
  const { t } = useTranslation();
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AlterarSenhaFormData>({
    resolver: zodResolver(alterarSenhaSchema),
    mode: 'onChange', // Validação em tempo real
    defaultValues: {
      senha_atual: '',
      nova_senha: '',
      confirmar_senha: '',
    },
  });

  const novaSenha = watch('nova_senha');

  const onSubmit = async (data: AlterarSenhaFormData) => {
    try {
      // Simular alteração de senha
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onSave?.(data);
      reset();
      setIsEditing(false);
      toast.success(t('components.passwordChangeForm.passwordChanged'));
    } catch (error) {
      toast.error(t('components.passwordChangeForm.passwordChangeError'));
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Lock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl text-gray-900">{t('components.passwordChangeForm.security')}</h2>
            <p className="text-sm text-gray-600">{t('components.passwordChangeForm.securityDesc')}</p>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            {t('components.passwordChangeForm.changePassword')}
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label={t('components.passwordChangeForm.currentPassword')}
            htmlFor="senha_atual"
            required
            error={errors.senha_atual?.message}
          >
            <div className="relative">
              <InputWithValidation
                id="senha_atual"
                type={showSenhaAtual ? 'text' : 'password'}
                {...register('senha_atual')}
                placeholder={t('components.passwordChangeForm.currentPasswordPlaceholder')}
                error={errors.senha_atual?.message}
                showValidation={false}
              />
              <button
                type="button"
                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
              >
                {showSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <FormField
            label={t('components.passwordChangeForm.newPassword')}
            htmlFor="nova_senha"
            required
            error={errors.nova_senha?.message}
          >
            <div className="space-y-2">
              <div className="relative">
                <InputWithValidation
                  id="nova_senha"
                  type={showNovaSenha ? 'text' : 'password'}
                  {...register('nova_senha')}
                  placeholder={t('components.passwordChangeForm.newPasswordPlaceholder')}
                  error={errors.nova_senha?.message}
                  showValidation={false}
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={novaSenha} />
            </div>
          </FormField>

          <FormField
            label={t('components.passwordChangeForm.confirmNewPassword')}
            htmlFor="confirmar_senha"
            required
            error={errors.confirmar_senha?.message}
          >
            <div className="relative">
              <InputWithValidation
                id="confirmar_senha"
                type={showConfirmarSenha ? 'text' : 'password'}
                {...register('confirmar_senha')}
                placeholder={t('components.passwordChangeForm.confirmNewPasswordPlaceholder')}
                error={errors.confirmar_senha?.message}
                showValidation={false}
              />
              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
              >
                {showConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormField>

          <div className="flex items-center gap-3 pt-4 border-t">
            <LoadingButton 
              type="submit" 
              isLoading={isSubmitting}
              loadingText={t('common.actions.saving')}
            >
              <Save className="w-4 h-4 mr-2" />
              {t('components.passwordChangeForm.saveNewPassword')}
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
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Lock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">{t('components.passwordChangeForm.currentPasswordLabel')}</p>
              <p className="text-gray-900">••••••••••</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            <Trans
              i18nKey="components.passwordChangeForm.lastUpdated"
              values={{ date: '01/11/2025' }}
              components={[<span className="font-semibold" />]}
            />
          </p>
        </div>
      )}
    </div>
  );
}
