// ============================================
// CONFIGURAÇÕES DE PRIVACIDADE - Componente Reutilizável
// ============================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Eye,
  EyeOff,
  Mail,
  Bell,
  Download,
  Trash2,
  Shield,
  FileText,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface PrivacidadeSettingsProps {
  userRole: 'aluno' | 'professor' | 'gestor';
}

export const PrivacidadeSettings: React.FC<PrivacidadeSettingsProps> = ({ userRole }) => {
  const { t } = useTranslation();

  const [mostrarFoto, setMostrarFoto] = useState(true);
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [mostrarTelefone, setMostrarTelefone] = useState(false);
  const [receberEmailComunicados, setReceberEmailComunicados] = useState(true);
  const [receberSMS, setReceberSMS] = useState(false);
  const [notificacoesPush, setNotificacoesPush] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(t('components.privacidadeSettings.settingsUpdated'), {
      description: t('components.privacidadeSettings.settingsUpdatedDesc'),
    });
    setSalvando(false);
  };

  const handleExportarDados = () => {
    toast.info(t('components.privacidadeSettings.exportRequested'), {
      description: t('components.privacidadeSettings.exportRequestedDesc'),
    });
  };

  const handleSolicitarExclusao = () => {
    toast.warning(t('components.privacidadeSettings.deletionRequested'), {
      description: t('components.privacidadeSettings.deletionRequestedDesc'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Aviso LGPD */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription
          dangerouslySetInnerHTML={{ __html: t('components.privacidadeSettings.lgpdNotice') }}
        />
      </Alert>

      {/* Visibilidade do Perfil */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{t('components.privacidadeSettings.profileVisibility')}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {t('components.privacidadeSettings.profileVisibilityDesc')}
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mostrarFoto ? <Eye className="h-4 w-4 text-gray-500" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
              <div>
                <Label htmlFor="mostrar-foto">{t('components.privacidadeSettings.showPhoto')}</Label>
                <p className="text-sm text-gray-500">
                  {t('components.privacidadeSettings.showPhotoDesc')}
                </p>
              </div>
            </div>
            <Switch
              id="mostrar-foto"
              checked={mostrarFoto}
              onCheckedChange={setMostrarFoto}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="mostrar-email">{t('components.privacidadeSettings.showEmail')}</Label>
                <p className="text-sm text-gray-500">
                  {userRole === 'aluno'
                    ? t('components.privacidadeSettings.showEmailStudent')
                    : t('components.privacidadeSettings.showEmailOther')}
                </p>
              </div>
            </div>
            <Switch
              id="mostrar-email"
              checked={mostrarEmail}
              onCheckedChange={setMostrarEmail}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="mostrar-telefone">{t('components.privacidadeSettings.showPhone')}</Label>
                <p className="text-sm text-gray-500">
                  {userRole === 'aluno'
                    ? t('components.privacidadeSettings.showPhoneStudent')
                    : t('components.privacidadeSettings.showPhoneOther')}
                </p>
              </div>
            </div>
            <Switch
              id="mostrar-telefone"
              checked={mostrarTelefone}
              onCheckedChange={setMostrarTelefone}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Comunicações */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{t('components.privacidadeSettings.communications')}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {t('components.privacidadeSettings.communicationsDesc')}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="email-comunicados">{t('components.privacidadeSettings.emailAnnouncements')}</Label>
                <p className="text-sm text-gray-500">
                  {t('components.privacidadeSettings.emailAnnouncementsDesc')}
                </p>
              </div>
            </div>
            <Switch
              id="email-comunicados"
              checked={receberEmailComunicados}
              onCheckedChange={setReceberEmailComunicados}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="sms">{t('components.privacidadeSettings.sms')}</Label>
                <p className="text-sm text-gray-500">
                  {t('components.privacidadeSettings.smsDesc')}
                </p>
              </div>
            </div>
            <Switch
              id="sms"
              checked={receberSMS}
              onCheckedChange={setReceberSMS}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="push">{t('components.privacidadeSettings.push')}</Label>
                <p className="text-sm text-gray-500">
                  {t('components.privacidadeSettings.pushDesc')}
                </p>
              </div>
            </div>
            <Switch
              id="push"
              checked={notificacoesPush}
              onCheckedChange={setNotificacoesPush}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Seus Dados (LGPD) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{t('components.privacidadeSettings.personalData')}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {t('components.privacidadeSettings.personalDataDesc')}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleExportarDados}
          >
            <Download className="h-4 w-4" />
            {t('components.privacidadeSettings.exportData')}
            <span className="text-xs text-gray-500 ml-auto">{t('components.privacidadeSettings.exportDataDesc')}</span>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSolicitarExclusao}
          >
            <Trash2 className="h-4 w-4" />
            {t('components.privacidadeSettings.requestDeletion')}
            <span className="text-xs text-gray-500 ml-auto">{t('components.privacidadeSettings.requestDeletionDesc')}</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Termos e Política */}
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{t('components.privacidadeSettings.legalDocuments')}</span>
        </div>
        <div className="space-y-2 text-sm">
          <a href="#" className="text-blue-600 hover:underline block">
            📄 {t('components.privacidadeSettings.privacyPolicy')}
          </a>
          <a href="#" className="text-blue-600 hover:underline block">
            📄 {t('components.privacidadeSettings.termsOfUse')}
          </a>
          <p className="text-xs text-gray-500 mt-2">
            {t('components.privacidadeSettings.lastUpdated')}
          </p>
          <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
            <Check className="h-3 w-3" />
            <span>{t('components.privacidadeSettings.termsAccepted')}</span>
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSalvar} disabled={salvando} className="gap-2">
          {salvando ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('components.privacidadeSettings.saving')}
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              {t('components.privacidadeSettings.saveSettings')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
