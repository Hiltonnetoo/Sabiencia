// ============================================
// CONFIGURAÇÕES ALUNO PAGE
// ============================================

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { NotificationPreferences } from '../../components/notifications/NotificationPreferences';
import { PrivacidadeSettings } from '../../components/shared/PrivacidadeSettings';
import { AparenciaSettings } from '../../components/shared/AparenciaSettings';
import { Bell, Shield, Palette } from 'lucide-react';

export const ConfiguracoesAlunoPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <Tabs defaultValue="notificacoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notificacoes">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="privacidade">
            <Shield className="w-4 h-4 mr-2" />
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="aparencia">
            <Palette className="w-4 h-4 mr-2" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure como e quando você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationPreferences
                onSave={(data) => {
                  if (import.meta.env.DEV) {
                    console.debug('[ConfiguracoesAluno] Preferências salvas');
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
              <CardDescription>
                Gerencie suas configurações de privacidade e dados pessoais (LGPD)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacidadeSettings userRole="aluno" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aparência do Sistema</CardTitle>
              <CardDescription>
                Personalize a aparência da interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AparenciaSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesAlunoPage;