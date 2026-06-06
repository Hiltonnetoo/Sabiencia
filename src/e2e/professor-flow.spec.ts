// ============================================
// E2E TESTS - Professor Flow
// Testa fluxo completo de professor
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Professor - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login como professor
    await page.goto('/');
    await page.getByLabel(/cpf/i).fill('111.111.111-11');
    await page.getByLabel(/senha/i).fill('prof123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/professor\/dashboard/i, { timeout: 5000 });
  });

  test('deve visualizar dashboard do professor', async ({ page }) => {
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    await expect(page.getByText(/turmas/i)).toBeVisible({ timeout: 3000 });
  });

  test('deve acessar minhas turmas', async ({ page }) => {
    await page.getByRole('link', { name: /turmas/i }).first().click();
    await page.waitForURL(/\/professor\/turmas/i);
    
    await expect(page.getByRole('heading', { name: /turmas/i })).toBeVisible();
  });

  test('deve acessar meus alunos', async ({ page }) => {
    await page.getByRole('link', { name: /alunos/i }).first().click();
    await page.waitForURL(/\/professor\/alunos/i);
    
    await expect(page.getByRole('heading', { name: /alunos/i })).toBeVisible();
  });

  test('deve acessar lançamento de notas', async ({ page }) => {
    await page.getByRole('link', { name: /notas/i }).first().click();
    await page.waitForURL(/\/professor\/notas/i);
    
    await expect(page.getByText(/notas/i)).toBeVisible();
  });

  test('deve acessar controle de frequência', async ({ page }) => {
    await page.getByRole('link', { name: /frequência/i }).first().click();
    await page.waitForURL(/\/professor\/frequencia/i);
    
    await expect(page.getByText(/frequência/i)).toBeVisible();
  });

  test('deve acessar biblioteca de materiais', async ({ page }) => {
    await page.getByRole('link', { name: /biblioteca/i }).or(
      page.getByRole('link', { name: /materiais/i })
    ).first().click();

    // Aguardar URL ou elemento em vez de timeout fixo
    await page.waitForURL(/\/professor\/(biblioteca|materiais)/i);
    await expect(page.getByText(/biblioteca|materiais/i)).toBeVisible();
  });

  test('deve acessar comunicados', async ({ page }) => {
    await page.getByRole('link', { name: /comunicados/i }).first().click();
    await page.waitForURL(/\/professor\/comunicados/i);
    
    await expect(page.getByText(/comunicados/i)).toBeVisible();
  });
});

test.describe('Professor - Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/cpf/i).fill('111.111.111-11');
    await page.getByLabel(/senha/i).fill('prof123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/professor\/dashboard/i, { timeout: 5000 });
  });

  test('deve navegar entre páginas pelo menu', async ({ page }) => {
    // Dashboard
    await page.getByRole('link', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/professor\/dashboard/i);
    
    // Turmas
    await page.getByRole('link', { name: /turmas/i }).first().click();
    await page.waitForURL(/\/professor\/turmas/i);
    
    // Voltar ao dashboard
    await page.getByRole('link', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/professor\/dashboard/i);
  });
});
