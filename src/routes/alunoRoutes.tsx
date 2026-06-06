import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppPreloader } from '../components/shared/AppPreloader';

const AlunoLayout = lazy(() => import('../components/layout/AlunoLayout'));
const AlunoDashboard = lazy(() => import('../pages/aluno/AlunoDashboard'));
const MinhasAulasPage = lazy(() => import('../pages/aluno/MinhasAulasPage'));
const BibliotecaAlunoPage = lazy(() => import('../pages/aluno/BibliotecaAlunoPage'));
const MinhaFrequenciaPage = lazy(() => import('../pages/aluno/MinhaFrequenciaPage'));
const MinhasNotasPage = lazy(() => import('../pages/aluno/MinhasNotasPage'));
const ComunicadosAlunoPage = lazy(() => import('../pages/aluno/ComunicadosAlunoPage'));
const FinanceiroAlunoPage = lazy(() => import('../pages/aluno/FinanceiroAlunoPage'));
const ObservacoesAlunoPage = lazy(() => import('../pages/aluno/ObservacoesAlunoPage'));
const PerfilAlunoPage = lazy(() => import('../pages/aluno/PerfilAlunoPage'));
const ConfiguracoesAlunoPage = lazy(() => import('../pages/aluno/ConfiguracoesAlunoPage'));
const EventosAlunoPage = lazy(() => import('../pages/aluno/EventosAlunoPage'));
const CertificadosPage = lazy(() => import('../pages/aluno/CertificadosPage'));
const ProgressoVideoaulasPage = lazy(() => import('../pages/aluno/ProgressoVideoaulasPage'));

export function AlunoRoutes() {
  return (
    <ProtectedRoute allowedRoles={['aluno']}>
      <Suspense fallback={<AppPreloader message="Carregando painel do aluno..." />}>
        <AlunoLayout>
          <Routes>
            <Route path="dashboard" element={<AlunoDashboard />} />
            <Route path="aulas" element={<MinhasAulasPage />} />
            <Route path="materiais" element={<BibliotecaAlunoPage />} />
            <Route path="notas" element={<MinhasNotasPage />} />
            <Route path="frequencia" element={<MinhaFrequenciaPage />} />
            <Route path="comunicados" element={<ComunicadosAlunoPage />} />
            <Route path="observacoes" element={<ObservacoesAlunoPage />} />
            <Route path="financeiro" element={<FinanceiroAlunoPage />} />
            <Route path="perfil" element={<PerfilAlunoPage />} />
            <Route path="configuracoes" element={<ConfiguracoesAlunoPage />} />
            <Route path="eventos" element={<EventosAlunoPage />} />
            <Route path="certificados" element={<CertificadosPage />} />
            <Route path="progresso-videoaulas" element={<ProgressoVideoaulasPage />} />
            <Route path="*" element={<Navigate to="/aluno/dashboard" replace />} />
          </Routes>
        </AlunoLayout>
      </Suspense>
    </ProtectedRoute>
  );
}
