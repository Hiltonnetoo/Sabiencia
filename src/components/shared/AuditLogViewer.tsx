// ============================================
// AUDIT LOG VIEWER - Visualizador de log de auditoria
// ============================================

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  getAuditLogs, 
  getActionDescription, 
  AuditLogEntry,
  AuditAction,
  AuditResource 
} from '../../utils/auditLog';
import { 
  Clock, 
  User, 
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  LogIn,
  LogOut,
  Shield,
  Archive,
  RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AuditLogViewerProps {
  userId?: string;
  resource?: AuditResource;
  resourceId?: string;
  limit?: number;
  showFilters?: boolean;
}

const getActionIcon = (action: AuditAction) => {
  const icons = {
    [AuditAction.CREATE]: FileText,
    [AuditAction.READ]: Eye,
    [AuditAction.UPDATE]: Edit,
    [AuditAction.DELETE]: Trash2,
    [AuditAction.LOGIN]: LogIn,
    [AuditAction.LOGOUT]: LogOut,
    [AuditAction.EXPORT]: Download,
    [AuditAction.IMPORT]: Upload,
    [AuditAction.RESTORE]: RefreshCw,
    [AuditAction.ARCHIVE]: Archive,
    [AuditAction.GRANT_PERMISSION]: Shield,
    [AuditAction.REVOKE_PERMISSION]: Shield,
  };
  
  return icons[action] || FileText;
};

const getActionColor = (action: AuditAction): string => {
  const colors = {
    [AuditAction.CREATE]: 'bg-green-100 text-green-700',
    [AuditAction.READ]: 'bg-blue-100 text-blue-700',
    [AuditAction.UPDATE]: 'bg-yellow-100 text-yellow-700',
    [AuditAction.DELETE]: 'bg-red-100 text-red-700',
    [AuditAction.LOGIN]: 'bg-purple-100 text-purple-700',
    [AuditAction.LOGOUT]: 'bg-gray-100 text-gray-700',
    [AuditAction.EXPORT]: 'bg-indigo-100 text-indigo-700',
    [AuditAction.IMPORT]: 'bg-indigo-100 text-indigo-700',
    [AuditAction.RESTORE]: 'bg-cyan-100 text-cyan-700',
    [AuditAction.ARCHIVE]: 'bg-orange-100 text-orange-700',
    [AuditAction.GRANT_PERMISSION]: 'bg-emerald-100 text-emerald-700',
    [AuditAction.REVOKE_PERMISSION]: 'bg-rose-100 text-rose-700',
  };
  
  return colors[action] || 'bg-gray-100 text-gray-700';
};

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  userId,
  resource,
  resourceId,
  limit = 50,
  showFilters = true,
}) => {
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [resourceFilter, setResourceFilter] = useState<AuditResource | 'all'>('all');

  const logs = useMemo(() => {
    let allLogs = getAuditLogs();
    
    // Filtrar por usuário
    if (userId) {
      allLogs = allLogs.filter(log => log.user_id === userId);
    }
    
    // Filtrar por recurso
    if (resource) {
      allLogs = allLogs.filter(log => log.resource === resource);
    }
    
    // Filtrar por ID do recurso
    if (resourceId) {
      allLogs = allLogs.filter(log => log.resource_id === resourceId);
    }
    
    // Filtrar por ação (filtro UI)
    if (actionFilter !== 'all') {
      allLogs = allLogs.filter(log => log.action === actionFilter);
    }
    
    // Filtrar por recurso (filtro UI)
    if (resourceFilter !== 'all') {
      allLogs = allLogs.filter(log => log.resource === resourceFilter);
    }
    
    return allLogs.slice(0, limit);
  }, [userId, resource, resourceId, actionFilter, resourceFilter, limit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Atividades</CardTitle>
        <CardDescription>
          {logs.length} {logs.length === 1 ? 'ação registrada' : 'ações registradas'}
        </CardDescription>
        
        {showFilters && (
          <div className="flex gap-4 mt-4">
            <div className="w-full max-w-xs">
              <Select value={actionFilter} onValueChange={(value) => setActionFilter(value as AuditAction | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  <SelectItem value={AuditAction.CREATE}>Criação</SelectItem>
                  <SelectItem value={AuditAction.UPDATE}>Edição</SelectItem>
                  <SelectItem value={AuditAction.DELETE}>Exclusão</SelectItem>
                  <SelectItem value={AuditAction.LOGIN}>Login</SelectItem>
                  <SelectItem value={AuditAction.EXPORT}>Exportação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full max-w-xs">
              <Select value={resourceFilter} onValueChange={(value) => setResourceFilter(value as AuditResource | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por recurso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os recursos</SelectItem>
                  <SelectItem value={AuditResource.ALUNO}>Alunos</SelectItem>
                  <SelectItem value={AuditResource.PROFESSOR}>Professores</SelectItem>
                  <SelectItem value={AuditResource.TURMA}>Turmas</SelectItem>
                  <SelectItem value={AuditResource.MATERIAL}>Materiais</SelectItem>
                  <SelectItem value={AuditResource.NOTA}>Notas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma atividade registrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => {
                const Icon = getActionIcon(log.action);
                
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {getActionDescription(log.action, log.resource, log.resource_name)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {log.user_role}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(log.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                      </div>
                      
                      {log.details && Object.keys(log.details).length > 0 && (
                        <details className="text-xs text-gray-600 mt-2">
                          <summary className="cursor-pointer hover:text-gray-900">
                            Ver detalhes
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
