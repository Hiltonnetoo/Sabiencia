// ============================================
// PERFIL ALUNO PAGE
// ============================================

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { PerfilHeader } from '../../components/perfil/PerfilHeader';
import { PerfilForm } from '../../components/perfil/PerfilForm';
import { PasswordChangeForm } from '../../components/perfil/PasswordChangeForm';
import { DadosAcademicosCard } from '../../components/perfil/DadosAcademicosCard';
import { AtividadesRecentes } from '../../components/perfil/AtividadesRecentes';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import type { PerfilPessoalFormData, AlterarSenhaFormData } from '../../schemas/perfilSchemas';

export const PerfilAlunoPage: React.FC = () => {
  const { user } = useAuth();
  const { alunos, matriculas, turmas, cursos } = useMockData();

  if (!user) return null;

  // Buscar dados do aluno
  const aluno = alunos.find((a) => a.id === user.id);
  const matricula = matriculas.find((m) => m.aluno_id === user.id);
  const turma = matricula ? turmas.find((t) => t.id === matricula.turma_id) : undefined;
  const curso = turma ? cursos.find((c) => c.id === turma.curso_id) : undefined;

  const handleSavePerfil = (data: PerfilPessoalFormData) => {
    // ✅ SEGURANÇA: Não logar dados pessoais (CPF, email, telefone)
    if (import.meta.env.DEV) {
      console.debug('[PerfilAluno] Perfil atualizado');
    }
    // Em produção, aqui chamaria a API para salvar os dados
  };

  const handleSaveSenha = (data: AlterarSenhaFormData) => {
    // ✅ SEGURANÇA: NUNCA logar senhas (nem antiga, nem nova)
    if (import.meta.env.DEV) {
      console.debug('[PerfilAluno] Senha alterada com sucesso');
    }
    // Em produção, aqui chamaria a API para alterar a senha
  };

  const handleFotoChange = (url: string) => {
    // Foto pode ser logada (URL não é sensível)
    if (import.meta.env.DEV) {
      console.debug('[PerfilAluno] Foto atualizada:', url);
    }
    // Em produção, aqui chamaria a API para salvar a foto
  };

  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <PerfilHeader user={user} onFotoChange={handleFotoChange} />

      {/* Tabs */}
      <Tabs defaultValue="dados-pessoais" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="academico">Dados Acadêmicos</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
        </TabsList>

        {/* Tab: Dados Pessoais */}
        <TabsContent value="dados-pessoais">
          <PerfilForm user={user} onSave={handleSavePerfil} />
        </TabsContent>

        {/* Tab: Dados Acadêmicos */}
        <TabsContent value="academico">
          {aluno ? (
            <DadosAcademicosCard
              aluno={aluno}
              matricula={matricula}
              turma={turma}
              curso={curso}
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600">Dados acadêmicos não disponíveis</p>
            </div>
          )}
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

export default PerfilAlunoPage;
