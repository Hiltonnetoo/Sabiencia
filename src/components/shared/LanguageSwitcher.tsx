// ============================================
// LANGUAGE SWITCHER - Alterna entre inglês e português
// ============================================

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from '../ui/button';

interface LanguageSwitcherProps {
  /** 'ghost' (default) for app chrome; 'outline' for the landing header. */
  variant?: 'ghost' | 'outline';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'ghost' }) => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage === 'pt' ? 'pt' : 'en';
  const next = current === 'en' ? 'pt' : 'en';

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => i18n.changeLanguage(next)}
      aria-label={`Switch language to ${next === 'en' ? 'English' : 'Português'}`}
      title={`Switch language to ${next === 'en' ? 'English' : 'Português'}`}
      className="gap-1.5 font-medium"
    >
      <Languages className="h-4 w-4" />
      <span className="uppercase">{current}</span>
    </Button>
  );
};

export default LanguageSwitcher;
