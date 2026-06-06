// ============================================
// USER SCHEMAS - Validação com Zod
// ============================================

import { z } from 'zod';

// ==================== VALIDADORES CUSTOMIZADOS ====================

// Validar CPF
const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // CPF com todos números iguais
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

// Validar idade mínima
const validateMinAge = (date: Date, minAge: number): boolean => {
  const today = new Date();
  const birthDate = new Date(date);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge;
  }
  
  return age >= minAge;
};

// ==================== SCHEMAS COMPARTILHADOS ====================

const cpfSchema = z.string()
  .min(11, 'O formato do CPF está incorreto. Por favor, verifique os números e digite novamente.')
  .max(14, 'O formato do CPF está incorreto. Por favor, verifique os números e digite novamente.')
  .refine(validateCPF, 'O formato do CPF está incorreto. Por favor, verifique os números e digite novamente.');

const emailSchema = z.string()
  .email('Email inválido')
  .min(5, 'Email muito curto');

const telefoneSchema = z.string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone muito longo')
  .regex(/^[\d\s()+-]+$/, 'Telefone contém caracteres inválidos');

const nomeCompletoSchema = z.string()
  .min(3, 'Nome deve ter pelo menos 3 caracteres')
  .max(100, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras');

// ==================== SCHEMA DE ENDEREÇO ====================

export const enderecoSchema = z.object({
  cep: z.string()
    .min(8, 'CEP deve ter 8 dígitos')
    .max(9, 'CEP inválido')
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  rua: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  cidade: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  estado: z.string()
    .length(2, 'Estado deve ter 2 letras')
    .regex(/^[A-Z]{2}$/, 'Estado deve ser sigla maiúscula (ex: SP)'),
});

// ==================== SCHEMA DE ALUNO ====================

export const alunoSchema = z.object({
  // Dados pessoais
  nome_completo: nomeCompletoSchema,
  cpf: cpfSchema,
  rg: z.string().optional(),
  data_nascimento: z.date()
    .refine(date => validateMinAge(date, 14), 'Aluno deve ter pelo menos 14 anos')
    .refine(date => date <= new Date(), 'Data de nascimento não pode ser futura'),
  sexo: z.enum(['M', 'F', 'Outro']).optional(),
  estado_civil: z.string().optional(),

  // Contato
  email: emailSchema,
  telefone: telefoneSchema,
  nome_responsavel: z.string().optional(),
  telefone_responsavel: z.string().optional(),

  // Endereço
  endereco: enderecoSchema.optional(),

  // Sistema
  foto_url: z.string().url().optional().or(z.literal('')),
  ativo: z.boolean().default(true),
});

export type AlunoFormData = z.infer<typeof alunoSchema>;

// ==================== SCHEMA DE PROFESSOR ====================

export const professorSchema = z.object({
  // Dados pessoais
  nome_completo: nomeCompletoSchema,
  cpf: cpfSchema,
  data_nascimento: z.date().optional(),

  // Contato
  email: emailSchema,
  telefone: telefoneSchema,

  // Profissionais
  formacao: z.string()
    .min(3, 'Formação deve ter pelo menos 3 caracteres')
    .max(200, 'Formação muito longa'),
  especialidades: z.array(z.string())
    .min(1, 'Selecione pelo menos uma especialidade')
    .max(10, 'Máximo de 10 especialidades'),
  registro_profissional: z.string().optional(),

  // Sistema
  foto_url: z.string().url().optional().or(z.literal('')),
  ativo: z.boolean().default(true),
});

export type ProfessorFormData = z.infer<typeof professorSchema>;

// ==================== SCHEMA DE MATRÍCULA ====================

export const matriculaSchema = z.object({
  aluno_id: z.string().min(1, 'Selecione um aluno'),
  turma_id: z.string().min(1, 'Selecione uma turma'),
  data_matricula: z.date().default(() => new Date()),
  status: z.enum(['ativo', 'trancado', 'concluido', 'evadido']).default('ativo'),
});

export type MatriculaFormData = z.infer<typeof matriculaSchema>;
