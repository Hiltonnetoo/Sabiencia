import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppPreloader } from '../components/shared/AppPreloader';

const DemoIndex = lazy(() => import('../pages/demo/DemoIndex'));
const DemoGestor = lazy(() => import('../pages/demo/DemoGestor'));
const DemoProfessor = lazy(() => import('../pages/demo/DemoProfessor'));
const DemoAluno = lazy(() => import('../pages/demo/DemoAluno'));

export function DemoRoutes() {
  return (
    <Suspense fallback={<AppPreloader message="Carregando demonstração..." />}>
      <Routes>
        <Route index element={<DemoIndex />} />

        {/* Pré-visualização dos dashboards (login automático por papel) */}
        <Route path="gestor" element={<DemoGestor />} />
        <Route path="professor" element={<DemoProfessor />} />
        <Route path="aluno" element={<DemoAluno />} />

        {/* Telas de login antigas -> rotas consolidadas /login/:role */}
        <Route path="loginaluno" element={<Navigate to="/login/aluno" replace />} />
        <Route path="logingestor" element={<Navigate to="/login/gestor" replace />} />

        {/* Aliases legados */}
        <Route path="demo-gestor" element={<Navigate to="/demo/gestor" replace />} />
        <Route path="demo-professor" element={<Navigate to="/demo/professor" replace />} />
        <Route path="demo-aluno" element={<Navigate to="/demo/aluno" replace />} />

        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </Suspense>
  );
}
