// ============================================
// LANÇAMENTO NOTAS FORM - Lançamento de notas em lote
// ============================================

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
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
import { CalendarIcon, Save, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TIPOS_AVALIACAO, formatarNota, notaPorExtenso } from '../../schemas/notaSchemas';
import { useMockData } from '../../contexts/MockDataContext';
import type { Aluno } from '../../types';

interface LancamentoNotasFormProps {
  professorId: string;
  onSuccess?: () => void;
}

export const LancamentoNotasForm: React.FC<LancamentoNotasFormProps> = ({
  professorId,
  onSuccess,
}) => {
  const { turmas, disciplinas, alunos, matriculas, notas: notasExistentes } = useMockData();
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>('');
  const [tipoAvaliacao, setTipoAvaliacao] = useState<string>('');
  const [peso, setPeso] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [notasAlunos, setNotasAlunos] = useState<Map<string, { nota: number | null, observacao?: string }>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar alunos da turma selecionada
  const alunosDaTurma: Aluno[] = selectedTurma
    ? alunos.filter(aluno => {
        const matricula = matriculas.find(m => m.aluno_id === aluno.id && m.turma_id === selectedTurma);
        return matricula && matricula.status === 'ativo';
      })
    : [];

  // Handlers
  const handleNotaChange = (alunoId: string, nota: string) => {
    const newMap = new Map(notasAlunos);
    const notaNum = parseFloat(nota);
    
    if (isNaN(notaNum) || nota === '') {
      newMap.set(alunoId, { nota: null, observacao: notasAlunos.get(alunoId)?.observacao });
    } else if (notaNum >= 0 && notaNum <= 10) {
      newMap.set(alunoId, { nota: notaNum, observacao: notasAlunos.get(alunoId)?.observacao });
    }
    
    setNotasAlunos(newMap);
  };

  const handleObservacaoChange = (alunoId: string, observacao: string) => {
    const newMap = new Map(notasAlunos);
    const notaAtual = notasAlunos.get(alunoId);
    newMap.set(alunoId, {
      nota: notaAtual?.nota ?? null,
      observacao: observacao || undefined,
    });
    setNotasAlunos(newMap);
  };

  const handleSubmit = async () => {
    if (!selectedTurma || !selectedDisciplina || !tipoAvaliacao || !selectedDate || !peso) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (import.meta.env.DEV) {
        console.debug('[LancamentoNotas] Notas salvas:', {
          turma_id: selectedTurma,
          disciplina_id: selectedDisciplina,
          tipo_avaliacao: tipoAvaliacao,
          peso: parseFloat(peso),
          data_avaliacao: selectedDate,
          notas: Array.from(notasAlunos.entries())
            .filter(([_, dados]) => dados.nota !== null)
            .map(([alunoId, dados]) => ({
              aluno_id: alunoId,
              ...dados,
            })),
        });
      }

      // Reset
      setNotasAlunos(new Map());
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obter nota anterior do aluno na mesma disciplina
  const getNotaAnterior = (alunoId: string): number | null => {
    if (!selectedDisciplina) return null;
    
    const notasAluno = notasExistentes.filter(
      n => n.aluno_id === alunoId && n.disciplina_id === selectedDisciplina
    );
    
    if (notasAluno.length === 0) return null;
    
    // Retornar última nota lançada
    return notasAluno.sort((a, b) => new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime())[0].nota;
  };

  // Comparar nota atual com anterior
  const getTendencia = (alunoId: string): 'up' | 'down' | 'neutral' | null => {
    const notaAtual = notasAlunos.get(alunoId)?.nota;
    const notaAnterior = getNotaAnterior(alunoId);
    
    if (notaAtual === null || notaAtual === undefined || notaAnterior === null) return null;
    
    if (notaAtual > notaAnterior) return 'up';
    if (notaAtual < notaAnterior) return 'down';
    return 'neutral';
  };

  // Validar se pode salvar
  const canSave = selectedTurma && selectedDisciplina && tipoAvaliacao && selectedDate && peso && 
    Array.from(notasAlunos.values()).some(n => n.nota !== null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lançamento de Notas</CardTitle>
        <CardDescription>
          Lance notas para os alunos de forma rápida e eficiente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="turma">Turma *</Label>
            <Select value={selectedTurma} onValueChange={setSelectedTurma}>
              <SelectTrigger id="turma">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disciplina">Disciplina *</Label>
            <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
              <SelectTrigger id="disciplina">
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {disciplinas
                  .filter(d => !selectedTurma || d.curso_id === turmas.find(t => t.id === selectedTurma)?.curso_id)
                  .map((disciplina) => (
                    <SelectItem key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Avaliação *</Label>
            <Select value={tipoAvaliacao} onValueChange={setTipoAvaliacao}>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_AVALIACAO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data da Avaliação *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="data"
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ptBR }) : 'Selecione a data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="peso">Peso da Avaliação *</Label>
          <Input
            id="peso"
            type="number"
            min="0.5"
            max="10"
            step="0.5"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Ex: 1, 2, 3..."
          />
        </div>

        {/* Tabela de alunos */}
        {selectedTurma && selectedDisciplina && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead className="w-32">Nota (0-10)</TableHead>
                  <TableHead className="w-24">Tendência</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosDaTurma.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Nenhum aluno encontrado nesta turma
                    </TableCell>
                  </TableRow>
                ) : (
                  alunosDaTurma.map((aluno) => {
                    const notaAtual = notasAlunos.get(aluno.id)?.nota;
                    const notaAnterior = getNotaAnterior(aluno.id);
                    const tendencia = getTendencia(aluno.id);
                    
                    return (
                      <TableRow key={aluno.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{aluno.nome_completo}</div>
                            {notaAnterior !== null && (
                              <div className="text-xs text-gray-500">
                                Última nota: {formatarNota(notaAnterior)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {matriculas.find(m => m.aluno_id === aluno.id)?.numero_matricula || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={notaAtual ?? ''}
                            onChange={(e) => handleNotaChange(aluno.id, e.target.value)}
                            placeholder="0.0"
                            className="w-20"
                          />
                          {notaAtual !== null && notaAtual !== undefined && (
                            <div className="text-xs text-gray-500 mt-1">
                              {notaPorExtenso(notaAtual)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {tendencia === 'up' && (
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-xs">Melhorou</span>
                            </div>
                          )}
                          {tendencia === 'down' && (
                            <div className="flex items-center gap-1 text-red-600">
                              <TrendingDown className="h-4 w-4" />
                              <span className="text-xs">Piorou</span>
                            </div>
                          )}
                          {tendencia === 'neutral' && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Minus className="h-4 w-4" />
                              <span className="text-xs">Igual</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={notasAlunos.get(aluno.id)?.observacao || ''}
                            onChange={(e) => handleObservacaoChange(aluno.id, e.target.value)}
                            placeholder="Observações (opcional)"
                            className="min-h-[60px]"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setNotasAlunos(new Map());
              setSelectedTurma('');
              setSelectedDisciplina('');
              setTipoAvaliacao('');
              setPeso('1');
              setSelectedDate(undefined);
            }}
          >
            Limpar
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!canSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Notas
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
};
