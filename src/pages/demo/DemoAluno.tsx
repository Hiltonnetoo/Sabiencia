// ============================================
// DEMO ALUNO - Demonstração do Dashboard Aluno
// ✅ CORRIGIDO: Login forçado mesmo com sessão anterior
// ============================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlunoDashboard } from '../aluno/AlunoDashboard';
import { BaseLayout } from '../../components/layout/BaseLayout';
import { alunoNavItems } from '../../config/navigation';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { LoadingFallback } from '../../components/shared/LoadingFallback';
import { getAlunoDetails } from '../../utils/alunoHelpers';

export const DemoAluno: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, logout, isAuthenticated, user } = useAuth();
  const { matriculas, turmas, cursos } = useMockData();
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
        
        // ✅ Fazer login como aluno
        const result = await login('333.333.333-33', 'aluno123');
        
        if (!result.success) {
          throw new Error(result.error || 'Erro ao fazer login');
        }
      } catch (error) {
        // ✅ SEGURANÇA: Log de erro sem expor dados sensíveis (apenas em desenvolvimento)
        console.error('[DemoAluno] Erro ao inicializar:', error);
        hasInitialized.current = false; // Permitir retry
        navigate('/demo');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initDemo();
  }, [login, logout, navigate]);
  
  // ✅ Buscar curso do aluno
  const cursoNome = useMemo(() => {
    if (!user || user.role !== 'aluno') return t('demoPages.aluno.defaultCourse');
    const alunoDetails = getAlunoDetails(user.id, matriculas, turmas, cursos);
    return alunoDetails.curso?.nome || t('demoPages.aluno.defaultCourse');
  }, [user, matriculas, turmas, cursos, t]);
  
  // ✅ Mostrar loading até tudo estar correto
  if (isInitializing || !isAuthenticated || user?.role !== 'aluno') {
    return <LoadingFallback message={t('demoPages.aluno.loading')} />;
  }
  
  return (
    <BaseLayout navItems={alunoNavItems}>
      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-green-800">
            🎯 <strong>{t('demoPages.aluno.bannerLabel')}</strong> | {user.nome_completo} - {cursoNome}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/demo')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('demoPages.common.back')}
          </Button>
        </div>
      </div>
      <AlunoDashboard />
    </BaseLayout>
  );
};

export default DemoAluno;
