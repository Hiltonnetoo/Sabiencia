// ============================================
// CONFIGURAÇÕES GESTOR PAGE
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { NotificationPreferences } from '../../components/notifications/NotificationPreferences';
import { PrivacidadeSettings } from '../../components/shared/PrivacidadeSettings';
import { SistemaSettings } from '../../components/shared/SistemaSettings';
import { AparenciaSettings } from '../../components/shared/AparenciaSettings';
import { Bell, Shield, Palette, Database } from 'lucide-react';

export const ConfiguracoesGestorPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('gestor.configuracoes.title')}</h1>
        <p className="text-gray-600 mt-1">{t('gestor.configuracoes.subtitle')}</p>
      </div>

      <Tabs defaultValue="notificacoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notificacoes">
            <Bell className="w-4 h-4 mr-2" />
            {t('gestor.configuracoes.tabs.notifications')}
          </TabsTrigger>
          <TabsTrigger value="sistema">
            <Database className="w-4 h-4 mr-2" />
            {t('gestor.configuracoes.tabs.system')}
          </TabsTrigger>
          <TabsTrigger value="privacidade">
            <Shield className="w-4 h-4 mr-2" />
            {t('gestor.configuracoes.tabs.privacy')}
          </TabsTrigger>
          <TabsTrigger value="aparencia">
            <Palette className="w-4 h-4 mr-2" />
            {t('gestor.configuracoes.tabs.appearance')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('gestor.configuracoes.notificationsTitle')}</CardTitle>
              <CardDescription>
                {t('gestor.configuracoes.notificationsDescription')}
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
              <CardTitle>{t('gestor.configuracoes.systemTitle')}</CardTitle>
              <CardDescription>
                {t('gestor.configuracoes.systemDescription')}
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
              <CardTitle>{t('gestor.configuracoes.privacyTitle')}</CardTitle>
              <CardDescription>
                {t('gestor.configuracoes.privacyDescription')}
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
              <CardTitle>{t('gestor.configuracoes.appearanceTitle')}</CardTitle>
              <CardDescription>
                {t('gestor.configuracoes.appearanceDescription')}
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