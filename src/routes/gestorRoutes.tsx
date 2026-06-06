import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AppPreloader } from '../components/shared/AppPreloader';

const GestorLayout = lazy(() => import('../components/layout/GestorLayout'));
const GestorDashboard = lazy(() => import('../pages/gestor/GestorDashboard'));
const AlunosListPage = lazy(() => import('../pages/gestor/AlunosListPage'));
const AlunoFormPage = lazy(() => import('../pages/gestor/AlunoFormPage'));
const AlunoDetailPage = lazy(() => import('../pages/gestor/AlunoDetailPage'));
const ProfessoresListPage = lazy(() => import('../pages/gestor/ProfessoresListPage'));
const ProfessorFormPage = lazy(() => import('../pages/gestor/ProfessorFormPage'));
const ProfessorDetailPage = lazy(() => import('../pages/gestor/ProfessorDetailPage'));
const BibliotecaGestorPage = lazy(() => import('../pages/gestor/BibliotecaGestorPage'));
const ComunicadosGestorPage = lazy(() => import('../pages/gestor/ComunicadosGestorPage'));
const FinanceiroGestorPage = lazy(() => import('../pages/gestor/FinanceiroGestorPage'));
const TurmasListPage = lazy(() => import('../pages/gestor/TurmasListPage'));
const TurmaDetailPage = lazy(() => import('../pages/gestor/TurmaDetailPage'));
const DisciplinasListPage = lazy(() => import('../pages/gestor/DisciplinasListPage'));
const CursosListPage = lazy(() => import('../pages/gestor/CursosListPage'));
const ObservacoesGestorPage = lazy(() => import('../pages/gestor/ObservacoesGestorPage'));
const RelatoriosGestorPage = lazy(() => import('../pages/gestor/RelatoriosGestorPage'));
const PerfilGestorPage = lazy(() => import('../pages/gestor/PerfilGestorPage'));
const ConfiguracoesGestorPage = lazy(() => import('../pages/gestor/ConfiguracoesGestorPage'));
const EventosPage = lazy(() => import('../pages/gestor/EventosPage'));
const CuponsPage = lazy(() => import('../pages/gestor/CuponsPage'));
const QuestionariosPage = lazy(() => import('../pages/gestor/QuestionariosPage'));
const GerenciarVideoaulasPage = lazy(() => import('../pages/professor/GerenciarVideoaulasPage'));
const GerenciarLivesPage = lazy(() => import('../pages/professor/GerenciarLivesPage'));

export function GestorRoutes() {
  return (
    <ProtectedRoute allowedRoles={['gestor']}>
      <Suspense fallback={<AppPreloader message="Carregando painel do gestor..." />}>
        <GestorLayout>
          <Routes>
            <Route path="dashboard" element={<GestorDashboard />} />
            <Route path="alunos" element={<AlunosListPage />} />
            <Route path="alunos/novo" element={<AlunoFormPage />} />
            <Route path="alunos/:id" element={<AlunoDetailPage />} />
            <Route path="alunos/:id/editar" element={<AlunoFormPage />} />
            <Route path="professores" element={<ProfessoresListPage />} />
            <Route path="professores/novo" element={<ProfessorFormPage />} />
            <Route path="professores/:id" element={<ProfessorDetailPage />} />
            <Route path="professores/:id/editar" element={<ProfessorFormPage />} />
            <Route path="cursos" element={<CursosListPage />} />
            <Route path="turmas" element={<TurmasListPage />} />
            <Route path="turmas/:id" element={<TurmaDetailPage />} />
            <Route path="disciplinas" element={<DisciplinasListPage />} />
            <Route path="biblioteca" element={<BibliotecaGestorPage />} />
            <Route path="financeiro" element={<FinanceiroGestorPage />} />
            <Route path="comunicados" element={<ComunicadosGestorPage />} />
            <Route path="observacoes" element={<ObservacoesGestorPage />} />
            <Route path="relatorios" element={<RelatoriosGestorPage />} />
            <Route path="perfil" element={<PerfilGestorPage />} />
            <Route path="configuracoes" element={<ConfiguracoesGestorPage />} />
            <Route path="eventos" element={<EventosPage />} />
            <Route path="cupons" element={<CuponsPage />} />
            <Route path="questionarios" element={<QuestionariosPage />} />
            <Route path="videoaulas" element={<GerenciarVideoaulasPage />} />
            <Route path="lives" element={<GerenciarLivesPage />} />
            <Route path="*" element={<Navigate to="/gestor/dashboard" replace />} />
          </Routes>
        </GestorLayout>
      </Suspense>
    </ProtectedRoute>
  );
}
