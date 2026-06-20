// ============================================
// CONFIGURAÇÕES DE SISTEMA - Componente para Gestor
// ============================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
    toast.success(t('components.sistemaSettings.settingsUpdated'));
    setSalvando(false);
  };

  const handleRealizarBackup = () => {
    toast.success(t('components.sistemaSettings.backupStarted'), {
      description: t('components.sistemaSettings.backupStartedDesc'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Informações da Instituição */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-500" />
            <CardTitle>{t('components.sistemaSettings.institutionInfo')}</CardTitle>
          </div>
          <CardDescription>
            {t('components.sistemaSettings.institutionInfoDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome-instituicao">{t('components.sistemaSettings.institutionName')}</Label>
              <Input
                id="nome-instituicao"
                value={nomeInstituicao}
                onChange={(e) => setNomeInstituicao(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cnpj">{t('components.sistemaSettings.cnpj')}</Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">{t('components.sistemaSettings.fullAddress')}</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">{t('components.sistemaSettings.phone')}</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email-contato">{t('components.sistemaSettings.contactEmail')}</Label>
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
            <CardTitle>{t('components.sistemaSettings.generalSettings')}</CardTitle>
          </div>
          <CardDescription>
            {t('components.sistemaSettings.generalSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fuso-horario">{t('components.sistemaSettings.timezone')}</Label>
              <Select value={fusoHorario} onValueChange={setFusoHorario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">{t('components.sistemaSettings.timezoneBrasilia')}</SelectItem>
                  <SelectItem value="America/Manaus">{t('components.sistemaSettings.timezoneManaus')}</SelectItem>
                  <SelectItem value="America/Rio_Branco">{t('components.sistemaSettings.timezoneRioBranco')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formato-data">{t('components.sistemaSettings.dateFormat')}</Label>
              <Select value={formatoData} onValueChange={setFormatoData}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">{t('components.sistemaSettings.dateFormatDMY')}</SelectItem>
                  <SelectItem value="MM/DD/YYYY">{t('components.sistemaSettings.dateFormatMDY')}</SelectItem>
                  <SelectItem value="YYYY-MM-DD">{t('components.sistemaSettings.dateFormatYMD')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="idioma">{t('components.sistemaSettings.language')}</Label>
              <Select value={idioma} onValueChange={setIdioma}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">{t('components.sistemaSettings.languagePt')}</SelectItem>
                  <SelectItem value="en-US">{t('components.sistemaSettings.languageEn')}</SelectItem>
                  <SelectItem value="es-ES">{t('components.sistemaSettings.languageEs')}</SelectItem>
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
            <CardTitle>{t('components.sistemaSettings.academicParams')}</CardTitle>
          </div>
          <CardDescription>
            {t('components.sistemaSettings.academicParamsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequencia-minima">{t('components.sistemaSettings.minAttendance')}</Label>
              <Input
                id="frequencia-minima"
                type="number"
                value={frequenciaMinima}
                onChange={(e) => setFrequenciaMinima(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="nota-minima">{t('components.sistemaSettings.minGrade')}</Label>
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
              <Label htmlFor="sistema-notas">{t('components.sistemaSettings.gradeSystem')}</Label>
              <Select value={sistemaNotas} onValueChange={setSistemaNotas}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10">{t('components.sistemaSettings.gradeSystem010')}</SelectItem>
                  <SelectItem value="0-100">{t('components.sistemaSettings.gradeSystem0100')}</SelectItem>
                  <SelectItem value="conceitos">{t('components.sistemaSettings.gradeSystemConcepts')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duracao-semestre">{t('components.sistemaSettings.semesterDuration')}</Label>
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
            <CardTitle>{t('components.sistemaSettings.backupSecurity')}</CardTitle>
          </div>
          <CardDescription>
            {t('components.sistemaSettings.backupSecurityDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{t('components.sistemaSettings.systemBackup')}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {t('components.sistemaSettings.systemBackupDesc')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('components.sistemaSettings.lastBackup', { date: '10/11/2024 03:00' })}
                </p>
              </div>
              <Button onClick={handleRealizarBackup} className="gap-2">
                <Download className="h-4 w-4" />
                {t('components.sistemaSettings.performBackup')}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">{t('components.sistemaSettings.automaticBackup')}</h4>
            </div>
            <p className="text-sm text-blue-700">
              {t('components.sistemaSettings.automaticBackupDesc')}
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
              {t('components.sistemaSettings.saving')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t('components.sistemaSettings.saveSettings')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
