// ============================================
// PROTECTED ROUTE - Proteção de rotas
// ============================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDefaultRoute } from '../../utils/permissions';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

/**
 * Componente que protege rotas baseado em autenticação e roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar se o role do usuário está permitido
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirecionar para dashboard apropriado do usuário
    const defaultRoute = getDefaultRoute(user.role);
    return <Navigate to={redirectTo || defaultRoute} replace />;
  }

  // Usuário autenticado e com permissão
  return <>{children}</>;
};

/**
 * HOC para proteger rotas
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: Role[]
) => {
  return (props: P) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
