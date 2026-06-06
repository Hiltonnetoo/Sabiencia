import React, { useState } from 'react';
import { Pagamento } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Calendar, CreditCard, FileText, CheckCircle2 } from 'lucide-react';
import { LoadingButton } from '../shared/LoadingButton';

interface PagamentoFormProps {
  pagamento: Pagamento;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    data_pagamento: Date;
    metodo_pagamento: string;
    comprovante_url?: string;
    observacao?: string;
  }) => void;
}

export function PagamentoForm({ pagamento, open, onClose, onSubmit }: PagamentoFormProps) {
  const [dataPagamento, setDataPagamento] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [comprovanteUrl, setComprovanteUrl] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!metodoPagamento) {
      alert('Selecione um método de pagamento');
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit({
        data_pagamento: new Date(dataPagamento),
        metodo_pagamento: metodoPagamento,
        comprovante_url: comprovanteUrl || undefined,
        observacao: observacao || undefined,
      });
      
      // Reset form
      setDataPagamento(new Date().toISOString().split('T')[0]);
      setMetodoPagamento('');
      setComprovanteUrl('');
      setObservacao('');
      
      onClose();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      alert('Erro ao registrar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Registrar Pagamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações do Pagamento */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valor</span>
              <span className="font-bold text-gray-900">{formatCurrency(pagamento.valor)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vencimento</span>
              <span className="font-medium text-gray-900">{formatDate(pagamento.data_vencimento)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ID</span>
              <span className="font-medium text-gray-900">{pagamento.id}</span>
            </div>
          </div>

          {/* Data do Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="data_pagamento" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data do Pagamento *
            </Label>
            <Input
              id="data_pagamento"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="metodo_pagamento" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Método de Pagamento *
            </Label>
            <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
              <SelectTrigger id="metodo_pagamento">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Boleto">Boleto Bancário</SelectItem>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                <SelectItem value="Transferência">Transferência Bancária</SelectItem>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* URL do Comprovante */}
          <div className="space-y-2">
            <Label htmlFor="comprovante_url" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              URL do Comprovante (opcional)
            </Label>
            <Input
              id="comprovante_url"
              type="url"
              placeholder="https://exemplo.com/comprovante.pdf"
              value={comprovanteUrl}
              onChange={(e) => setComprovanteUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Link para o comprovante de pagamento (pode ser adicionado depois)
            </p>
          </div>

          {/* Observação */}
          <div className="space-y-2">
            <Label htmlFor="observacao">Observação (opcional)</Label>
            <Textarea
              id="observacao"
              placeholder="Adicione informações adicionais sobre o pagamento..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">{observacao.length}/500 caracteres</p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <LoadingButton 
              type="submit" 
              isLoading={loading}
              loadingText="Salvando..."
            >
              Registrar Pagamento
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
