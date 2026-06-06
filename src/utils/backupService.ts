/**
 * Serviço de Backup de Dados
 * Gerencia backup automático e manual dos dados do localStorage
 */

import type {
  User,
  Aluno,
  Professor,
  Turma,
  Disciplina,
  Material,
  Comunicado,
  Observacao,
  Pagamento,
  Nota,
  Frequencia,
  Notificacao,
} from '../types';

export interface BackupData {
  timestamp: number;
  version: string;
  data: {
    users?: User[];
    alunos?: Aluno[];
    professores?: Professor[];
    turmas?: Turma[];
    disciplinas?: Disciplina[];
    materiais?: Material[];
    comunicados?: Comunicado[];
    observacoes?: Observacao[];
    pagamentos?: Pagamento[];
    notas?: Nota[];
    frequencias?: Frequencia[];
    notifications?: Notificacao[];
  };
  metadata: {
    totalRecords: number;
    createdBy: string;
    description?: string;
  };
}

export interface BackupMetadata {
  id: string;
  timestamp: number;
  description: string;
  size: number;
  recordCount: number;
}

const BACKUP_STORAGE_KEY = 'sabiencia_backups';
const AUTO_BACKUP_KEY = 'sabiencia_auto_backup';
const BACKUP_VERSION = '1.0.0';

/**
 * Cria um backup completo dos dados
 */
export function createBackup(description: string = 'Backup manual'): BackupData {
  const data: BackupData['data'] = {};
  let totalRecords = 0;

  // Lista de chaves para fazer backup
  const dataKeys = [
    'mock_users',
    'mock_alunos',
    'mock_professores',
    'mock_turmas',
    'mock_disciplinas',
    'mock_materiais',
    'mock_comunicados',
    'mock_observacoes',
    'mock_pagamentos',
    'mock_notas',
    'mock_frequencias',
    'mock_notifications',
  ];

  // Coletar dados do localStorage
  dataKeys.forEach((key) => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const cleanKey = key.replace('mock_', '');
        data[cleanKey as keyof BackupData['data']] = parsed;
        totalRecords += Array.isArray(parsed) ? parsed.length : 1;
      } catch (error) {
        console.error(`Erro ao processar ${key}:`, error);
      }
    }
  });

  // Obter usuário atual
  const currentUserStr = localStorage.getItem('current_user');
  let createdBy = 'Sistema';
  if (currentUserStr) {
    try {
      const currentUser = JSON.parse(currentUserStr);
      createdBy = currentUser.nome || 'Sistema';
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
    }
  }

  const backup: BackupData = {
    timestamp: Date.now(),
    version: BACKUP_VERSION,
    data,
    metadata: {
      totalRecords,
      createdBy,
      description,
    },
  };

  return backup;
}

/**
 * Salva um backup no localStorage
 */
export function saveBackup(backup: BackupData): BackupMetadata {
  const backups = listBackups();
  
  const metadata: BackupMetadata = {
    id: `backup_${backup.timestamp}`,
    timestamp: backup.timestamp,
    description: backup.metadata.description || 'Backup',
    size: JSON.stringify(backup).length,
    recordCount: backup.metadata.totalRecords,
  };

  // Adicionar metadata à lista
  backups.push(metadata);
  localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backups));

  // Salvar dados do backup
  localStorage.setItem(metadata.id, JSON.stringify(backup));

  return metadata;
}

/**
 * Lista todos os backups salvos
 */
export function listBackups(): BackupMetadata[] {
  const stored = localStorage.getItem(BACKUP_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao listar backups:', error);
    return [];
  }
}

/**
 * Carrega um backup específico
 */
export function loadBackup(id: string): BackupData | null {
  const stored = localStorage.getItem(id);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao carregar backup:', error);
    return null;
  }
}

/**
 * Restaura um backup
 */
export function restoreBackup(id: string, options?: {
  selective?: string[]; // Restaurar apenas algumas chaves
  merge?: boolean; // Mesclar com dados existentes ao invés de substituir
  createBackupBefore?: boolean; // Criar backup antes de restaurar
}): boolean {
  const backup = loadBackup(id);
  if (!backup) return false;

  try {
    // Criar backup de segurança antes de restaurar
    if (options?.createBackupBefore) {
      const safetyBackup = createBackup('Backup automático antes de restaurar');
      saveBackup(safetyBackup);
    }

    // Restaurar cada conjunto de dados
    Object.entries(backup.data).forEach(([key, value]) => {
      if (!value) return;
      
      // Se restoration seletiva, verificar se a chave está incluída
      if (options?.selective && !options.selective.includes(key)) {
        return;
      }

      const storageKey = `mock_${key}`;

      if (options?.merge) {
        // Modo merge: combina dados existentes com o backup
        const existing = localStorage.getItem(storageKey);
        if (existing) {
          try {
            const existingData = JSON.parse(existing);
            const mergedData = Array.isArray(existingData) && Array.isArray(value)
              ? [...existingData, ...value]
              : value;
            localStorage.setItem(storageKey, JSON.stringify(mergedData));
          } catch {
            localStorage.setItem(storageKey, JSON.stringify(value));
          }
        } else {
          localStorage.setItem(storageKey, JSON.stringify(value));
        }
      } else {
        // Modo replace: substitui completamente
        localStorage.setItem(storageKey, JSON.stringify(value));
      }
    });

    return true;
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    return false;
  }
}

/**
 * Deleta um backup
 */
export function deleteBackup(id: string): boolean {
  try {
    const backups = listBackups();
    const filtered = backups.filter((b) => b.id !== id);
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(filtered));
    localStorage.removeItem(id);
    return true;
  } catch (error) {
    console.error('Erro ao deletar backup:', error);
    return false;
  }
}

