// ============================================
// PERFIL GESTOR PAGE
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { PerfilHeader } from '../../components/perfil/PerfilHeader';
import { PerfilForm } from '../../components/perfil/PerfilForm';
import { PasswordChangeForm } from '../../components/perfil/PasswordChangeForm';
import { AtividadesRecentes } from '../../components/perfil/AtividadesRecentes';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { Callout } from '../../components/shared/Callout';
import type { PerfilPessoalFormData, AlterarSenhaFormData } from '../../schemas/perfilSchemas';

export const PerfilGestorPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { alunos, professores, turmas, cursos } = useMockData();

  if (!user) return null;

  // Estatísticas gerais
  const totalAlunos = alunos.filter((a) => a.ativo).length;
  const totalProfessores = professores.filter((p) => p.ativo).length;
  const totalTurmas = turmas.filter((t) => t.ativa).length;
  const totalCursos = cursos.filter((c) => c.ativo).length;

  const handleSavePerfil = (data: PerfilPessoalFormData) => {
    // ✅ SEGURANÇA: Não logar dados pessoais (CPF, email, telefone)
    if (import.meta.env.DEV) {
      console.debug('[PerfilGestor] Perfil atualizado');
    }
  };

  const handleSaveSenha = (data: AlterarSenhaFormData) => {
    // ✅ SEGURANÇA: NUNCA logar senhas (nem antiga, nem nova)
    if (import.meta.env.DEV) {
      console.debug('[PerfilGestor] Senha alterada com sucesso');
    }
  };

  const handleFotoChange = (url: string) => {
    // Foto pode ser logada (URL não é sensível)
    if (import.meta.env.DEV) {
      console.debug('[PerfilGestor] Foto atualizada:', url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <PerfilHeader user={user} onFotoChange={handleFotoChange} />

      {/* Tabs */}
      <Tabs defaultValue="dados-pessoais" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dados-pessoais">{t('gestor.perfil.tabs.personalData')}</TabsTrigger>
          <TabsTrigger value="gestao">{t('gestor.perfil.tabs.managementView')}</TabsTrigger>
          <TabsTrigger value="seguranca">{t('gestor.perfil.tabs.security')}</TabsTrigger>
          <TabsTrigger value="atividades">{t('gestor.perfil.tabs.activities')}</TabsTrigger>
        </TabsList>

        {/* Tab: Dados Pessoais */}
        <TabsContent value="dados-pessoais">
          <PerfilForm user={user} onSave={handleSavePerfil} />
        </TabsContent>

        {/* Tab: Visão de Gestão */}
        <TabsContent value="gestao">
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('gestor.perfil.stats.activeStudents')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalAlunos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('gestor.perfil.stats.teachers')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalProfessores}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('gestor.perfil.stats.activeClasses')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalTurmas}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('gestor.perfil.stats.activeCourses')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalCursos}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Gestão */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('gestor.perfil.managementInfoTitle')}</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('gestor.perfil.role')}</p>
                  <p className="text-gray-900">{t('gestor.perfil.roleValue')}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('gestor.perfil.accessLevel')}</p>
                  <p className="text-gray-900">{t('gestor.perfil.accessLevelValue')}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('gestor.perfil.permissions')}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {t('gestor.perfil.perm.students')}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {t('gestor.perfil.perm.teachers')}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {t('gestor.perfil.perm.financial')}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                      {t('gestor.perfil.perm.reports')}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      {t('gestor.perfil.perm.systemSettings')}
                    </span>
                  </div>
                </div>

                <Callout variant="info" title={t('gestor.perfil.calloutTitle')}>
                  {t('gestor.perfil.calloutBody')}
                </Callout>
              </div>
            </div>

            {/* Resumo Institucional */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('gestor.perfil.institutionalSummaryTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1">{t('gestor.perfil.totalStudents')}</p>
                  <p className="text-3xl font-semibold text-blue-900 mb-2">{totalAlunos}</p>
                  <p className="text-xs text-blue-700">{t('gestor.perfil.activeEnrolled')}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 mb-1">{t('gestor.perfil.facultyBody')}</p>
                  <p className="text-3xl font-semibold text-green-900 mb-2">{totalProfessores}</p>
                  <p className="text-xs text-green-700">{t('gestor.perfil.activeTeachers')}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 mb-1">{t('gestor.perfil.offeredCourses')}</p>
                  <p className="text-3xl font-semibold text-purple-900 mb-2">{totalCursos}</p>
                  <p className="text-xs text-purple-700">{t('gestor.perfil.availablePrograms')}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Segurança */}
        <TabsContent value="seguranca">
          <PasswordChangeForm onSave={handleSaveSenha} />
        </TabsContent>

        {/* Tab: Atividades */}
        <TabsContent value="atividades">
          <AtividadesRecentes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerfilGestorPage;
