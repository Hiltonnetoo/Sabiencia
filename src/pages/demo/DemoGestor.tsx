// ============================================
// DEMO GESTOR - Demonstração do Dashboard Gestor
// ✅ CORRIGIDO: Login forçado mesmo com sessão anterior
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { GestorDashboard } from '../gestor/GestorDashboard';
import { BaseLayout } from '../../components/layout/BaseLayout';
import { gestorNavItems } from '../../config/navigation';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingFallback } from '../../components/shared/LoadingFallback';

export const DemoGestor: React.FC = () => {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, user } = useAuth();
  const hasInitialized = useRef(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // ✅ Login automático SEMPRE - mesmo com sessão anterior
  useEffect(() => {
    const initDemo = async () => {
      // Evitar execução múltipla
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      setIsInitializing(true);
      
      try {
        // ✅ SEMPRE fazer logout primeiro (limpar qualquer sessão anterior)
        logout();
        
        // ✅ Aguardar para garantir que o logout completou
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // ✅ Fazer login como gestor
        const result = await login('000.000.000-01', 'gestor123');
        
        if (!result.success) {
          throw new Error(result.error || 'Erro ao fazer login');
        }
      } catch (error) {
        // ✅ SEGURANÇA: Log de erro sem expor dados sensíveis (apenas em desenvolvimento)
        console.error('[DemoGestor] Erro ao inicializar:', error);
        hasInitialized.current = false; // Permitir retry
        navigate('/demo');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initDemo();
  }, [login, logout, navigate]);
  
  // ✅ Mostrar loading até tudo estar correto
  if (isInitializing || !isAuthenticated || user?.role !== 'gestor') {
    return <LoadingFallback message="Preparando demonstração do Gestor..." />;
  }
  
  return (
    <BaseLayout navItems={gestorNavItems}>
      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-yellow-800">
            🎯 <strong>MODO DEMONSTRAÇÃO - GESTOR</strong> | {user.nome_completo} - Administrador do Sistema
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/demo')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
      <GestorDashboard />
    </BaseLayout>
  );
};

export default DemoGestor;