/**
 * Exporta um backup como arquivo JSON
 */
export function exportBackup(backup: BackupData, filename?: string): void {
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const finalFilename =
    filename || `backup_${new Date(backup.timestamp).toISOString().split('T')[0]}.json`;

  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Importa um backup de um arquivo JSON
 */
export function importBackup(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content) as BackupData;

        // Validar estrutura básica
        if (!backup.timestamp || !backup.data || !backup.metadata) {
          throw new Error('Arquivo de backup inválido');
        }

        resolve(backup);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsText(file);
  });
}

/**
 * Cria backup automático
 */
export function createAutoBackup(): void {
  const backup = createBackup('Backup automático');
  localStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(backup));
}

/**
 * Carrega backup automático
 */
export function loadAutoBackup(): BackupData | null {
  const stored = localStorage.getItem(AUTO_BACKUP_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao carregar backup automático:', error);
    return null;
  }
}

/**
 * Calcula o tamanho total dos backups em bytes
 */
export function getBackupsSize(): number {
  const backups = listBackups();
  return backups.reduce((total, backup) => total + backup.size, 0);
}

/**
 * Formata bytes para string legível
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Compara dois backups e retorna as diferenças
 */
export function compareBackups(
  backup1Id: string,
  backup2Id: string
): {
  added: Record<string, number>;
  removed: Record<string, number>;
  modified: Record<string, number>;
} | null {
  const b1 = loadBackup(backup1Id);
  const b2 = loadBackup(backup2Id);
  
  if (!b1 || !b2) return null;

  const result = {
    added: {} as Record<string, number>,
    removed: {} as Record<string, number>,
    modified: {} as Record<string, number>,
  };

  // Comparar cada tipo de dado
  const allKeys = new Set([
    ...Object.keys(b1.data),
    ...Object.keys(b2.data),
  ]);

  allKeys.forEach((key) => {
    const data1 = b1.data[key as keyof BackupData['data']];
    const data2 = b2.data[key as keyof BackupData['data']];

    const count1 = Array.isArray(data1) ? data1.length : (data1 ? 1 : 0);
    const count2 = Array.isArray(data2) ? data2.length : (data2 ? 1 : 0);

    if (count1 < count2) {
      result.added[key] = count2 - count1;
    } else if (count1 > count2) {
      result.removed[key] = count1 - count2;
    } else if (count1 > 0 && JSON.stringify(data1) !== JSON.stringify(data2)) {
      result.modified[key] = count1;
    }
  });

  return result;
}

/**
 * Valida integridade de um backup
 */
export function validateBackup(backup: BackupData): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validações obrigatórias
  if (!backup.timestamp) {
    errors.push('Backup sem timestamp');
  }
  if (!backup.version) {
    errors.push('Backup sem versão');
  }
  if (!backup.data) {
    errors.push('Backup sem dados');
  }
  if (!backup.metadata) {
    errors.push('Backup sem metadata');
  }

  // Validações de consistência
  if (backup.data) {
    let actualRecords = 0;
    Object.values(backup.data).forEach((value) => {
      if (Array.isArray(value)) {
        actualRecords += value.length;
      } else if (value) {
        actualRecords += 1;
      }
    });

    if (backup.metadata?.totalRecords !== actualRecords) {
      warnings.push(
        `Contagem de registros inconsistente (esperado: ${backup.metadata?.totalRecords}, encontrado: ${actualRecords})`
      );
    }
  }

  // Validação de versão
  if (backup.version && backup.version !== BACKUP_VERSION) {
    warnings.push(
      `Versão do backup (${backup.version}) diferente da versão atual (${BACKUP_VERSION})`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Limpa backups antigos (mantém apenas os N mais recentes)
 */
export function cleanOldBackups(keepCount: number = 10): number {
  const backups = listBackups();
  
  if (backups.length <= keepCount) {
    return 0;
  }

  // Ordenar por timestamp (mais recente primeiro)
  const sorted = [...backups].sort((a, b) => b.timestamp - a.timestamp);
  
  // Pegar os que serão removidos
  const toRemove = sorted.slice(keepCount);
  
  // Remover cada um
  toRemove.forEach((backup) => {
    deleteBackup(backup.id);
  });

  return toRemove.length;
}

/**
 * Agenda backup automático
 */
export function scheduleAutoBackup(intervalMinutes: number = 60): () => void {
  const interval = setInterval(() => {
    createAutoBackup();
    console.log('Backup automático criado');
  }, intervalMinutes * 60 * 1000);

  // Retorna função para cancelar o agendamento
  return () => clearInterval(interval);
}

/**
 * Cria snapshot incremental (apenas mudanças desde último backup)
 */
export function createIncrementalBackup(
  lastBackupId: string,
  description: string = 'Backup incremental'
): BackupData | null {
  const lastBackup = loadBackup(lastBackupId);
  if (!lastBackup) return null;

  const currentData = createBackup(description);
  const incrementalData: BackupData['data'] = {};
  let totalRecords = 0;

  // Comparar e incluir apenas o que mudou
  Object.keys(currentData.data).forEach((key) => {
    const currentValue = currentData.data[key as keyof BackupData['data']];
    const lastValue = lastBackup.data[key as keyof BackupData['data']];

    if (JSON.stringify(currentValue) !== JSON.stringify(lastValue)) {
      incrementalData[key as keyof BackupData['data']] = currentValue;
      totalRecords += Array.isArray(currentValue) ? currentValue.length : 1;
    }
  });

  const incrementalBackup: BackupData = {
    ...currentData,
    data: incrementalData,
    metadata: {
      ...currentData.metadata,
      totalRecords,
      description: `${description} (incremental desde ${new Date(lastBackup.timestamp).toLocaleString()})`,
    },
  };

  return incrementalBackup;
}
