import { useState, useRef } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  importFromCSV,
  importFromExcel,
  getExcelSheets,
  ImportMapping,
  ImportResult,
} from '../../utils/importService';
import { toast } from 'sonner';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  mappings: ImportMapping[];
  onImportComplete: (data: any[]) => void;
}

export function ImportDialog({
  open,
  onOpenChange,
  title,
  mappings,
  onImportComplete,
}: ImportDialogProps) {
  const [step, setStep] = useState<'upload' | 'configure' | 'result'>('upload');
  const [fileType, setFileType] = useState<'csv' | 'excel'>('excel');
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Se for Excel, carregar lista de planilhas
    if (fileType === 'excel') {
      try {
        const sheetNames = await getExcelSheets(selectedFile);
        setSheets(sheetNames);
        setSelectedSheet(0);
      } catch (error) {
        console.error('Erro ao ler planilhas:', error);
        toast.error('Erro ao ler arquivo Excel');
        return;
      }
    }

    setStep('configure');
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      let importResult: ImportResult;

      if (fileType === 'csv') {
        importResult = await importFromCSV(file, mappings);
      } else {
        importResult = await importFromExcel(file, mappings, selectedSheet);
      }

      setResult(importResult);
      setStep('result');

      if (importResult.success) {
        toast.success(`${importResult.validRows} registro(s) importado(s) com sucesso!`);
      } else if (importResult.validRows > 0) {
        toast.warning(
          `${importResult.validRows} registro(s) importado(s) com ${importResult.errors.length} erro(s)`
        );
      } else {
        toast.error('Nenhum registro válido foi importado');
      }
    } catch (error) {
      console.error('Erro ao importar:', error);
      toast.error('Erro ao processar arquivo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    if (result && result.data.length > 0) {
      onImportComplete(result.data);
    }
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setSheets([]);
    setSelectedSheet(0);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Dados - {title}
          </DialogTitle>
          <DialogDescription>
            Importe dados de arquivos CSV ou Excel.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-6 py-4">
            {/* Tipo de arquivo */}
            <div className="space-y-3">
              <Label>Tipo de Arquivo</Label>
              <RadioGroup value={fileType} onValueChange={(v) => setFileType(v as any)}>
                <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="excel" id="excel-import" />
                  <Label
                    htmlFor="excel-import"
                    className="flex-1 flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-5 w-5" />
                    <div>
                      <div>Excel (.xlsx, .xls)</div>
                      <div className="text-xs text-muted-foreground">
                        Suporta múltiplas planilhas
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="csv" id="csv-import" />
                  <Label
                    htmlFor="csv-import"
                    className="flex-1 flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="h-5 w-5" />
                    <div>
                      <div>CSV (.csv)</div>
                      <div className="text-xs text-muted-foreground">
                        Arquivo de texto separado por vírgulas
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <Label>Selecionar Arquivo</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:bg-accent cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={fileType === 'csv' ? '.csv' : '.xlsx,.xls'}
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Escolher Arquivo
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  {fileType === 'csv' ? 'CSV' : 'Excel'} • Máx 10MB
                </p>
              </div>
            </div>

            {/* Instruções */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="mb-2">O arquivo deve conter as seguintes colunas:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {mappings
                    .filter((m) => m.required)
                    .map((m) => (
                      <li key={m.sourceColumn}>{m.sourceColumn} (obrigatório)</li>
                    ))}
                  {mappings
                    .filter((m) => !m.required)
                    .slice(0, 3)
                    .map((m) => (
                      <li key={m.sourceColumn}>{m.sourceColumn} (opcional)</li>
                    ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 'configure' && (
          <div className="space-y-6 py-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Arquivo selecionado: <strong>{file?.name}</strong>
              </AlertDescription>
            </Alert>

            {fileType === 'excel' && sheets.length > 1 && (
              <div className="space-y-2">
                <Label>Selecione a Planilha</Label>
                <Select
                  value={selectedSheet.toString()}
                  onValueChange={(v) => setSelectedSheet(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sheets.map((sheet, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {sheet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleReset}>
                Voltar
              </Button>
              <Button onClick={handleImport} disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Importar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && result && (
          <div className="space-y-6 py-4">
            {/* Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>
                  {result.validRows} / {result.totalRows} registros
                </span>
              </div>
              <Progress
                value={(result.validRows / result.totalRows) * 100}
                className="h-2"
              />
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl text-green-600 dark:text-green-400">
                  {result.validRows}
                </div>
                <div className="text-xs text-muted-foreground">Válidos</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl text-red-600 dark:text-red-400">
                  {result.errors.length}
                </div>
                <div className="text-xs text-muted-foreground">Erros</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="text-2xl text-yellow-600 dark:text-yellow-400">
                  {result.warnings.length}
                </div>
                <div className="text-xs text-muted-foreground">Avisos</div>
              </div>
            </div>

            {/* Erros */}
            {result.errors.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Erros Encontrados
                </Label>
                <ScrollArea className="h-[150px] rounded-md border">
                  <div className="p-3 space-y-1">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600">
                        • {error}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Avisos */}
            {result.warnings.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  Avisos
                </Label>
                <ScrollArea className="h-[100px] rounded-md border">
                  <div className="p-3 space-y-1">
                    {result.warnings.map((warning, index) => (
                      <div key={index} className="text-sm text-yellow-600">
                        • {warning}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleReset}>
                Importar Outro
              </Button>
              <Button
                onClick={handleComplete}
                disabled={result.validRows === 0}
              >
                Concluir
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
