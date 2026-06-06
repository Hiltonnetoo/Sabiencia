// ============================================
// INTEGRATION TESTS - Auth Flow
// Testa fluxo completo de autenticação com múltiplos componentes
// ============================================

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { LoginPage } from '../../components/auth/LoginPage';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { GestorDashboard } from '../../pages/gestor/GestorDashboard';
import { MockDataProvider } from '../../contexts/MockDataContext';

// Componente de teste para rota protegida
const TestDashboard = () => {
  const { user } = useAuth();
  return <div>Welcome {user?.nome}</div>;
};

// App de teste completo
const TestApp = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MockDataProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/redirect" element={<div>Redirecting...</div>} />
            <Route
              path="/gestor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['gestor']}>
                  <GestorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-dashboard"
              element={
                <ProtectedRoute allowedRoles={['gestor', 'professor', 'aluno']}>
                  <TestDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MockDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Authentication Flow - Integration', () => {
  it('deve fazer login completo e acessar dashboard', async () => {
    const user = userEvent.setup();
    render(<TestApp />);

    // Verificar que está na página de login
    expect(screen.getByText(/Sistema de Gestão Educacional/i)).toBeInTheDocument();

    // Fazer login
    await user.type(screen.getByLabelText(/cpf/i), '00000000001');
    await user.type(screen.getByLabelText(/senha/i), 'gestor123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Aguardar redirecionamento
    await waitFor(() => {
      expect(window.location.pathname).toContain('/redirect');
    });
  });

  it('deve persistir autenticação entre páginas', async () => {
    const user = userEvent.setup();
    
    // Mock do localStorage
    const mockUser = {
      id: '1',
      cpf: '000.000.000-01',
      nome: 'Maria Clara Santos',
      email: 'maria@sabiencia.com.br',
      role: 'gestor' as const,
      ativo: true
    };

    localStorage.setItem('sabiencia_auth_user', JSON.stringify(mockUser));
    localStorage.setItem('sabiencia_auth_token', 'mock-token');

    render(<TestApp />);

    // Navegar direto para dashboard (deve estar autenticado)
    window.history.pushState({}, '', '/test-dashboard');

    await waitFor(() => {
      expect(screen.queryByText(/Welcome Maria Clara Santos/i)).toBeTruthy();
    });
  });

  it('deve redirecionar para login quando não autenticado', async () => {
    localStorage.clear();
    
    render(<TestApp />);

    // Tentar acessar rota protegida
    window.history.pushState({}, '', '/test-dashboard');

    // Deve redirecionar para login
    await waitFor(() => {
      expect(screen.getByText(/Sistema de Gestão Educacional/i)).toBeInTheDocument();
    });
  });

  it('deve fazer logout e limpar sessão', async () => {
    const user = userEvent.setup();
    
    // Mock de usuário autenticado
    const mockUser = {
      id: '1',
      cpf: '000.000.000-01',
      nome: 'Maria Clara Santos',
      email: 'maria@sabiencia.com.br',
      role: 'gestor' as const,
      ativo: true
    };

    localStorage.setItem('sabiencia_auth_user', JSON.stringify(mockUser));
    
    const TestAppWithLogout = () => {
      const { logout, user } = useAuth();
      
      return (
        <div>
          {user ? (
            <>
              <div>Logged in as {user.nome}</div>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <div>Not logged in</div>
          )}
        </div>
      );
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestAppWithLogout />
        </AuthProvider>
      </BrowserRouter>
    );

    // Usuário deve estar logado
    await waitFor(() => {
      expect(screen.getByText(/Logged in as Maria Clara Santos/i)).toBeInTheDocument();
    });

    // Fazer logout
    await user.click(screen.getByRole('button', { name: /logout/i }));

    // Deve estar deslogado
    await waitFor(() => {
      expect(screen.getByText(/Not logged in/i)).toBeInTheDocument();
    });

    // localStorage deve estar limpo
    expect(localStorage.getItem('sabiencia_auth_user')).toBeNull();
  });

  it('deve bloquear acesso a rotas de outro perfil', async () => {
    // Login como aluno
    const mockUser = {
      id: '3',
      cpf: '333.333.333-33',
      nome: 'João Pedro Santos',
      email: 'joao@exemplo.com',
      role: 'aluno' as const,
      ativo: true
    };

    localStorage.setItem('sabiencia_auth_user', JSON.stringify(mockUser));

    render(<TestApp />);

    // Tentar acessar dashboard do gestor
    window.history.pushState({}, '', '/gestor/dashboard');

    // Deve ser bloqueado (redirecionar ou mostrar acesso negado)
    await waitFor(() => {
      expect(screen.queryByText(/Welcome/i)).toBeNull();
    });
  });
});

describe('Auth + MockData Integration', () => {
  it('deve carregar dados do usuário após login', async () => {
    const user = userEvent.setup();
    
    const TestAppWithData = () => {
      const { user } = useAuth();
      
      return (
        <BrowserRouter>
          <AuthProvider>
            <MockDataProvider>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                  path="/redirect"
                  element={
                    <div>
                      User: {user?.nome}
                      Role: {user?.role}
                    </div>
                  }
                />
              </Routes>
            </MockDataProvider>
          </AuthProvider>
        </BrowserRouter>
      );
    };

    render(<TestAppWithData />);

    // Login
    await user.type(screen.getByLabelText(/cpf/i), '00000000001');
    await user.type(screen.getByLabelText(/senha/i), 'gestor123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Verificar que dados do usuário foram carregados
    await waitFor(() => {
      expect(screen.queryByText(/User: Maria Clara Santos/i)).toBeTruthy();
      expect(screen.queryByText(/Role: gestor/i)).toBeTruthy();
    });
  });
});
