// ============================================
// IMPORT TEMPLATES - Templates pré-configurados para importação
// ============================================

import { ImportMapping, validateCPF, validateEmail, validatePhone, transformDate, transformNumber, transformBoolean } from './importService';

/**
 * Template para importação de alunos
 */
export const ALUNO_TEMPLATE: ImportMapping[] = [
  {
    sourceColumn: 'Nome Completo',
    targetField: 'nome_completo',
    required: true,
  },
  {
    sourceColumn: 'CPF',
    targetField: 'cpf',
    required: true,
    validator: validateCPF,
    transformer: (value) => value.replace(/\D/g, ''),
  },
  {
    sourceColumn: 'RG',
    targetField: 'rg',
    transformer: (value) => value?.toString(),
  },
  {
    sourceColumn: 'Data de Nascimento',
    targetField: 'data_nascimento',
    required: true,
    transformer: transformDate,
  },
  {
    sourceColumn: 'Sexo',
    targetField: 'sexo',
    validator: (value) => ['M', 'F', 'Outro'].includes(value),
  },
  {
    sourceColumn: 'Email',
    targetField: 'email',
    required: true,
    validator: validateEmail,
  },
  {
    sourceColumn: 'Telefone',
    targetField: 'telefone',
    required: true,
    validator: validatePhone,
    transformer: (value) => value.replace(/\D/g, ''),
  },
  {
    sourceColumn: 'CEP',
    targetField: 'endereco.cep',
    transformer: (value) => value?.replace(/\D/g, ''),
  },
  {
    sourceColumn: 'Rua',
    targetField: 'endereco.rua',
  },
  {
    sourceColumn: 'Número',
    targetField: 'endereco.numero',
  },
  {
    sourceColumn: 'Complemento',
    targetField: 'endereco.complemento',
  },
  {
    sourceColumn: 'Bairro',
    targetField: 'endereco.bairro',
  },
  {
    sourceColumn: 'Cidade',
    targetField: 'endereco.cidade',
  },
  {
    sourceColumn: 'Estado',
    targetField: 'endereco.estado',
  },
  {
    sourceColumn: 'Ativo',
    targetField: 'ativo',
    transformer: transformBoolean,
  },
];

/**
 * Template para importação de professores
 */
export const PROFESSOR_TEMPLATE: ImportMapping[] = [
  {
    sourceColumn: 'Nome Completo',
    targetField: 'nome_completo',
    required: true,
  },
  {
    sourceColumn: 'CPF',
    targetField: 'cpf',
    required: true,
    validator: validateCPF,
    transformer: (value) => value.replace(/\D/g, ''),
  },
  {
    sourceColumn: 'Email',
    targetField: 'email',
    required: true,
    validator: validateEmail,
  },
  {
    sourceColumn: 'Telefone',
    targetField: 'telefone',
    required: true,
    validator: validatePhone,
    transformer: (value) => value.replace(/\D/g, ''),
  },
  {
    sourceColumn: 'Formação',
    targetField: 'formacao',
  },
  {
    sourceColumn: 'Especialização',
    targetField: 'especializacao',
  },
  {
    sourceColumn: 'Ativo',
    targetField: 'ativo',
    transformer: transformBoolean,
  },
];

/**
 * Template para importação de notas
 */
export const NOTAS_TEMPLATE: ImportMapping[] = [
  {
    sourceColumn: 'CPF Aluno',
    targetField: 'aluno_cpf',
    required: true,
    validator: validateCPF,
  },
  {
    sourceColumn: 'Disciplina',
    targetField: 'disciplina_nome',
    required: true,
  },
  {
    sourceColumn: 'AV1',
    targetField: 'av1',
    transformer: transformNumber,
    validator: (value) => value >= 0 && value <= 10,
  },
  {
    sourceColumn: 'AV2',
    targetField: 'av2',
    transformer: transformNumber,
    validator: (value) => value >= 0 && value <= 10,
  },
  {
    sourceColumn: 'Recuperação',
    targetField: 'recuperacao',
    transformer: transformNumber,
    validator: (value) => !value || (value >= 0 && value <= 10),
  },
  {
    sourceColumn: 'Trabalhos',
    targetField: 'trabalhos',
    transformer: transformNumber,
  },
];

