// ============================================
// CONFIGURAÇÕES PROFESSOR PAGE
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { NotificationPreferences } from '../../components/notifications/NotificationPreferences';
import { PrivacidadeSettings } from '../../components/shared/PrivacidadeSettings';
import { AparenciaSettings } from '../../components/shared/AparenciaSettings';
import { Bell, Shield, Palette } from 'lucide-react';

export const ConfiguracoesProfessorPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('professor.configuracoes.title')}</h1>
        <p className="text-gray-600 mt-1">{t('professor.configuracoes.subtitle')}</p>
      </div>

      <Tabs defaultValue="notificacoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notificacoes">
            <Bell className="w-4 h-4 mr-2" />
            {t('professor.configuracoes.tabs.notifications')}
          </TabsTrigger>
          <TabsTrigger value="privacidade">
            <Shield className="w-4 h-4 mr-2" />
            {t('professor.configuracoes.tabs.privacy')}
          </TabsTrigger>
          <TabsTrigger value="aparencia">
            <Palette className="w-4 h-4 mr-2" />
            {t('professor.configuracoes.tabs.appearance')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('professor.configuracoes.notifications.title')}</CardTitle>
              <CardDescription>
                {t('professor.configuracoes.notifications.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationPreferences
                onSave={(data) => {
                  if (import.meta.env.DEV) {
                    console.debug('[ConfiguracoesProfessor] Preferências salvas');
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('professor.configuracoes.privacy.title')}</CardTitle>
              <CardDescription>
                {t('professor.configuracoes.privacy.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrivacidadeSettings userRole="professor" />
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

export default ConfiguracoesProfessorPage;