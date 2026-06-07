import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { toast } from 'sonner';
import { EnrollmentData } from '../EnrollmentFlow';
import { 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Mail, 
  BookOpen,
  Clock,
  Award,
  Send
} from 'lucide-react';

interface ConfirmationStepProps {
  data: EnrollmentData;
  onPrev: () => void;
  onComplete: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ 
  data, 
  onPrev, 
  onComplete 
}) => {
  const navigate = useNavigate();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!acceptTerms || !acceptPrivacy) {
      return;
    }

    setIsSubmitting(true);
    
    // Simular envio dos dados
    try {
      // Aqui você faria a chamada para o backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso
      // ✅ SEGURANÇA: Não logar dados de matrícula (contém CPF, RG, dados pessoais)
      if (import.meta.env.DEV) {
        console.debug('[Enrollment] Matrícula processada com sucesso');
      }
      
      // Mostrar mensagem de sucesso
      toast.success('Matrícula realizada com sucesso!', {
        description: 'Você será redirecionado para sua dashboard em instantes.',
        duration: 3000,
      });
      
      // Redirecionar para a dashboard do aluno após 2 segundos
      setTimeout(() => {
        onComplete();
        navigate('/aluno/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar matrícula:', error);
      toast.error('Erro ao processar matrícula', {
        description: 'Por favor, tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = () => {
    const { street, number, complement, neighborhood, city, state, zipCode } = data.address;
    return `${street}, ${number}${complement ? `, ${complement}` : ''}, ${neighborhood}, ${city}/${state}, CEP: ${zipCode}`;
  };

  const getEducationLabel = (value: string) => {
    const labels: Record<string, string> = {
      'fundamental-incompleto': 'Ensino Fundamental Incompleto',
      'fundamental-completo': 'Ensino Fundamental Completo',
      'medio-incompleto': 'Ensino Médio Incompleto',
      'medio-completo': 'Ensino Médio Completo',
      'superior-incompleto': 'Ensino Superior Incompleto',
      'superior-completo': 'Ensino Superior Completo',
      'pos-graduacao': 'Pós-graduação'
    };
    return labels[value] || value;
  };

  const getExperienceLabel = (value: string) => {
    const labels: Record<string, string> = {
      'sem-experiencia': 'Sem experiência',
      'ate-1-ano': 'Até 1 ano',
      '1-3-anos': '1 a 3 anos',
      '3-5-anos': '3 a 5 anos',
      '5-10-anos': '5 a 10 anos',
      'mais-10-anos': 'Mais de 10 anos'
    };
    return labels[value] || 'Não informado';
  };

  const getGenderLabel = (value: string) => {
    const labels: Record<string, string> = {
      'masculino': 'Masculino',
      'feminino': 'Feminino',
      'nao-binario': 'Não-binário',
      'prefiro-nao-informar': 'Prefiro não informar'
    };
    return labels[value] || value;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Confirmação de Matrícula</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Revise suas informações antes de finalizar a matrícula. Após a confirmação, 
            você receberá um e-mail com os próximos passos.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <User className="w-4 h-4 text-blue-600" />
              <span>Dados Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Nome Completo</p>
              <p className="text-gray-900">{data.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">CPF</p>
              <p className="text-gray-900">{data.cpf}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Data de Nascimento</p>
              <p className="text-gray-900">
                {new Date(data.birthDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Gênero</p>
              <p className="text-gray-900">{getGenderLabel(data.gender)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Escolaridade</p>
              <p className="text-gray-900">{getEducationLabel(data.education)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Experiência Profissional</p>
              <p className="text-gray-900">{getExperienceLabel(data.workExperience)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Curso Selecionado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Curso Selecionado</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.selectedCourse && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {data.selectedCourse.title}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Duração: {data.selectedCourse.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span>Investimento: {data.selectedCourse.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Próximos Passos:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Você receberá um e-mail de confirmação</li>
                    <li>• Acesso à plataforma em até 24h</li>
                    <li>• Orientações sobre o início das aulas</li>
                    <li>• Informações sobre documentação necessária</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Dados de Contato</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">E-mail</p>
                <p className="text-gray-900">{data.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Telefone com WhatsApp</p>
                <p className="text-gray-900">{data.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Endereço</p>
              <p className="text-gray-900 text-sm leading-relaxed">
                {formatAddress()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Termos e Condições */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Termos e Condições</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <div className="space-y-1">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aceito os Termos de Uso e Condições Gerais
              </label>
              <p className="text-xs text-gray-500">
                Li e concordo com os{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  termos de uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  condições gerais
                </a>{' '}
                da Sabiencia.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={acceptPrivacy}
              onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
            />
            <div className="space-y-1">
              <label
                htmlFor="privacy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aceito a Política de Privacidade
              </label>
              <p className="text-xs text-gray-500">
                Concordo com o tratamento dos meus dados pessoais conforme a{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  política de privacidade
                </a>{' '}
                e LGPD.
              </p>
            </div>
          </div>

          {(!acceptTerms || !acceptPrivacy) && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                É necessário aceitar os termos e condições para finalizar a matrícula.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!acceptTerms || !acceptPrivacy || isSubmitting}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Finalizando Matrícula...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Finalizar Matrícula
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
