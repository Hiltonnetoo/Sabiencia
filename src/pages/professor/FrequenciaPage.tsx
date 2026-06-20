// ============================================
// FREQUÊNCIA PAGE (PROFESSOR) - Registro de presença
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { ListaPresencaForm } from '../../components/frequencia/ListaPresencaForm';
import { Card, CardContent } from '../../components/ui/card';
import { ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

export const FrequenciaPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleSuccess = () => {
    toast.success(t('professor.frequencia.toast.saved'));
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">{t('professor.frequencia.notLoggedIn')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <ClipboardCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('professor.frequencia.title')}</h1>
            <p className="text-gray-600 mt-1">
              {t('professor.frequencia.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-medium text-blue-900 mb-2">{t('professor.frequencia.instructionsTitle')}</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>{t('professor.frequencia.instructions.step1')}</li>
            <li>{t('professor.frequencia.instructions.step2')}</li>
            <li>{t('professor.frequencia.instructions.step3')}</li>
            <li>{t('professor.frequencia.instructions.step4')}</li>
            <li>{t('professor.frequencia.instructions.step5')}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Formulário */}
      <ListaPresencaForm
        professorId={user.id}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default FrequenciaPage;
