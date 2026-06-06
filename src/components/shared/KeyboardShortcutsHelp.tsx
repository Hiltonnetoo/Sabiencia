// ============================================
// KEYBOARD SHORTCUTS HELP - Modal de ajuda com atalhos disponíveis
// ============================================

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Keyboard, X } from 'lucide-react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface ShortcutItem {
  keys: string;
  description: string;
  category?: string;
}

interface KeyboardShortcutsHelpProps {
  shortcuts: ShortcutItem[];
  trigger?: React.ReactNode;
}

/**
 * Componente que exibe uma lista de atalhos de teclado disponíveis
 * Pode ser aberto via botão ou atalho Shift+?
 */
export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  shortcuts,
  trigger,
}) => {
  const [open, setOpen] = useState(false);

  // Atalho para abrir o modal (Shift + ?)
  useKeyboardShortcuts([
    {
      key: '?',
      shift: true,
      action: () => setOpen(true),
      description: 'Abrir ajuda de atalhos',
      global: true,
    },
  ]);

  // Agrupar atalhos por categoria
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'Geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutItem[]>);

  return (
    <>
      {/* Trigger customizado ou botão padrão */}
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <Keyboard className="h-4 w-4" />
          Atalhos
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Atalhos de Teclado
            </DialogTitle>
            <DialogDescription>
              Use estes atalhos para navegar mais rapidamente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, items]) => (
              <div key={category}>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  {category}
                </h4>
                <div className="space-y-2">
                  {items.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-600">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.split(' + ').map((key, i) => (
                          <React.Fragment key={i}>
                            <Badge
                              variant="secondary"
                              className="font-mono text-xs px-2 py-0.5"
                            >
                              {key}
                            </Badge>
                            {i < shortcut.keys.split(' + ').length - 1 && (
                              <span className="text-gray-400 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={() => setOpen(false)} variant="outline">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

/**
 * Componente simplificado que mostra apenas um tooltip com atalhos
 */
export const KeyboardShortcutBadge: React.FC<{
  shortcut: string;
  className?: string;
}> = ({ shortcut, className }) => {
  return (
    <Badge
      variant="secondary"
      className={`font-mono text-xs ${className || ''}`}
    >
      {shortcut}
    </Badge>
  );
};
