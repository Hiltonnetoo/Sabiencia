// ============================================
// NOTAS AULA - Componente para anotações durante videoaulas
// ============================================

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Plus, Save, Trash2, Clock, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDuration } from '../../utils/youtube';
import type { AnotacaoAula } from '../../types/videoaulas';
import { DeleteConfirmDialog } from '../shared/DeleteConfirmDialog';

interface NotasAulaProps {
  videoaulaId: string;
  alunoId: string;
  anotacoes: AnotacaoAula[];
  onSalvarAnotacao: (anotacao: Omit<AnotacaoAula, 'id' | 'criado_em' | 'atualizado_em'>) => void;
  onDeletarAnotacao: (anotacaoId: string) => void;
  onEditarAnotacao: (anotacaoId: string, conteudo: string) => void;
  currentTime?: number; // Tempo atual do vídeo
  className?: string;
}

export const NotasAula: React.FC<NotasAulaProps> = ({
  videoaulaId,
  alunoId,
  anotacoes,
  onSalvarAnotacao,
  onDeletarAnotacao,
  onEditarAnotacao,
  currentTime,
  className = ''
}) => {
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [conteudoEditado, setConteudoEditado] = useState('');
  const [incluirTimestamp, setIncluirTimestamp] = useState(true);
  const [anotacaoToDelete, setAnotacaoToDelete] = useState<string | null>(null);

  const handleSalvar = () => {
    if (!novaAnotacao.trim()) {
      toast.error('Digite uma anotação antes de salvar');
      return;
    }

    const anotacao: Omit<AnotacaoAula, 'id' | 'criado_em' | 'atualizado_em'> = {
      aluno_id: alunoId,
      videoaula_id: videoaulaId,
      conteudo: novaAnotacao.trim(),
      tempo_video_segundos: incluirTimestamp && currentTime ? Math.floor(currentTime) : undefined
    };

    onSalvarAnotacao(anotacao);
    setNovaAnotacao('');
    toast.success('Anotação salva com sucesso!');
  };

  const handleIniciarEdicao = (anotacao: AnotacaoAula) => {
    setEditandoId(anotacao.id);
    setConteudoEditado(anotacao.conteudo);
  };

  const handleSalvarEdicao = () => {
    if (!conteudoEditado.trim() || !editandoId) return;

    onEditarAnotacao(editandoId, conteudoEditado.trim());
    setEditandoId(null);
    setConteudoEditado('');
    toast.success('Anotação atualizada!');
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setConteudoEditado('');
  };

  const handleDeletar = (anotacaoId: string) => {
    setAnotacaoToDelete(anotacaoId);
  };

  const handleConfirmDeletar = () => {
    if (anotacaoToDelete) {
      onDeletarAnotacao(anotacaoToDelete);
      toast.success('Anotação excluída!');
      setAnotacaoToDelete(null);
    }
  };

  // Ordenar anotações por data (mais recentes primeiro)
  const anotacoesOrdenadas = [...anotacoes].sort((a, b) => 
    new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Minhas Anotações</CardTitle>
        <CardDescription>
          Faça anotações durante a aula para revisar depois
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Formulário de Nova Anotação */}
        <div className="space-y-3">
          <Textarea
            placeholder="Digite sua anotação aqui..."
            value={novaAnotacao}
            onChange={(e) => setNovaAnotacao(e.target.value)}
            rows={3}
            className="resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="incluirTimestamp"
                checked={incluirTimestamp}
                onCheckedChange={(checked) => setIncluirTimestamp(!!checked)}
              />
              <label
                htmlFor="incluirTimestamp"
                className="text-sm text-gray-600 cursor-pointer select-none flex items-center gap-2"
              >
                <span>Incluir momento do vídeo</span>
                {incluirTimestamp && currentTime !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    {formatDuration(currentTime)}
                  </Badge>
                )}
              </label>
            </div>

            <Button onClick={handleSalvar} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Anotação
            </Button>
          </div>
        </div>

        {/* Lista de Anotações */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {anotacoesOrdenadas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma anotação ainda</p>
              <p className="text-xs mt-1">
                Adicione anotações para revisar depois
              </p>
            </div>
          ) : (
            anotacoesOrdenadas.map((anotacao) => (
              <div
                key={anotacao.id}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {editandoId === anotacao.id ? (
                  // Modo Edição
                  <div className="space-y-2">
                    <Textarea
                      value={conteudoEditado}
                      onChange={(e) => setConteudoEditado(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSalvarEdicao} className="gap-1">
                        <Save className="w-3 h-3" />
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelarEdicao}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modo Visualização
                  <>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {anotacao.tempo_video_segundos !== undefined && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(anotacao.tempo_video_segundos)}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(anotacao.criado_em).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleIniciarEdicao(anotacao)}
                          className="h-11 w-11 p-0"
                          aria-label="Editar anotação"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletar(anotacao.id)}
                          className="h-11 w-11 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          aria-label="Excluir anotação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {anotacao.conteudo}
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contador */}
        {anotacoesOrdenadas.length > 0 && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            {anotacoesOrdenadas.length} anotaç{anotacoesOrdenadas.length === 1 ? 'ão' : 'ões'}
          </div>
        )}

        {/* Dialog de Confirmação de Exclusão */}
        <DeleteConfirmDialog
          open={!!anotacaoToDelete}
          onOpenChange={(open) => !open && setAnotacaoToDelete(null)}
          onConfirm={handleConfirmDeletar}
          title="Excluir Anotação"
          description="Tem certeza de que deseja excluir esta anotação? Esta ação não pode ser desfeita."
        />
      </CardContent>
    </Card>
  );
};
