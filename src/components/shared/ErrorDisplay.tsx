// ============================================
// ERROR DISPLAY - Componente para exibir erros contextuais
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { ErrorType, getErrorMessage } from '../../utils/errorMessages';

interface ErrorDisplayProps {
  type: ErrorType;
  customMessage?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  type,
  customMessage,
  onRetry,
  onGoBack,
  className,
}) => {
  const { t } = useTranslation();
  const error = getErrorMessage(type, customMessage);

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{error.title}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>{error.message}</p>
        {error.action && (
          <p className="text-sm text-gray-600">{error.action}</p>
        )}
        
        <div className="flex gap-2 mt-4">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('common.actions.retry')}
            </Button>
          )}
          {onGoBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.actions.back')}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

/**
 * Hook para mostrar erros em toasts
 */
import { toast } from 'sonner';
import i18n from '../../i18n';

export const showErrorToast = (
  type: ErrorType,
  customMessage?: string,
  onRetry?: () => void
) => {
  const error = getErrorMessage(type, customMessage);

  toast.error(error.title, {
    description: error.message,
    action: onRetry ? {
      label: i18n.t('common.actions.retry'),
      onClick: onRetry,
    } : undefined,
    duration: 5000,
  });
};
