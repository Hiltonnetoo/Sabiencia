// ============================================
// CALLOUT - Aviso contextual reutilizável (info/warning/success/error)
// Padroniza os avisos do sistema usando ícones do design system (lucide-react)
// em vez de emojis soltos.
// ============================================

import React from 'react';
import { Info, AlertTriangle, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

type CalloutVariant = 'info' | 'warning' | 'success' | 'error';

interface CalloutConfig {
  container: string;
  icon: string;
  title: string;
  Icon: LucideIcon;
}

const VARIANTS: Record<CalloutVariant, CalloutConfig> = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    Icon: Info,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    Icon: AlertTriangle,
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-900',
    icon: 'text-green-600',
    title: 'text-green-900',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-900',
    icon: 'text-red-600',
    title: 'text-red-900',
    Icon: XCircle,
  },
};

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  variant = 'info',
  title,
  children,
  className,
}) => {
  const config = VARIANTS[variant];
  const { Icon } = config;

  return (
    <div
      role="note"
      className={cn('flex items-start gap-3 rounded-lg border p-4', config.container, className)}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.icon)} aria-hidden="true" />
      <div className="text-sm">
        {title && <p className={cn('font-semibold mb-1', config.title)}>{title}</p>}
        <div className="[&_strong]:font-semibold">{children}</div>
      </div>
    </div>
  );
};

export default Callout;
