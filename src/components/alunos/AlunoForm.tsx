// ============================================
// ALUNO FORM - Formulário de criação/edição de aluno
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Aluno } from '../../types';
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
  const { t } = useTranslation();
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
  // Atalhos de teclado
  useKeyboardShortcuts([
    commonShortcuts.save(() => {
      if (!isLoading) {
        handleSubmit(activeOnSubmit)();
      }
    }),
    commonShortcuts.cancel(onCancel ?? (() => {})),
  ]);

  return (
    <form onSubmit={handleSubmit(activeOnSubmit)} className="space-y-6" noValidate>
      {/* SEÇÃO 1: DADOS PESSOAIS */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.alunoForm.personalData')}</CardTitle>
          <CardDescription>{t('components.alunoForm.personalDataDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Nome Completo */}
            <FormField
              label={t('components.alunoForm.fullName')}
              htmlFor="nome_completo"
              required
              error={errors.nome_completo?.message}
              className="md:col-span-2"
            >
              <InputWithValidation
                id="nome_completo"
                required
                {...register('nome_completo')}
                placeholder={t('components.alunoForm.fullNamePlaceholder')}
                error={errors.nome_completo?.message}
                isValid={validation.isFieldValid('nome_completo')}
              />
            </FormField>

            {/* CPF */}
            <FormField
              label={t('components.alunoForm.cpf')}
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
              <Label htmlFor="rg">{t('components.alunoForm.rg')}</Label>
              <Input
                id="rg"
                {...register('rg')}
                placeholder={t('components.alunoForm.rgPlaceholder')}
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
                {t('components.alunoForm.birthDate')} <span className="text-red-500">*</span>
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
                      <span>{t('components.alunoForm.selectDate')}</span>
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
              <Label htmlFor="sexo">{t('components.alunoForm.sex')}</Label>
              <Select
                value={watch('sexo')}
                onValueChange={(value) => setValue('sexo', value as 'M' | 'F' | 'Outro')}
              >
                <SelectTrigger id="sexo">
                  <SelectValue placeholder={t('components.alunoForm.select')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">{t('components.alunoForm.sexMale')}</SelectItem>
                  <SelectItem value="F">{t('components.alunoForm.sexFemale')}</SelectItem>
                  <SelectItem value="Outro">{t('components.alunoForm.sexOther')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado Civil */}
            <div>
              <Label htmlFor="estado_civil">{t('components.alunoForm.maritalStatus')}</Label>
              <Select
                value={watch('estado_civil')}
                onValueChange={(value) => setValue('estado_civil', value)}
              >
                <SelectTrigger id="estado_civil">
                  <SelectValue placeholder={t('components.alunoForm.select')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solteiro(a)">{t('components.alunoForm.maritalSingle')}</SelectItem>
                  <SelectItem value="Casado(a)">{t('components.alunoForm.maritalMarried')}</SelectItem>
                  <SelectItem value="Divorciado(a)">{t('components.alunoForm.maritalDivorced')}</SelectItem>
                  <SelectItem value="Viúvo(a)">{t('components.alunoForm.maritalWidowed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: CONTATO */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.alunoForm.contact')}</CardTitle>
          <CardDescription>{t('components.alunoForm.contactDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
            <FormField
              label={t('components.alunoForm.email')}
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
              label={t('components.alunoForm.phone')}
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
                {t('components.alunoForm.guardianName')}
                <span className="text-sm text-gray-500 ml-1">{t('components.alunoForm.guardianNameHint')}</span>
              </Label>
              <Input
                id="nome_responsavel"
                {...register('nome_responsavel')}
                placeholder={t('components.alunoForm.guardianNamePlaceholder')}
              />
            </div>

            {/* Telefone do Responsável */}
            <FormField
              label={t('components.alunoForm.guardianPhone')}
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
          <CardTitle>{t('components.alunoForm.address')}</CardTitle>
          <CardDescription>{t('components.alunoForm.addressDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* CEP */}
            <FormField
              label={t('components.alunoForm.zipCode')}
              htmlFor="endereco.cep"
              error={errors.endereco?.cep?.message}
              hint={t('components.alunoForm.zipCodeHint')}
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
              label={t('components.alunoForm.street')}
              htmlFor="endereco.rua"
              error={errors.endereco?.rua?.message}
            >
              <InputWithValidation
                id="endereco.rua"
                {...register('endereco.rua')}
                placeholder={t('components.alunoForm.streetPlaceholder')}
                error={errors.endereco?.rua?.message}
                isValid={validation.isFieldValid('endereco.rua')}
              />
            </FormField>

            {/* Número */}
            <div>
              <Label htmlFor="endereco.numero">{t('components.alunoForm.number')}</Label>
              <Input
                id="endereco.numero"
                {...register('endereco.numero')}
                placeholder={t('components.alunoForm.numberPlaceholder')}
              />
              {errors.endereco?.numero && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endereco.numero.message}
                </p>
              )}
            </div>

            {/* Complemento */}
            <div>
              <Label htmlFor="endereco.complemento">{t('components.alunoForm.complement')}</Label>
              <Input
                id="endereco.complemento"
                {...register('endereco.complemento')}
                placeholder={t('components.alunoForm.complementPlaceholder')}
              />
            </div>

            {/* Bairro */}
            <div>
              <Label htmlFor="endereco.bairro">{t('components.alunoForm.neighborhood')}</Label>
              <Input
                id="endereco.bairro"
                {...register('endereco.bairro')}
                placeholder={t('components.alunoForm.neighborhoodPlaceholder')}
              />
              {errors.endereco?.bairro && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endereco.bairro.message}
                </p>
              )}
            </div>

            {/* Cidade */}
            <div>
              <Label htmlFor="endereco.cidade">{t('components.alunoForm.city')}</Label>
              <Input
                id="endereco.cidade"
                {...register('endereco.cidade')}
                placeholder={t('components.alunoForm.cityPlaceholder')}
              />
              {errors.endereco?.cidade && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endereco.cidade.message}
                </p>
              )}
            </div>

            {/* Estado */}
            <div>
              <Label htmlFor="endereco.estado">{t('components.alunoForm.state')}</Label>
              <Input
                id="endereco.estado"
                {...register('endereco.estado')}
                placeholder={t('components.alunoForm.statePlaceholder')}
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
          <CardTitle>{t('components.alunoForm.photo')}</CardTitle>
          <CardDescription>{t('components.alunoForm.photoDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="foto_url">{t('components.alunoForm.photoUrl')}</Label>
            <Input
              id="foto_url"
              {...register('foto_url')}
              placeholder={t('components.alunoForm.photoUrlPlaceholder')}
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
          {t('common.actions.cancel')}
        </Button>
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText={t('common.actions.saving')}
        >
          {t('components.alunoForm.saveStudent')}
        </LoadingButton>
      </div>
    </form>
  );
};
