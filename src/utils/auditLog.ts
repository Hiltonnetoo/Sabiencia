// ============================================
// AUDIT LOG - Sistema de log de auditoria
// ============================================

export enum AuditAction {
  // CRUD
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  
  // Autenticação
  LOGIN = 'login',
  LOGOUT = 'logout',
  
  // Específicos
  EXPORT = 'export',
  IMPORT = 'import',
  RESTORE = 'restore',
  ARCHIVE = 'archive',
  
  // Permissões
  GRANT_PERMISSION = 'grant_permission',
  REVOKE_PERMISSION = 'revoke_permission',
}

export enum AuditResource {
  ALUNO = 'aluno',
  PROFESSOR = 'professor',
  TURMA = 'turma',
  DISCIPLINA = 'disciplina',
  MATERIAL = 'material',
  NOTA = 'nota',
  FREQUENCIA = 'frequencia',
  COMUNICADO = 'comunicado',
  PAGAMENTO = 'pagamento',
  OBSERVACAO = 'observacao',
  USER = 'user',
  SYSTEM = 'system',
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user_id: string;
  user_name: string;
  user_role: 'gestor' | 'professor' | 'aluno';
  action: AuditAction;
  resource: AuditResource;
  resource_id?: string;
  resource_name?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Registra uma ação no log de auditoria
 */
export const logAuditAction = (
  entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
): AuditLogEntry => {
  const auditEntry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    ...entry,
  };

  // Em ambiente de desenvolvimento, apenas loga no console
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', auditEntry);
  }

  // Em produção, enviaria para backend/Supabase
  const existingLogs = getAuditLogs();
  existingLogs.unshift(auditEntry);
  
  // Mantém apenas últimas 1000 entradas no localStorage
  const logsToStore = existingLogs.slice(0, 1000);
  localStorage.setItem('audit_logs', JSON.stringify(logsToStore));

  return auditEntry;
};

/**
 * Obtém logs de auditoria do localStorage
 */
export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const stored = localStorage.getItem('audit_logs');
    if (!stored) return [];
    
    const logs = JSON.parse(stored);
    // Converte timestamps de string para Date
    return logs.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp),
    }));
  } catch {
    return [];
  }
};

/**
 * Filtra logs por usuário
 */
export const getAuditLogsByUser = (userId: string): AuditLogEntry[] => {
  return getAuditLogs().filter(log => log.user_id === userId);
};

/**
 * Filtra logs por recurso
 */
export const getAuditLogsByResource = (
  resource: AuditResource,
  resourceId?: string
): AuditLogEntry[] => {
  const logs = getAuditLogs().filter(log => log.resource === resource);
  
  if (resourceId) {
    return logs.filter(log => log.resource_id === resourceId);
  }
  
  return logs;
};

/**
 * Filtra logs por ação
 */
export const getAuditLogsByAction = (action: AuditAction): AuditLogEntry[] => {
  return getAuditLogs().filter(log => log.action === action);
};

/**
 * Filtra logs por período
 */
export const getAuditLogsByDateRange = (
  startDate: Date,
  endDate: Date
): AuditLogEntry[] => {
  return getAuditLogs().filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
};

/**
 * Limpa logs antigos (mais de X dias)
 */
export const cleanOldAuditLogs = (daysToKeep: number = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const recentLogs = getAuditLogs().filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= cutoffDate;
  });
  
  localStorage.setItem('audit_logs', JSON.stringify(recentLogs));
  
  return recentLogs.length;
};

/**
 * Obtém descrição amigável da ação
 */
export const getActionDescription = (
  action: AuditAction,
  resource: AuditResource,
  resourceName?: string
): string => {
  const actionLabels: Record<AuditAction, string> = {
    [AuditAction.CREATE]: 'criou',
    [AuditAction.READ]: 'visualizou',
    [AuditAction.UPDATE]: 'editou',
    [AuditAction.DELETE]: 'excluiu',
    [AuditAction.LOGIN]: 'fez login',
    [AuditAction.LOGOUT]: 'fez logout',
    [AuditAction.EXPORT]: 'exportou',
    [AuditAction.IMPORT]: 'importou',
    [AuditAction.RESTORE]: 'restaurou',
    [AuditAction.ARCHIVE]: 'arquivou',
    [AuditAction.GRANT_PERMISSION]: 'concedeu permissão',
    [AuditAction.REVOKE_PERMISSION]: 'revogou permissão',
  };

  const resourceLabels: Record<AuditResource, string> = {
    [AuditResource.ALUNO]: 'aluno',
    [AuditResource.PROFESSOR]: 'professor',
    [AuditResource.TURMA]: 'turma',
    [AuditResource.DISCIPLINA]: 'disciplina',
    [AuditResource.MATERIAL]: 'material',
    [AuditResource.NOTA]: 'nota',
    [AuditResource.FREQUENCIA]: 'frequência',
    [AuditResource.COMUNICADO]: 'comunicado',
    [AuditResource.PAGAMENTO]: 'pagamento',
    [AuditResource.OBSERVACAO]: 'observação',
    [AuditResource.USER]: 'usuário',
    [AuditResource.SYSTEM]: 'sistema',
  };

  const actionLabel = actionLabels[action];
  const resourceLabel = resourceLabels[resource];
  
  if (resourceName) {
    return `${actionLabel} ${resourceLabel} "${resourceName}"`;
  }
  
  return `${actionLabel} ${resourceLabel}`;
};
