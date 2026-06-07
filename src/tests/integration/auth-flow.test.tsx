// ============================================
// INTEGRATION TESTS - Auth Flow
// Testa fluxo completo de autenticação com múltiplos componentes
// ============================================

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { LoginPage } from '../../components/auth/LoginPage';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { GestorDashboard } from '../../pages/gestor/GestorDashboard';
import { MockDataProvider } from '../../contexts/MockDataContext';

// Componente de teste para rota protegida
const TestDashboard = () => {
  const { user } = useAuth();
  return <div>Welcome {user?.nome_completo}</div>;
};

// App de teste completo
interface TestAppProps {
  initialPath?: string;
}

const TestApp = ({ initialPath = '/' }: TestAppProps) => {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <MockDataProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
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
    </MemoryRouter>
  );
};

describe('Authentication Flow - Integration', () => {
  it('deve fazer login completo e acessar dashboard', async () => {
    const user = userEvent.setup();
    render(<TestApp initialPath="/" />);

    // Verificar que está na página de login
    await waitFor(() => {
      expect(screen.getByText(/Entre com suas credenciais/i)).toBeInTheDocument();
    });

    // Fazer login
    await user.type(screen.getByLabelText(/cpf ou/i), '00000000001');
    await user.type(screen.getByLabelText(/^senha$/i), 'gestor123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Aguardar o redirecionamento (na prática o navigate direcionará para /redirect)
    // No MemoryRouter, a rota /redirect será renderizada
    await waitFor(() => {
      expect(screen.getByText(/Redirecting.../i)).toBeInTheDocument();
    });
  });

  it('deve persistir autenticação entre páginas', async () => {
    // Mock do localStorage com envelope SecureStorage
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
    localStorage.setItem('sabiencia_auth_token', 'mock-token');

    render(<TestApp initialPath="/test-dashboard" />);

    await waitFor(() => {
      expect(screen.queryByText(/Welcome Maria Clara Santos/i)).toBeTruthy();
    });
  });

  it('deve redirecionar para login quando não autenticado', async () => {
    localStorage.clear();
    
    render(<TestApp initialPath="/test-dashboard" />);

    // Deve redirecionar para login (que renderiza a tela com "Entre com suas credenciais")
    await waitFor(() => {
      expect(screen.getByText(/Entre com suas credenciais/i)).toBeInTheDocument();
    });
  });

  it('deve fazer logout e limpar sessão', async () => {
    const user = userEvent.setup();
    
    // Mock de usuário autenticado
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
        expiresAt: Date.now() + 1000 * 60 * 60 * 8,
        createdAt: Date.now()
      },
      signature: 'mock-signature'
    };

    localStorage.setItem('sabiencia_auth_user', JSON.stringify(secureStorageObj));
    
    const TestAppWithLogout = () => {
      const { logout, user } = useAuth();
      
      return (
        <div>
          {user ? (
            <>
              <div>Logged in as {user.nome_completo}</div>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <div>Not logged in</div>
          )}
        </div>
      );
    };

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <TestAppWithLogout />
        </AuthProvider>
      </MemoryRouter>
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
      nome_completo: 'João Pedro Santos',
      email: 'joao@exemplo.com',
      role: 'aluno' as const,
      ativo: true,
      created_at: new Date()
    };

    const secureStorageObj = {
      token: {
        user: mockUser,
        expiresAt: Date.now() + 1000 * 60 * 60 * 8,
        createdAt: Date.now()
      },
      signature: 'mock-signature'
    };

    localStorage.setItem('sabiencia_auth_user', JSON.stringify(secureStorageObj));

    render(<TestApp initialPath="/gestor/dashboard" />);

    // Deve ser redirecionado para dashboard do aluno ou ficar na login / não exibir welcome
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
        <MockDataProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/redirect"
              element={
                <div>
                  User: {user?.nome_completo}
                  Role: {user?.role}
                </div>
              }
            />
          </Routes>
        </MockDataProvider>
      );
    };

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <TestAppWithData />
        </AuthProvider>
      </MemoryRouter>
    );

    // Login
    await user.type(screen.getByLabelText(/cpf ou/i), '00000000001');
    await user.type(screen.getByLabelText(/^senha$/i), 'gestor123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    // Verificar que dados do usuário foram carregados
    await waitFor(() => {
      expect(screen.queryByText(/User: Gestor Demo/i)).toBeTruthy();
      expect(screen.queryByText(/Role: gestor/i)).toBeTruthy();
    });
  });
});
