import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MockDataProvider } from './contexts/MockDataContext';
import { VideoaulasProvider } from './contexts/VideoaulasContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './components/auth/LoginPage';
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

// Lazy Load Demo professor pages (used outside /demo/* prefix)
const DemoLoginProfessor = lazy(() => import('./pages/demo/DemoLoginProfessor'));
const ProfessorRegisterPage = lazy(() => import('./pages/demo/ProfessorRegisterPage'));

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
        <Header onLoginSuccess={() => {}} />
        <HeroSection onLoginSuccess={() => {}} />
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
// PLACEHOLDER PAGES (serão criadas nas próximas fases)
// ============================================
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">
        Esta seção está sendo preparada para você! Em breve a funcionalidade estará ativa.
      </p>
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/debug" element={<LoginDebug />} />
        <Route path="/redirect" element={<RedirectByRole />} />

        {/* Rotas de demonstração */}
        <Route path="/demo/*" element={<DemoRoutes />} />

        {/* Rota de login/cadastro do professor (pública) */}
        <Route path="/professor" element={
          <Suspense fallback={<AppPreloader message="Carregando..." />}>
            <DemoLoginProfessor />
          </Suspense>
        } />
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
  );
}
