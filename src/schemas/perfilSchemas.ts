// ============================================
// PERFIL SCHEMAS - Validações de perfil
// ============================================

import { z } from 'zod';

/**
 * Schema para edição de dados pessoais
 */
export const perfilPessoalSchema = z.object({
  nome_completo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().optional(),
  data_nascimento: z.string().optional(),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
});

export type PerfilPessoalFormData = z.infer<typeof perfilPessoalSchema>;

/**
 * Schema para alteração de senha
 */
export const alterarSenhaSchema = z.object({
  senha_atual: z.string().min(1, 'Senha atual é obrigatória'),
  nova_senha: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
  confirmar_senha: z.string().min(6, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.nova_senha === data.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
});

export type AlterarSenhaFormData = z.infer<typeof alterarSenhaSchema>;

/**
 * Schema para dados acadêmicos (aluno)
 */
export const dadosAcademicosSchema = z.object({
  matricula: z.string(),
  curso: z.string(),
  turma: z.string(),
  turno: z.string(),
  status: z.string(),
  data_matricula: z.string(),
});

export type DadosAcademicosData = z.infer<typeof dadosAcademicosSchema>;

/**
 * Schema para dados profissionais (professor)
 */
export const dadosProfissionaisSchema = z.object({
  registro_profissional: z.string().optional(),
  area_especializacao: z.string().optional(),
  formacao: z.string().optional(),
  data_admissao: z.string().optional(),
  status: z.string(),
});

export type DadosProfissionaisData = z.infer<typeof dadosProfissionaisSchema>;

/**
 * Tipos de atividades do perfil
 */
export type AtividadePerfil = {
  id: string;
  tipo: 'login' | 'edicao' | 'senha' | 'foto' | 'outro';
  descricao: string;
  data: string;
  ip?: string;
};

/**
 * Schema para upload de foto
 */
export const uploadFotoSchema = z.object({
  file: z.instanceof(File).optional(),
  url: z.string().url().optional(),
}).refine((data) => data.file || data.url, {
  message: 'Arquivo ou URL da foto é obrigatório',
});

export type UploadFotoFormData = z.infer<typeof uploadFotoSchema>;
