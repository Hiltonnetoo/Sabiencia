// ============================================
// VALIDATORS - Schemas Zod para validação
// ============================================

import { z } from 'zod';

/**
 * Validador de CPF
 */
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cpfValidator = z.string().regex(cpfRegex, 'O formato do CPF está incorreto. Por favor, verifique os números e digite novamente.');

/**
 * Validador de telefone
 */
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const phoneValidator = z.string().regex(phoneRegex, 'Telefone inválido');

/**
 * Validador de CEP
 */
const cepRegex = /^\d{5}-\d{3}$/;
const cepValidator = z.string().regex(cepRegex, 'CEP inválido');

/**
 * Schema de Login
 */
export const loginSchema = z.object({
  cpf: cpfValidator,
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema de Endereço
 */
export const enderecoSchema = z.object({
  cep: cepValidator,
  rua: z.string().min(3, 'Rua deve ter no mínimo 3 caracteres'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro deve ter no mínimo 2 caracteres'),
  cidade: z.string().min(2, 'Cidade deve ter no mínimo 2 caracteres'),
  estado: z.string().length(2, 'Estado deve ter 2 caracteres')
});

/**
 * Schema de Aluno
 */
export const alunoSchema = z.object({
  nome_completo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: cpfValidator,
  email: z.string().email('Email inválido'),
  telefone: phoneValidator.optional(),
  data_nascimento: z.date({
    required_error: 'Data de nascimento é obrigatória'
  }),
  rg: z.string().optional(),
  sexo: z.enum(['M', 'F', 'Outro']).optional(),
  estado_civil: z.string().optional(),
  endereco: enderecoSchema.optional(),
  nome_responsavel: z.string().optional(),
  telefone_responsavel: phoneValidator.optional(),
  foto_url: z.string().url().optional()
});

export type AlunoFormData = z.infer<typeof alunoSchema>;

/**
 * Schema de Professor
 */
export const professorSchema = z.object({
  nome_completo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: cpfValidator,
  email: z.string().email('Email inválido'),
  telefone: phoneValidator.optional(),
  especialidades: z.array(z.string()).min(1, 'Pelo menos uma especialidade é obrigatória'),
  formacao: z.string().min(5, 'Formação deve ter no mínimo 5 caracteres'),
  registro_profissional: z.string().optional(),
  foto_url: z.string().url().optional()
});

export type ProfessorFormData = z.infer<typeof professorSchema>;

/**
 * Schema de Curso
 */
export const cursoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  carga_horaria: z.number().min(1, 'Carga horária deve ser maior que 0'),
  duracao_meses: z.number().min(1, 'Duração deve ser maior que 0'),
  ativo: z.boolean().default(true)
});

export type CursoFormData = z.infer<typeof cursoSchema>;

/**
 * Schema de Disciplina
 */
export const disciplinaSchema = z.object({
  curso_id: z.string().min(1, 'Curso é obrigatório'),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  carga_horaria: z.number().min(1, 'Carga horária deve ser maior que 0'),
  ordem: z.number().min(1, 'Ordem deve ser maior que 0'),
  ementa: z.string().optional()
});

export type DisciplinaFormData = z.infer<typeof disciplinaSchema>;

/**
 * Schema de Turma
 */
export const turmaSchema = z.object({
  curso_id: z.string().min(1, 'Curso é obrigatório'),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  data_inicio: z.date({
    required_error: 'Data de início é obrigatória'
  }),
  data_fim: z.date({
    required_error: 'Data de fim é obrigatória'
  }),
  periodo: z.enum(['manha', 'tarde', 'noite']),
  ativa: z.boolean().default(true)
}).refine(data => data.data_fim > data.data_inicio, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['data_fim']
});

export type TurmaFormData = z.infer<typeof turmaSchema>;

/**
 * Schema de Matrícula
 */
export const matriculaSchema = z.object({
  aluno_id: z.string().min(1, 'Aluno é obrigatório'),
  turma_id: z.string().min(1, 'Turma é obrigatória'),
  data_matricula: z.date({
    required_error: 'Data de matrícula é obrigatória'
  }),
  status: z.enum(['ativo', 'trancado', 'concluido', 'evadido']).default('ativo')
});

export type MatriculaFormData = z.infer<typeof matriculaSchema>;

/**
 * Schema de Nota
 */
export const notaSchema = z.object({
  aluno_id: z.string().min(1, 'Aluno é obrigatório'),
  disciplina_id: z.string().min(1, 'Disciplina é obrigatória'),
  turma_id: z.string().min(1, 'Turma é obrigatória'),
  tipo_avaliacao: z.string().min(3, 'Tipo de avaliação é obrigatório'),
  nota: z.number()
    .min(0, 'Nota não pode ser menor que 0')
    .max(10, 'Nota não pode ser maior que 10'),
  peso: z.number().min(1, 'Peso deve ser maior que 0'),
  data_avaliacao: z.date({
    required_error: 'Data da avaliação é obrigatória'
  }),
  observacao: z.string().optional()
});

export type NotaFormData = z.infer<typeof notaSchema>;

/**
 * Schema de Frequência
 */
