// ============================================
// COMPONENTE: CARD DE COMUNICADO
// ============================================

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Mail, 
  Clock, 
  Users, 
  CheckCircle2, 
  MessageCircle,
  AlertCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ComunicadoComDetalhes } from '../../types';
import { formatarDestinatarios, getPrioridadeColor } from '../../schemas/comunicadoSchemas';

interface ComunicadoCardProps {
  comunicado: ComunicadoComDetalhes;
  onView: (comunicado: ComunicadoComDetalhes) => void;
  onMarkAsRead?: (comunicadoId: string) => void;
  showReadStatus?: boolean;
  showStats?: boolean;
}

export function ComunicadoCard({
  comunicado,
  onView,
  onMarkAsRead,
  showReadStatus = false,
  showStats = false
}: ComunicadoCardProps) {
  const PrioridadeIcon = {
    baixa: MessageCircle,
    normal: Mail,
    alta: AlertCircle,
    urgente: AlertTriangle
  }[comunicado.prioridade] || Mail;

  const isLido = comunicado.lido;

  return (
    <Card 
      className={`transition-all hover:shadow-md ${
        !isLido && showReadStatus ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Título e Badge Não Lido */}
            <div className="flex items-start gap-2">
              <PrioridadeIcon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                comunicado.prioridade === 'urgente' ? 'text-red-600' :
                comunicado.prioridade === 'alta' ? 'text-orange-600' :
                'text-gray-600'
              }`} />
              <div className="flex-1">
                <h3 className={`${!isLido && showReadStatus ? 'font-semibold' : ''}`}>
                  {comunicado.titulo}
                </h3>
                {!isLido && showReadStatus && (
                  <Badge variant="secondary" className="mt-1">
                    Novo
                  </Badge>
                )}
              </div>
            </div>

            {/* Badges de Status */}
            <div className="flex flex-wrap gap-2">
              {comunicado.prioridade !== 'normal' && (
                <Badge className={getPrioridadeColor(comunicado.prioridade)}>
                  {comunicado.prioridade.charAt(0).toUpperCase() + comunicado.prioridade.slice(1)}
                </Badge>
              )}
              
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {formatarDestinatarios(comunicado.destinatarios, comunicado.turma)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Prévia da mensagem */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {comunicado.mensagem}
        </p>

        {/* Informações de data e remetente */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(comunicado.data_envio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
          
          {comunicado.remetente && (
            <span>
              De: {comunicado.remetente.nome_completo}
            </span>
          )}
        </div>

        {/* Estatísticas de leitura (para gestor/professor) */}
        {showStats && comunicado.total_destinatarios !== undefined && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm">
              {comunicado.total_leituras || 0} de {comunicado.total_destinatarios} leram
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
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
        )}

        {/* Status de leitura (para aluno) */}
        {showReadStatus && isLido && comunicado.data_leitura && (
          <div className="flex items-center gap-2 text-sm text-green-600 pt-2 border-t">
            <CheckCircle2 className="h-4 w-4" />
            Lido em {format(new Date(comunicado.data_leitura), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onView(comunicado)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Completo
          </Button>
          
          {showReadStatus && !isLido && onMarkAsRead && (
            <Button 
              onClick={() => onMarkAsRead(comunicado.id)}
              variant="default"
              size="sm"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Marcar como Lido
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
