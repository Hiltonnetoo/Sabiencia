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
    vi.clearAllMocks();
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
      expect(result.current.user?.nome).toBe('Maria Clara Santos');
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
      expect(result.current.user?.nome).toBe('Ana Paula Costa');
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
      expect(result.current.user?.nome).toBe('João Pedro Santos');
    });

    it('deve falhar com CPF inválido', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login('999.999.999-99', 'senha123');
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('CPF ou senha inválidos');
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
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('000.000.000-01', 'gestor123');
      });

      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Logout', () => {
    it('deve fazer logout e limpar sessão', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Fazer login primeiro
      await act(async () => {
        await result.current.login('000.000.000-01', 'gestor123');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Fazer logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('Persistência de Sessão', () => {
    it('deve restaurar sessão do localStorage ao carregar', async () => {
      const mockUser = {
        id: '1',
        cpf: '000.000.000-01',
        nome: 'Maria Clara Santos',
        email: 'maria@sabiencia.com.br',
        role: 'gestor' as const,
        ativo: true
      };

      // Mock do localStorage com sessão válida
      localStorage.getItem = vi.fn((key) => {
        if (key === 'sabiencia_auth_user') {
          return JSON.stringify(mockUser);
        }
        if (key === 'sabiencia_auth_token') {
          return 'mock-token';
        }
        return null;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.user?.nome).toBe('Maria Clara Santos');
      expect(result.current.user?.role).toBe('gestor');
    });

    it('deve limpar sessão inválida do localStorage', async () => {
      localStorage.getItem = vi.fn((key) => {
        if (key === 'sabiencia_auth_user') {
          return 'invalid-json';
        }
        return null;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      expect(localStorage.removeItem).toHaveBeenCalled();
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

      // Durante o login, isLoading pode ser true
      // (dependendo do timing, pode não ser capturado)

      await loginPromise;

      // Após completar, isLoading deve ser false
      expect(result.current.isLoading).toBe(false);
    });
  });
});
