import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BookOpen, GraduationCap, Users, Home, AlertCircle, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { SabienciaMonogramBadge } from '../brand/SabienciaBrand';

type DemoRole = 'aluno' | 'professor' | 'gestor';

interface RoleConfig {
  bg: string;
  iconBg: string;
  iconColor: string;
  Icon: LucideIcon;
  cardTitle: string;
  cardDescription: string;
  buttonClass: string;
  subtitle: string;
  demoCpf: string;
  demoPassword: string;
  dashboardPath: string;
  features?: {
    emoji: string;
    label: string;
    bgClass: string;
    labelClass: string;
    itemClass: string;
    items: string[];
  };
}

const ROLE_CONFIGS: Record<DemoRole, RoleConfig> = {
  aluno: {
    bg: 'from-green-50 via-white to-blue-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    Icon: BookOpen,
    cardTitle: 'Acesso do Aluno',
    cardDescription: 'Entre com suas credenciais para acessar sua área de estudos',
    buttonClass: 'w-full bg-green-600 hover:bg-green-700',
    subtitle: 'Sistema EAD - Login do Aluno',
    demoCpf: '333.333.333-33',
    demoPassword: 'aluno123',
    dashboardPath: '/aluno/dashboard',
  },
  professor: {
    bg: 'from-blue-50 via-white to-purple-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    Icon: GraduationCap,
    cardTitle: 'Acesso do Professor',
    cardDescription: 'Entre com suas credenciais para acessar sua área de ensino',
    buttonClass: 'w-full bg-blue-600 hover:bg-blue-700',
    subtitle: 'Sistema EAD - Login do Professor',
    demoCpf: '111.111.111-11',
    demoPassword: 'prof123',
    dashboardPath: '/professor/dashboard',
    features: {
      emoji: '📚',
      label: 'Funcionalidades:',
      bgClass: 'bg-blue-50 border-blue-200',
      labelClass: 'text-blue-900',
      itemClass: 'text-blue-800',
      items: [
        'Minhas turmas e alunos',
        'Lançamento de notas',
        'Registro de frequência',
        'Upload de materiais',
        'Observações sobre alunos',
      ],
    },
  },
  gestor: {
    bg: 'from-yellow-50 via-white to-orange-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    Icon: Users,
    cardTitle: 'Gestor / CEO',
    cardDescription: 'Entre com suas credenciais para acessar o painel administrativo',
    buttonClass: 'w-full bg-yellow-600 hover:bg-yellow-700',
    subtitle: 'Sistema EAD - Login do Gestor/CEO',
    demoCpf: '000.000.000-01',
    demoPassword: 'gestor123',
    dashboardPath: '/gestor/dashboard',
    features: {
      emoji: '🏢',
      label: 'Acesso completo:',
      bgClass: 'bg-yellow-50 border-yellow-200',
      labelClass: 'text-yellow-900',
      itemClass: 'text-yellow-800',
      items: [
        'Gestão de alunos e professores',
        'Controle financeiro',
        'Relatórios gerenciais',
        'Auditoria do sistema',
        'Configurações gerais',
      ],
    },
  },
};

interface DemoLoginProps {
  role: DemoRole;
}

export const DemoLogin: React.FC<DemoLoginProps> = ({ role }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const config = ROLE_CONFIGS[role];
  const { Icon } = config;
  const roleLabel = role === 'gestor' ? 'Gestor' : role === 'professor' ? 'Professor' : 'Aluno';

  const handleQuickLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await login(config.demoCpf, config.demoPassword);
      if (result.success) {
        toast.success('Entrando na demonstração...', {
          description: 'Redirecionando para sua dashboard...',
        });
        setTimeout(() => navigate(config.dashboardPath), 500);
      } else {
        setError(result.error || 'Não foi possível iniciar a demonstração');
      }
    } catch {
      setError('Erro ao iniciar a demonstração. Tente novamente.');
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
        toast.success('Login realizado com sucesso!', {
          description: 'Redirecionando para sua dashboard...',
        });
        setTimeout(() => {
          navigate(config.dashboardPath);
        }, 500);
      } else {
        setError(result.error || 'CPF ou senha inválidos');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bg} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <SabienciaMonogramBadge className="inline-flex w-20 h-20 rounded-full mb-4" labelClassName="text-2xl" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sabiencia</h1>
          <p className="text-gray-600">{config.subtitle}</p>
        </div>

        {/* Card de Login */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className={`mx-auto w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
              <Icon className={`h-8 w-8 ${config.iconColor}`} />
            </div>
            <CardTitle className="text-2xl">{config.cardTitle}</CardTitle>
            <CardDescription>{config.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Lista de funcionalidades (apenas gestor e professor) */}
            {config.features && (
              <div className={`mb-6 p-4 border rounded-lg ${config.features.bgClass}`}>
                <h4 className={`font-medium mb-2 text-sm ${config.features.labelClass}`}>
                  {config.features.emoji} {config.features.label}
                </h4>
                <ul className={`text-xs space-y-1 ml-4 ${config.features.itemClass}`}>
                  {config.features.items.map((item) => (
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
                <Label htmlFor="cpf">CPF ou e‑mail</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00 ou email@exemplo.com"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className={config.buttonClass} disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Acesso rápido à demonstração */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-400 uppercase">ou</span>
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
                Entrar como {roleLabel} (demo)
              </Button>
              <p className="mt-2 text-center text-xs text-gray-500">
                Acesso instantâneo ao ambiente de demonstração, sem precisar digitar credenciais.
              </p>
            </div>

            {/* Links extras */}
            <div className="mt-4 text-center space-y-2">
              <button
                type="button"
                onClick={() =>
                  toast.info('Recuperação de senha', {
                    description:
                      'Se houver uma conta associada, você receberá um link de redefinição por e-mail.',
                  })
                }
                className="text-sm text-blue-600 hover:underline block w-full"
              >
                Esqueci minha senha
              </button>
              {role === 'aluno' && (
                <a href="/#matricule-se" className="text-sm text-gray-600 hover:text-gray-900 block">
                  Ainda não tem conta? Matricule-se
                </a>
              )}
              {role === 'professor' && (
                <div className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/professor/cadastro')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Cadastre-se aqui
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
            Voltar para página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};
