// ============================================
// PERFIL GESTOR PAGE
// ============================================

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { PerfilHeader } from '../../components/perfil/PerfilHeader';
import { PerfilForm } from '../../components/perfil/PerfilForm';
import { PasswordChangeForm } from '../../components/perfil/PasswordChangeForm';
import { AtividadesRecentes } from '../../components/perfil/AtividadesRecentes';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { Users, GraduationCap, BookOpen, DollarSign } from 'lucide-react';
import { Callout } from '../../components/shared/Callout';
import type { PerfilPessoalFormData, AlterarSenhaFormData } from '../../schemas/perfilSchemas';

export const PerfilGestorPage: React.FC = () => {
  const { user } = useAuth();
  const { alunos, professores, turmas, cursos } = useMockData();

  if (!user) return null;

  // Estatísticas gerais
  const totalAlunos = alunos.filter((a) => a.ativo).length;
  const totalProfessores = professores.filter((p) => p.ativo).length;
  const totalTurmas = turmas.filter((t) => t.ativo).length;
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
          <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="gestao">Visão de Gestão</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
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
                    <p className="text-sm text-gray-600">Alunos Ativos</p>
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
                    <p className="text-sm text-gray-600">Professores</p>
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
                    <p className="text-sm text-gray-600">Turmas Ativas</p>
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
                    <p className="text-sm text-gray-600">Cursos Ativos</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalCursos}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Gestão */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informações de Gestão</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Cargo</p>
                  <p className="text-gray-900">Gestor / CEO</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Nível de Acesso</p>
                  <p className="text-gray-900">Administrador Total</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Permissões</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Gestão de Alunos
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Gestão de Professores
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      Gestão Financeira
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                      Relatórios Completos
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      Configurações do Sistema
                    </span>
                  </div>
                </div>

                <Callout variant="info" title="Sobre as Permissões">
                  Como gestor, você tem acesso completo a todas as funcionalidades do sistema,
                  incluindo gestão de usuários, controle financeiro, relatórios e configurações.
                </Callout>
              </div>
            </div>

            {/* Resumo Institucional */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo Institucional</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1">Total de Alunos</p>
                  <p className="text-3xl font-semibold text-blue-900 mb-2">{totalAlunos}</p>
                  <p className="text-xs text-blue-700">Matriculados ativos</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 mb-1">Corpo Docente</p>
                  <p className="text-3xl font-semibold text-green-900 mb-2">{totalProfessores}</p>
                  <p className="text-xs text-green-700">Professores ativos</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 mb-1">Cursos Ofertados</p>
                  <p className="text-3xl font-semibold text-purple-900 mb-2">{totalCursos}</p>
                  <p className="text-xs text-purple-700">Programas disponíveis</p>
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
