// ============================================
// PROFESSOR REGISTER PAGE - Auto-cadastro de professor
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { GraduationCap, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { CPFInput } from '../../components/shared/CPFInput';
import { PhoneInput } from '../../components/shared/PhoneInput';
import { EmailInput } from '../../components/shared/EmailInput';
import { MultiSelect } from '../../components/shared/MultiSelect';
import { PasswordStrengthIndicator } from '../../components/shared/PasswordStrengthIndicator';
import { SabienciaMonogramBadge } from '../../components/brand/SabienciaBrand';

export const ProfessorRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Etapa 1 - Dados Pessoais
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

  // Etapa 2 - Dados Profissionais
  const [formacao, setFormacao] = useState('');
  const [registroProfissional, setRegistroProfissional] = useState('');
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [experiencia, setExperiencia] = useState('');

  // Etapa 3 - Documentos
  const [motivacao, setMotivacao] = useState('');

  // Etapa 4 - Acesso
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Especialidades disponíveis
  const especialidadesDisponiveis = [
    { value: 'enfermagem', label: 'Enfermagem' },
    { value: 'anatomia', label: 'Anatomia' },
    { value: 'fisiologia', label: 'Fisiologia' },
    { value: 'farmacologia', label: 'Farmacologia' },
    { value: 'administracao', label: 'Administração' },
    { value: 'informatica', label: 'Informática' },
    { value: 'programacao', label: 'Programação' },
    { value: 'redes', label: 'Redes de Computadores' },
  ];

  const handleProximaEtapa = () => {
    // Validações
    if (etapa === 1) {
      if (!nomeCompleto || !cpf || !email || !telefone) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }
    }
    
    if (etapa === 2) {
      if (!formacao || especialidades.length === 0) {
        toast.error('Preencha sua formação e ao menos uma especialidade');
        return;
      }
    }

    if (etapa === 3) {
      if (!motivacao) {
        toast.error('Por favor, conte-nos sua motivação');
        return;
      }
    }

    setEtapa(etapa + 1);
  };

  const handleVoltarEtapa = () => {
    setEtapa(etapa - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar senha
    if (senha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error('As senhas não conferem');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Cadastro enviado com sucesso!', {
        description: 'Aguarde a análise do administrador. Você receberá um e-mail em breve.',
        duration: 5000,
      });

      // Redirecionar para página de login após 2 segundos
      setTimeout(() => {
        navigate('/professor');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao enviar cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEtapa1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome Completo *</Label>
        <Input
          id="nome"
          type="text"
          placeholder="Seu nome completo"
          value={nomeCompleto}
          onChange={(e) => setNomeCompleto(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="cpf">CPF *</Label>
        <CPFInput
          id="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">E-mail *</Label>
        <EmailInput
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
        <PhoneInput
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="foto">URL da Foto (opcional)</Label>
        <Input
          id="foto"
          type="url"
          placeholder="https://..."
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Link para sua foto de perfil
        </p>
      </div>
    </div>
  );

  const renderEtapa2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="formacao">Formação Acadêmica *</Label>
        <Input
          id="formacao"
          type="text"
          placeholder="Ex: Enfermeiro, Mestre em Ciências da Saúde"
          value={formacao}
          onChange={(e) => setFormacao(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="registro">Registro Profissional</Label>
        <Input
          id="registro"
          type="text"
          placeholder="Ex: COREN-MA 123456"
          value={registroProfissional}
          onChange={(e) => setRegistroProfissional(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="especialidades">Especialidades / Áreas de Atuação *</Label>
        <MultiSelect
          label="Especialidades / Areas de Atuacao"
          options={especialidadesDisponiveis}
          value={especialidades}
          onChange={setEspecialidades}
          placeholder="Selecione suas especialidades..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Selecione todas as áreas em que você tem experiência
        </p>
      </div>

      <div>
        <Label htmlFor="experiencia">Experiência Profissional</Label>
        <Textarea
          id="experiencia"
          placeholder="Descreva brevemente sua experiência profissional e tempo de atuação..."
          value={experiencia}
          onChange={(e) => setExperiencia(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );

  const renderEtapa3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="motivacao">Por que deseja fazer parte da equipe Sabiencia? *</Label>
        <Textarea
          id="motivacao"
          placeholder="Conte-nos sobre sua motivação para lecionar em nossa instituição..."
          value={motivacao}
          onChange={(e) => setMotivacao(e.target.value)}
          rows={6}
          required
        />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2 text-sm">
          📝 Próximos Passos
        </h4>
        <ul className="text-xs text-blue-800 space-y-1 ml-4">
          <li>• Seu cadastro será analisado pela equipe administrativa</li>
          <li>• Pode ser solicitado envio de documentos adicionais</li>
          <li>• Você receberá um e-mail com o resultado em até 5 dias úteis</li>
          <li>• Após aprovação, você poderá fazer login na plataforma</li>
        </ul>
      </div>
    </div>
  );

  const renderEtapa4 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="senha">Criar Senha *</Label>
        <Input
          id="senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <PasswordStrengthIndicator password={senha} />
      </div>

      <div>
        <Label htmlFor="confirmar-senha">Confirmar Senha *</Label>
        <Input
          id="confirmar-senha"
          type="password"
          placeholder="Digite a senha novamente"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />
        {confirmarSenha && senha !== confirmarSenha && (
          <p className="text-xs text-red-600 mt-1">
            As senhas não conferem
          </p>
        )}
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2 text-sm flex items-center gap-2">
          <Check className="h-4 w-4" />
          Tudo pronto!
        </h4>
        <p className="text-xs text-green-800">
          Ao clicar em "Enviar Cadastro", você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <SabienciaMonogramBadge className="inline-flex w-20 h-20 rounded-full mb-4" labelClassName="text-2xl" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sabiencia
          </h1>
          <p className="text-gray-600">
            Cadastro de Professor
          </p>
        </div>

        {/* Card de Cadastro */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Seja um Professor</CardTitle>
            <CardDescription>
              Faça parte da equipe Sabiencia
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Indicador de Progresso */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        etapa >= step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {etapa > step ? <Check className="h-4 w-4" /> : step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          etapa > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>Pessoais</span>
                <span>Profissionais</span>
                <span>Motivação</span>
                <span>Acesso</span>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit}>
              {etapa === 1 && renderEtapa1()}
              {etapa === 2 && renderEtapa2()}
              {etapa === 3 && renderEtapa3()}
              {etapa === 4 && renderEtapa4()}

              {/* Botões de Navegação */}
              <div className="flex gap-3 mt-6">
                {etapa > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVoltarEtapa}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                )}

                {etapa < 4 ? (
                  <Button
                    type="button"
                    onClick={handleProximaEtapa}
                    className="flex-1"
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Cadastro'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Botão Voltar */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/professor')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para página de login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorRegisterPage;
