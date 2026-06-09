import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MockDataProvider } from './contexts/MockDataContext';
import { VideoaulasProvider } from './contexts/VideoaulasContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoginDebug } from './components/auth/LoginDebug';
import { getDefaultRoute } from './utils/permissions';
import { ToastProvider } from './components/shared/ToastProvider';
import { LoadingFallback } from './components/shared/LoadingFallback';
import { AppPreloader } from './components/shared/AppPreloader';
import { GestorRoutes } from './routes/gestorRoutes';
import { ProfessorRoutes } from './routes/professorRoutes';
import { AlunoRoutes } from './routes/alunoRoutes';
import { DemoRoutes } from './routes/demoRoutes';

// Lazy Load Landing Page Components
const Header = lazy(() => import('./components/landing/Header'));
const HeroSection = lazy(() => import('./components/landing/HeroSection'));
const CoursesSection = lazy(() => import('./components/landing/CoursesSection'));
const FeaturesSection = lazy(() => import('./components/landing/FeaturesSection'));
const MethodologySection = lazy(() => import('./components/landing/MethodologySection'));
const TestimonialsSection = lazy(() => import('./components/landing/TestimonialsSection'));
const Footer = lazy(() => import('./components/landing/Footer'));

// Login por papel (3 telas: /login/ceo · /login/professor · /login/aluno)
const DemoLogin = lazy(() =>
  import('./components/auth/DemoLogin').then((m) => ({ default: m.DemoLogin }))
);
const ProfessorRegisterPage = lazy(() => import('./pages/demo/ProfessorRegisterPage'));

// ============================================
// LOGIN BY ROLE
// ============================================
const VALID_LOGIN_ROLES = ['ceo', 'professor', 'aluno'] as const;

const LoginByRole: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  if (!role || !VALID_LOGIN_ROLES.includes(role as (typeof VALID_LOGIN_ROLES)[number])) {
    return <Navigate to="/login/aluno" replace />;
  }
  return (
    <Suspense fallback={<AppPreloader message="Carregando..." />}>
      <DemoLogin role={role as (typeof VALID_LOGIN_ROLES)[number]} />
    </Suspense>
  );
};

// ============================================
// REDIRECT BY ROLE
// ============================================
const RedirectByRole: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const defaultRoute = getDefaultRoute(user.role);
  return <Navigate to={defaultRoute} replace />;
};

// ============================================
// LANDING PAGE
// ============================================
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ✅ ACESSIBILIDADE: Skip link para conteúdo principal */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white focus:top-4 focus:left-4 focus:rounded-lg focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>

      {/* Header e Hero carregam primeiro */}
      <Suspense fallback={<AppPreloader message="Carregando página inicial..." />}>
        <Header />
        <HeroSection />
      </Suspense>

      {/* ✅ ACESSIBILIDADE: Main landmark com ID para skip link */}
      <main id="main-content" role="main">
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><LoadingFallback /></div>}>
          <CoursesSection />
          <FeaturesSection />
          <MethodologySection />
          <TestimonialsSection />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
};

// ============================================
// APP ROUTES
// ============================================
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LandingPage />} />

        {/* Login: 3 telas por papel + alias /login -> aluno */}
        <Route path="/login" element={<Navigate to="/login/aluno" replace />} />
        <Route path="/login/:role" element={<LoginByRole />} />

        <Route path="/debug" element={<LoginDebug />} />
        <Route path="/redirect" element={<RedirectByRole />} />

        {/* Rotas de demonstração */}
        <Route path="/demo/*" element={<DemoRoutes />} />

        {/* Login antigo do professor -> nova rota consolidada */}
        <Route path="/professor" element={<Navigate to="/login/professor" replace />} />
        <Route path="/professor/cadastro" element={
          <Suspense fallback={<AppPreloader message="Carregando..." />}>
            <ProfessorRegisterPage />
          </Suspense>
        } />

        {/* Rotas protegidas por papel */}
        <Route path="/gestor/*" element={<GestorRoutes />} />
        <Route path="/professor/*" element={<ProfessorRoutes />} />
        <Route path="/aluno/*" element={<AlunoRoutes />} />

        {/* Rota catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// ============================================
// APP PRINCIPAL
// ============================================
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MockDataProvider>
            <VideoaulasProvider>
              <ToastProvider />
              <AppRoutes />
            </VideoaulasProvider>
          </MockDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