export const frequenciaSchema = z.object({
  aluno_id: z.string().min(1, 'Aluno é obrigatório'),
  disciplina_id: z.string().min(1, 'Disciplina é obrigatória'),
  turma_id: z.string().min(1, 'Turma é obrigatória'),
  data_aula: z.date({
    required_error: 'Data da aula é obrigatória'
  }),
  status: z.enum(['presente', 'ausente', 'justificado']),
  observacao: z.string().optional()
});

export type FrequenciaFormData = z.infer<typeof frequenciaSchema>;

/**
 * Schema de Material
 */
export const materialSchema = z.object({
  disciplina_id: z.string().min(1, 'Disciplina é obrigatória'),
  turma_id: z.string().optional(),
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  tipo: z.enum(['pdf', 'video']),
  arquivo_url: z.string().url('URL inválida').optional(),
  video_url: z.string().url('URL do vídeo inválida').optional(),
  modulo: z.string().min(1, 'Módulo é obrigatório'),
  ordem: z.number().min(1, 'Ordem deve ser maior que 0'),
  visivel_alunos: z.boolean().default(true)
}).refine(
  data => {
    if (data.tipo === 'pdf') return !!data.arquivo_url;
    if (data.tipo === 'video') return !!data.video_url;
    return true;
  },
  {
    message: 'URL do arquivo ou vídeo é obrigatória conforme o tipo',
    path: ['arquivo_url']
  }
);

export type MaterialFormData = z.infer<typeof materialSchema>;

/**
 * Schema de Observação
 */
export const observacaoSchema = z.object({
  aluno_id: z.string().min(1, 'Aluno é obrigatório'),
  disciplina_id: z.string().optional(),
  tipo: z.enum(['pedagogica', 'comportamental', 'administrativa']),
  conteudo: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
  visivel_aluno: z.boolean().default(true)
});

export type ObservacaoFormData = z.infer<typeof observacaoSchema>;

/**
 * Schema de Pagamento
 */
export const pagamentoSchema = z.object({
  aluno_id: z.string().min(1, 'Aluno é obrigatório'),
  valor: z.number().min(0.01, 'Valor deve ser maior que 0'),
  data_vencimento: z.date({
    required_error: 'Data de vencimento é obrigatória'
  }),
  data_pagamento: z.date().optional(),
  status: z.enum(['pendente', 'pago', 'vencido', 'cancelado']).default('pendente'),
  metodo_pagamento: z.string().optional(),
  observacao: z.string().optional()
});

export type PagamentoFormData = z.infer<typeof pagamentoSchema>;

/**
 * Schema de Comunicado
 */
export const comunicadoSchema = z.object({
  titulo: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  mensagem: z.string().min(20, 'Mensagem deve ter no mínimo 20 caracteres'),
  destinatarios: z.enum(['todos_alunos', 'todos_professores', 'turma_especifica', 'individual']),
  turma_id: z.string().optional()
}).refine(
  data => {
    if (data.destinatarios === 'turma_especifica') return !!data.turma_id;
    return true;
  },
  {
    message: 'Turma é obrigatória para comunicados específicos',
    path: ['turma_id']
  }
);

export type ComunicadoFormData = z.infer<typeof comunicadoSchema>;

/**
 * Schema de alteração de senha
 */
export const alterarSenhaSchema = z.object({
  senha_atual: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  nova_senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmar_senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
}).refine(data => data.nova_senha === data.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha']
});

export type AlterarSenhaFormData = z.infer<typeof alterarSenhaSchema>;

/**
 * Validadores auxiliares
 */
export const validarCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleaned.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

export const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validarIdade = (dataNascimento: Date, idadeMinima: number = 16): boolean => {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes = hoje.getMonth() - dataNascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }
  
  return idade >= idadeMinima;
};

export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  
  // Whitelist para CPFs de demonstração do sistema
  if (cleaned === '00000000001' || cleaned === '11111111111' || cleaned === '33333333333') {
    return true;
  }
  
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  return validarCPF(cpf);
};

export const isValidEmail = validarEmail;

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

export const isValidCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

export interface PasswordValidationResult {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong' | 'very-weak';
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  if (password.length < 6) {
    errors.push('Mínimo de 6 caracteres');
  }
  
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  if (!hasNumber) errors.push('Deve conter pelo menos um número');
  if (!hasUpper) errors.push('Deve conter pelo menos uma letra maiúscula');
  if (!hasSpecial) errors.push('Deve conter pelo menos um caractere especial');
  
  let strength: 'weak' | 'medium' | 'strong' | 'very-weak' = 'very-weak';
  if (password.length === 0) {
    strength = 'very-weak';
  } else if (password.length < 6) {
    strength = 'weak';
  } else {
    let score = 0;
    if (password.length >= 8) score++;
    if (hasNumber) score++;
    if (hasUpper) score++;
    if (hasSpecial) score++;
    
    if (score >= 4) {
      strength = 'strong';
    } else if (score >= 2) {
      strength = 'medium';
    } else {
      strength = 'weak';
    }
  }
  
  return {
    isValid: errors.length === 0 && password.length >= 6,
    strength,
    errors
  };
};

