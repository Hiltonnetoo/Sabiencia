// ============================================
// LIVE CARD - Card de aula ao vivo
// ============================================

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Trash2, 
  Edit, 
  ExternalLink,
  Bell
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import type { AulaAoVivo } from '../../types/videoaulas';

interface LiveCardProps {
  aula: AulaAoVivo;
  disciplinaNome?: string;
  professorNome?: string;
  participantes?: number;
  onEntrarSala?: () => void;
  onEditar?: () => void;
  onDeletar?: () => void;
  onNotificar?: () => void;
  showActions?: boolean;
  userRole?: 'aluno' | 'professor' | 'gestor';
}

export const LiveCard: React.FC<LiveCardProps> = ({
  aula,
  disciplinaNome,
  professorNome,
  participantes = 0,
  onEntrarSala,
  onEditar,
  onDeletar,
  onNotificar,
  showActions = false,
  userRole = 'aluno'
}) => {
  const getStatusBadge = () => {
    switch (aula.status) {
      case 'ao_vivo':
        return (
          <Badge className="bg-red-600 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mr-2" />
            AO VIVO
          </Badge>
        );
      case 'agendada':
        return <Badge variant="secondary">Agendada</Badge>;
      case 'finalizada':
        return <Badge variant="outline">Finalizada</Badge>;
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return null;
    }
  };

  const getPlataformaIcon = () => {
    switch (aula.plataforma) {
      case 'zoom':
        return '📹 Zoom';
      case 'google_meet':
        return '🎥 Google Meet';
      case 'teams':
        return '💼 Teams';
      case 'jitsi':
        return '🎬 Jitsi';
      default:
        return '🎥 Online';
    }
  };

  const isPast = new Date(aula.data_inicio) < new Date();
  const isLive = aula.status === 'ao_vivo';
  const canJoin = (aula.status === 'agendada' || aula.status === 'ao_vivo') && onEntrarSala;

  const timeUntilStart = () => {
    const now = new Date();
    const start = new Date(aula.data_inicio);
    const diffMs = start.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) return null;
    if (diffMins < 60) return `Começa em ${diffMins} min`;
    if (diffMins < 1440) return `Começa em ${Math.floor(diffMins / 60)}h`;
    return null;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${
      isLive ? 'border-red-500 border-2' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge()}
              {timeUntilStart() && !isLive && (
                <Badge variant="outline" className="text-blue-600">
                  {timeUntilStart()}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{aula.titulo}</CardTitle>
            <CardDescription className="mt-1">
              {aula.descricao}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {disciplinaNome && (
            <div className="flex items-center gap-2 text-gray-600">
              <Video className="w-4 h-4" />
              <span>{disciplinaNome}</span>
            </div>
          )}

          {professorNome && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Prof. {professorNome}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(aula.data_inicio)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(aula.data_inicio).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
              {' '}({aula.duracao_minutos} min)
            </span>
          </div>
        </div>

        {/* Plataforma */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
          <span>{getPlataformaIcon()}</span>
        </div>

        {/* Participantes (se ao vivo) */}
        {isLive && participantes > 0 && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm">
            <Users className="w-4 h-4 text-red-600" />
            <span className="text-red-900">
              <strong>{participantes}</strong> participante{participantes !== 1 ? 's' : ''} online
            </span>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2 pt-3 border-t">
          {/* Botão Entrar (Aluno) */}
          {canJoin && userRole === 'aluno' && (
            <Button
              onClick={onEntrarSala}
              className={`flex-1 gap-2 ${isLive ? 'bg-red-600 hover:bg-red-700 animate-pulse' : ''}`}
              size="lg"
            >
              <ExternalLink className="w-4 h-4" />
              {isLive ? 'Entrar Agora' : 'Entrar na Sala'}
            </Button>
          )}

          {/* Ações do Professor/Gestor */}
          {showActions && (userRole === 'professor' || userRole === 'gestor') && (
            <>
              <Button
                onClick={onEntrarSala}
                className="flex-1 gap-2"
                size="sm"
                variant={isLive ? 'default' : 'outline'}
              >
                <ExternalLink className="w-4 h-4" />
                {isLive ? 'Entrar' : 'Acessar Sala'}
              </Button>

              {aula.status === 'agendada' && onNotificar && (
                <Button
                  onClick={onNotificar}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Notificar
                </Button>
              )}

              {aula.status !== 'finalizada' && onEditar && (
                <Button
                  onClick={onEditar}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}

              {onDeletar && (
                <Button
                  onClick={onDeletar}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
        </div>

        {/* Senha da Sala (se houver) */}
        {aula.senha_sala && canJoin && (
          <div className="text-xs text-gray-600 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <strong>Senha da sala:</strong> <code className="font-mono">{aula.senha_sala}</code>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
