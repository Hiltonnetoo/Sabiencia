import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Database,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  Loader2,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import {
  createBackup,
  saveBackup,
  listBackups,
  loadBackup,
  restoreBackup,
  deleteBackup,
  exportBackup,
  importBackup,
  getBackupsSize,
  formatBytes,
  BackupMetadata,
} from '../../utils/backupService';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface BackupManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BackupManager({ open, onOpenChange }: BackupManagerProps) {
  const { user } = useAuth();
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    if (open) {
      loadBackupsList();
    }
  }, [open]);

  const loadBackupsList = () => {
    const list = listBackups();
    setBackups(list.sort((a, b) => b.timestamp - a.timestamp));
    setTotalSize(getBackupsSize());
  };

  const handleCreateBackup = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const backup = createBackup(description || 'Backup manual');
      saveBackup(backup);
      loadBackupsList();
      toast.success('Backup criado com sucesso!');
      setShowCreateDialog(false);
      setDescription('');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error('Erro ao criar backup');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = restoreBackup(selectedBackup);
      if (success) {
        toast.success('Backup restaurado com sucesso! A página será recarregada.');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('Erro ao restaurar backup');
      }
      setShowRestoreDialog(false);
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast.error('Erro ao restaurar backup');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteBackup = async () => {
    if (!selectedBackup) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const success = deleteBackup(selectedBackup);
      if (success) {
        loadBackupsList();
        toast.success('Backup excluído com sucesso!');
      } else {
        toast.error('Erro ao excluir backup');
      }
      setShowDeleteDialog(false);
      setSelectedBackup(null);
    } catch (error) {
      console.error('Erro ao excluir backup:', error);
      toast.error('Erro ao excluir backup');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportBackup = (id: string) => {
    const backup = loadBackup(id);
    if (backup) {
      exportBackup(backup);
      toast.success('Backup exportado com sucesso!');
    } else {
      toast.error('Erro ao exportar backup');
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const backup = await importBackup(file);
      saveBackup(backup);
      loadBackupsList();
      toast.success('Backup importado com sucesso!');
      event.target.value = '';
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      toast.error('Erro ao importar backup. Verifique o arquivo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Gerenciador de Backups
            </DialogTitle>
            <DialogDescription>
              Crie, restaure e gerencie backups completos do sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Ações */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowCreateDialog(true)} disabled={isProcessing}>
                <Database className="mr-2 h-4 w-4" />
                Criar Backup
              </Button>
              <Button variant="outline" asChild disabled={isProcessing}>
                <label>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportBackup}
                  />
                </label>
              </Button>
            </div>

            {/* Estatísticas */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <HardDrive className="h-4 w-4" />
              <span>
                {backups.length} backup(s) • {formatBytes(totalSize)} utilizados
              </span>
            </div>

            {/* Lista de backups */}
            <ScrollArea className="h-[300px] rounded-md border">
              {backups.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                  <Database className="h-12 w-12 mb-3 opacity-20" />
                  <p>Nenhum backup encontrado</p>
                  <p className="text-sm">Crie seu primeiro backup para começar</p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {backups.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <p className="truncate">{backup.description}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>
                            {new Date(backup.timestamp).toLocaleString('pt-BR')}
                          </span>
                          <span>•</span>
                          <span>{backup.recordCount} registros</span>
                          <span>•</span>
                          <span>{formatBytes(backup.size)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExportBackup(backup.id)}
                          title="Exportar"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBackup(backup.id);
                            setShowRestoreDialog(true);
                          }}
                          title="Restaurar"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBackup(backup.id);
                            setShowDeleteDialog(true);
                          }}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de criação */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Backup</DialogTitle>
            <DialogDescription>
              Será criado um backup completo de todos os dados do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Backup antes da atualização de dados..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBackup} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Backup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de restauração */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá substituir todos os dados atuais pelos dados do backup
              selecionado. A página será recarregada automaticamente. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreBackup} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este backup? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBackup} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
