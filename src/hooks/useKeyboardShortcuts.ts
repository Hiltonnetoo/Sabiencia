// ============================================
// USE KEYBOARD SHORTCUTS - Hook para atalhos de teclado
// ============================================

import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  /**
   * Tecla principal do atalho (ex: 's', 'Enter', 'Escape')
   */
  key: string;
  
  /**
   * Requer tecla Ctrl pressionada
   */
  ctrl?: boolean;
  
  /**
   * Requer tecla Shift pressionada
   */
  shift?: boolean;
  
  /**
   * Requer tecla Alt pressionada
   */
  alt?: boolean;
  
  /**
   * Requer tecla Meta/Command pressionada (macOS)
   */
  meta?: boolean;
  
  /**
   * Função a ser executada quando o atalho for ativado
   */
  action: (event: KeyboardEvent) => void;
  
  /**
   * Descrição do atalho (para exibir em help/tooltip)
   */
  description: string;
  
  /**
   * Se true, preventDefault não será chamado
   */
  allowDefault?: boolean;
  
  /**
   * Se true, atalho funciona mesmo em inputs/textareas
   */
  global?: boolean;
  
  /**
   * Se true, o atalho está desabilitado
   */
  disabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  /**
   * Se true, atalhos são habilitados globalmente (mesmo em inputs)
   */
  enableInFormFields?: boolean;
  
  /**
   * Se true, desabilita todos os atalhos
   */
  disabled?: boolean;
}

/**
 * Hook para registrar atalhos de teclado no componente
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     key: 's',
 *     ctrl: true,
 *     action: handleSave,
 *     description: 'Salvar'
 *   },
 *   {
 *     key: 'Escape',
 *     action: handleCancel,
 *     description: 'Cancelar',
 *     global: true
 *   }
 * ]);
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const {
    enableInFormFields = false,
    disabled = false,
  } = options;

  // Usar ref para evitar recriação do listener
  const shortcutsRef = useRef(shortcuts);
  
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Se todos os atalhos estão desabilitados
    if (disabled) return;

    // Verificar se estamos em um campo de formulário
    const target = event.target as HTMLElement;
    const isFormField = 
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable;

    // Para cada atalho registrado
    for (const shortcut of shortcutsRef.current) {
      // Se o atalho está desabilitado individualmente
      if (shortcut.disabled) continue;

      // Se estamos em um campo de formulário e o atalho não é global
      if (isFormField && !shortcut.global && !enableInFormFields) {
        continue;
      }

      // Verificar se as teclas modificadoras correspondem
      const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === (event.ctrlKey || event.metaKey);
      const shiftMatch = shortcut.shift === undefined || shortcut.shift === event.shiftKey;
      const altMatch = shortcut.alt === undefined || shortcut.alt === event.altKey;
      const metaMatch = shortcut.meta === undefined || shortcut.meta === event.metaKey;
      
      // Verificar se a tecla principal corresponde (case-insensitive)
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      // Se todas as condições forem verdadeiras
      if (ctrlMatch && shiftMatch && altMatch && metaMatch && keyMatch) {
        // Prevenir ação padrão (exceto se especificado)
        if (!shortcut.allowDefault) {
          event.preventDefault();
          event.stopPropagation();
        }

        // Executar ação
        shortcut.action(event);
        
        // Parar de procurar (evitar múltiplas ações)
        break;
      }
    }
  }, [disabled, enableInFormFields]);

  useEffect(() => {
    // Adicionar listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Hook para exibir uma lista de atalhos disponíveis (para help/tooltip)
 */
export function useShortcutsList(shortcuts: KeyboardShortcut[]) {
  return shortcuts
    .filter(s => !s.disabled)
    .map(shortcut => {
      const keys: string[] = [];
      
      if (shortcut.ctrl) keys.push('Ctrl');
      if (shortcut.meta) keys.push('Cmd');
      if (shortcut.shift) keys.push('Shift');
      if (shortcut.alt) keys.push('Alt');
      keys.push(shortcut.key.toUpperCase());

      return {
        keys: keys.join(' + '),
        description: shortcut.description,
      };
    });
}

/**
 * Atalhos de teclado globais comuns (reutilizáveis)
 */
export const commonShortcuts = {
  save: (action: () => void): KeyboardShortcut => ({
    key: 's',
    ctrl: true,
    action,
    description: 'Salvar',
  }),
  
  cancel: (action: () => void): KeyboardShortcut => ({
    key: 'Escape',
    action,
    description: 'Cancelar/Fechar',
    global: true,
  }),
  
  search: (action: () => void): KeyboardShortcut => ({
    key: '/',
    action,
    description: 'Buscar',
  }),
  
  new: (action: () => void): KeyboardShortcut => ({
    key: 'n',
    ctrl: true,
    action,
    description: 'Novo registro',
  }),
  
  delete: (action: () => void): KeyboardShortcut => ({
    key: 'Delete',
    action,
    description: 'Excluir',
  }),
  
  refresh: (action: () => void): KeyboardShortcut => ({
    key: 'r',
    ctrl: true,
    action,
    description: 'Atualizar',
  }),
  
  help: (action: () => void): KeyboardShortcut => ({
    key: '?',
    shift: true,
    action,
    description: 'Ajuda',
  }),
  
  nextItem: (action: () => void): KeyboardShortcut => ({
    key: 'ArrowDown',
    action,
    description: 'Próximo item',
    global: true,
  }),
  
  previousItem: (action: () => void): KeyboardShortcut => ({
    key: 'ArrowUp',
    action,
    description: 'Item anterior',
    global: true,
  }),
  
  submit: (action: () => void): KeyboardShortcut => ({
    key: 'Enter',
    ctrl: true,
    action,
    description: 'Enviar/Confirmar',
  }),
};
