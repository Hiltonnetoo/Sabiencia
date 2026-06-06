// ============================================
// CURSO FORM - Formulário de curso
// ============================================

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cursoSchema, type CursoFormData } from '../../schemas/cursoSchemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { LoadingButton } from '../shared/LoadingButton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, BookOpen, Clock, Calendar } from 'lucide-react';
import type { Curso } from '../../types';

interface CursoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CursoFormData) => void;
  curso?: Curso;
  isLoading?: boolean;
}

export const CursoForm: React.FC<CursoFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  curso,
  isLoading = false,
}) => {
  const [showErrors, setShowErrors] = useState(false);
  const isEditing = !!curso;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<CursoFormData>({
    resolver: zodResolver(cursoSchema),
    defaultValues: curso ? {
      nome: curso.nome,
      descricao: curso.descricao,
      carga_horaria: curso.carga_horaria,
      duracao_meses: curso.duracao_meses,
      ativo: curso.ativo,
    } : {
      nome: '',
      descricao: '',
      carga_horaria: 0,
      duracao_meses: 0,
      ativo: true,
    },
  });

  const ativoValue = watch('ativo');

  useEffect(() => {
    if (isOpen) {
      setShowErrors(false);
      if (curso) {
        reset({
          nome: curso.nome,
          descricao: curso.descricao,
          carga_horaria: curso.carga_horaria,
          duracao_meses: curso.duracao_meses,
          ativo: curso.ativo,
        });
      } else {
        reset({
          nome: '',
          descricao: '',
          carga_horaria: 0,
          duracao_meses: 0,
          ativo: true,
        });
      }
    }
  }, [isOpen, curso, reset]);

  const handleFormSubmit = (data: CursoFormData) => {
    setShowErrors(false);
    onSubmit(data);
  };

  const handleFormError = () => {
    setShowErrors(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Curso' : 'Novo Curso'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do curso'
              : 'Preencha os dados para criar um novo curso'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-6">
          {/* Mostrar erros gerais */}
          {showErrors && Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Por favor, corrija os erros no formulário antes de continuar.
              </AlertDescription>
            </Alert>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="required">
              Nome do Curso
            </Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="nome"
                {...register('nome')}
                placeholder="Ex: Técnico em Enfermagem"
                className="pl-10"
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? 'nome-error' : undefined}
              />
            </div>
            {errors.nome && (
              <p id="nome-error" className="text-sm text-red-600">
                {errors.nome.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="required">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Descreva o curso, objetivos, competências desenvolvidas..."
              rows={4}
              aria-invalid={!!errors.descricao}
              aria-describedby={errors.descricao ? 'descricao-error' : undefined}
            />
            {errors.descricao && (
              <p id="descricao-error" className="text-sm text-red-600">
                {errors.descricao.message}
              </p>
            )}
          </div>

          {/* Carga Horária e Duração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carga Horária */}
            <div className="space-y-2">
              <Label htmlFor="carga_horaria" className="required">
                Carga Horária (horas)
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="carga_horaria"
                  type="number"
                  min="0"
                  step="1"
                  {...register('carga_horaria', { valueAsNumber: true })}
                  placeholder="Ex: 1200"
                  className="pl-10"
                  aria-invalid={!!errors.carga_horaria}
                  aria-describedby={errors.carga_horaria ? 'carga-error' : undefined}
                />
              </div>
              {errors.carga_horaria && (
                <p id="carga-error" className="text-sm text-red-600">
                  {errors.carga_horaria.message}
                </p>
              )}
            </div>

            {/* Duração */}
            <div className="space-y-2">
              <Label htmlFor="duracao_meses" className="required">
                Duração (meses)
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="duracao_meses"
                  type="number"
                  min="0"
                  step="1"
                  {...register('duracao_meses', { valueAsNumber: true })}
                  placeholder="Ex: 18"
                  className="pl-10"
                  aria-invalid={!!errors.duracao_meses}
                  aria-describedby={errors.duracao_meses ? 'duracao-error' : undefined}
                />
              </div>
              {errors.duracao_meses && (
                <p id="duracao-error" className="text-sm text-red-600">
                  {errors.duracao_meses.message}
                </p>
              )}
            </div>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="ativo" className="text-base">
                Curso Ativo
              </Label>
              <p className="text-sm text-gray-500">
                {ativoValue 
                  ? 'Este curso está ativo e pode receber novas turmas'
                  : 'Este curso está inativo e não pode receber novas turmas'}
              </p>
            </div>
            <Switch
              id="ativo"
              checked={ativoValue}
              onCheckedChange={(checked) => setValue('ativo', checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || (!isDirty && isEditing)}
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Curso'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
