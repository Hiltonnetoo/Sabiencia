import React from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { disciplinaSchema, type DisciplinaFormData } from '../../schemas/disciplinaSchemas';
import { Disciplina, Curso } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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

interface DisciplinaFormProps {
  disciplina?: Disciplina;
  cursos: Curso[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DisciplinaFormData) => void;
}

export function DisciplinaForm({ disciplina, cursos, open, onClose, onSubmit }: DisciplinaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<DisciplinaFormData>({
    resolver: zodResolver(disciplinaSchema),
    defaultValues: disciplina ? {
      curso_id: disciplina.curso_id,
      nome: disciplina.nome,
      descricao: disciplina.descricao,
      carga_horaria: disciplina.carga_horaria,
      ordem: disciplina.ordem,
      ementa: disciplina.ementa,
    } : {
      ordem: 1,
      carga_horaria: 60,
    },
  });

  const cursoId = watch('curso_id');

  const handleFormSubmit = (data: DisciplinaFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {disciplina ? 'Editar Disciplina' : 'Nova Disciplina'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Nome */}
          <div>
            <Label htmlFor="nome">Nome da Disciplina *</Label>
            <Input
              id="nome"
              {...register('nome')}
              placeholder="Ex: Anatomia Humana"
              className="mt-1"
            />
            {errors.nome && (
              <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
            )}
          </div>

          {/* Curso */}
          <div>
            <Label htmlFor="curso_id">Curso *</Label>
            <Select 
              value={cursoId} 
              onValueChange={(value) => setValue('curso_id', value, { shouldValidate: true })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione um curso..." />
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

          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              {...register('descricao')}
              placeholder="Breve descrição da disciplina..."
              rows={3}
              className="mt-1"
            />
            {errors.descricao && (
              <p className="text-sm text-red-600 mt-1">{errors.descricao.message}</p>
            )}
          </div>

          {/* Carga Horária e Ordem */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="carga_horaria">Carga Horária (horas) *</Label>
              <Input
                id="carga_horaria"
                type="number"
                {...register('carga_horaria', {
                  valueAsNumber: true,
                })}
                min={20}
                max={500}
                className="mt-1"
              />
              {errors.carga_horaria && (
                <p className="text-sm text-red-600 mt-1">{errors.carga_horaria.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="ordem">Ordem na Grade *</Label>
              <Input
                id="ordem"
                type="number"
                {...register('ordem', {
                  valueAsNumber: true,
                })}
                min={1}
                max={50}
                className="mt-1"
              />
              {errors.ordem && (
                <p className="text-sm text-red-600 mt-1">{errors.ordem.message}</p>
              )}
            </div>
          </div>

          {/* Ementa */}
          <div>
            <Label htmlFor="ementa">Ementa</Label>
            <Textarea
              id="ementa"
              {...register('ementa')}
              placeholder="Conteúdo programático da disciplina..."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Opcional. Descreva os principais tópicos abordados na disciplina.
            </p>
            {errors.ementa && (
              <p className="text-sm text-red-600 mt-1">{errors.ementa.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <LoadingButton 
              type="submit" 
              isLoading={isSubmitting}
              loadingText="Salvando..."
            >
              {disciplina ? 'Salvar Alterações' : 'Criar Disciplina'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
