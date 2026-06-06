import { useState, useEffect } from 'react';
import {
  createBackup,
  saveBackup,
  listBackups,
  loadBackup,
  restoreBackup,
  deleteBackup,
  exportBackup,
  importBackup,
  createAutoBackup,
  loadAutoBackup,
  getBackupsSize,
  BackupData,
  BackupMetadata,
} from '../utils/backupService';

export function useBackup() {
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Carregar lista de backups
  const loadBackupsList = () => {
    const list = listBackups();
    setBackups(list.sort((a, b) => b.timestamp - a.timestamp));
    setTotalSize(getBackupsSize());
  };

  // Carregar automaticamente na montagem
  useEffect(() => {
    loadBackupsList();
  }, []);

  // Criar backup
  const handleCreateBackup = async (description?: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const backup = createBackup(description);
      saveBackup(backup);
      loadBackupsList();
      return true;
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Restaurar backup
  const handleRestoreBackup = async (id: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = restoreBackup(id);
      return success;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Deletar backup
  const handleDeleteBackup = async (id: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const success = deleteBackup(id);
      if (success) {
        loadBackupsList();
      }
      return success;
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Exportar backup
  const handleExportBackup = (id: string): boolean => {
    try {
      const backup = loadBackup(id);
      if (backup) {
        exportBackup(backup);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      return false;
    }
  };

  // Importar backup
  const handleImportBackup = async (file: File): Promise<boolean> => {
    setIsProcessing(true);
    try {
      const backup = await importBackup(file);
      saveBackup(backup);
      loadBackupsList();
      return true;
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Criar backup automático
  const handleAutoBackup = () => {
    try {
      createAutoBackup();
      return true;
    } catch (error) {
      console.error('Erro ao criar backup automático:', error);
      return false;
    }
  };

  // Carregar backup automático
  const handleLoadAutoBackup = (): BackupData | null => {
    try {
      return loadAutoBackup();
    } catch (error) {
      console.error('Erro ao carregar backup automático:', error);
      return null;
    }
  };

  return {
    backups,
    totalSize,
    isProcessing,
    createBackup: handleCreateBackup,
    restoreBackup: handleRestoreBackup,
    deleteBackup: handleDeleteBackup,
    exportBackup: handleExportBackup,
    importBackup: handleImportBackup,
    createAutoBackup: handleAutoBackup,
    loadAutoBackup: handleLoadAutoBackup,
    refreshBackups: loadBackupsList,
  };
}
