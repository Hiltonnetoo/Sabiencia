import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Download, Filter } from 'lucide-react';
import { ExportDialog } from './ExportDialog';
import { ExportColumn } from '../../utils/exportService';

interface ExportButtonProps {
  title: string;
  data: any[];
  columns: ExportColumn[];
  filename?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  totalRecords?: number; // Total sem filtros para mostrar quantos estão filtrados
  appliedFiltersCount?: number; // Quantidade de filtros ativos
}

export function ExportButton({
  title,
  data,
  columns,
  filename,
  variant = 'outline',
  size = 'default',
  children,
  totalRecords,
  appliedFiltersCount,
}: ExportButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  
  const hasFilters = appliedFiltersCount && appliedFiltersCount > 0;
  const isFiltered = totalRecords && data.length < totalRecords;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowDialog(true)}
        disabled={data.length === 0}
        className="relative"
      >
        <Download className="mr-2 h-4 w-4" />
        {children || 'Exportar'}
        {hasFilters && (
          <Badge variant="secondary" className="ml-2 h-5 px-1.5">
            <Filter className="h-3 w-3 mr-1" />
            {appliedFiltersCount}
          </Badge>
        )}
      </Button>
      
      {isFiltered && (
        <p className="text-xs text-gray-500 mt-1">
          Exportando {data.length} de {totalRecords} registros (filtrados)
        </p>
      )}

      <ExportDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title={title}
        data={data}
        columns={columns}
        defaultFilename={filename}
      />
    </>
  );
}
