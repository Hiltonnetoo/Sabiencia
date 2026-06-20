// ============================================
// LOCALIZAÇÃO DOS DADOS MOCK (data namespace)
// ============================================
// Transforma as entidades mock para o idioma ativo, traduzindo apenas
// campos descritivos/categóricos. Nomes de pessoas, e-mails, CPF, telefones,
// códigos e URLs permanecem intactos.
//
// Cada texto vira uma chave estável em `data.<entidade>.<id>.<campo>` (ou,
// para conteúdo gerado a partir de um conjunto finito de literais, em
// `data.shared.*`). O texto português original é sempre o fallback, então a
// UI nunca fica vazia mesmo que uma chave falte.

import { localizeData } from '../i18n';
import i18n from '../i18n';
import type {
  Curso,
  Disciplina,
  Turma,
  Material,
  Observacao,
  Pagamento,
  Comunicado,
  Nota,
  Frequencia,
  Notificacao,
} from '../types';

// Slug estável usado para mapear literais de texto compartilhado em chaves.
const slug = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

/** Localiza um literal compartilhado via `data.shared.<slug>`. */
const localizeShared = (text: string): string =>
  localizeData(`data.shared.${slug(text)}`, text);

// ---------- CURSOS ----------
export function localizeCursos(cursos: Curso[]): Curso[] {
  return cursos.map((c) => ({
    ...c,
    nome: localizeData(`data.curso.${c.id}.nome`, c.nome),
    descricao: localizeData(`data.curso.${c.id}.descricao`, c.descricao),
  }));
}

// ---------- DISCIPLINAS ----------
export function localizeDisciplinas(disciplinas: Disciplina[]): Disciplina[] {
  return disciplinas.map((d) => ({
    ...d,
    nome: localizeData(`data.disciplina.${d.id}.nome`, d.nome),
    descricao: localizeData(`data.disciplina.${d.id}.descricao`, d.descricao),
    ementa: d.ementa
      ? localizeData(`data.disciplina.${d.id}.ementa`, d.ementa)
      : d.ementa,
  }));
}

// ---------- TURMAS ----------
export function localizeTurmas(turmas: Turma[]): Turma[] {
  return turmas.map((t) => ({
    ...t,
    nome: localizeData(`data.turma.${t.id}.nome`, t.nome),
  }));
}

// ---------- MATERIAIS ----------
// Os títulos/descrições embutem o nome da disciplina, então localizamos por id
// (a seed em PT reproduz o texto original; em EN o texto traduzido completo).
export function localizeMateriais(materiais: Material[]): Material[] {
  return materiais.map((m) => ({
    ...m,
    titulo: localizeData(`data.material.${m.id}.titulo`, m.titulo),
    descricao: localizeData(`data.material.${m.id}.descricao`, m.descricao),
    modulo: m.modulo ? localizeShared(m.modulo) : m.modulo,
  }));
}

// ---------- OBSERVAÇÕES ----------
// `conteudo` vem de um conjunto finito de literais; localizamos via shared.
export function localizeObservacoes(observacoes: Observacao[]): Observacao[] {
  return observacoes.map((o) => ({
    ...o,
    conteudo: o.conteudo ? localizeShared(o.conteudo) : o.conteudo,
    titulo: o.titulo ? localizeShared(o.titulo) : o.titulo,
  }));
}

// ---------- PAGAMENTOS ----------
// metodo_pagamento é um label livre (Boleto/PIX/Cartão); observacao pode existir.
export function localizePagamentos(pagamentos: Pagamento[]): Pagamento[] {
  return pagamentos.map((p) => ({
    ...p,
    metodo_pagamento: p.metodo_pagamento
      ? localizeShared(p.metodo_pagamento)
      : p.metodo_pagamento,
    observacao: p.observacao ? localizeShared(p.observacao) : p.observacao,
  }));
}

// ---------- NOTAS ----------
// tipo_avaliacao vem de um conjunto finito (Prova 1, Prova 2, Trabalho Final).
export function localizeNotas(notas: Nota[]): Nota[] {
  return notas.map((n) => ({
    ...n,
    tipo_avaliacao: n.tipo_avaliacao
      ? localizeShared(n.tipo_avaliacao)
      : n.tipo_avaliacao,
  }));
}

// ---------- FREQUÊNCIAS ----------
// observacao é "Atestado médico" (literal compartilhado) quando justificado.
export function localizeFrequencias(frequencias: Frequencia[]): Frequencia[] {
  return frequencias.map((f) => ({
    ...f,
    observacao: f.observacao ? localizeShared(f.observacao) : f.observacao,
  }));
}

// ---------- COMUNICADOS ----------
export function localizeComunicados(comunicados: Comunicado[]): Comunicado[] {
  return comunicados.map((c) => ({
    ...c,
    titulo: localizeData(`data.comunicado.${c.id}.titulo`, c.titulo),
    mensagem: localizeData(`data.comunicado.${c.id}.mensagem`, c.mensagem),
  }));
}

// ---------- NOTIFICAÇÕES ----------
export function localizeNotificacoes(notificacoes: Notificacao[]): Notificacao[] {
  return notificacoes.map((n) => ({
    ...n,
    titulo: localizeData(`data.notificacao.${n.id}.titulo`, n.titulo),
    mensagem: localizeData(`data.notificacao.${n.id}.mensagem`, n.mensagem),
  }));
}

/** Idioma ativo — usado como dependência de memo para reagir à troca. */
export const currentLanguage = (): string => i18n.language;
