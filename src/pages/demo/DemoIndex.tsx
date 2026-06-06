// ============================================
// DEMO INDEX - Página inicial das demonstrações
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, GraduationCap, BookOpen, ArrowRight, Home } from 'lucide-react';
import { SabienciaMonogramBadge } from '../../components/brand/SabienciaBrand';

export const DemoIndex: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <SabienciaMonogramBadge className="inline-flex w-20 h-20 rounded-full mb-6" labelClassName="text-2xl" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sistema EAD - Sabiencia
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Explore a plataforma pelos três perfis de acesso
          </p>
          <p className="text-sm text-gray-500">
            Escolha um perfil abaixo para entrar no ambiente correspondente
          </p>
        </div>

        {/* Cards de Demonstração */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Gestor */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Gestor / CEO</CardTitle>
              <CardDescription>Administrador do Sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-600">
                  <strong>Acesso completo:</strong>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Gestão de alunos e professores</li>
                  <li>• Controle financeiro</li>
                  <li>• Relatórios gerenciais</li>
                  <li>• Auditoria do sistema</li>
                  <li>• Configurações gerais</li>
                </ul>
              </div>
              <Button 
                onClick={() => navigate('/demo/gestor')}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Ver Dashboard Gestor
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
              <CardTitle className="text-2xl">Professor</CardTitle>
              <CardDescription>Ana Paula Costa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-600">
                  <strong>Funcionalidades:</strong>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Minhas turmas e alunos</li>
                  <li>• Lançamento de notas</li>
                  <li>• Registro de frequência</li>
                  <li>• Upload de materiais</li>
                  <li>• Observações sobre alunos</li>
                </ul>
              </div>
              <Button 
                onClick={() => navigate('/demo/professor')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Ver Dashboard Professor
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
              <CardTitle className="text-2xl">Aluno</CardTitle>
              <CardDescription>João Pedro Santos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-600">
                  <strong>Acesso do estudante:</strong>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Aulas em vídeo (YouTube)</li>
                  <li>• Download de materiais</li>
                  <li>• Consulta de notas</li>
                  <li>• Histórico de frequência</li>
                  <li>• Situação financeira</li>
                </ul>
              </div>
              <Button 
                onClick={() => navigate('/demo/aluno')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Ver Dashboard Aluno
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informações Adicionais */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3 text-blue-900">
              Sobre esta demonstração
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>Dados realistas:</strong> os ambientes são populados com um conjunto de dados de
                exemplo — alunos, professores, cursos e turmas — que reproduz uma operação acadêmica real.
              </p>
              <p>
                <strong>Navegação completa:</strong> explore o menu lateral e percorra os fluxos de cada
                perfil livremente.
              </p>
              <p>
                <strong>Totalmente responsivo:</strong> redimensione a janela para ver a interface se
                adaptar a desktop, tablet e mobile.
              </p>
              <p>
                <strong>Métricas dinâmicas:</strong> médias, frequências e indicadores são calculados em
                tempo real a partir dos dados.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botão voltar */}
        <div className="text-center mt-8">
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar para Landing Page
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Sabiencia — Plataforma de Gestão Educacional EAD
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Desenvolvido com React + TypeScript + Tailwind CSS + shadcn/ui
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoIndex;
