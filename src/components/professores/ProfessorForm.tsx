// ============================================
// PROFESSOR FORM - Formulário de criação/edição de professor
// ============================================

import React, { useState } from 'react';
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
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>Informações básicas do professor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Nome Completo */}
            <div className="md:col-span-2">
              <Label htmlFor="nome_completo">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome_completo"
                {...register('nome_completo')}
                placeholder="Nome completo do professor"
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
                CPF <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cpf"
                {...register('cpf')}
                placeholder="000.000.000-00"
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
              <Label htmlFor="registro_profissional">Registro Profissional</Label>
              <Input
                id="registro_profissional"
                {...register('registro_profissional')}
                placeholder="Ex: COREN, CRA, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: CONTATO */}
      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
          <CardDescription>Informações de contato do professor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email@exemplo.com"
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
                Telefone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder="(00) 00000-0000"
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
          <CardTitle>Formação e Especialidades</CardTitle>
          <CardDescription>Qualificações profissionais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formação */}
          <div>
            <Label htmlFor="formacao">
              Formação <span className="text-red-500">*</span>
            </Label>
            <Input
              id="formacao"
              {...register('formacao')}
              placeholder="Ex: Graduação em Enfermagem, Mestrado em..."
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
              Especialidades <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              {/* Input com sugestões */}
              <div className="relative">
                <Input
                  id="especialidades_input"
                  value={especialidadesInput}
                  onChange={(e) => setEspecialidadesInput(e.target.value)}
                  placeholder="Digite para buscar ou adicionar especialidade..."
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
                Digite e pressione Enter ou clique em uma sugestão para adicionar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 4: FOTO (OPCIONAL) */}
      <Card>
        <CardHeader>
          <CardTitle>Foto do Professor</CardTitle>
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
          Salvar Professor
        </LoadingButton>
      </div>
    </form>
  );
};
