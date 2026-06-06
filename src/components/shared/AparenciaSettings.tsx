// ============================================
// APARÊNCIA - Tema (claro/escuro/sistema) e tamanho de fonte
// ============================================

import React from 'react';
import { Sun, Moon, Monitor, Type, type LucideIcon } from 'lucide-react';
import { useTheme, type ThemeMode, type FontSize } from '../../contexts/ThemeContext';
import { cn } from '../ui/utils';
import { Callout } from './Callout';

interface OptionCardProps {
  active: boolean;
  onClick: () => void;
  Icon?: LucideIcon;
  label: string;
  description?: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ active, onClick, Icon, label, description }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all',
      active
        ? 'border-blue-600 bg-blue-50 text-blue-700'
        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
    )}
  >
    {Icon && <Icon className="h-6 w-6" />}
    <span className="text-sm font-medium">{label}</span>
    {description && <span className="text-xs text-gray-500">{description}</span>}
  </button>
);

const THEME_OPTIONS: { value: ThemeMode; label: string; Icon: LucideIcon; description: string }[] = [
  { value: 'light', label: 'Claro', Icon: Sun, description: 'Tema claro' },
  { value: 'dark', label: 'Escuro', Icon: Moon, description: 'Tema escuro' },
  { value: 'system', label: 'Sistema', Icon: Monitor, description: 'Segue o SO' },
];

const FONT_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'sm', label: 'Compacto' },
  { value: 'md', label: 'Padrão' },
  { value: 'lg', label: 'Ampliado' },
];

export const AparenciaSettings: React.FC = () => {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();

  return (
    <div className="space-y-8">
      {/* Tema */}
      <section>
        <h3 className="font-semibold text-gray-900 mb-1">Tema</h3>
        <p className="text-sm text-gray-600 mb-4">
          Escolha entre tema claro, escuro ou seguir a preferência do seu sistema operacional.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {THEME_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              active={theme === opt.value}
              onClick={() => setTheme(opt.value)}
              Icon={opt.Icon}
              label={opt.label}
              description={opt.description}
            />
          ))}
        </div>
      </section>

      {/* Tamanho da fonte */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Type className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Tamanho da fonte</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Ajuste a escala tipográfica de toda a interface para melhor legibilidade.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {FONT_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              active={fontSize === opt.value}
              onClick={() => setFontSize(opt.value)}
              label={opt.label}
            />
          ))}
        </div>
      </section>

      <Callout variant="info">
        Suas preferências de aparência são salvas automaticamente neste navegador.
      </Callout>
    </div>
  );
};

export default AparenciaSettings;
