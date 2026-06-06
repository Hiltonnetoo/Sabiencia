// ============================================
// DEMO PROFESSOR - Demonstração do Dashboard Professor
// ✅ CORRIGIDO: Login forçado mesmo com sessão anterior
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { ProfessorDashboard } from '../professor/ProfessorDashboard';
import { BaseLayout } from '../../components/layout/BaseLayout';
import { professorNavItems } from '../../config/navigation';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingFallback } from '../../components/shared/LoadingFallback';

export const DemoProfessor: React.FC = () => {
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
        
        // ✅ Fazer login como professor
        const result = await login('111.111.111-11', 'prof123');
        
        if (!result.success) {
          throw new Error(result.error || 'Erro ao fazer login');
        }
      } catch (error) {
        // ✅ SEGURANÇA: Log de erro sem expor dados sensíveis (apenas em desenvolvimento)
        console.error('[DemoProfessor] Erro ao inicializar:', error);
        hasInitialized.current = false; // Permitir retry
        navigate('/demo');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initDemo();
  }, [login, logout, navigate]);
  
  // ✅ Mostrar loading até tudo estar correto
  if (isInitializing || !isAuthenticated || user?.role !== 'professor') {
    return <LoadingFallback message="Preparando demonstração do Professor..." />;
  }
  
  return (
    <BaseLayout navItems={professorNavItems}>
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-800">
            🎯 <strong>MODO DEMONSTRAÇÃO - PROFESSOR</strong> | {user.nome_completo} - Enfermagem
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
      <ProfessorDashboard />
    </BaseLayout>
  );
};

export default DemoProfessor;
