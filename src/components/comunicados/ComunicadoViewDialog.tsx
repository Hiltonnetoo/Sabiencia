// ============================================
// COMPONENTE: DIALOG DE VISUALIZAÇÃO COMPLETA
// ============================================

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  Mail, 
  Users, 
  CheckCircle2,
  User,
  AlertCircle,
  AlertTriangle,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ComunicadoComDetalhes } from '../../types';
import { formatarDestinatarios, getPrioridadeColor } from '../../schemas/comunicadoSchemas';

interface ComunicadoViewDialogProps {
  comunicado: ComunicadoComDetalhes | null;
  open: boolean;
  onClose: () => void;
  onMarkAsRead?: (comunicadoId: string) => void;
  showReadStatus?: boolean;
  showStats?: boolean;
}

export function ComunicadoViewDialog({
  comunicado,
  open,
  onClose,
  onMarkAsRead,
  showReadStatus = false,
  showStats = false
}: ComunicadoViewDialogProps) {
  if (!comunicado) return null;

  const PrioridadeIcon = {
    baixa: MessageCircle,
    normal: Mail,
    alta: AlertCircle,
    urgente: AlertTriangle
  }[comunicado.prioridade] || Mail;

  const isLido = comunicado.lido;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3">
            <PrioridadeIcon className={`h-6 w-6 mt-1 flex-shrink-0 ${
              comunicado.prioridade === 'urgente' ? 'text-red-600' :
              comunicado.prioridade === 'alta' ? 'text-orange-600' :
              'text-gray-600'
            }`} />
            <div className="flex-1">
              <h2>{comunicado.titulo}</h2>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {comunicado.prioridade !== 'normal' && (
                  <Badge className={getPrioridadeColor(comunicado.prioridade)}>
                    {comunicado.prioridade.charAt(0).toUpperCase() + comunicado.prioridade.slice(1)}
                  </Badge>
                )}
                
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  {formatarDestinatarios(comunicado.destinatarios, comunicado.turma)}
                </Badge>

                {!isLido && showReadStatus && (
                  <Badge variant="default">
                    Novo
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Remetente e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Enviado por</p>
                <p>{comunicado.remetente?.nome_completo || 'Desconhecido'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Data de envio</p>
                <p>{format(new Date(comunicado.data_envio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              </div>
            </div>
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Mensagem</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {comunicado.mensagem}
              </p>
            </div>
          </div>

          {/* Estatísticas de Leitura (para gestor/professor) */}
          {showStats && comunicado.total_destinatarios !== undefined && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Estatísticas de Leitura
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total de destinatários</span>
                    <span className="font-medium">{comunicado.total_destinatarios}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Leram o comunicado</span>
                    <span className="font-medium text-green-600">
                      {comunicado.total_leituras || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Não leram ainda</span>
                    <span className="font-medium text-orange-600">
                      {comunicado.total_destinatarios - (comunicado.total_leituras || 0)}
                    </span>
                  </div>

                  {/* Barra de progresso */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Taxa de leitura</span>
                      <span>
                        {comunicado.total_destinatarios > 0
                          ? Math.round(((comunicado.total_leituras || 0) / comunicado.total_destinatarios) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${comunicado.total_destinatarios > 0 
                            ? ((comunicado.total_leituras || 0) / comunicado.total_destinatarios) * 100 
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Status de Leitura (para aluno) */}
          {showReadStatus && (
            <>
              <Separator />
              <div className="space-y-2">
                {isLido && comunicado.data_leitura ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Você já leu este comunicado</p>
                      <p className="text-xs text-gray-500">
                        Em {format(new Date(comunicado.data_leitura), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Mail className="h-5 w-5" />
                    <p className="font-medium">Este comunicado ainda não foi marcado como lido</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
            
            {showReadStatus && !isLido && onMarkAsRead && (
              <Button
                onClick={() => {
                  onMarkAsRead(comunicado.id);
                  onClose();
                }}
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marcar como Lido
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
