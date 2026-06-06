// ============================================
// LOGIN PAGE - Página de login unificada
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { formatCPF, unformatCPF } from '../../utils/formatters';
import { LoadingButton } from '../shared/LoadingButton';
import { SabienciaHorizontalLogo } from '../brand/SabienciaBrand';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleIdentificadorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes('@')) {
      setIdentificador(value);
    } else {
      const cleaned = unformatCPF(value);
      if (cleaned.length <= 11) {
        setIdentificador(formatCPF(cleaned));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (!identificador) {
      setError('Informe CPF ou e‑mail');
      return;
    }
    if (identificador.includes('@')) {
      const isValidEmail = /.+@.+\..+/.test(identificador);
      if (!isValidEmail) {
        setError('E‑mail inválido');
        return;
      }
    } else {
      if (unformatCPF(identificador).length !== 11) {
        setError('O formato do CPF está incorreto. Por favor, verifique os números e digite novamente.');
        return;
      }
    }

    if (!senha || senha.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(identificador, senha);

      if (result.success) {
        // Login bem-sucedido - redirecionar será feito pelo App.tsx
        navigate('/redirect');
      } else {
        setError(result.error || 'Não foi possível realizar o login. Por favor, verifique se suas credenciais estão corretas.');
      }
    } catch (err) {
      setError('Não foi possível realizar o login. Por favor, verifique se suas credenciais estão corretas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center mb-2">
            <SabienciaHorizontalLogo className="h-16 w-auto" title="Sabiencia" />
          </div>
          <div>
            <CardTitle className="text-2xl">Sabiencia</CardTitle>
            <CardDescription className="mt-2">
              Entre com suas credenciais para acessar a plataforma
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="identificador">CPF ou e‑mail</Label>
              <Input
                id="identificador"
                type="text"
                placeholder="000.000.000-00 ou email@exemplo.com"
                value={identificador}
                onChange={handleIdentificadorChange}
                disabled={isLoading}
                className="text-base"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={isLoading}
                  className="text-base pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <LoadingButton
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              isLoading={isLoading}
              loadingText="Entrando..."
            >
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </LoadingButton>
          </form>

          {/* Informações de teste recolhidas em aba discreta */}
          <details className="mt-6 pt-4 border-t text-xs text-gray-500 cursor-pointer">
            <summary className="text-center hover:text-gray-700 font-medium select-none outline-none py-1">
              🔑 Demonstração: Visualizar Credenciais de Teste
            </summary>
            <div className="mt-3 space-y-2 cursor-default">
              <button
                type="button"
                onClick={() => {
                  setIdentificador('000.000.000-01');
                  setSenha('gestor123');
                }}
                className="w-full bg-gray-50 p-2.5 rounded hover:bg-gray-100 transition-colors text-left border"
              >
                <p className="font-semibold text-gray-700">Gestor</p>
                <p className="text-gray-500">CPF: 000.000.000-01 | Senha: gestor123</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentificador('111.111.111-11');
                  setSenha('prof123');
                }}
                className="w-full bg-gray-50 p-2.5 rounded hover:bg-gray-100 transition-colors text-left border"
              >
                <p className="font-semibold text-gray-700">Professor</p>
                <p className="text-gray-500">CPF: 111.111.111-11 | Senha: prof123</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentificador('333.333.333-33');
                  setSenha('aluno123');
                }}
                className="w-full bg-gray-50 p-2.5 rounded hover:bg-gray-100 transition-colors text-left border"
              >
                <p className="font-semibold text-gray-700">Aluno</p>
                <p className="text-gray-500">CPF: 333.333.333-33 | Senha: aluno123</p>
              </button>
            </div>
          </details>

          <div className="mt-6 text-center space-y-2">
            <div>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                ← Voltar para o site
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate('/debug')}
                className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
              >
                🔧 Problemas com login? Clique aqui para debug
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
