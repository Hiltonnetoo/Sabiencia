// ============================================
// NOTIFICATION PREFERENCES - Configurações de notificações
// ============================================

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Save, Mail, Smartphone, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { preferenciasNotificacaoSchema, type PreferenciasNotificacaoData } from '../../schemas/notificacaoSchemas';
import { Callout } from '../shared/Callout';

interface NotificationPreferencesProps {
  preferences?: PreferenciasNotificacaoData;
  onSave?: (data: PreferenciasNotificacaoData) => void;
}

export function NotificationPreferences({ preferences, onSave }: NotificationPreferencesProps) {
  const { t } = useTranslation();
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<PreferenciasNotificacaoData>({
    resolver: zodResolver(preferenciasNotificacaoSchema),
    defaultValues: preferences || {
      email_comunicados: true,
      email_notas: true,
      email_frequencia: false,
      email_financeiro: true,
      email_materiais: false,
      push_comunicados: true,
      push_notas: true,
      push_frequencia: false,
      push_financeiro: true,
      push_materiais: true,
      resumo_diario: false,
      resumo_semanal: true,
    },
  });

  const onSubmit = async (data: PreferenciasNotificacaoData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave?.(data);
      toast.success(t('components.notificationPreferences.preferencesSaved'));
    } catch (error) {
      toast.error(t('components.notificationPreferences.preferencesSaveError'));
    }
  };

  const PreferenceItem = ({
    label,
    description,
    name,
  }: {
    label: string;
    description: string;
    name: keyof PreferenciasNotificacaoData;
  }) => {
    const value = watch(name);

    return (
      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex-1">
          <Label htmlFor={name} className="text-sm font-medium text-gray-900 cursor-pointer">
            {label}
          </Label>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
        <Switch
          id={name}
          checked={value as boolean}
          onCheckedChange={(checked) => {
            setValue(name, checked as any, { shouldValidate: true });
          }}
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Callout variant="info" title={t('components.notificationPreferences.importantTitle')}>
        {t('components.notificationPreferences.importantText')}
      </Callout>

      {/* Notificações por Email */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t('components.notificationPreferences.emailTitle')}</h3>
            <p className="text-sm text-gray-600">{t('components.notificationPreferences.emailDesc')}</p>
          </div>
        </div>

        <PreferenceItem
          name="email_comunicados"
          label={t('components.notificationPreferences.announcements')}
          description={t('components.notificationPreferences.emailAnnouncementsDesc')}
        />
        <PreferenceItem
          name="email_notas"
          label={t('components.notificationPreferences.grades')}
          description={t('components.notificationPreferences.emailGradesDesc')}
        />
        <PreferenceItem
          name="email_frequencia"
          label={t('components.notificationPreferences.attendance')}
          description={t('components.notificationPreferences.emailAttendanceDesc')}
        />
        <PreferenceItem
          name="email_financeiro"
          label={t('components.notificationPreferences.financial')}
          description={t('components.notificationPreferences.emailFinancialDesc')}
        />
        <PreferenceItem
          name="email_materiais"
          label={t('components.notificationPreferences.materials')}
          description={t('components.notificationPreferences.emailMaterialsDesc')}
        />
      </div>

      {/* Notificações Push */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Smartphone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t('components.notificationPreferences.pushTitle')}</h3>
            <p className="text-sm text-gray-600">{t('components.notificationPreferences.pushDesc')}</p>
          </div>
        </div>

        <PreferenceItem
          name="push_comunicados"
          label={t('components.notificationPreferences.announcements')}
          description={t('components.notificationPreferences.pushAnnouncementsDesc')}
        />
        <PreferenceItem
          name="push_notas"
          label={t('components.notificationPreferences.grades')}
          description={t('components.notificationPreferences.pushGradesDesc')}
        />
        <PreferenceItem
          name="push_frequencia"
          label={t('components.notificationPreferences.attendance')}
          description={t('components.notificationPreferences.pushAttendanceDesc')}
        />
        <PreferenceItem
          name="push_financeiro"
          label={t('components.notificationPreferences.financial')}
          description={t('components.notificationPreferences.pushFinancialDesc')}
        />
        <PreferenceItem
          name="push_materiais"
          label={t('components.notificationPreferences.materials')}
          description={t('components.notificationPreferences.pushMaterialsDesc')}
        />
      </div>

      {/* Resumos */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{t('components.notificationPreferences.summariesTitle')}</h3>
            <p className="text-sm text-gray-600">{t('components.notificationPreferences.summariesDesc')}</p>
          </div>
        </div>

        <PreferenceItem
          name="resumo_diario"
          label={t('components.notificationPreferences.dailySummary')}
          description={t('components.notificationPreferences.dailySummaryDesc')}
        />
        <PreferenceItem
          name="resumo_semanal"
          label={t('components.notificationPreferences.weeklySummary')}
          description={t('components.notificationPreferences.weeklySummaryDesc')}
        />
      </div>

      {/* Botão de Salvar */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? t('common.actions.saving') : t('components.notificationPreferences.savePreferences')}
        </Button>
      </div>
    </form>
  );
}
