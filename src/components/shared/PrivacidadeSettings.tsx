// ============================================
// CONFIGURAÇÕES DE PRIVACIDADE - Componente Reutilizável
// ============================================

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Bell, 
  Download,
  Trash2,
  Shield,
  FileText,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface PrivacidadeSettingsProps {
  userRole: 'aluno' | 'professor' | 'gestor';
}

export const PrivacidadeSettings: React.FC<PrivacidadeSettingsProps> = ({ userRole }) => {
  // Estados das configurações
  const [mostrarFoto, setMostrarFoto] = useState(true);
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [mostrarTelefone, setMostrarTelefone] = useState(false);
  const [receberEmailComunicados, setReceberEmailComunicados] = useState(true);
  const [receberSMS, setReceberSMS] = useState(false);
  const [notificacoesPush, setNotificacoesPush] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Configurações de privacidade atualizadas!', {
      description: 'Suas preferências foram salvas com sucesso.',
    });
    
    setSalvando(false);
  };

  const handleExportarDados = () => {
    toast.info('Exportação de dados solicitada', {
      description: 'Você receberá um email com seus dados em até 48 horas.',
    });
  };

  const handleSolicitarExclusao = () => {
    toast.warning('Solicitação de exclusão registrada', {
      description: 'Nossa equipe entrará em contato para processar sua solicitação.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Aviso LGPD */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Suas informações pessoais são protegidas de acordo com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>. 
          Você tem total controle sobre seus dados.
        </AlertDescription>
      </Alert>

      {/* Visibilidade do Perfil */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Visibilidade do Perfil</h3>
          <p className="text-sm text-gray-500 mt-1">
            Escolha quais informações outros usuários podem ver
          </p>
        </div>
        
        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mostrarFoto ? <Eye className="h-4 w-4 text-gray-500" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
              <div>
                <Label htmlFor="mostrar-foto">Mostrar foto de perfil</Label>
                <p className="text-sm text-gray-500">
                  Outros usuários poderão ver sua foto
                </p>
              </div>
            </div>
            <Switch
              id="mostrar-foto"
              checked={mostrarFoto}
              onCheckedChange={setMostrarFoto}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="mostrar-email">Mostrar e-mail</Label>
                <p className="text-sm text-gray-500">
                  {userRole === 'aluno' 
                    ? 'Professores e gestores poderão ver seu e-mail'
                    : 'Outros usuários poderão ver seu e-mail'}
                </p>
              </div>
            </div>
            <Switch
              id="mostrar-email"
              checked={mostrarEmail}
              onCheckedChange={setMostrarEmail}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="mostrar-telefone">Mostrar telefone</Label>
                <p className="text-sm text-gray-500">
                  {userRole === 'aluno' 
                    ? 'Professores e gestores poderão ver seu telefone'
                    : 'Outros usuários poderão ver seu telefone'}
                </p>
              </div>
            </div>
            <Switch
              id="mostrar-telefone"
              checked={mostrarTelefone}
              onCheckedChange={setMostrarTelefone}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Comunicações */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Comunicações</h3>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie como deseja ser contatado
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="email-comunicados">E-mails de comunicados</Label>
                <p className="text-sm text-gray-500">
                  Receber avisos e comunicados por e-mail
                </p>
              </div>
            </div>
            <Switch
              id="email-comunicados"
              checked={receberEmailComunicados}
              onCheckedChange={setReceberEmailComunicados}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="sms">SMS</Label>
                <p className="text-sm text-gray-500">
                  Receber mensagens SMS importantes
                </p>
              </div>
            </div>
            <Switch
              id="sms"
              checked={receberSMS}
              onCheckedChange={setReceberSMS}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-gray-500" />
              <div>
                <Label htmlFor="push">Notificações push (navegador)</Label>
                <p className="text-sm text-gray-500">
                  Receber notificações no navegador quando houver novidades
                </p>
              </div>
            </div>
            <Switch
              id="push"
              checked={notificacoesPush}
              onCheckedChange={setNotificacoesPush}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Seus Dados (LGPD) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Seus Dados Pessoais</h3>
          <p className="text-sm text-gray-500 mt-1">
            Conforme a LGPD, você tem direitos sobre seus dados
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={handleExportarDados}
          >
            <Download className="h-4 w-4" />
            Exportar meus dados
            <span className="text-xs text-gray-500 ml-auto">Receba uma cópia dos seus dados</span>
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSolicitarExclusao}
          >
            <Trash2 className="h-4 w-4" />
            Solicitar exclusão da conta
            <span className="text-xs text-gray-500 ml-auto">Desativar permanentemente</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Termos e Política */}
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Documentos Legais</span>
        </div>
        <div className="space-y-2 text-sm">
          <a href="#" className="text-blue-600 hover:underline block">
            📄 Política de Privacidade
          </a>
          <a href="#" className="text-blue-600 hover:underline block">
            📄 Termos de Uso
          </a>
          <p className="text-xs text-gray-500 mt-2">
            Última atualização: 12 de novembro de 2024
          </p>
          <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
            <Check className="h-3 w-3" />
            <span>Você aceitou os termos em 01/01/2024</span>
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSalvar} disabled={salvando} className="gap-2">
          {salvando ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
