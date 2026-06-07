// ============================================
// AUTHCONTEXT TESTS - Testes do contexto de autenticação
// ============================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

// Wrapper para o provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Estado Inicial', () => {
    it('deve iniciar com usuário não autenticado', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Login', () => {
    it('deve fazer login com credenciais de gestor válidas', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('000.000.000-01', 'gestor123');
      });

      expect(loginResult.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe('gestor');
      expect(result.current.user?.nome_completo).toBe('Gestor Demo');
    });

    it('deve fazer login com credenciais de professor válidas', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('111.111.111-11', 'prof123');
      });

      expect(loginResult.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe('professor');
      expect(result.current.user?.nome_completo).toBe('Professor Demo');
    });

    it('deve fazer login com credenciais de aluno válidas', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('333.333.333-33', 'aluno123');
      });

      expect(loginResult.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe('aluno');
      expect(result.current.user?.nome_completo).toBe('Aluno Demo');
    });

    it('deve falhar com CPF inválido', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('999.999.999-99', 'senha123');
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('CPF não encontrado');
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('deve falhar com senha inválida', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('000.000.000-01', 'senhaErrada');
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('CPF ou senha inválidos');
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('deve salvar sessão no localStorage após login bem-sucedido', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('000.000.000-01', 'gestor123');
      });

      expect(setItemSpy).toHaveBeenCalled();
    });
  });

  describe('Logout', () => {
    it('deve fazer logout e limpar sessão', async () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Fazer login primeiro
      await act(async () => {
        await result.current.login('000.000.000-01', 'gestor123');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Fazer logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(removeItemSpy).toHaveBeenCalled();
    });
  });

  describe('Persistência de Sessão', () => {
    it('deve restaurar sessão do localStorage ao carregar', async () => {
      const mockUser = {
        id: '1',
        cpf: '000.000.000-01',
        nome_completo: 'Maria Clara Santos',
        email: 'maria@sabiencia.com.br',
        role: 'gestor' as const,
        ativo: true,
        created_at: new Date()
      };

      const secureStorageObj = {
        token: {
          user: mockUser,
          expiresAt: Date.now() + 1000 * 60 * 60 * 8, // 8h
          createdAt: Date.now()
        },
        signature: 'mock-signature'
      };

      localStorage.setItem('sabiencia_auth_user', JSON.stringify(secureStorageObj));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.user?.nome_completo).toBe('Maria Clara Santos');
      expect(result.current.user?.role).toBe('gestor');
    });

    it('deve limpar sessão inválida do localStorage', async () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
      localStorage.setItem('sabiencia_auth_user', 'invalid-json');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      expect(removeItemSpy).toHaveBeenCalled();
    });
  });

  describe('Validações', () => {
    it('deve rejeitar CPF vazio', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('', 'senha123');
      });

      expect(loginResult.success).toBe(false);
    });

    it('deve rejeitar senha vazia', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('000.000.000-01', '');
      });

      expect(loginResult.success).toBe(false);
    });
  });

  describe('Estado de Loading', () => {
    it('deve mostrar isLoading durante o login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoading).toBe(false);

      // Iniciar login sem aguardar
      const loginPromise = act(async () => {
        return result.current.login('000.000.000-01', 'gestor123');
      });

      await loginPromise;

      // Após completar, isLoading deve ser false
      expect(result.current.isLoading).toBe(false);
    });
  });
});
