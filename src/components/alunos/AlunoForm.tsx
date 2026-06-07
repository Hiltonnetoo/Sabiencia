// ============================================
// ALUNO FORM - Formulário de criação/edição de aluno
// ============================================

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { alunoSchema, type AlunoFormData } from '../../schemas/userSchemas';
import { CalendarIcon, Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Aluno } from '../../types';
import { useMockData } from '../../contexts/MockDataContext';
import { LoadingButton } from '../shared/LoadingButton';
import { FormField } from '../shared/FormField';
import { InputWithValidation } from '../shared/InputWithValidation';
import { CPFInput } from '../shared/CPFInput';
import { PhoneInput } from '../shared/PhoneInput';
import { CEPInput } from '../shared/CEPInput';
import { EmailInput } from '../shared/EmailInput';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useKeyboardShortcuts, commonShortcuts } from '../../hooks/useKeyboardShortcuts';

interface AlunoFormProps {
  aluno?: Aluno;
  initialData?: Aluno;
  onSubmit?: (data: AlunoFormData) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export const AlunoForm: React.FC<AlunoFormProps> = ({
  aluno,
  initialData,
  onSubmit,
  onSuccess,
  onCancel,
  isLoading = false,
  onDirtyChange,
}) => {
  const { cursos, turmas } = useMockData();
  const [selectedCurso, setSelectedCurso] = useState<string>('');
  const activeAluno = aluno || initialData;

  const form = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    mode: 'onChange', // Validação em tempo real
    defaultValues: activeAluno ? {
      nome_completo: activeAluno.nome_completo,
      cpf: activeAluno.cpf,
      rg: activeAluno.rg,
      data_nascimento: typeof activeAluno.data_nascimento === 'string' ? new Date(activeAluno.data_nascimento) : activeAluno.data_nascimento,
      sexo: activeAluno.sexo,
      estado_civil: activeAluno.estado_civil,
      email: activeAluno.email,
      telefone: activeAluno.telefone,
      nome_responsavel: activeAluno.nome_responsavel,
      telefone_responsavel: activeAluno.telefone_responsavel,
      endereco: activeAluno.endereco,
      foto_url: activeAluno.foto_url,
      ativo: activeAluno.ativo,
    } : {
      ativo: true,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = form;

  // Notificar componente pai sobre alteração no estado dirty do formulário
  React.useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const activeOnSubmit = (data: AlunoFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else if (onSuccess) {
      onSuccess();
    }
  };

  const validation = useFormValidation(form);

  const dataNascimento = watch('data_nascimento');

  // Filtrar turmas por curso selecionado
  const turmasFiltradas = selectedCurso
    ? turmas.filter(t => t.curso_id === selectedCurso)
    : turmas;

  // Atalhos de teclado
  useKeyboardShortcuts([
    commonShortcuts.save(() => {
      if (!isLoading) {
        handleSubmit(activeOnSubmit)();
      }
    }),
    commonShortcuts.cancel(onCancel),
  ]);

  return (
    <form onSubmit={handleSubmit(activeOnSubmit)} className="space-y-6" noValidate>
      {/* SEÇÃO 1: DADOS PESSOAIS */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>Informações básicas do aluno</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Nome Completo */}
            <FormField
              label="Nome Completo"
              htmlFor="nome_completo"
              required
              error={errors.nome_completo?.message}
              className="md:col-span-2"
            >
              <InputWithValidation
                id="nome_completo"
                required
                {...register('nome_completo')}
                placeholder="Nome completo do aluno"
                error={errors.nome_completo?.message}
                isValid={validation.isFieldValid('nome_completo')}
              />
            </FormField>

            {/* CPF */}
            <FormField
              label="CPF"
              htmlFor="cpf"
              required
              error={errors.cpf?.message}
            >
              <CPFInput
                id="cpf"
                required
                {...register('cpf')}
                error={errors.cpf?.message}
              />
            </FormField>

            {/* RG */}
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                {...register('rg')}
                placeholder="00.000.000-0"
              />
              {errors.rg && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.rg.message}
                </p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div>
              <Label htmlFor="data_nascimento">
                Data de Nascimento <span className="text-red-500">*</span>
              </Label>
              <input
                type="text"
                id="data_nascimento"
                required
                className="sr-only"
                {...register('data_nascimento', {
                  setValueAs: (v) => {
                    if (!v) return undefined;
                    const d = new Date(v);
                    return isNaN(d.getTime()) ? undefined : d;
                  }
                })}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataNascimento ? (
                      format(dataNascimento, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataNascimento}
                    onSelect={(date) => setValue('data_nascimento', date!, { shouldDirty: true, shouldValidate: true })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.data_nascimento && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.data_nascimento.message}
                </p>
              )}
            </div>

            {/* Sexo */}
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={watch('sexo')}
                onValueChange={(value) => setValue('sexo', value as 'M' | 'F' | 'Outro')}
              >
                <SelectTrigger id="sexo">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado Civil */}
            <div>
              <Label htmlFor="estado_civil">Estado Civil</Label>
              <Select
                value={watch('estado_civil')}
                onValueChange={(value) => setValue('estado_civil', value)}
              >
                <SelectTrigger id="estado_civil">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                  <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                  <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                  <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: CONTATO */}
      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
          <CardDescription>Informações de contato do aluno</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
            <FormField
              label="Email"
              htmlFor="email"
              required
              error={errors.email?.message}
            >
              <EmailInput
                id="email"
                required
                {...register('email')}
                error={errors.email?.message}
              />
            </FormField>

