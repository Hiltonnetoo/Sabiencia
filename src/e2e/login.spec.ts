// ============================================
// E2E TESTS - Login Flow
// Testa fluxos de autenticação completos
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Login Flow - E2E', () => {
  test('deve carregar a página inicial (landing page)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sabiencia/i);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('deve fazer login como GESTOR/CEO e acessar dashboard', async ({ page }) => {
    await page.goto('/login/ceo');
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha|password/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 10000 });
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();
    await expect(page.getByText(/total.*(alunos|students)/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('deve fazer login como PROFESSOR e acessar dashboard', async ({ page }) => {
    await page.goto('/login/professor');
    await page.getByLabel(/cpf/i).fill('111.111.111-11');
    await page.getByLabel(/senha|password/i).fill('prof123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/professor\/dashboard/i, { timeout: 10000 });
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();
    await expect(page.getByText(/turmas|classes/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('deve fazer login como ALUNO e acessar dashboard', async ({ page }) => {
    await page.goto('/login/aluno');
    await page.getByLabel(/cpf/i).fill('333.333.333-33');
    await page.getByLabel(/senha|password/i).fill('aluno123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/aluno\/dashboard/i, { timeout: 10000 });
    await expect(page.getByText(/dashboard|início|home/i).first()).toBeVisible();
  });

  test('deve rejeitar credenciais inválidas', async ({ page }) => {
    await page.goto('/login/aluno');
    await page.getByLabel(/cpf/i).fill('999.999.999-99');
    await page.getByLabel(/senha|password/i).fill('senhaerrada');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await expect(page.getByText(/inválid|erro|failed|não encontrado|not found/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve navegar para modo demonstração', async ({ page }) => {
    await page.goto('/');
    const demoLink = page.getByRole('link', { name: /demonstração|demo/i }).or(
      page.getByRole('button', { name: /demonstração|demo/i })
    );
    await demoLink.first().click();
    await page.waitForURL(/\/demo/i, { timeout: 10000 });
    await expect(page.getByText(/demonstração|demo/i).first()).toBeVisible();
  });
});

test.describe('Login - Acessibilidade', () => {
  test('deve ser navegável por teclado', async ({ page }) => {
    await page.goto('/login/aluno');
    const cpfInput = page.getByLabel(/cpf/i);
    await cpfInput.focus();
    await expect(cpfInput).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/senha|password/i)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /entrar|sign in/i })).toBeFocused();
  });

  test('deve permitir login com Enter', async ({ page }) => {
    await page.goto('/login/ceo');
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    const senha = page.getByLabel(/senha|password/i);
    await senha.fill('gestor123');
    await senha.press('Enter');
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 10000 });
  });
});

test.describe('Login - Responsividade', () => {
  test('deve funcionar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login/ceo');
    await expect(page.getByText(/Sabiencia/i).first()).toBeVisible();
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha|password/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 10000 });
  });

  test('deve funcionar em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login/professor');
    await page.getByLabel(/cpf/i).fill('111.111.111-11');
    await page.getByLabel(/senha|password/i).fill('prof123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/professor\/dashboard/i, { timeout: 10000 });
  });
});
