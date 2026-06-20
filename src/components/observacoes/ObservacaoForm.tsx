// ============================================
// OBSERVACAO FORM - Formulário de observação
// ============================================

import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { observacaoSchema, type ObservacaoFormData } from '../../schemas/observacaoSchemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import type { Observacao, Aluno, Disciplina } from '../../types';
import { LoadingButton } from '../shared/LoadingButton';

interface ObservacaoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ObservacaoFormData) => void;
  observacao?: Observacao;
  alunos: Aluno[];
  disciplinas: Disciplina[];
  professorId: string;
  alunoIdPredefinido?: string;
}

export function ObservacaoForm({
  open,
  onOpenChange,
  onSubmit,
  observacao,
  alunos,
  disciplinas,
  professorId,
  alunoIdPredefinido
}: ObservacaoFormProps) {
  const { t } = useTranslation();
  const form = useForm<ObservacaoFormData>({
    resolver: zodResolver(observacaoSchema),
    defaultValues: observacao
      ? {
          aluno_id: observacao.aluno_id,
          professor_id: observacao.professor_id,
          disciplina_id: observacao.disciplina_id || undefined,
          tipo: observacao.tipo,
          conteudo: observacao.conteudo,
          visivel_aluno: observacao.visivel_aluno
        }
      : {
          aluno_id: alunoIdPredefinido || '',
          professor_id: professorId,
          disciplina_id: undefined,
          tipo: 'pedagogica',
          conteudo: '',
          visivel_aluno: true
        }
  });

  const handleSubmit = (data: ObservacaoFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const tipoSelecionado = form.watch('tipo');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {observacao ? t('components.observacoes.form.editTitle') : t('components.observacoes.form.newTitle')}
          </DialogTitle>
          <DialogDescription>
            {observacao
              ? t('components.observacoes.form.editDescription')
              : t('components.observacoes.form.newDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aluno */}
              <FormField
                control={form.control}
                name="aluno_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('components.observacoes.form.student')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!alunoIdPredefinido}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('components.observacoes.form.selectStudent')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {alunos
                          .filter(aluno => aluno?.id && aluno.id.trim() !== '')
                          .map((aluno) => (
                            <SelectItem key={aluno.id} value={aluno.id}>
                              {aluno.nome_completo}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo */}
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('components.observacoes.form.type')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('components.observacoes.form.selectType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pedagogica">{t('components.observacoes.type.pedagogica')}</SelectItem>
                        <SelectItem value="comportamental">{t('components.observacoes.type.comportamental')}</SelectItem>
                        <SelectItem value="administrativa">{t('components.observacoes.type.administrativa')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      {tipoSelecionado === 'pedagogica' && t('components.observacoes.form.typeHintPedagogica')}
                      {tipoSelecionado === 'comportamental' && t('components.observacoes.form.typeHintComportamental')}
                      {tipoSelecionado === 'administrativa' && t('components.observacoes.form.typeHintAdministrativa')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Disciplina */}
            <FormField
              control={form.control}
              name="disciplina_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('components.observacoes.form.subject')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'nenhuma'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('components.observacoes.form.selectSubject')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nenhuma">{t('components.observacoes.form.noSpecificSubject')}</SelectItem>
                      {disciplinas
                        .filter(disciplina => disciplina?.id && disciplina.id.trim() !== '')
                        .map((disciplina) => (
                          <SelectItem key={disciplina.id} value={disciplina.id}>
                            {disciplina.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    {t('components.observacoes.form.subjectHint')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conteúdo */}
            <FormField
              control={form.control}
              name="conteudo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('components.observacoes.form.content')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('components.observacoes.form.contentPlaceholder')}
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {t('components.observacoes.form.contentHint', { count: field.value?.length || 0 })}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibilidade */}
            <FormField
              control={form.control}
              name="visivel_aluno"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t('components.observacoes.form.visibleToStudent')}</FormLabel>
                    <FormDescription>
                      {t('components.observacoes.form.visibleToStudentHint')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('common.actions.cancel')}
              </Button>
              <LoadingButton
                type="submit"
                isLoading={form.formState.isSubmitting}
                loadingText={t('components.observacoes.form.saving')}
              >
                {observacao ? t('components.observacoes.form.saveChanges') : t('components.observacoes.form.createObservation')}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
