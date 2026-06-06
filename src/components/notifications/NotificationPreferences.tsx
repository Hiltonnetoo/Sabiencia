// ============================================
// NOTIFICATION PREFERENCES - Configurações de notificações
// ============================================

import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Mail, Smartphone, Bell, Calendar } from 'lucide-react';
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
      toast.success('Preferências salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar preferências');
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
      <Callout variant="info" title="Importante">
        Você pode ajustar suas preferências a qualquer momento. Recomendamos manter ativas as
        notificações de comunicados e financeiro.
      </Callout>

      {/* Notificações por Email */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Notificações por Email</h3>
            <p className="text-sm text-gray-600">Receba atualizações no seu email</p>
          </div>
        </div>

        <PreferenceItem
          name="email_comunicados"
          label="Comunicados"
          description="Receber comunicados importantes da escola"
        />
        <PreferenceItem
          name="email_notas"
          label="Notas e Avaliações"
          description="Ser notificado sobre lançamento de notas"
        />
        <PreferenceItem
          name="email_frequencia"
          label="Frequência"
          description="Receber alertas sobre faltas e presenças"
        />
        <PreferenceItem
          name="email_financeiro"
          label="Financeiro"
          description="Lembretes de pagamentos e cobranças"
        />
        <PreferenceItem
          name="email_materiais"
          label="Materiais Didáticos"
          description="Novos materiais disponibilizados"
        />
      </div>

      {/* Notificações Push */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Smartphone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Notificações no Sistema</h3>
            <p className="text-sm text-gray-600">Alertas em tempo real no sistema</p>
          </div>
        </div>

        <PreferenceItem
          name="push_comunicados"
          label="Comunicados"
          description="Notificações instantâneas de comunicados"
        />
        <PreferenceItem
          name="push_notas"
          label="Notas e Avaliações"
          description="Alertas sobre novas notas lançadas"
        />
        <PreferenceItem
          name="push_frequencia"
          label="Frequência"
          description="Notificações sobre registros de presença"
        />
        <PreferenceItem
          name="push_financeiro"
          label="Financeiro"
          description="Alertas de vencimentos e pagamentos"
        />
        <PreferenceItem
          name="push_materiais"
          label="Materiais Didáticos"
          description="Notificações de novos conteúdos"
        />
      </div>

      {/* Resumos */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Resumos Periódicos</h3>
            <p className="text-sm text-gray-600">Receba compilados de atividades</p>
          </div>
        </div>

        <PreferenceItem
          name="resumo_diario"
          label="Resumo Diário"
          description="Receber um resumo das atividades do dia"
        />
        <PreferenceItem
          name="resumo_semanal"
          label="Resumo Semanal"
          description="Receber um resumo das atividades da semana"
        />
      </div>

      {/* Botão de Salvar */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Salvando...' : 'Salvar Preferências'}
        </Button>
      </div>
    </form>
  );
}
