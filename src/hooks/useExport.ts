import { useState } from 'react';
import {
  exportData,
  exportToPDF,
  exportToExcel,
  exportToCSV,
  exportMultiSheetExcel,
  ExportColumn,
  ExportOptions,
} from '../utils/exportService';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (
    data: any[],
    columns: ExportColumn[],
    options: ExportOptions
  ) => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await exportData(data, columns, options);
      return true;
    } catch (error) {
      console.error('Erro ao exportar:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async (
    data: any[],
    columns: ExportColumn[],
    options: Partial<ExportOptions> = {}
  ) => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await exportToPDF(data, columns, options);
      return true;
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async (
    data: any[],
    columns: ExportColumn[],
    options: Partial<ExportOptions> = {}
  ) => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await exportToExcel(data, columns, options);
      return true;
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async (
    data: any[],
    columns: ExportColumn[],
    options: Partial<ExportOptions> = {}
  ) => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      exportToCSV(data, columns, options);
      return true;
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMultiSheet = async (
    sheets: Array<{
      name: string;
      data: any[];
      columns: ExportColumn[];
    }>,
    filename?: string
  ) => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await exportMultiSheetExcel(sheets, filename);
      return true;
    } catch (error) {
      console.error('Erro ao exportar multi-sheet:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportData: handleExport,
    exportPDF: handleExportPDF,
    exportExcel: handleExportExcel,
    exportCSV: handleExportCSV,
    exportMultiSheet: handleExportMultiSheet,
  };
}
