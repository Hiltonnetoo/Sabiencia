// ============================================
// LISTA PRESENÇA FORM - Registro de presença em lote
// ============================================

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { LoadingButton } from '../shared/LoadingButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { CalendarIcon, Check, X, FileQuestion, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { listaPresencaSchema, type ListaPresencaFormData } from '../../schemas/frequenciaSchemas';
import { useMockData } from '../../contexts/MockDataContext';
import type { Aluno, Matricula } from '../../types';

interface ListaPresencaFormProps {
  professorId: string;
  onSuccess?: () => void;
}

export const ListaPresencaForm: React.FC<ListaPresencaFormProps> = ({
  professorId,
  onSuccess,
}) => {
  const { turmas, disciplinas, alunos, matriculas } = useMockData();
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [presencas, setPresencas] = useState<Map<string, { status: 'presente' | 'ausente' | 'justificado', observacao?: string }>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar alunos da turma selecionada
  const alunosDaTurma: Aluno[] = selectedTurma
    ? alunos.filter(aluno => {
        const matricula = matriculas.find(m => m.aluno_id === aluno.id && m.turma_id === selectedTurma);
        return matricula && matricula.status === 'ativo';
      })
    : [];

  // Handlers
  const handleToggleStatus = (alunoId: string) => {
    const presenca = presencas.get(alunoId);
    const newMap = new Map(presencas);

    if (!presenca) {
      newMap.set(alunoId, { status: 'presente' });
    } else {
      const nextStatus =
        presenca.status === 'presente'
          ? 'ausente'
          : presenca.status === 'ausente'
          ? 'justificado'
          : 'presente';
      newMap.set(alunoId, { status: nextStatus, observacao: presenca.observacao });
    }

    setPresencas(newMap);
  };

  const handleObservacao = (alunoId: string, observacao: string) => {
    const presenca = presencas.get(alunoId);
    const newMap = new Map(presencas);
    newMap.set(alunoId, {
      status: presenca?.status || 'presente',
      observacao: observacao || undefined,
    });
    setPresencas(newMap);
  };

  const handleMarcarTodos = (status: 'presente' | 'ausente') => {
    const newMap = new Map<string, { status: 'presente' | 'ausente' | 'justificado' }>();
    alunosDaTurma.forEach(aluno => {
      newMap.set(aluno.id, { status });
    });
    setPresencas(newMap);
  };

  const handleSubmit = async () => {
    if (!selectedTurma || !selectedDisciplina || !selectedDate) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Aqui você chamaria a função do contexto para salvar as presenças
      // createFrequenciasEmLote({ ... })

      if (import.meta.env.DEV) {
        console.debug('[ListaPresenca] Frequências salvas:', {
          turma_id: selectedTurma,
          disciplina_id: selectedDisciplina,
        data_aula: selectedDate,
        presencas: Array.from(presencas.entries()).map(([alunoId, dados]) => ({
          aluno_id: alunoId,
          ...dados,
        })),
        });
      }

      // Reset
      setPresencas(new Map());
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar frequências:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: 'presente' | 'ausente' | 'justificado') => {
    switch (status) {
      case 'presente':
        return 'bg-green-500 hover:bg-green-600';
      case 'ausente':
        return 'bg-red-500 hover:bg-red-600';
      case 'justificado':
        return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  const getStatusIcon = (status: 'presente' | 'ausente' | 'justificado') => {
    switch (status) {
      case 'presente':
        return <Check className="h-4 w-4" />;
      case 'ausente':
        return <X className="h-4 w-4" />;
      case 'justificado':
        return <FileQuestion className="h-4 w-4" />;
    }
  };

  const canSubmit =
    selectedTurma &&
    selectedDisciplina &&
    selectedDate &&
    presencas.size > 0;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Configurar Aula</CardTitle>
          <CardDescription>Selecione a turma, disciplina e data da aula</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {/* Turma */}
          <div className="space-y-2">
            <Label>Turma</Label>
            <Select value={selectedTurma} onValueChange={setSelectedTurma}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas
                  .filter(turma => turma?.id && turma.id.trim() !== '')
                  .map(turma => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Disciplina */}
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {disciplinas
                  .filter(disc => disc?.id && disc.id.trim() !== '')
                  .map(disc => (
                    <SelectItem key={disc.id} value={disc.id}>
                      {disc.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label>Data da Aula</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ptBR }) : 'Selecione a data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date > new Date() || date < new Date('2024-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos */}
      {alunosDaTurma.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Presença</CardTitle>
                <CardDescription>{alunosDaTurma.length} alunos na turma</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarcarTodos('presente')}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Todos presentes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarcarTodos('ausente')}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Todos ausentes
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosDaTurma.map(aluno => {
                  const presenca = presencas.get(aluno.id);
                  const status = presenca?.status || 'presente';

                  return (
                    <TableRow key={aluno.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{aluno.nome_completo}</p>
                          <p className="text-sm text-gray-500">{aluno.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => handleToggleStatus(aluno.id)}
                          className={`gap-2 ${getStatusColor(status)} text-white`}
                          size="sm"
                        >
                          {getStatusIcon(status)}
                          {status === 'presente' ? 'Presente' : status === 'ausente' ? 'Ausente' : 'Justificado'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Textarea
                          placeholder="Observação (opcional)"
                          value={presenca?.observacao || ''}
                          onChange={(e) => handleObservacao(aluno.id, e.target.value)}
                          className="min-h-[60px]"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Resumo */}
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="flex gap-4">
                <Badge variant="outline" className="gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  Presentes: {Array.from(presencas.values()).filter(p => p.status === 'presente').length}
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <X className="h-3 w-3 text-red-600" />
                  Ausentes: {Array.from(presencas.values()).filter(p => p.status === 'ausente').length}
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <FileQuestion className="h-3 w-3 text-yellow-600" />
                  Justificados: {Array.from(presencas.values()).filter(p => p.status === 'justificado').length}
                </Badge>
              </div>

              <LoadingButton
                onClick={handleSubmit}
                disabled={!canSubmit}
                isLoading={isSubmitting}
                loadingText="Salvando..."
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Frequência
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTurma && alunosDaTurma.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">Nenhum aluno ativo encontrado nesta turma</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
