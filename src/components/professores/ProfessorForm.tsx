// ============================================
// PROFESSOR FORM - Formulário de criação/edição de professor
// ============================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { professorSchema, type ProfessorFormData } from '../../schemas/userSchemas';
import { X } from 'lucide-react';
import type { Professor } from '../../types';
import { LoadingButton } from '../shared/LoadingButton';

interface ProfessorFormProps {
  professor?: Professor;
  onSubmit: (data: ProfessorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

// Especialidades disponíveis
const especialidadesDisponiveis = [
  'Enfermagem',
  'Administração',
  'Informática',
  'Gestão de Pessoas',
  'Contabilidade',
  'Marketing',
  'Logística',
  'Segurança do Trabalho',
  'Matemática',
  'Português',
  'Inglês',
  'Química',
  'Física',
  'Biologia',
];

export const ProfessorForm: React.FC<ProfessorFormProps> = ({
  professor,
  onSubmit,
  onCancel,
  isLoading = false,
  onDirtyChange,
}) => {
  const { t } = useTranslation();
  const [especialidadesInput, setEspecialidadesInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: professor ? {
      nome_completo: professor.nome_completo,
      cpf: professor.cpf,
      data_nascimento: professor.data_nascimento,
      email: professor.email,
      telefone: professor.telefone,
      formacao: professor.formacao,
      especialidades: professor.especialidades,
      registro_profissional: professor.registro_profissional,
      foto_url: professor.foto_url,
      ativo: professor.ativo,
    } : {
      ativo: true,
      especialidades: [],
    },
  });

  // Notificar componente pai sobre alteração no estado dirty do formulário
  React.useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const especialidades = watch('especialidades') || [];

  // Adicionar especialidade
  const handleAddEspecialidade = (especialidade: string) => {
    if (!especialidades.includes(especialidade)) {
      setValue('especialidades', [...especialidades, especialidade]);
    }
    setEspecialidadesInput('');
  };

  // Remover especialidade
  const handleRemoveEspecialidade = (especialidade: string) => {
    setValue(
      'especialidades',
      especialidades.filter(e => e !== especialidade)
    );
  };

  // Especialidades filtradas para sugestão
  const especialidadesFiltradas = especialidadesDisponiveis.filter(
    e => 
      e.toLowerCase().includes(especialidadesInput.toLowerCase()) &&
      !especialidades.includes(e)
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* SEÇÃO 1: DADOS PESSOAIS */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.professorForm.personalData')}</CardTitle>
          <CardDescription>{t('components.professorForm.personalDataDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Nome Completo */}
            <div className="md:col-span-2">
              <Label htmlFor="nome_completo">
                {t('components.professorForm.fullName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome_completo"
                {...register('nome_completo')}
                placeholder={t('components.professorForm.fullNamePlaceholder')}
              />
              {errors.nome_completo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.nome_completo.message}
                </p>
              )}
            </div>

            {/* CPF */}
            <div>
              <Label htmlFor="cpf">
                {t('components.professorForm.cpf')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cpf"
                {...register('cpf')}
                placeholder={t('components.professorForm.cpfPlaceholder')}
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cpf.message}
                </p>
              )}
            </div>

            {/* Registro Profissional */}
            <div>
              <Label htmlFor="registro_profissional">{t('components.professorForm.professionalRegistration')}</Label>
              <Input
                id="registro_profissional"
                {...register('registro_profissional')}
                placeholder={t('components.professorForm.professionalRegistrationPlaceholder')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: CONTATO */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.professorForm.contact')}</CardTitle>
          <CardDescription>{t('components.professorForm.contactDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
            <div>
              <Label htmlFor="email">
                {t('components.professorForm.email')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={t('components.professorForm.emailPlaceholder')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="telefone">
                {t('components.professorForm.phone')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder={t('components.professorForm.phonePlaceholder')}
                maxLength={15}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.telefone.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 3: FORMAÇÃO E ESPECIALIDADES */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.professorForm.educationAndSpecialties')}</CardTitle>
          <CardDescription>{t('components.professorForm.educationAndSpecialtiesDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formação */}
          <div>
            <Label htmlFor="formacao">
              {t('components.professorForm.education')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="formacao"
              {...register('formacao')}
              placeholder={t('components.professorForm.educationPlaceholder')}
            />
            {errors.formacao && (
              <p className="text-sm text-red-500 mt-1">
                {errors.formacao.message}
              </p>
            )}
          </div>

          {/* Especialidades */}
          <div>
            <Label htmlFor="especialidades">
              {t('components.professorForm.specialties')} <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              {/* Input com sugestões */}
              <div className="relative">
                <Input
                  id="especialidades_input"
                  value={especialidadesInput}
                  onChange={(e) => setEspecialidadesInput(e.target.value)}
                  placeholder={t('components.professorForm.specialtiesPlaceholder')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (especialidadesInput.trim()) {
                        handleAddEspecialidade(especialidadesInput.trim());
                      }
                    }
                  }}
                />
                
                {/* Sugestões */}
                {especialidadesInput && especialidadesFiltradas.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {especialidadesFiltradas.map((esp) => (
                      <button
                        key={esp}
                        type="button"
                        onClick={() => handleAddEspecialidade(esp)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        {esp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Especialidades selecionadas */}
              <div className="flex flex-wrap gap-2">
                {especialidades.map((esp) => (
                  <Badge key={esp} variant="secondary" className="gap-1 pr-1">
                    {esp}
                    <button
                      type="button"
                      onClick={() => handleRemoveEspecialidade(esp)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {errors.especialidades && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.especialidades.message}
                </p>
              )}

              <p className="text-xs text-gray-500">
                {t('components.professorForm.specialtiesHint')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 4: FOTO (OPCIONAL) */}
      <Card>
        <CardHeader>
          <CardTitle>{t('components.professorForm.photo')}</CardTitle>
          <CardDescription>{t('components.professorForm.photoDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="foto_url">{t('components.professorForm.photoUrl')}</Label>
            <Input
              id="foto_url"
              {...register('foto_url')}
              placeholder={t('components.professorForm.photoUrlPlaceholder')}
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
          {t('components.professorForm.saveTeacher')}
        </LoadingButton>
      </div>
    </form>
  );
};
