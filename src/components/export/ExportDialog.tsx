import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { FileDown, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { exportData, ExportColumn, ExportFormat } from '../../utils/exportService';
import { toast } from 'sonner';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: any[];
  columns: ExportColumn[];
  defaultFilename?: string;
}

export function ExportDialog({
  open,
  onOpenChange,
  title,
  data,
  columns,
  defaultFilename = 'export',
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [filename, setFilename] = useState(defaultFilename);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!filename.trim()) {
      toast.error('Digite um nome para o arquivo');
      return;
    }

    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simular processamento

      await exportData(data, columns, {
        format,
        filename,
        title,
        orientation: format === 'pdf' ? orientation : undefined,
        includeTimestamp,
      });

      toast.success('Dados exportados com sucesso!');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar dados');
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (fmt: ExportFormat) => {
    switch (fmt) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'csv':
        return <FileDown className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exportar Dados</DialogTitle>
          <DialogDescription>
            Exporte {data.length} registro(s) de {title.toLowerCase()} no formato desejado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Formato */}
          <div className="space-y-3">
            <Label>Formato de Exportação</Label>
            <RadioGroup value={format} onValueChange={(v: ExportFormat | string) => setFormat(v as ExportFormat)}>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="excel" id="excel" />
                <Label
                  htmlFor="excel"
                  className="flex-1 flex items-center gap-2 cursor-pointer"
                >
                  {getFormatIcon('excel')}
                  <div>
                    <div>Excel (.xlsx)</div>
                    <div className="text-xs text-muted-foreground">
                      Melhor para análise de dados
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label
                  htmlFor="pdf"
                  className="flex-1 flex items-center gap-2 cursor-pointer"
                >
                  {getFormatIcon('pdf')}
                  <div>
                    <div>PDF (.pdf)</div>
                    <div className="text-xs text-muted-foreground">
                      Melhor para impressão
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="csv" id="csv" />
                <Label
                  htmlFor="csv"
                  className="flex-1 flex items-center gap-2 cursor-pointer"
                >
                  {getFormatIcon('csv')}
                  <div>
                    <div>CSV (.csv)</div>
                    <div className="text-xs text-muted-foreground">
                      Compatível com qualquer sistema
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Nome do arquivo */}
          <div className="space-y-2">
            <Label htmlFor="filename">Nome do Arquivo</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="nome-do-arquivo"
            />
          </div>

          {/* Orientação (só para PDF) */}
          {format === 'pdf' && (
            <div className="space-y-2">
              <Label>Orientação da Página</Label>
              <RadioGroup
                value={orientation}
                onValueChange={(v: 'portrait' | 'landscape' | string) => setOrientation(v as 'portrait' | 'landscape')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait" id="portrait" />
                  <Label htmlFor="portrait" className="cursor-pointer">
                    Retrato
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landscape" id="landscape" />
                  <Label htmlFor="landscape" className="cursor-pointer">
                    Paisagem
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Opções */}
          <div className="space-y-2">
            <Label>Opções</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="timestamp"
                checked={includeTimestamp}
                onCheckedChange={(checked: boolean | 'indeterminate') => setIncludeTimestamp(checked === true)}
              />
              <Label htmlFor="timestamp" className="cursor-pointer">
                Incluir data/hora no nome do arquivo
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Exportar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
