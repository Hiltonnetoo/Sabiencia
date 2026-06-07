// ============================================
// CHAT AO VIVO - Chat em tempo real durante aulas ao vivo
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Send, User, Users } from 'lucide-react';
import type { MensagemChatAoVivo } from '../../types/videoaulas';

interface ChatAoVivoProps {
  aulaAoVivoId: string;
  usuarioAtual: {
    id: string;
    nome: string;
    tipo: 'aluno' | 'professor' | 'gestor';
  };
  mensagens: MensagemChatAoVivo[];
  onEnviarMensagem: (mensagem: string) => void;
  participantesOnline?: number;
  className?: string;
}

export const ChatAoVivo: React.FC<ChatAoVivoProps> = ({
  aulaAoVivoId,
  usuarioAtual,
  mensagens,
  onEnviarMensagem,
  participantesOnline = 0,
  className = ''
}) => {
  const [novaMensagem, setNovaMensagem] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const handleEnviar = () => {
    if (!novaMensagem.trim()) {
      return;
    }

    onEnviarMensagem(novaMensagem.trim());
    setNovaMensagem('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'professor':
        return <Badge className="text-xs bg-purple-600">Professor</Badge>;
      case 'gestor':
        return <Badge className="text-xs bg-blue-600">Gestor</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Chat ao Vivo</CardTitle>
            <CardDescription>
              Tire dúvidas e interaja durante a aula
            </CardDescription>
          </div>
          {participantesOnline > 0 && (
            <Badge variant="outline" className="gap-1">
              <Users className="w-3 h-3" />
              {participantesOnline} online
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Área de Mensagens */}
        <ScrollArea className="h-96 pr-4" ref={scrollRef}>
          <div className="space-y-3">
            {mensagens.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Nenhuma mensagem ainda</p>
                <p className="text-xs mt-1">Seja o primeiro a enviar uma mensagem!</p>
              </div>
            ) : (
              mensagens.map((mensagem) => {
                const isPropraMensagem = mensagem.usuario_id === usuarioAtual.id;
                
                return (
                  <div
                    key={mensagem.id}
                    className={`flex gap-2 ${isPropraMensagem ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                      mensagem.usuario_tipo === 'professor' 
                        ? 'bg-purple-600'
                        : mensagem.usuario_tipo === 'gestor'
                        ? 'bg-blue-600'
                        : 'bg-gray-600'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>

                    {/* Mensagem */}
                    <div className={`flex-1 max-w-[75%] ${isPropraMensagem ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block ${isPropraMensagem ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {!isPropraMensagem && (
                            <>
                              <span className="text-xs font-medium text-gray-900">
                                {mensagem.usuario_nome}
                              </span>
                              {getTipoBadge(mensagem.usuario_tipo)}
                            </>
                          )}
                          {isPropraMensagem && (
                            <span className="text-xs text-gray-500">Você</span>
                          )}
                        </div>
                        
                        <div className={`inline-block p-3 rounded-lg ${
                          isPropraMensagem
                            ? 'bg-blue-600 text-white'
                            : mensagem.usuario_tipo === 'professor'
                            ? 'bg-purple-100 text-purple-900'
                            : mensagem.usuario_tipo === 'gestor'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {mensagem.mensagem}
                          </p>
                        </div>

                        <div className={`text-xs text-gray-500 mt-1 ${isPropraMensagem ? 'text-right' : 'text-left'}`}>
                          {new Date(mensagem.enviado_em).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Input de Nova Mensagem */}
        <div className="flex gap-2 pt-3 border-t">
          <Input
            ref={inputRef}
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={500}
            className="flex-1"
          />
          <Button 
            onClick={handleEnviar}
            disabled={!novaMensagem.trim()}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar
          </Button>
        </div>

        {/* Contador de caracteres */}
        {novaMensagem.length > 0 && (
          <div className="text-xs text-gray-500 text-right -mt-2">
            {novaMensagem.length}/500
          </div>
        )}
      </CardContent>
    </Card>
  );
};
