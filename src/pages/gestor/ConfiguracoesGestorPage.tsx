// ============================================
// CONFIGURAÇÕES GESTOR PAGE
// ============================================

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { NotificationPreferences } from '../../components/notifications/NotificationPreferences';
import { PrivacidadeSettings } from '../../components/shared/PrivacidadeSettings';
import { SistemaSettings } from '../../components/shared/SistemaSettings';
import { AparenciaSettings } from '../../components/shared/AparenciaSettings';
import { Bell, Shield, Palette, Database } from 'lucide-react';

export const ConfiguracoesGestorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-600 mt-1">Gerencie configurações gerais e preferências administrativas</p>
      </div>

      <Tabs defaultValue="notificacoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notificacoes">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="sistema">
            <Database className="w-4 h-4 mr-2" />
            Sistema
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
                Configure como e quando você deseja receber notificações administrativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationPreferences
                onSave={(data) => {
                  if (import.meta.env.DEV) {
                    console.debug('[ConfiguracoesGestor] Preferências salvas');
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configurações gerais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SistemaSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
              <CardDescription>
                Gerencie configurações de privacidade e segurança (LGPD)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacidadeSettings userRole="gestor" />
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

export default ConfiguracoesGestorPage;