/**
 * Template para importação de frequências
 */
export const FREQUENCIA_TEMPLATE: ImportMapping[] = [
  {
    sourceColumn: 'CPF Aluno',
    targetField: 'aluno_cpf',
    required: true,
    validator: validateCPF,
  },
  {
    sourceColumn: 'Data',
    targetField: 'data',
    required: true,
    transformer: transformDate,
  },
  {
    sourceColumn: 'Disciplina',
    targetField: 'disciplina_nome',
    required: true,
  },
  {
    sourceColumn: 'Presente',
    targetField: 'presente',
    required: true,
    transformer: transformBoolean,
  },
  {
    sourceColumn: 'Justificativa',
    targetField: 'justificativa',
  },
];

/**
 * Template para importação de pagamentos
 */
export const PAGAMENTO_TEMPLATE: ImportMapping[] = [
  {
    sourceColumn: 'CPF Aluno',
    targetField: 'aluno_cpf',
    required: true,
    validator: validateCPF,
  },
  {
    sourceColumn: 'Descrição',
    targetField: 'descricao',
    required: true,
  },
  {
    sourceColumn: 'Valor',
    targetField: 'valor',
    required: true,
    transformer: transformNumber,
    validator: (value) => value > 0,
  },
  {
    sourceColumn: 'Data Vencimento',
    targetField: 'data_vencimento',
    required: true,
    transformer: transformDate,
  },
  {
    sourceColumn: 'Data Pagamento',
    targetField: 'data_pagamento',
    transformer: transformDate,
  },
  {
    sourceColumn: 'Status',
    targetField: 'status',
    validator: (value) => ['pendente', 'pago', 'vencido', 'cancelado'].includes(value),
  },
];

/**
 * Gera arquivo CSV de exemplo para um template
 */
export function generateTemplateCSV(template: ImportMapping[]): string {
  const headers = template.map(m => m.sourceColumn).join(',');
  
  // Gerar linha de exemplo baseada no tipo de campo
  const exampleRow = template.map(m => {
    if (m.sourceColumn.includes('CPF')) return '123.456.789-00';
    if (m.sourceColumn.includes('Email')) return 'exemplo@email.com';
    if (m.sourceColumn.includes('Telefone')) return '(11) 98765-4321';
    if (m.sourceColumn.includes('Data')) return '01/01/2025';
    if (m.sourceColumn.includes('Valor')) return '100.00';
    if (m.sourceColumn.includes('Ativo') || m.sourceColumn.includes('Presente')) return 'Sim';
    if (m.sourceColumn.includes('Sexo')) return 'M';
    if (m.sourceColumn.includes('Estado')) return 'SP';
    if (m.sourceColumn.includes('CEP')) return '12345-678';
    if (m.sourceColumn.includes('Status')) return 'pendente';
    return 'Exemplo';
  }).join(',');
  
  return `${headers}\n${exampleRow}`;
}

/**
 * Baixa arquivo CSV de template
 */
export function downloadTemplateCSV(
  template: ImportMapping[],
  filename: string = 'template.csv'
): void {
  const csv = generateTemplateCSV(template);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Retorna template por nome
 */
export function getTemplate(name: string): ImportMapping[] | null {
  const templates: Record<string, ImportMapping[]> = {
    aluno: ALUNO_TEMPLATE,
    professor: PROFESSOR_TEMPLATE,
    notas: NOTAS_TEMPLATE,
    frequencia: FREQUENCIA_TEMPLATE,
    pagamento: PAGAMENTO_TEMPLATE,
  };
  
  return templates[name] || null;
}

/**
 * Lista todos os templates disponíveis
 */
export function listTemplates(): Array<{ name: string; label: string; fields: number }> {
  return [
    { name: 'aluno', label: 'Alunos', fields: ALUNO_TEMPLATE.length },
    { name: 'professor', label: 'Professores', fields: PROFESSOR_TEMPLATE.length },
    { name: 'notas', label: 'Notas', fields: NOTAS_TEMPLATE.length },
    { name: 'frequencia', label: 'Frequências', fields: FREQUENCIA_TEMPLATE.length },
    { name: 'pagamento', label: 'Pagamentos', fields: PAGAMENTO_TEMPLATE.length },
  ];
}
