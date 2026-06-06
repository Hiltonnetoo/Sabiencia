// ============================================
// PERFIL FORM - Formulário de edição de perfil
// ============================================

import { useState } from 'react';
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
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
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
        <h2 className="text-xl text-gray-900">Dados Pessoais</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome_completo">Nome Completo *</Label>
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
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              {...register('cpf')}
              placeholder="000.000.000-00"
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>

          <div>
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
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
          <h3 className="text-lg text-gray-900 mb-4">Contatos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder="(00) 0000-0000"
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div>
              <Label htmlFor="celular">Celular</Label>
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
          <h3 className="text-lg text-gray-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="endereco">Logradouro</Label>
              <Input
                id="endereco"
                {...register('endereco')}
                placeholder="Rua, Avenida, etc."
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  {...register('cidade')}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  {...register('estado')}
                  placeholder="UF"
                  maxLength={2}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </div>

              <div>
                <Label htmlFor="cep">CEP</Label>
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
              loadingText="Salvando..."
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
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
        )}
      </form>
    </div>
  );
}
