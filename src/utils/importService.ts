/**
 * Serviço de Importação de Dados
 * Suporta importação de CSV e Excel.
 * A biblioteca `xlsx` (~143KB gzip) é carregada sob demanda via import dinâmico
 * para não pesar no bundle de quem não importa planilhas.
 */

export interface ImportResult {
  success: boolean;
  data: any[];
  errors: string[];
  warnings: string[];
  totalRows: number;
  validRows: number;
}

export interface ImportMapping {
  sourceColumn: string;
  targetField: string;
  required?: boolean;
  validator?: (value: any) => boolean;
  transformer?: (value: any) => any;
}

/**
 * Importa dados de arquivo CSV
 */
export function importFromCSV(
  file: File,
  mappings: ImportMapping[]
): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter((line) => line.trim());

        if (lines.length === 0) {
          resolve({
            success: false,
            data: [],
            errors: ['Arquivo vazio'],
            warnings: [],
            totalRows: 0,
            validRows: 0,
          });
          return;
        }

        // Parse header
        const headers = parseCSVLine(lines[0]);
        const data: any[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        // Process data rows
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length === 0) continue;

          try {
            const row = processRow(headers, values, mappings, i + 1);
            if (row.errors.length > 0) {
              errors.push(...row.errors);
            }
            if (row.warnings.length > 0) {
              warnings.push(...row.warnings);
            }
            if (row.data) {
              data.push(row.data);
            }
          } catch (error) {
            errors.push(`Linha ${i + 1}: ${error}`);
          }
        }

        resolve({
          success: errors.length === 0,
          data,
          errors,
          warnings,
          totalRows: lines.length - 1,
          validRows: data.length,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Importa dados de arquivo Excel
 */
export function importFromExcel(
  file: File,
  mappings: ImportMapping[],
  sheetIndex: number = 0
): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const XLSX = await import('xlsx');
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        if (workbook.SheetNames.length === 0) {
          resolve({
            success: false,
            data: [],
            errors: ['Nenhuma planilha encontrada'],
            warnings: [],
            totalRows: 0,
            validRows: 0,
          });
          return;
        }

        const sheetName = workbook.SheetNames[sheetIndex];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          resolve({
            success: false,
            data: [],
            errors: ['Planilha vazia'],
            warnings: [],
            totalRows: 0,
            validRows: 0,
          });
          return;
        }

        const headers = jsonData[0] as string[];
        const processedData: any[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const values = jsonData[i] as any[];
          if (!values || values.length === 0) continue;

          try {
            const row = processRow(headers, values, mappings, i + 1);
            if (row.errors.length > 0) {
              errors.push(...row.errors);
            }
            if (row.warnings.length > 0) {
              warnings.push(...row.warnings);
            }
            if (row.data) {
              processedData.push(row.data);
            }
          } catch (error) {
            errors.push(`Linha ${i + 1}: ${error}`);
          }
        }

        resolve({
          success: errors.length === 0,
          data: processedData,
          errors,
          warnings,
          totalRows: jsonData.length - 1,
          validRows: processedData.length,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Parse de linha CSV considerando aspas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Processa uma linha de dados
 */
function processRow(
  headers: string[],
  values: any[],
  mappings: ImportMapping[],
  rowNumber: number
): {
  data: any | null;
  errors: string[];
  warnings: string[];
} {
  const data: any = {};
  const errors: string[] = [];
  const warnings: string[] = [];

  mappings.forEach((mapping) => {
    const columnIndex = headers.findIndex(
      (h) => h.toLowerCase().trim() === mapping.sourceColumn.toLowerCase().trim()
    );

    if (columnIndex === -1) {
      if (mapping.required) {
        errors.push(
          `Linha ${rowNumber}: Coluna obrigatória "${mapping.sourceColumn}" não encontrada`
        );
      }
      return;
    }

    let value = values[columnIndex];

    // Aplicar transformação se existir
    if (mapping.transformer) {
      try {
        value = mapping.transformer(value);
      } catch (error) {
        errors.push(
          `Linha ${rowNumber}: Erro ao transformar "${mapping.sourceColumn}": ${error}`
        );
        return;
      }
    }

    // Validar se existir validador
    if (mapping.validator && !mapping.validator(value)) {
      errors.push(
        `Linha ${rowNumber}: Valor inválido para "${mapping.sourceColumn}": ${value}`
      );
      return;
    }

    // Verificar campos obrigatórios
    if (mapping.required && (value === null || value === undefined || value === '')) {
      errors.push(
        `Linha ${rowNumber}: Campo obrigatório "${mapping.sourceColumn}" está vazio`
      );
      return;
    }

    data[mapping.targetField] = value;
  });

  return {
    data: errors.length > 0 ? null : data,
    errors,
    warnings,
  };
}

/**
 * Obtém as planilhas de um arquivo Excel
 */
export function getExcelSheets(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const XLSX = await import('xlsx');
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Valida CPF
 */
export function validateCPF(cpf: string): boolean {
  if (!cpf) return false;
  
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  return true; // Validação simplificada para demo
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida telefone
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

/**
 * Transforma string de data para objeto Date
 */
export function transformDate(value: any): Date | null {
  if (!value) return null;
  
  if (value instanceof Date) return value;
  
  // Tentar parse de string
  if (typeof value === 'string') {
    // Formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Formato ISO
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  
  return null;
}

/**
 * Transforma string para número
 */
export function transformNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  
  if (typeof value === 'number') return value;
  
  if (typeof value === 'string') {
    // Remove caracteres não numéricos exceto . e ,
    const cleaned = value.replace(/[^\d.,-]/g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  
  return null;
}

/**
 * Transforma string para boolean
 */
export function transformBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'sim' || lower === 'yes' || lower === 'true' || lower === '1';
  }
  
  return Boolean(value);
}