            {/* Telefone */}
            <FormField
              label="Telefone"
              htmlFor="telefone"
              required
              error={errors.telefone?.message}
            >
              <PhoneInput
                id="telefone"
                required
                {...register('telefone')}
                error={errors.telefone?.message}
              />
            </FormField>

            {/* Nome do Responsável */}
            <div>
              <Label htmlFor="nome_responsavel">
                Nome do Responsável
                <span className="text-sm text-gray-500 ml-1">(se menor de idade)</span>
              </Label>
              <Input
                id="nome_responsavel"
                {...register('nome_responsavel')}
                placeholder="Nome do responsável"
              />
            </div>

            {/* Telefone do Responsável */}
            <FormField
              label="Telefone do Responsável"
              htmlFor="telefone_responsavel"
            >
              <PhoneInput
                id="telefone_responsavel"
                {...register('telefone_responsavel')}
                showValidation={false}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 3: ENDEREÇO */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>Endereço residencial do aluno</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* CEP */}
            <FormField
              label="CEP"
              htmlFor="endereco.cep"
              error={errors.endereco?.cep?.message}
              hint="O endereço será preenchido automaticamente"
            >
              <CEPInput
                id="endereco.cep"
                {...register('endereco.cep')}
                error={errors.endereco?.cep?.message}
                onAddressFound={(address) => {
                  setValue('endereco.rua', address.rua);
                  setValue('endereco.bairro', address.bairro);
                  setValue('endereco.cidade', address.cidade);
                  setValue('endereco.estado', address.estado);
                }}
              />
            </FormField>

            {/* Rua */}
            <FormField
              label="Rua"
              htmlFor="endereco.rua"
              error={errors.endereco?.rua?.message}
            >
              <InputWithValidation
                id="endereco.rua"
                {...register('endereco.rua')}
                placeholder="Nome da rua"
                error={errors.endereco?.rua?.message}
                isValid={validation.isFieldValid('endereco.rua')}
              />
            </FormField>

            {/* Número */}
            <div>
              <Label htmlFor="endereco.numero">Número</Label>
              <Input
                id="endereco.numero"
                {...register('endereco.numero')}
                placeholder="Número"
              />
              {errors.endereco?.numero && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endereco.numero.message}
                </p>
              )}
            </div>

            {/* Complemento */}
            <div>
              <Label htmlFor="endereco.complemento">Complemento</Label>
              <Input
                id="endereco.complemento"
                {...register('endereco.complemento')}
                placeholder="Apto, bloco, etc."
              />
            </div>

            {/* Bairro */}
            <div>
              <Label htmlFor="endereco.bairro">Bairro</Label>
              <Input
                id="endereco.bairro"
                {...register('endereco.bairro')}
                placeholder="Nome do bairro"
              />
              {errors.endereco?.bairro && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endereco.bairro.message}
                </p>
              )}
            </div>

            {/* Cidade */}
            <div>
              <Label htmlFor="endereco.cidade">Cidade</Label>
              <Input
                id="endereco.cidade"
                {...register('endereco.cidade')}
                placeholder="Nome da cidade"
              />
              {errors.endereco?.cidade && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endereco.cidade.message}
                </p>
              )}
            </div>

            {/* Estado */}
            <div>
              <Label htmlFor="endereco.estado">Estado</Label>
              <Input
                id="endereco.estado"
                {...register('endereco.estado')}
                placeholder="UF (ex: SP)"
                maxLength={2}
              />
              {errors.endereco?.estado && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endereco.estado.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 4: FOTO (OPCIONAL) */}
      <Card>
        <CardHeader>
          <CardTitle>Foto do Aluno</CardTitle>
          <CardDescription>URL da foto de perfil (opcional)</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="foto_url">URL da Foto</Label>
            <Input
              id="foto_url"
              {...register('foto_url')}
              placeholder="https://exemplo.com/foto.jpg"
            />
            {errors.foto_url && (
              <p className="text-sm text-red-500 mt-1">
                {errors.foto_url.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <LoadingButton 
          type="submit" 
          isLoading={isLoading}
          loadingText="Salvando..."
        >
          Salvar Aluno
        </LoadingButton>
      </div>
    </form>
  );
};
