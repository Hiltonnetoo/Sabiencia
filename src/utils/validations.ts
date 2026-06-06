// ============================================
// VALIDATIONS - Validações para videoaulas
// ============================================

import { isValidYouTubeUrl } from './youtube';

/**
 * Valida dados de tópico
 */
export function validarTopico(dados: { titulo: string; descricao?: string }): string[] {
  const erros: string[] = [];

  if (!dados.titulo || dados.titulo.trim().length === 0) {
    erros.push('O título do tópico é obrigatório');
  } else if (dados.titulo.trim().length < 3) {
    erros.push('O título deve ter pelo menos 3 caracteres');
  } else if (dados.titulo.length > 200) {
    erros.push('O título não pode exceder 200 caracteres');
  }

  if (dados.descricao && dados.descricao.length > 1000) {
    erros.push('A descrição não pode exceder 1000 caracteres');
  }

  return erros;
}

/**
 * Valida dados de videoaula
 */
export function validarVideoaula(dados: {
  titulo: string;
  descricao: string;
  youtube_url: string;
}): string[] {
  const erros: string[] = [];

  if (!dados.titulo || dados.titulo.trim().length === 0) {
    erros.push('O título da videoaula é obrigatório');
  } else if (dados.titulo.trim().length < 3) {
    erros.push('O título deve ter pelo menos 3 caracteres');
  } else if (dados.titulo.length > 300) {
    erros.push('O título não pode exceder 300 caracteres');
  }

  if (!dados.descricao || dados.descricao.trim().length === 0) {
    erros.push('A descrição da videoaula é obrigatória');
  } else if (dados.descricao.trim().length < 10) {
    erros.push('A descrição deve ter pelo menos 10 caracteres');
  } else if (dados.descricao.length > 2000) {
    erros.push('A descrição não pode exceder 2000 caracteres');
  }

  if (!dados.youtube_url || dados.youtube_url.trim().length === 0) {
    erros.push('A URL do YouTube é obrigatória');
  } else if (!isValidYouTubeUrl(dados.youtube_url)) {
    erros.push('URL do YouTube inválida. Use o formato: https://www.youtube.com/watch?v=ID');
  }

  return erros;
}