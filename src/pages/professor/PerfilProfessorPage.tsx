// ============================================
// PERFIL PROFESSOR PAGE
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
import { BookOpen, Users, FileText } from 'lucide-react';
import type { PerfilPessoalFormData, AlterarSenhaFormData } from '../../schemas/perfilSchemas';

export const PerfilProfessorPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { professores, professorTurmaDisciplina, observacoes } = useMockData();

  if (!user) return null;

  // Buscar dados do professor
  const professor = professores.find((p) => p.id === user.id);

  // Estatísticas
  const minhasTurmas = professorTurmaDisciplina
    .filter((ptd) => ptd.professor_id === user.id)
    .map((ptd) => ptd.turma_id);

  const minhasDisciplinas = professorTurmaDisciplina
    .filter((ptd) => ptd.professor_id === user.id)
    .map((ptd) => ptd.disciplina_id);

  const minhasObservacoes = observacoes.filter((o) => o.professor_id === user.id);

  const turmasUnicas = [...new Set(minhasTurmas)].length;
  const disciplinasUnicas = [...new Set(minhasDisciplinas)].length;

  const handleSavePerfil = (data: PerfilPessoalFormData) => {
    // ✅ SEGURANÇA: Não logar dados pessoais (CPF, email, telefone)
    if (import.meta.env.DEV) {
      console.debug('[PerfilProfessor] Perfil atualizado');
    }
  };

  const handleSaveSenha = (data: AlterarSenhaFormData) => {
    // ✅ SEGURANÇA: NUNCA logar senhas (nem antiga, nem nova)
    if (import.meta.env.DEV) {
      console.debug('[PerfilProfessor] Senha alterada com sucesso');
    }
  };

  const handleFotoChange = (url: string) => {
    // Foto pode ser logada (URL não é sensível)
    if (import.meta.env.DEV) {
      console.debug('[PerfilProfessor] Foto atualizada:', url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <PerfilHeader user={user} onFotoChange={handleFotoChange} />

      {/* Tabs */}
      <Tabs defaultValue="dados-pessoais" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dados-pessoais">{t('professor.perfil.tabs.personalData')}</TabsTrigger>
          <TabsTrigger value="profissional">{t('professor.perfil.tabs.professionalData')}</TabsTrigger>
          <TabsTrigger value="seguranca">{t('professor.perfil.tabs.security')}</TabsTrigger>
          <TabsTrigger value="atividades">{t('professor.perfil.tabs.activities')}</TabsTrigger>
        </TabsList>

        {/* Tab: Dados Pessoais */}
        <TabsContent value="dados-pessoais">
          <PerfilForm user={user} onSave={handleSavePerfil} />
        </TabsContent>

        {/* Tab: Dados Profissionais */}
        <TabsContent value="profissional">
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('professor.perfil.stats.classes')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{turmasUnicas}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('professor.perfil.stats.subjects')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{disciplinasUnicas}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FileText className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('professor.perfil.stats.observations')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{minhasObservacoes.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('professor.perfil.professionalInfo')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('professor.perfil.fields.education')}</p>
                  <p className="text-gray-900">
                    {professor?.formacao || t('professor.perfil.notInformed')}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('professor.perfil.fields.specialization')}</p>
                  <p className="text-gray-900">
                    {professor?.especialidades?.join(', ') || professor?.especializacao || t('professor.perfil.notInformed')}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('professor.perfil.fields.professionalRegistration')}</p>
                  <p className="text-gray-900">{t('professor.perfil.notInformed')}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{t('professor.perfil.fields.admissionDate')}</p>
                  <p className="text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
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

export default PerfilProfessorPage;
