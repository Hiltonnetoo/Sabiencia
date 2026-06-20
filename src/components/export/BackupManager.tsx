import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
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

interface BackupManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BackupManager({ open, onOpenChange }: BackupManagerProps) {
  const { t } = useTranslation();
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
      const backup = createBackup(description || t('components.backupManager.manualBackup'));
      saveBackup(backup);
      loadBackupsList();
      toast.success(t('components.backupManager.createSuccess'));
      setShowCreateDialog(false);
      setDescription('');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error(t('components.backupManager.createError'));
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
        toast.success(t('components.backupManager.restoreSuccess'));
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(t('components.backupManager.restoreError'));
      }
      setShowRestoreDialog(false);
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast.error(t('components.backupManager.restoreError'));
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
        toast.success(t('components.backupManager.deleteSuccess'));
      } else {
        toast.error(t('components.backupManager.deleteError'));
      }
      setShowDeleteDialog(false);
      setSelectedBackup(null);
    } catch (error) {
      console.error('Erro ao excluir backup:', error);
      toast.error(t('components.backupManager.deleteError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportBackup = (id: string) => {
    const backup = loadBackup(id);
    if (backup) {
      exportBackup(backup);
      toast.success(t('components.backupManager.exportSuccess'));
    } else {
      toast.error(t('components.backupManager.exportError'));
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
      toast.success(t('components.backupManager.importSuccess'));
      event.target.value = '';
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      toast.error(t('components.backupManager.importError'));
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
              {t('components.backupManager.title')}
            </DialogTitle>
            <DialogDescription>
              {t('components.backupManager.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Ações */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowCreateDialog(true)} disabled={isProcessing}>
                <Database className="mr-2 h-4 w-4" />
                {t('components.backupManager.createBackup')}
              </Button>
              <Button variant="outline" asChild disabled={isProcessing}>
                <label>
                  <Upload className="mr-2 h-4 w-4" />
                  {t('components.backupManager.importBackup')}
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
                {t('components.backupManager.storageUsage', { count: backups.length, size: formatBytes(totalSize) })}
              </span>
            </div>

            {/* Lista de backups */}
            <ScrollArea className="h-[300px] rounded-md border">
              {backups.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                  <Database className="h-12 w-12 mb-3 opacity-20" />
                  <p>{t('components.backupManager.noBackups')}</p>
                  <p className="text-sm">{t('components.backupManager.noBackupsHint')}</p>
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
                            {new Date(backup.timestamp).toLocaleString(undefined)}
                          </span>
                          <span>•</span>
                          <span>{t('components.backupManager.recordsCount', { count: backup.recordCount })}</span>
                          <span>•</span>
                          <span>{formatBytes(backup.size)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExportBackup(backup.id)}
                          title={t('components.backupManager.exportTitle')}
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
                          title={t('components.backupManager.restoreTitle')}
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
                          title={t('components.backupManager.deleteTitle')}
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
              {t('common.actions.close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de criação */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('components.backupManager.createDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('components.backupManager.createDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t('components.backupManager.descriptionLabel')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('components.backupManager.descriptionPlaceholder')}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button onClick={handleCreateBackup} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('components.backupManager.createBackup')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de restauração */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('components.backupManager.restoreDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('components.backupManager.restoreDialogDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreBackup} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('components.backupManager.restore')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('components.backupManager.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('components.backupManager.deleteDialogDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBackup} disabled={isProcessing}>
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
