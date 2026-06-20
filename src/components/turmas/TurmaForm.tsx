import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { turmaSchema, type TurmaFormData } from '../../schemas/turmaSchemas';
import { Turma, Curso } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { LoadingButton } from '../shared/LoadingButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Switch } from '../ui/switch';

interface TurmaFormProps {
  turma?: Turma;
  cursos: Curso[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TurmaFormData) => void;
}

export function TurmaForm({ turma, cursos, open, onClose, onSubmit }: TurmaFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TurmaFormData>({
    resolver: zodResolver(turmaSchema),
    defaultValues: turma ? {
      curso_id: turma.curso_id,
      nome: turma.nome,
      data_inicio: new Date(turma.data_inicio),
      data_fim: new Date(turma.data_fim),
      periodo: turma.periodo,
      ativa: turma.ativa,
    } : {
      ativa: true,
    },
  });

  const cursoId = watch('curso_id');
  const periodo = watch('periodo');
  const ativa = watch('ativa');

  const handleFormSubmit = (data: TurmaFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {turma ? t('components.turmas.form.editTitle') : t('components.turmas.form.newTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Nome */}
          <div>
            <Label htmlFor="nome">{t('components.turmas.form.nameLabel')}</Label>
            <Input
              id="nome"
              {...register('nome')}
              placeholder={t('components.turmas.form.namePlaceholder')}
              className="mt-1"
            />
            {errors.nome && (
              <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
            )}
          </div>

          {/* Curso */}
          <div>
            <Label htmlFor="curso_id">{t('components.turmas.form.courseLabel')}</Label>
            <Select
              value={cursoId}
              onValueChange={(value) => setValue('curso_id', value, { shouldValidate: true })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('components.turmas.form.coursePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {cursos
                  .filter(curso => curso?.id && curso.id.trim() !== '')
                  .map(curso => (
                    <SelectItem key={curso.id} value={curso.id}>
                      {curso.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.curso_id && (
              <p className="text-sm text-red-600 mt-1">{errors.curso_id.message}</p>
            )}
          </div>

          {/* Período */}
          <div>
            <Label htmlFor="periodo">{t('components.turmas.form.periodLabel')}</Label>
            <Select
              value={periodo}
              onValueChange={(value) => setValue('periodo', value as any, { shouldValidate: true })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('components.turmas.form.periodPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manha">{t('components.turmas.periodo.manha')}</SelectItem>
                <SelectItem value="tarde">{t('components.turmas.periodo.tarde')}</SelectItem>
                <SelectItem value="noite">{t('components.turmas.periodo.noite')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.periodo && (
              <p className="text-sm text-red-600 mt-1">{errors.periodo.message}</p>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_inicio">{t('components.turmas.form.startDateLabel')}</Label>
              <Input
                id="data_inicio"
                type="date"
                {...register('data_inicio', {
                  valueAsDate: true,
                })}
                className="mt-1"
              />
              {errors.data_inicio && (
                <p className="text-sm text-red-600 mt-1">{errors.data_inicio.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="data_fim">{t('components.turmas.form.endDateLabel')}</Label>
              <Input
                id="data_fim"
                type="date"
                {...register('data_fim', {
                  valueAsDate: true,
                })}
                className="mt-1"
              />
              {errors.data_fim && (
                <p className="text-sm text-red-600 mt-1">{errors.data_fim.message}</p>
              )}
            </div>
          </div>

          {/* Ativa */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="ativa" className="font-semibold">{t('components.turmas.form.activeLabel')}</Label>
              <p className="text-sm text-gray-600 mt-1">
                {t('components.turmas.form.activeHint')}
              </p>
            </div>
            <Switch
              id="ativa"
              checked={ativa}
              onCheckedChange={(checked) => setValue('ativa', checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.actions.cancel')}
            </Button>
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText={t('common.actions.saving')}
            >
              {turma ? t('components.turmas.form.submitEdit') : t('components.turmas.form.submitNew')}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
