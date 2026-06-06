// ============================================
// OBSERVACAO FORM - Formulário de observação
// ============================================

import { useForm } from 'react-hook-form@7.55.0';
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
import { Input } from '../ui/input';
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
            {observacao ? 'Editar Observação' : 'Nova Observação'}
          </DialogTitle>
          <DialogDescription>
            {observacao
              ? 'Atualize as informações da observação.'
              : 'Registre uma nova observação sobre o aluno.'}
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
                    <FormLabel>Aluno *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!alunoIdPredefinido}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o aluno" />
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
                    <FormLabel>Tipo de Observação *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pedagogica">Pedagógica</SelectItem>
                        <SelectItem value="comportamental">Comportamental</SelectItem>
                        <SelectItem value="administrativa">Administrativa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      {tipoSelecionado === 'pedagogica' && 'Relacionada ao desempenho acadêmico'}
                      {tipoSelecionado === 'comportamental' && 'Relacionada ao comportamento'}
                      {tipoSelecionado === 'administrativa' && 'Questões administrativas'}
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
                  <FormLabel>Disciplina (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'nenhuma'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nenhuma">Nenhuma disciplina específica</SelectItem>
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
                    Associe a observação a uma disciplina específica, se aplicável
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
                  <FormLabel>Observação *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a observação..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Mínimo 10 caracteres, máximo 1000 caracteres ({field.value?.length || 0}/1000)
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
                    <FormLabel className="text-base">Visível para o aluno</FormLabel>
                    <FormDescription>
                      Permitir que o aluno visualize esta observação
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
                Cancelar
              </Button>
              <LoadingButton 
                type="submit"
                isLoading={form.formState.isSubmitting}
                loadingText="Salvando..."
              >
                {observacao ? 'Salvar Alterações' : 'Criar Observação'}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
