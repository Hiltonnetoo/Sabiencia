import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppPreloader } from '../components/shared/AppPreloader';

const ProfessorLayout = lazy(() => import('../components/layout/ProfessorLayout'));
const ProfessorDashboard = lazy(() => import('../pages/professor/ProfessorDashboard'));
const MinhasTurmasPage = lazy(() => import('../pages/professor/MinhasTurmasPage'));
const MeusAlunosPage = lazy(() => import('../pages/professor/MeusAlunosPage'));
const BibliotecaProfessorPage = lazy(() => import('../pages/professor/BibliotecaProfessorPage'));
const FrequenciaPage = lazy(() => import('../pages/professor/FrequenciaPage'));
const NotasPage = lazy(() => import('../pages/professor/NotasPage'));
const ComunicadosProfessorPage = lazy(() => import('../pages/professor/ComunicadosProfessorPage'));
const ObservacoesProfessorPage = lazy(() => import('../pages/professor/ObservacoesProfessorPage'));
const RelatoriosProfessorPage = lazy(() => import('../pages/professor/RelatoriosProfessorPage'));
const PerfilProfessorPage = lazy(() => import('../pages/professor/PerfilProfessorPage'));
const ConfiguracoesProfessorPage = lazy(() => import('../pages/professor/ConfiguracoesProfessorPage'));
const ConteudoAulasPage = lazy(() => import('../pages/professor/ConteudoAulasPage'));
const GerenciarVideoaulasPage = lazy(() => import('../pages/professor/GerenciarVideoaulasPage'));
const GerenciarLivesPage = lazy(() => import('../pages/professor/GerenciarLivesPage'));

export function ProfessorRoutes() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <Suspense fallback={<AppPreloader message="Carregando painel do professor..." />}>
        <ProfessorLayout>
          <Routes>
            <Route path="dashboard" element={<ProfessorDashboard />} />
            <Route path="turmas" element={<MinhasTurmasPage />} />
            <Route path="alunos" element={<MeusAlunosPage />} />
            <Route path="notas" element={<NotasPage />} />
            <Route path="frequencia" element={<FrequenciaPage />} />
            <Route path="materiais" element={<BibliotecaProfessorPage />} />
            <Route path="observacoes" element={<ObservacoesProfessorPage />} />
            <Route path="comunicados" element={<ComunicadosProfessorPage />} />
            <Route path="relatorios" element={<RelatoriosProfessorPage />} />
            <Route path="perfil" element={<PerfilProfessorPage />} />
            <Route path="configuracoes" element={<ConfiguracoesProfessorPage />} />
            <Route path="conteudo" element={<ConteudoAulasPage />} />
            <Route path="videoaulas" element={<GerenciarVideoaulasPage />} />
            <Route path="lives" element={<GerenciarLivesPage />} />
            <Route path="*" element={<Navigate to="/professor/dashboard" replace />} />
          </Routes>
        </ProfessorLayout>
      </Suspense>
    </ProtectedRoute>
  );
}
