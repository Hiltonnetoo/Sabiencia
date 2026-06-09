// ============================================
// DEMO INDEX - Página inicial das demonstrações
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, GraduationCap, BookOpen, ArrowRight, Home } from 'lucide-react';
import { SabienciaMonogramBadge } from '../../components/brand/SabienciaBrand';
import { LanguageSwitcher } from '../../components/shared/LanguageSwitcher';

export const DemoIndex: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const managerFeatures = t('demo.managerFeatures', { returnObjects: true }) as string[];
  const teacherFeatures = t('demo.teacherFeatures', { returnObjects: true }) as string[];
  const studentFeatures = t('demo.studentFeatures', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Language switch */}
        <div className="flex justify-end mb-2">
          <LanguageSwitcher variant="outline" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <SabienciaMonogramBadge className="inline-flex w-20 h-20 rounded-full mb-6" labelClassName="text-2xl" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sistema EAD - Sabiencia
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {t('demo.subtitle')}
          </p>
          <p className="text-sm text-gray-500">
            {t('demo.chooseProfile')}
          </p>
        </div>

        {/* Aviso / contexto da demonstração (no topo, antes dos cards) */}
        <Card className="bg-blue-50 border-blue-200 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-900">
              {t('demo.aboutTitle')}
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>{t('demo.aboutData')}</p>
              <p>{t('demo.aboutNav')}</p>
              <p>{t('demo.aboutResponsive')}</p>
              <p>{t('demo.aboutMetrics')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Demonstração */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Gestor */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">{t('demo.roles.managerTitle')}</CardTitle>
              <CardDescription>{t('demo.roles.managerSubtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-600">
                  <strong>{t('demo.accessComplete')}</strong>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  {managerFeatures.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => navigate('/demo/gestor')}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                {t('demo.viewManagerDashboard')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Professor */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">{t('demo.roles.teacherTitle')}</CardTitle>
              <CardDescription>Ana Paula Costa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-600">
                  <strong>{t('demo.features')}</strong>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  {teacherFeatures.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => navigate('/demo/professor')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {t('demo.viewTeacherDashboard')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Aluno */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-green-500">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{t('demo.roles.studentTitle')}</CardTitle>
              <CardDescription>João Pedro Santos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-600">
                  <strong>{t('demo.studentAccess')}</strong>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  {studentFeatures.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => navigate('/demo/aluno')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {t('demo.viewStudentDashboard')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Botão voltar */}
        <div className="text-center mt-8">
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            {t('demo.backToLanding')}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t('demo.footerTagline')}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {t('demo.builtWith')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoIndex;
