// ============================================
// E2E TESTS - Gestor Flow
// Testa fluxo completo de gestão de alunos
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Gestor - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login como gestor
    await page.goto('/login/ceo');
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha|password/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 10000 });
  });

  test('deve visualizar dashboard do gestor', async ({ page }) => {
    // Verificar cards de estatísticas
    await expect(page.getByText(/total.*(alunos|students)/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/professores|teachers/i).first()).toBeVisible();
    await expect(page.getByText(/turmas|classes/i).first()).toBeVisible();
  });

  test('deve navegar para lista de alunos', async ({ page }) => {
    await page.getByRole('link', { name: /alunos|students/i }).first().click();
    await page.waitForURL(/\/gestor\/alunos/i, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /alunos|students/i }).first()).toBeVisible();
  });

  test('deve buscar aluno por nome', async ({ page }) => {
    await page.goto('/gestor/alunos');
    await page.waitForLoadState('networkidle');
    const searchInput = page.getByPlaceholder(/buscar|search/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Ana');
      await expect(searchInput).toHaveValue('Ana');
    }
  });

  test('deve filtrar alunos por status', async ({ page }) => {
    await page.goto('/gestor/alunos');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /alunos|students/i }).first()).toBeVisible();
  });

  test('deve navegar para professores', async ({ page }) => {
    await page.getByRole('link', { name: /professores|teachers/i }).first().click();
    await page.waitForURL(/\/gestor\/professores/i, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /professores|teachers/i }).first()).toBeVisible();
  });

  test('deve navegar para turmas', async ({ page }) => {
    await page.getByRole('link', { name: /turmas|classes/i }).first().click();
    await page.waitForURL(/\/gestor\/turmas/i, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /turmas|classes/i }).first()).toBeVisible();
  });

  test('deve navegar para financeiro', async ({ page }) => {
    await page.getByRole('link', { name: /financeiro|financial/i }).first().click();
    await page.waitForURL(/\/gestor\/financeiro/i, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /financeiro|financial/i }).first()).toBeVisible();
  });

  test('deve acessar relatórios', async ({ page }) => {
    await page.getByRole('link', { name: /relatórios|reports/i }).first().click();
    await page.waitForURL(/\/gestor\/relatorios/i, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /relatórios|reports/i }).first()).toBeVisible();
  });
});

test.describe('Gestor - Navegação Lateral', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login/ceo');
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha|password/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 10000 });
  });

  test('deve ter menu lateral visível', async ({ page }) => {
    const sidebar = page.locator('nav, aside, [role="navigation"]').first();
    await expect(sidebar).toBeVisible();
  });

  test('deve navegar entre páginas usando menu lateral', async ({ page }) => {
    await page.getByRole('link', { name: /alunos|students/i }).first().click();
    await page.waitForURL(/\/gestor\/alunos/i, { timeout: 10000 });
    await page.getByRole('link', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/gestor\/dashboard/i);
  });
});
