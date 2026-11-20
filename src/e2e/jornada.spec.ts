// ============================================
// E2E — Jornada acadêmica completa (modo demo, dados no localStorage)
// Gestor cadastra e matricula -> Professor lança nota -> Aluno consulta.
// Cada etapa usa um perfil diferente, com logout real entre elas, e os dados
// precisam sobreviver ao reload da página.
// ============================================

import { test, expect, type Page } from '@playwright/test';

const ALUNO_NOVO = 'Aluno Jornada Ponta';
// Nomes de fixture localizados (o idioma segue o navegador): aceitamos PT e EN
const TURMA = /^(Enfermagem 2025\.1 - Manhã|Nursing 2025\.1 - Morning)$/;
const DISCIPLINA = /^(Anatomia Humana|Human Anatomy)$/;

async function login(page: Page, rota: 'ceo' | 'professor' | 'aluno', cpf: string, senha: string, destino: RegExp) {
  await page.goto(`/login/${rota}`);
  await page.getByLabel(/cpf/i).fill(cpf);
  await page.getByLabel(/senha|password/i).fill(senha);
  await page.getByRole('button', { name: /^(entrar|sign in)$/i }).click();
  await page.waitForURL(destino, { timeout: 10000 });
}

async function logout(page: Page) {
  await page.getByRole('button', { name: /menu do usuário/i }).click();
  await page.getByRole('menuitem', { name: /^(sair|sign out)$/i }).click();
  await page.waitForURL(/\/login|\/$/);
}

async function escolher(page: Page, trigger: string, opcao: string | RegExp) {
  await page.locator(trigger).click();
  await page.getByRole('option', { name: opcao }).click();
}

async function lancarNota(page: Page, aluno: string, tipo: string, nota: string) {
  await page.goto('/professor/notas');
  await escolher(page, '#turma', TURMA);
  await escolher(page, '#disciplina', DISCIPLINA);
  await escolher(page, '#tipo', new RegExp(`^${tipo}$`));
  await page.locator('#data').click();
  await page.getByRole('gridcell', { name: '15' }).first().click();
  await page.keyboard.press('Escape');
  await page.getByLabel(new RegExp(`— ${aluno}$`)).fill(nota);
  await page.getByRole('button', { name: /salvar notas|save grades/i }).click();
  await expect(page.getByText(/notas salvas com sucesso/i)).toBeVisible();
}

test.describe('Jornada acadêmica entre perfis', () => {
  test('gestor cadastra -> professor lança nota -> aluno vê a nota', async ({ page }) => {
    // 1. GESTOR cadastra um aluno já matriculado numa turma
    await login(page, 'ceo', '000.000.000-01', 'gestor123', /\/gestor\/dashboard/);
    await page.goto('/gestor/alunos/novo');
    await page.getByLabel(/nome completo|full name/i).fill(ALUNO_NOVO);
    await page.getByLabel(/^cpf/i).fill('52998224725');
    await page.locator('#data_nascimento').fill('2000-01-01');
    await page.getByLabel(/e-?mail/i).fill('aluno.jornada@exemplo.com');
    await page.getByLabel(/^(telefone|phone)/i).fill('11987654321');
    await escolher(page, '#turma_id', TURMA);
    await page.getByRole('button', { name: /^(salvar|save)/i }).click();
    await page.waitForURL(/\/gestor\/alunos$/);
    await expect(page.getByText(ALUNO_NOVO)).toBeVisible();

    // Persistência: o cadastro sobrevive ao reload
    await page.reload();
    await expect(page.getByText(ALUNO_NOVO)).toBeVisible();
    await logout(page);

    // 2. PROFESSOR vê o novo aluno na turma e lança notas
    await login(page, 'professor', '111.111.111-11', 'prof123', /\/professor\/dashboard/);
    await lancarNota(page, ALUNO_NOVO, 'Projeto', '8.5');
    await lancarNota(page, 'João Pedro Santos', 'Seminário', '9.5');

    // O professor reabre o formulário e vê a nota anterior do novo aluno
    await page.reload();
    await escolher(page, '#turma', TURMA);
    await escolher(page, '#disciplina', DISCIPLINA);
    await expect(
      page.getByRole('row', { name: new RegExp(ALUNO_NOVO) }).getByText(/8\.5/)
    ).toBeVisible();
    await logout(page);

    // 3. ALUNO (João Pedro Santos) consulta a nota lançada
    await login(page, 'aluno', '333.333.333-33', 'aluno123', /\/aluno\/dashboard/);
    await page.goto('/aluno/notas');
    // Linha do boletim da avaliação lançada, com a nota na mesma linha
    const linha = page.getByRole('row').filter({ hasText: /^(seminário|seminar)/i });
    await expect(linha).toHaveCount(1);
    await expect(linha.getByRole('cell').nth(1)).toHaveText('9.5');
  });

  test('professor não vê turmas que não leciona no lançamento de notas', async ({ page }) => {
    await login(page, 'professor', '111.111.111-11', 'prof123', /\/professor\/dashboard/);
    await page.goto('/professor/notas');
    await page.locator('#turma').click();
    const opcoes = await page.getByRole('option').allTextContents();
    expect(opcoes.length).toBeGreaterThan(0);
    // prof-001 leciona apenas nas turmas de Enfermagem (mockData.professorTurmaDisciplina)
    for (const opcao of opcoes) {
      expect(opcao).toMatch(/enfermagem|nursing/i);
    }
  });
});
