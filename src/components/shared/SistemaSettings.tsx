// ============================================
// CONFIGURAÇÕES DE SISTEMA - Componente para Gestor
// ============================================

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Building2,
  Globe,
  Clock,
  Save,
  Download,
  Shield,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

export const SistemaSettings: React.FC = () => {
  // Informações da Instituição
  const [nomeInstituicao, setNomeInstituicao] = useState('Sabiencia');
  const [cnpj, setCnpj] = useState('12.345.678/0001-90');
  const [endereco, setEndereco] = useState('Rua Exemplo, 123 - Centro');
  const [telefone, setTelefone] = useState('(98) 3234-5678');
  const [emailContato, setEmailContato] = useState('contato@sabiencia.com.br');

  // Configurações Gerais
  const [fusoHorario, setFusoHorario] = useState('America/Sao_Paulo');
  const [formatoData, setFormatoData] = useState('DD/MM/YYYY');
  const [idioma, setIdioma] = useState('pt-BR');

  // Parâmetros Acadêmicos
  const [frequenciaMinima, setFrequenciaMinima] = useState('75');
  const [notaMinima, setNotaMinima] = useState('7.0');
  const [sistemaNotas, setSistemaNotas] = useState('0-10');
  const [duracaoSemestre, setDuracaoSemestre] = useState('6');

  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Configurações do sistema atualizadas!');
    setSalvando(false);
  };

  const handleRealizarBackup = () => {
    toast.success('Backup iniciado!', {
      description: 'O backup será concluído em alguns minutos.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Informações da Instituição */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            <CardTitle>Informações da Instituição</CardTitle>
          </div>
          <CardDescription>
            Dados cadastrais da escola
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome-instituicao">Nome da Instituição</Label>
              <Input
                id="nome-instituicao"
                value={nomeInstituicao}
                onChange={(e) => setNomeInstituicao(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">Endereço Completo</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email-contato">E-mail de Contato</Label>
              <Input
                id="email-contato"
                type="email"
                value={emailContato}
                onChange={(e) => setEmailContato(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-500" />
            <CardTitle>Configurações Gerais</CardTitle>
          </div>
          <CardDescription>
            Parâmetros gerais do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fuso-horario">Fuso Horário</Label>
              <Select value={fusoHorario} onValueChange={setFusoHorario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                  <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formato-data">Formato de Data</Label>
              <Select value={formatoData} onValueChange={setFormatoData}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                  <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="idioma">Idioma</Label>
              <Select value={idioma} onValueChange={setIdioma}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parâmetros Acadêmicos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <CardTitle>Parâmetros Acadêmicos</CardTitle>
          </div>
          <CardDescription>
            Regras e critérios de avaliação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequencia-minima">Frequência Mínima para Aprovação (%)</Label>
              <Input
                id="frequencia-minima"
                type="number"
                value={frequenciaMinima}
                onChange={(e) => setFrequenciaMinima(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="nota-minima">Nota Mínima para Aprovação</Label>
              <Input
                id="nota-minima"
                type="number"
                step="0.1"
                value={notaMinima}
                onChange={(e) => setNotaMinima(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sistema-notas">Sistema de Notas</Label>
              <Select value={sistemaNotas} onValueChange={setSistemaNotas}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10">0 a 10</SelectItem>
                  <SelectItem value="0-100">0 a 100</SelectItem>
                  <SelectItem value="conceitos">Conceitos (A, B, C, D, E)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duracao-semestre">Duração do Semestre (meses)</Label>
              <Input
                id="duracao-semestre"
                type="number"
                value={duracaoSemestre}
                onChange={(e) => setDuracaoSemestre(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup e Segurança */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-500" />
            <CardTitle>Backup e Segurança</CardTitle>
          </div>
          <CardDescription>
            Proteção e recuperação de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Backup do Sistema</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Realize um backup completo de todos os dados do sistema
                </p>
                <p className="text-xs text-gray-500">
                  Último backup: 10/11/2024 às 03:00
                </p>
              </div>
              <Button onClick={handleRealizarBackup} className="gap-2">
                <Download className="h-4 w-4" />
                Realizar Backup
              </Button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Backup Automático</h4>
            </div>
            <p className="text-sm text-blue-700">
              Backups automáticos são realizados diariamente às 03:00
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSalvar} disabled={salvando} size="lg" className="gap-2">
          {salvando ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};