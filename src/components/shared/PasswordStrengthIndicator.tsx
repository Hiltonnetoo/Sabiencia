// ============================================
// PASSWORD STRENGTH INDICATOR - Indicador visual de força de senha
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../ui/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  bgColor: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export function PasswordStrengthIndicator({ 
  password, 
  showDetails = true 
}: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation();

  const calculateStrength = (pwd: string): StrengthResult => {
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[^a-zA-Z0-9]/.test(pwd),
    };

    const score = Object.values(checks).filter(Boolean).length;

    let label = t('components.passwordStrength.veryWeak');
    let color = 'text-red-600';
    let bgColor = 'bg-red-600';

    if (score === 0) {
      label = t('components.passwordStrength.veryWeak');
      color = 'text-red-600';
      bgColor = 'bg-red-600';
    } else if (score <= 2) {
      label = t('components.passwordStrength.weak');
      color = 'text-orange-600';
      bgColor = 'bg-orange-600';
    } else if (score === 3) {
      label = t('components.passwordStrength.medium');
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-600';
    } else if (score === 4) {
      label = t('components.passwordStrength.good');
      color = 'text-blue-600';
      bgColor = 'bg-blue-600';
    } else {
      label = t('components.passwordStrength.strong');
      color = 'text-green-600';
      bgColor = 'bg-green-600';
    }

    return { score, label, color, bgColor, checks };
  };

  if (!password) return null;

  const strength = calculateStrength(password);
  const percentage = (strength.score / 5) * 100;

  return (
    <div className="space-y-2">
      {/* Barra de progresso */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{t('components.passwordStrength.strengthLabel')}</span>
          <span className={cn('text-xs font-semibold', strength.color)}>
            {strength.label}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', strength.bgColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Detalhes dos requisitos */}
      {showDetails && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600">{t('components.passwordStrength.requirements')}</p>
          <ul className="space-y-1">
            <RequirementItem
              met={strength.checks.length}
              text={t('components.passwordStrength.minLength')}
            />
            <RequirementItem
              met={strength.checks.lowercase}
              text={t('components.passwordStrength.lowercase')}
            />
            <RequirementItem
              met={strength.checks.uppercase}
              text={t('components.passwordStrength.uppercase')}
            />
            <RequirementItem
              met={strength.checks.number}
              text={t('components.passwordStrength.number')}
            />
            <RequirementItem
              met={strength.checks.special}
              text={t('components.passwordStrength.special')}
            />
          </ul>
        </div>
      )}
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <div
        className={cn(
          'w-4 h-4 rounded-full flex items-center justify-center',
          met ? 'bg-green-100' : 'bg-gray-100'
        )}
      >
        {met ? (
          <svg
            className="w-3 h-3 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-2 h-2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <circle cx="4" cy="4" r="3" />
          </svg>
        )}
      </div>
      <span className={cn(met ? 'text-gray-700' : 'text-gray-500')}>{text}</span>
    </li>
  );
}
