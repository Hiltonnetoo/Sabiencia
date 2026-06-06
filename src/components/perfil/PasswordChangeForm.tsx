// ============================================
// PASSWORD CHANGE FORM - Formulário de alteração de senha
// ============================================

import { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      toast.error('Erro ao alterar senha');
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
            <h2 className="text-xl text-gray-900">Segurança</h2>
            <p className="text-sm text-gray-600">Altere sua senha de acesso</p>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Alterar Senha
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Senha Atual"
            htmlFor="senha_atual"
            required
            error={errors.senha_atual?.message}
          >
            <div className="relative">
              <InputWithValidation
                id="senha_atual"
                type={showSenhaAtual ? 'text' : 'password'}
                {...register('senha_atual')}
                placeholder="Digite sua senha atual"
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
            label="Nova Senha"
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
                  placeholder="Digite a nova senha"
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
            label="Confirmar Nova Senha"
            htmlFor="confirmar_senha"
            required
            error={errors.confirmar_senha?.message}
          >
            <div className="relative">
              <InputWithValidation
                id="confirmar_senha"
                type={showConfirmarSenha ? 'text' : 'password'}
                {...register('confirmar_senha')}
                placeholder="Digite a senha novamente"
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
              loadingText="Salvando..."
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Nova Senha
            </LoadingButton>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Lock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Senha atual</p>
              <p className="text-gray-900">••••••••••</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Sua senha foi atualizada pela última vez em: <span className="font-semibold">01/11/2025</span>
          </p>
        </div>
      )}
    </div>
  );
}
