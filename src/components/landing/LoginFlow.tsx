import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { SabienciaSymbol } from '../brand/SabienciaBrand';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail, 
  X, 
  AlertCircle,
  BookOpen,
  ArrowRight 
} from 'lucide-react';

interface LoginFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnrollment?: () => void;
  onLoginSuccess?: (studentName: string) => void;
}

const LoginFlow: React.FC<LoginFlowProps> = ({ isOpen, onClose, onOpenEnrollment, onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'E-mail ou CPF é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email) && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(loginData.email) && !/^\d{11}$/.test(loginData.email)) {
      newErrors.email = 'Digite um e-mail válido ou CPF no formato XXX.XXX.XXX-XX';
    }

    if (!loginData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular chamada de login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular erro de login para demonstração
      const shouldSucceed = Math.random() > 0.3; // 70% de sucesso
      
      if (shouldSucceed) {
        // ✅ SEGURANÇA: Não logar dados de login
        if (import.meta.env.DEV) {
          console.debug('[LoginFlow] Login realizado com sucesso');
        }
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess('João Silva'); // Nome realista do estudante
        }
        // Aqui você redirecionaria para a área do aluno
      } else {
        setLoginError('E-mail/CPF ou senha incorretos. Tente novamente.');
      }
    } catch (error) {
      setLoginError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // Aqui você implementaria a funcionalidade de recuperação de senha
    alert('Funcionalidade de recuperação de senha será enviada por e-mail.');
  };

  const handleCreateAccount = () => {
    onClose();
    if (onOpenEnrollment) {
      onOpenEnrollment();
    }
  };

  const handleClose = () => {
    setLoginData({ email: '', password: '', rememberMe: false });
    setErrors({});
    setLoginError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Área do Estudante
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Entre em sua conta para acessar os cursos
                </DialogDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Login Error */}
          {loginError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email/CPF Field */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail ou CPF</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="text"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="seu.email@exemplo.com ou 000.000.000-00"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Digite sua senha"
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={loginData.rememberMe}
                  onCheckedChange={(checked: CheckedState) => 
                    setLoginData({ ...loginData, rememberMe: checked as boolean })
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
              >
                Esqueci minha senha
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Separator */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">ou</span>
            </div>
          </div>

          {/* Create Account Section */}
          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-medium">Ainda não tem uma conta?</span>
                <br />
                Matricule-se e comece a transformar sua carreira hoje mesmo!
              </p>
              <Button
                variant="outline"
                onClick={handleCreateAccount}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Criar Conta - Matricular-se
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Ao fazer login, você concorda com nossos{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-6 h-6 flex items-center justify-center">
              <SabienciaSymbol className="w-6 h-6 object-contain" title="Sabiencia" />
            </div>
            <span>Sabiencia - Transformando carreiras</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginFlow;
