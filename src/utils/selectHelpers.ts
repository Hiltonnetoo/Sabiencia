// ============================================
// SELECT HELPERS - Utilitários para componentes Select
// ============================================

/**
 * Filtra items para garantir que não tenham valores vazios
 * Evita erro: "A <Select.Item /> must have a value prop that is not an empty string"
 */
export function filterValidSelectItems<T extends { id: string }>(items: T[]): T[] {
  return items.filter(item => item.id && item.id.trim() !== '');
}

/**
 * Filtra array de strings para remover vazias
 */
export function filterValidSelectValues(values: string[]): string[] {
  return values.filter(value => value && value.trim() !== '');
}

/**
 * Valida se um valor é válido para SelectItem
 */
export function isValidSelectValue(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
}

/**
 * Sanitiza valor de Select para evitar strings vazias
 * Se o valor for vazio, retorna um fallback
 */
export function sanitizeSelectValue(value: any, fallback: string = 'default'): string {
  if (!isValidSelectValue(value)) return fallback;
  return String(value);
}
