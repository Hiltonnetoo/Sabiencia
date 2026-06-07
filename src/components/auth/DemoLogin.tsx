import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BookOpen, GraduationCap, Users, Home, AlertCircle, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { SabienciaMonogramBadge } from '../brand/SabienciaBrand';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

type DemoRole = 'aluno' | 'professor' | 'gestor';

interface RoleConfig {
  bg: string;
  iconBg: string;
  iconColor: string;
  Icon: LucideIcon;
  buttonClass: string;
  demoCpf: string;
  demoPassword: string;
  dashboardPath: string;
  /** i18n role key + features bullets source. */
  i18nKey: 'manager' | 'teacher' | 'student';
  features?: {
    labelKey: string;
    itemsKey: string;
    bgClass: string;
    labelClass: string;
    itemClass: string;
  };
}

const ROLE_CONFIGS: Record<DemoRole, RoleConfig> = {
  aluno: {
    bg: 'from-green-50 via-white to-blue-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    Icon: BookOpen,
    buttonClass: 'w-full bg-green-600 hover:bg-green-700',
    demoCpf: '333.333.333-33',
    demoPassword: 'aluno123',
    dashboardPath: '/aluno/dashboard',
    i18nKey: 'student',
  },
  professor: {
    bg: 'from-blue-50 via-white to-purple-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    Icon: GraduationCap,
    buttonClass: 'w-full bg-blue-600 hover:bg-blue-700',
    demoCpf: '111.111.111-11',
    demoPassword: 'prof123',
    dashboardPath: '/professor/dashboard',
    i18nKey: 'teacher',
    features: {
      labelKey: 'auth.teacherFeaturesLabel',
      itemsKey: 'demo.teacherFeatures',
      bgClass: 'bg-blue-50 border-blue-200',
      labelClass: 'text-blue-900',
      itemClass: 'text-blue-800',
    },
  },
  gestor: {
    bg: 'from-yellow-50 via-white to-orange-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    Icon: Users,
    buttonClass: 'w-full bg-yellow-600 hover:bg-yellow-700',
    demoCpf: '000.000.000-01',
    demoPassword: 'gestor123',
    dashboardPath: '/gestor/dashboard',
    i18nKey: 'manager',
    features: {
      labelKey: 'auth.managerFeaturesLabel',
      itemsKey: 'demo.managerFeatures',
      bgClass: 'bg-yellow-50 border-yellow-200',
      labelClass: 'text-yellow-900',
      itemClass: 'text-yellow-800',
    },
  },
};

interface DemoLoginProps {
  role: DemoRole;
}

export const DemoLogin: React.FC<DemoLoginProps> = ({ role }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const config = ROLE_CONFIGS[role];
  const { Icon, i18nKey } = config;
  const roleLabel = t(`auth.roles.${i18nKey}Title`);

  const handleQuickLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await login(config.demoCpf, config.demoPassword);
      if (result.success) {
        toast.success(t('auth.enteringDemo'), { description: t('auth.redirecting') });
        setTimeout(() => navigate(config.dashboardPath), 500);
      } else {
        setError(result.error || t('auth.invalidCredentials'));
      }
    } catch {
      setError(t('auth.demoError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(cpf, password);

      if (result.success) {
        toast.success(t('auth.loginSuccess'), { description: t('auth.redirecting') });
        setTimeout(() => {
          navigate(config.dashboardPath);
        }, 500);
      } else {
        setError(result.error || t('auth.invalidCredentials'));
      }
    } catch {
      setError(t('auth.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bg} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Language switch */}
        <div className="flex justify-end mb-3">
          <LanguageSwitcher variant="outline" />
        </div>

        {/* Logo e Header */}
        <div className="text-center mb-8">
          <SabienciaMonogramBadge className="inline-flex w-20 h-20 rounded-full mb-4" labelClassName="text-2xl" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sabiencia</h1>
          <p className="text-gray-600">{t(`auth.roles.${i18nKey}Subtitle`)}</p>
        </div>

        {/* Card de Login */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className={`mx-auto w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
              <Icon className={`h-8 w-8 ${config.iconColor}`} />
            </div>
            <CardTitle className="text-2xl">{t(`auth.roles.${i18nKey}Title`)}</CardTitle>
            <CardDescription>{t(`auth.roles.${i18nKey}Description`)}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Lista de funcionalidades (apenas gestor e professor) */}
            {config.features && (
              <div className={`mb-6 p-4 border rounded-lg ${config.features.bgClass}`}>
                <h4 className={`font-medium mb-2 text-sm ${config.features.labelClass}`}>
                  {t(config.features.labelKey)}
                </h4>
                <ul className={`text-xs space-y-1 ml-4 ${config.features.itemClass}`}>
                  {(t(config.features.itemsKey, { returnObjects: true }) as string[]).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="cpf">{t('auth.cpfOrEmail')}</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder={t('auth.cpfPlaceholder')}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className={config.buttonClass} disabled={isLoading}>
                {isLoading ? t('auth.signingIn') : t('auth.signIn')}
              </Button>
            </form>

            {/* Acesso rápido à demonstração */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-400 uppercase">{t('auth.or')}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleQuickLogin}
                disabled={isLoading}
                className="w-full mt-4 gap-2"
              >
                <Icon className={`h-4 w-4 ${config.iconColor}`} />
                {t('auth.enterAs', { role: roleLabel })}
              </Button>
              <p className="mt-2 text-center text-xs text-gray-500">
                {t('auth.quickHint')}
              </p>
            </div>

            {/* Links extras */}
            <div className="mt-4 text-center space-y-2">
              <button
                type="button"
                onClick={() =>
                  toast.info(t('auth.forgotTitle'), { description: t('auth.forgotDescription') })
                }
                className="text-sm text-blue-600 hover:underline block w-full"
              >
                {t('auth.forgotPassword')}
              </button>
              {role === 'aluno' && (
                <a href="/#matricule-se" className="text-sm text-gray-600 hover:text-gray-900 block">
                  {t('auth.noAccountStudent')}
                </a>
              )}
              {role === 'professor' && (
                <div className="text-sm text-gray-600">
                  {t('auth.noAccountTeacher')}{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/professor/cadastro')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {t('auth.registerHere')}
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botão Voltar */}
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            {t('auth.backToHome')}
          </Button>
        </div>
      </div>
    </div>
  );
};
