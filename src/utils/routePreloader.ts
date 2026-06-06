// ============================================
// ROUTE PRELOADER - Precarregamento inteligente de rotas
// ============================================

/**
 * Precarrega componentes de rotas para melhorar a performance
 */

// Preload de rotas do Gestor
export const preloadGestorRoutes = () => {
  // Rotas principais (preload imediato)
  import('../pages/gestor/GestorDashboard');
  import('../pages/gestor/AlunosListPage');
  import('../pages/gestor/ProfessoresListPage');
  
  // Rotas secundárias (preload após 2s)
  setTimeout(() => {
    import('../pages/gestor/BibliotecaGestorPage');
    import('../pages/gestor/ComunicadosGestorPage');
    import('../pages/gestor/TurmasListPage');
    import('../pages/gestor/DisciplinasListPage');
  }, 2000);
  
  // Rotas terciárias (preload após 5s)
  setTimeout(() => {
    import('../pages/gestor/FinanceiroGestorPage');
    import('../pages/gestor/RelatoriosGestorPage');
    import('../pages/gestor/ObservacoesGestorPage');
  }, 5000);
};

// Preload de rotas do Professor
export const preloadProfessorRoutes = () => {
  import('../pages/professor/ProfessorDashboard');
  import('../pages/professor/BibliotecaProfessorPage');
  import('../pages/professor/FrequenciaPage');
  
  setTimeout(() => {
    import('../pages/professor/NotasPage');
    import('../pages/professor/ComunicadosProfessorPage');
    import('../pages/professor/ObservacoesProfessorPage');
  }, 2000);
};

// Preload de rotas do Aluno
export const preloadAlunoRoutes = () => {
  import('../pages/aluno/AlunoDashboard');
  import('../pages/aluno/BibliotecaAlunoPage');
  import('../pages/aluno/MinhasNotasPage');
  
  setTimeout(() => {
    import('../pages/aluno/ComunicadosAlunoPage');
    import('../pages/aluno/MinhaFrequenciaPage');
    import('../pages/aluno/FinanceiroAlunoPage');
  }, 2000);
};

// Preload de formulários (quando usuário clica em "Novo")
export const preloadForms = {
  aluno: () => import('../pages/gestor/AlunoFormPage'),
  professor: () => import('../pages/gestor/ProfessorFormPage'),
  turma: () => import('../components/turmas/TurmaForm'),
  disciplina: () => import('../components/disciplinas/DisciplinaForm'),
  material: () => import('../components/biblioteca/MaterialUploadForm'),
  comunicado: () => import('../components/comunicados/ComunicadoForm'),
};

// Preload de detalhes (quando usuário passa o mouse sobre um registro)
export const preloadDetails = {
  aluno: () => import('../pages/gestor/AlunoDetailPage'),
  professor: () => import('../pages/gestor/ProfessorDetailPage'),
};

/**
 * Precarrega rota específica
 */
export const preloadRoute = (route: string): void => {
  switch (route) {
    case 'gestor':
      preloadGestorRoutes();
      break;
    case 'professor':
      preloadProfessorRoutes();
      break;
    case 'aluno':
      preloadAlunoRoutes();
      break;
  }
};

/**
 * Precarrega rotas baseado no role do usuário após login
 */
export const preloadByRole = (role: 'gestor' | 'professor' | 'aluno'): void => {
  preloadRoute(role);
};

/**
 * Hook React para preload on hover
 */
export const useRoutePreload = () => {
  const handlePreload = (importFn: () => Promise<any>) => {
    return () => {
      importFn();
    };
  };

  return { handlePreload };
};
