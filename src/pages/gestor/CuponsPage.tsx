// ============================================
// CUPONS PAGE - Gerenciar Cupons de Desconto
// ============================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Plus,
  Edit,
  Trash2,
  Copy,
  Percent,
  DollarSign,
  Users,
  TrendingUp,
  Tag,
  AlertCircle
} from 'lucide-react';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { toast } from 'sonner';
import type { Cupom } from '../../types';

export const CuponsPage: React.FC = () => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<'ativos' | 'expirados'>('ativos');

  // Estados do formulário
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipoDesconto, setTipoDesconto] = useState<'percentual' | 'valor_fixo'>('percentual');
  const [valorDesconto, setValorDesconto] = useState('');
  const [valorMinimo, setValorMinimo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [limitarUso, setLimitarUso] = useState(false);
  const [limiteUso, setLimiteUso] = useState('');
  const [limiteUsuario, setLimiteUsuario] = useState('');

  // Cupons mockados
  const cuponsMockados: Cupom[] = [
    {
      id: '1',
      codigo: 'BEMVINDO2024',
      descricao: 'Desconto de boas-vindas para novos alunos',
      tipo_desconto: 'percentual',
      valor_desconto: 20,
      valor_minimo_compra: 500,
      data_inicio: new Date('2024-01-01'),
      data_fim: new Date('2024-12-31'),
      limite_uso: 100,
      usos_atuais: 45,
      limite_por_usuario: 1,
      ativo: true,
      created_at: new Date('2024-01-01')
    },
    {
      id: '2',
      codigo: 'BLACKFRIDAY',
      descricao: 'Super desconto Black Friday',
      tipo_desconto: 'percentual',
      valor_desconto: 50,
      data_inicio: new Date('2024-11-20'),
      data_fim: new Date('2024-11-30'),
      limite_uso: 50,
      usos_atuais: 48,
      limite_por_usuario: 1,
      ativo: true,
      created_at: new Date('2024-11-01')
    },
    {
      id: '3',
      codigo: 'AMIGO100',
      descricao: 'R$ 100 de desconto para indicação',
      tipo_desconto: 'valor_fixo',
      valor_desconto: 100,
      valor_minimo_compra: 800,
      data_inicio: new Date('2024-01-01'),
      data_fim: new Date('2024-12-31'),
      limite_por_usuario: 1,
      usos_atuais: 23,
      ativo: true,
      created_at: new Date('2024-01-01')
    }
  ];

  const cuponsAtivos = cuponsMockados.filter(c => c.ativo && new Date(c.data_fim) >= new Date());
  const cuponsExpirados = cuponsMockados.filter(c => !c.ativo || new Date(c.data_fim) < new Date());

  const gerarCodigoAleatorio = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setCodigo(codigo);
  };

  const handleCriarCupom = () => {
    if (!codigo || !descricao || !valorDesconto || !dataInicio || !dataFim) {
      toast.error(t('gestor.cupons.toast.fillRequired'));
      return;
    }

    toast.success(t('gestor.cupons.toast.createdTitle'), {
      description: t('gestor.cupons.toast.createdDescription', { code: codigo }),
    });
    setDialogOpen(false);
    // Resetar formulário
    setCodigo('');
    setDescricao('');
    setValorDesconto('');
    setValorMinimo('');
    setDataInicio('');
    setDataFim('');
    setLimitarUso(false);
    setLimiteUso('');
    setLimiteUsuario('');
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    toast.success(t('gestor.cupons.toast.copiedTitle'), {
      description: t('gestor.cupons.toast.copiedDescription'),
    });
  };

  const formatarValor = (cupom: Cupom) => {
    if (cupom.tipo_desconto === 'percentual') {
      return `${cupom.valor_desconto}%`;
    }
    return `R$ ${cupom.valor_desconto.toFixed(2)}`;
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString();
  };

  const calcularPercentualUso = (cupom: Cupom) => {
    if (!cupom.limite_uso) return null;
    return Math.round((cupom.usos_atuais / cupom.limite_uso) * 100);
  };

  const renderCupom = (cupom: Cupom) => {
    const percentualUso = calcularPercentualUso(cupom);
    const quaseEsgotado = percentualUso && percentualUso >= 90;

    return (
      <Card key={cupom.id} className={`hover:shadow-md transition-shadow ${quaseEsgotado ? 'border-orange-200' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Código do Cupom */}
              <div className="flex items-center gap-3 mb-3">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <p className="text-white font-mono font-bold text-lg">{cupom.codigo}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copiarCodigo(cupom.codigo)}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Badge className={cupom.tipo_desconto === 'percentual' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                  {cupom.tipo_desconto === 'percentual' ? (
                    <>
                      <Percent className="h-3 w-3 mr-1" />
                      {t('gestor.cupons.discountType.percentage')}
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-3 w-3 mr-1" />
                      {t('gestor.cupons.discountType.fixedAmount')}
                    </>
                  )}
                </Badge>
                {quaseEsgotado && (
                  <Badge className="bg-orange-100 text-orange-700">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {t('gestor.cupons.almostSoldOut')}
                  </Badge>
                )}
              </div>

              {/* Descrição */}
              <p className="text-gray-700 mb-4">{cupom.descricao}</p>

              {/* Detalhes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500 mb-1">{t('gestor.cupons.fields.discount')}</p>
                  <p className="font-bold text-green-600 text-lg">{formatarValor(cupom)}</p>
                </div>

                {cupom.valor_minimo_compra && (
                  <div>
                    <p className="text-gray-500 mb-1">{t('gestor.cupons.fields.minimumAmount')}</p>
                    <p className="font-medium">R$ {cupom.valor_minimo_compra.toFixed(2)}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-500 mb-1">{t('gestor.cupons.fields.validity')}</p>
                  <p className="font-medium">{formatarData(cupom.data_inicio)} - {formatarData(cupom.data_fim)}</p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">{t('gestor.cupons.fields.uses')}</p>
                  <p className="font-medium">
                    {cupom.usos_atuais}
                    {cupom.limite_uso ? ` / ${cupom.limite_uso}` : ''}
                  </p>
                </div>
              </div>

              {/* Barra de Progresso */}
              {cupom.limite_uso && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{t('gestor.cupons.couponUses')}</span>
                    <span>{percentualUso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentualUso && percentualUso >= 90
                          ? 'bg-orange-600'
                          : percentualUso && percentualUso >= 70
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{ width: `${percentualUso}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Regras Adicionais */}
              <div className="flex flex-wrap gap-2">
                {cupom.limite_por_usuario && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {t('gestor.cupons.maxPerUser', { count: cupom.limite_por_usuario })}
                  </Badge>
                )}
                {cupom.cursos_aplicaveis && cupom.cursos_aplicaveis.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {t('gestor.cupons.specificCourses')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 ml-4">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('gestor.cupons.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('gestor.cupons.subtitle')}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('gestor.cupons.createButton')}
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('gestor.cupons.stats.activeCoupons')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Tag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cuponsAtivos.length}</p>
                <p className="text-xs text-gray-500">{t('gestor.cupons.stats.coupons')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('gestor.cupons.stats.totalUses')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">116</p>
                <p className="text-xs text-gray-500">{t('gestor.cupons.stats.uses')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('gestor.cupons.stats.totalDiscount')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ 8.450</p>
                <p className="text-xs text-gray-500">{t('gestor.cupons.stats.granted')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('gestor.cupons.stats.conversionRate')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">38%</p>
                <p className="text-xs text-gray-500">{t('gestor.cupons.stats.converted')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cupons */}
      <Card>
        <CardHeader>
          <CardTitle>{t('gestor.cupons.listTitle')}</CardTitle>
          <CardDescription>
            {t('gestor.cupons.listDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={abaSelecionada} onValueChange={(v) => setAbaSelecionada(v as any)}>
            <TabsList>
              <TabsTrigger value="ativos">{t('gestor.cupons.tabs.active', { count: cuponsAtivos.length })}</TabsTrigger>
              <TabsTrigger value="expirados">{t('gestor.cupons.tabs.expired', { count: cuponsExpirados.length })}</TabsTrigger>
            </TabsList>

            <TabsContent value="ativos" className="space-y-4 mt-6">
              {cuponsAtivos.map(cupom => renderCupom(cupom))}
            </TabsContent>

            <TabsContent value="expirados" className="space-y-4 mt-6">
              {cuponsExpirados.length > 0 ? (
                cuponsExpirados.map(cupom => renderCupom(cupom))
              ) : (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('gestor.cupons.noExpiredCoupons')}
                  </h3>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog Criar Cupom */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('gestor.cupons.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('gestor.cupons.dialog.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Código */}
            <div>
              <Label htmlFor="codigo">{t('gestor.cupons.dialog.codeLabel')}</Label>
              <div className="flex gap-2">
                <Input
                  id="codigo"
                  placeholder={t('gestor.cupons.dialog.codePlaceholder')}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <Button type="button" variant="outline" onClick={gerarCodigoAleatorio}>
                  {t('gestor.cupons.dialog.generate')}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t('gestor.cupons.dialog.codeHint')}
              </p>
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">{t('gestor.cupons.dialog.descriptionLabel')}</Label>
              <Textarea
                id="descricao"
                placeholder={t('gestor.cupons.dialog.descriptionPlaceholder')}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
              />
            </div>

            {/* Tipo e Valor do Desconto */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">{t('gestor.cupons.dialog.discountTypeLabel')}</Label>
                <Select value={tipoDesconto} onValueChange={(v) => setTipoDesconto(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">{t('gestor.cupons.dialog.discountTypePercentage')}</SelectItem>
                    <SelectItem value="valor_fixo">{t('gestor.cupons.dialog.discountTypeFixed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="valor-desconto">
                  {t('gestor.cupons.dialog.discountValueLabel')} {tipoDesconto === 'percentual' ? t('gestor.cupons.dialog.discountValuePercentageSuffix') : t('gestor.cupons.dialog.discountValueFixedSuffix')}
                </Label>
                <Input
                  id="valor-desconto"
                  type="number"
                  placeholder={tipoDesconto === 'percentual' ? t('gestor.cupons.dialog.discountValuePercentagePlaceholder') : t('gestor.cupons.dialog.discountValueFixedPlaceholder')}
                  value={valorDesconto}
                  onChange={(e) => setValorDesconto(e.target.value)}
                  step={tipoDesconto === 'percentual' ? '1' : '0.01'}
                />
              </div>
            </div>

            {/* Valor Mínimo */}
            <div>
              <Label htmlFor="valor-minimo">{t('gestor.cupons.dialog.minimumPurchaseLabel')}</Label>
              <Input
                id="valor-minimo"
                type="number"
                placeholder={t('gestor.cupons.dialog.minimumPurchasePlaceholder')}
                value={valorMinimo}
                onChange={(e) => setValorMinimo(e.target.value)}
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('gestor.cupons.dialog.minimumPurchaseHint')}
              </p>
            </div>

            {/* Período de Validade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data-inicio">{t('gestor.cupons.dialog.startDateLabel')}</Label>
                <Input
                  id="data-inicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="data-fim">{t('gestor.cupons.dialog.endDateLabel')}</Label>
                <Input
                  id="data-fim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>

            {/* Limites de Uso */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="limitar-uso">{t('gestor.cupons.dialog.limitUsesLabel')}</Label>
                  <p className="text-xs text-gray-500">
                    {t('gestor.cupons.dialog.limitUsesHint')}
                  </p>
                </div>
                <Switch
                  id="limitar-uso"
                  checked={limitarUso}
                  onCheckedChange={setLimitarUso}
                />
              </div>

              {limitarUso && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="limite-uso">{t('gestor.cupons.dialog.totalUsesLimitLabel')}</Label>
                    <Input
                      id="limite-uso"
                      type="number"
                      placeholder={t('gestor.cupons.dialog.totalUsesLimitPlaceholder')}
                      value={limiteUso}
                      onChange={(e) => setLimiteUso(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="limite-usuario">{t('gestor.cupons.dialog.perUserLimitLabel')}</Label>
                    <Input
                      id="limite-usuario"
                      type="number"
                      placeholder={t('gestor.cupons.dialog.perUserLimitPlaceholder')}
                      value={limiteUsuario}
                      onChange={(e) => setLimiteUsuario(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button onClick={handleCriarCupom}>
              {t('gestor.cupons.createButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CuponsPage;
