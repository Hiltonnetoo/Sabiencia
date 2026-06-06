// ============================================
// COMPONENTE: FORMULÁRIO DE COMUNICADO
// ============================================

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { Send, Users, AlertCircle } from 'lucide-react';
import { comunicadoSchema, type ComunicadoFormData, calcularDestinatarios } from '../../schemas/comunicadoSchemas';
import { useMockData } from '../../contexts/MockDataContext';
import type { Role } from '../../types';
import { LoadingButton } from '../shared/LoadingButton';

interface ComunicadoFormProps {
  onSubmit: (data: ComunicadoFormData) => void;
  onCancel?: () => void;
  userRole: Role;
  userId: string;
}

export function ComunicadoForm({ onSubmit, onCancel, userRole, userId }: ComunicadoFormProps) {
  const { turmas, alunos, professores } = useMockData();
  const [selectedDestinatarios, setSelectedDestinatarios] = useState<string>('todos_alunos');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ComunicadoFormData>({
    resolver: zodResolver(comunicadoSchema),
    defaultValues: {
      destinatarios: 'todos_alunos',
      prioridade: 'normal',
      permitir_resposta: false
    }
  });

  // Watch dos campos
  const titulo = watch('titulo');
  const mensagem = watch('mensagem');
  const destinatarios = watch('destinatarios');
  const turmaId = watch('turma_id');
  const alunoId = watch('aluno_id');
  const prioridade = watch('prioridade');

  // Filtrar turmas do professor
  const turmasProfessor = useMemo(() => {
    if (userRole !== 'professor') return turmas;
    
    // Aqui você pode filtrar as turmas que o professor leciona
    // Por simplicidade, vamos retornar todas
    return turmas;
  }, [userRole, turmas]);

  // Calcular total de destinatários
  const totalDestinatarios = useMemo(() => {
    return calcularDestinatarios(
      destinatarios,
      turmaId,
      alunos,
      professores
    );
  }, [destinatarios, turmaId, alunos, professores]);

  // Opções de destinatários baseadas no role
  const destinatariosOptions = useMemo(() => {
    const options = [
      { value: 'todos_alunos', label: 'Todos os Alunos', disabled: false }
    ];

    if (userRole === 'gestor') {
      options.push(
        { value: 'todos_professores', label: 'Todos os Professores', disabled: false },
        { value: 'turma_especifica', label: 'Turma Específica', disabled: false },
        { value: 'individual', label: 'Aluno Específico', disabled: false }
      );
    } else if (userRole === 'professor') {
      options.push(
        { value: 'turma_especifica', label: 'Minha Turma', disabled: false }
      );
    }

    return options;
  }, [userRole]);

  const handleFormSubmit = (data: ComunicadoFormData) => {
    // Validação extra
    if (data.destinatarios === 'turma_especifica' && !data.turma_id) {
      alert('Selecione uma turma');
      return;
    }
    
    if (data.destinatarios === 'individual' && !data.aluno_id) {
      alert('Selecione um aluno');
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Novo Comunicado
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">
              Título *
            </Label>
            <Input
              id="titulo"
              {...register('titulo')}
              placeholder="Ex: Calendário de Provas"
              maxLength={100}
            />
            {errors.titulo && (
              <p className="text-sm text-red-600">{errors.titulo.message}</p>
            )}
            <p className="text-xs text-gray-500">
              {titulo?.length || 0}/100 caracteres
            </p>
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <Label htmlFor="mensagem">
              Mensagem *
            </Label>
            <Textarea
              id="mensagem"
              {...register('mensagem')}
              placeholder="Digite sua mensagem aqui..."
              rows={6}
              maxLength={2000}
            />
            {errors.mensagem && (
              <p className="text-sm text-red-600">{errors.mensagem.message}</p>
            )}
            <p className="text-xs text-gray-500">
              {mensagem?.length || 0}/2000 caracteres
            </p>
          </div>

          {/* Destinatários e Prioridade em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Destinatários */}
            <div className="space-y-2">
              <Label htmlFor="destinatarios">
                Destinatários *
              </Label>
              <Select
                value={destinatarios}
                onValueChange={(value) => {
                  setValue('destinatarios', value as any);
                  setSelectedDestinatarios(value);
                  setValue('turma_id', undefined);
                  setValue('aluno_id', undefined);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {destinatariosOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.destinatarios && (
                <p className="text-sm text-red-600">{errors.destinatarios.message}</p>
              )}
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="prioridade">
                Prioridade
              </Label>
              <Select
                value={prioridade}
                onValueChange={(value) => setValue('prioridade', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Turma Específica */}
          {destinatarios === 'turma_especifica' && (
            <div className="space-y-2">
              <Label htmlFor="turma_id">
                Selecione a Turma *
              </Label>
              <Select
                value={turmaId}
                onValueChange={(value) => setValue('turma_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmasProfessor
                    .filter(turma => turma?.id && turma.id.trim() !== '')
                    .map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Aluno Individual */}
          {destinatarios === 'individual' && (
            <div className="space-y-2">
              <Label htmlFor="aluno_id">
                Selecione o Aluno *
              </Label>
              <Select
                value={alunoId}
                onValueChange={(value) => setValue('aluno_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um aluno" />
                </SelectTrigger>
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
            </div>
          )}

          {/* Permitir Resposta */}
          <div className="flex items-center space-x-2">
            <Switch
              id="permitir_resposta"
              checked={watch('permitir_resposta')}
              onCheckedChange={(checked) => setValue('permitir_resposta', checked)}
            />
            <Label htmlFor="permitir_resposta" className="cursor-pointer">
              Permitir que destinatários respondam
            </Label>
          </div>

          {/* Resumo de destinatários */}
          {totalDestinatarios > 0 && (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                Este comunicado será enviado para <strong>{totalDestinatarios}</strong> {totalDestinatarios === 1 ? 'pessoa' : 'pessoas'}.
              </AlertDescription>
            </Alert>
          )}

          {/* Alerta de prioridade urgente */}
          {prioridade === 'urgente' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Comunicados <strong>urgentes</strong> aparecerão em destaque para os destinatários.
              </AlertDescription>
            </Alert>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <LoadingButton
              type="submit"
              disabled={totalDestinatarios === 0}
              isLoading={isSubmitting}
              loadingText="Enviando..."
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Comunicado
            </LoadingButton>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
