/**
 * Serviço de Exportação de Dados
 * Suporta exportação para PDF, Excel e CSV
 */

 

export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  title?: string;
  orientation?: 'portrait' | 'landscape';
  includeTimestamp?: boolean;
}

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
  format?: (value: any) => string;
}

/**
 * Exporta dados para PDF
 */
export async function exportToPDF(
  data: any[],
  columns: ExportColumn[],
  options: Partial<ExportOptions> = {}
): Promise<void> {
  const {
    filename = 'export',
    title = 'Relatório',
    orientation = 'portrait',
    includeTimestamp = true,
  } = options;

  const jsPDF = (await import('jspdf')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  // Criar documento PDF
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  // Adicionar título
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Adicionar timestamp se solicitado
  if (includeTimestamp) {
    doc.setFontSize(10);
    const timestamp = new Date().toLocaleString('pt-BR');
    doc.text(`Gerado em: ${timestamp}`, 14, 22);
  }

  // Preparar dados da tabela
  const headers = columns.map((col) => col.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      return col.format ? col.format(value) : value ?? '';
    })
  );

  // Adicionar tabela
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: includeTimestamp ? 25 : 20,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 10 },
  });

  // Salvar PDF
  const finalFilename = includeTimestamp
    ? `${filename}_${Date.now()}.pdf`
    : `${filename}.pdf`;
  doc.save(finalFilename);
}

/**
 * Exporta dados para Excel
 */
export async function exportToExcel(
  data: any[],
  columns: ExportColumn[],
  options: Partial<ExportOptions> = {}
): Promise<void> {
  const {
    filename = 'export',
    title = 'Relatório',
    includeTimestamp = true,
  } = options;

  const XLSX = await import('xlsx');

  // Preparar dados
  const headers = columns.map((col) => col.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      return col.format ? col.format(value) : value ?? '';
    })
  );

  // Criar worksheet
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Aplicar larguras de coluna se especificadas
  const colWidths = columns.map((col) => ({
    wch: col.width || 15,
  }));
  ws['!cols'] = colWidths;

  // Criar workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31)); // Excel sheet name limit

  // Salvar arquivo
  const finalFilename = includeTimestamp
    ? `${filename}_${Date.now()}.xlsx`
    : `${filename}.xlsx`;
  XLSX.writeFile(wb, finalFilename);
}

/**
 * Exporta dados para CSV
 */
export function exportToCSV(
  data: any[],
  columns: ExportColumn[],
  options: Partial<ExportOptions> = {}
): void {
  const { filename = 'export', includeTimestamp = true } = options;

  // Preparar headers
  const headers = columns.map((col) => col.header).join(',');

  // Preparar linhas
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const value = item[col.key];
        const formatted = col.format ? col.format(value) : value ?? '';
        // Escapar valores que contêm vírgulas ou aspas
        const escaped = String(formatted).includes(',') || String(formatted).includes('"')
          ? `"${String(formatted).replace(/"/g, '""')}"`
          : formatted;
        return escaped;
      })
      .join(',')
  );

  // Combinar em CSV
  const csv = [headers, ...rows].join('\n');

  // Criar blob e baixar
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM para UTF-8
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const finalFilename = includeTimestamp
    ? `${filename}_${Date.now()}.csv`
    : `${filename}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta dados no formato especificado
 */
export async function exportData(
  data: any[],
  columns: ExportColumn[],
  options: ExportOptions
): Promise<void> {
  switch (options.format) {
    case 'pdf':
      await exportToPDF(data, columns, options);
      break;
    case 'excel':
      await exportToExcel(data, columns, options);
      break;
    case 'csv':
      exportToCSV(data, columns, options);
      break;
    default:
      throw new Error(`Formato não suportado: ${options.format}`);
  }
}

/**
 * Exporta múltiplas planilhas para Excel
 */
export async function exportMultiSheetExcel(
  sheets: Array<{
    name: string;
    data: any[];
    columns: ExportColumn[];
  }>,
  filename: string = 'export',
  includeTimestamp: boolean = true
): Promise<void> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const headers = sheet.columns.map((col) => col.header);
    const rows = sheet.data.map((item) =>
      sheet.columns.map((col) => {
        const value = item[col.key];
        return col.format ? col.format(value) : value ?? '';
      })
    );

    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const colWidths = sheet.columns.map((col) => ({
      wch: col.width || 15,
    }));
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31));
  });

  const finalFilename = includeTimestamp
    ? `${filename}_${Date.now()}.xlsx`
    : `${filename}.xlsx`;
  XLSX.writeFile(wb, finalFilename);
}
