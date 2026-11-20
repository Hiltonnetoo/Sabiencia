// ============================================
// E2E TESTS - Professor Flow
// Testa fluxo completo de professor
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Professor - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login como professor via /login/professor
    await page.goto('/login/professor');
    await page.getByLabel(/cpf/i).fill('111.111.111-11');
    await page.getByLabel(/senha|password/i).fill('prof123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/professor\/dashboard/i, { timeout: 10000 });
  });

  test('deve visualizar dashboard do professor', async ({ page }) => {
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();
    await expect(page.getByText(/turmas|classes/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('deve acessar minhas turmas', async ({ page }) => {
    await page.getByRole('link', { name: /turmas|classes/i }).first().click();
    await page.waitForURL(/\/professor\/turmas/i);
    
    await expect(page.getByRole('heading', { name: /turmas|classes/i }).first()).toBeVisible();
  });

  test('deve acessar meus alunos', async ({ page }) => {
    await page.getByRole('link', { name: /alunos|students/i }).first().click();
    await page.waitForURL(/\/professor\/alunos/i);
    
    await expect(page.getByRole('heading', { name: /alunos|students/i }).first()).toBeVisible();
  });

  test('deve acessar lançamento de notas', async ({ page }) => {
    await page.getByRole('link', { name: /notas|grades/i }).first().click();
    await page.waitForURL(/\/professor\/notas/i);
    
    await expect(page.getByText(/notas|grades/i).first()).toBeVisible();
  });

  test('deve acessar controle de frequência', async ({ page }) => {
    await page.getByRole('link', { name: /frequência|attendance/i }).first().click();
    await page.waitForURL(/\/professor\/frequencia/i);
    
    await expect(page.getByText(/frequência|attendance/i).first()).toBeVisible();
  });

  test('deve acessar biblioteca de materiais', async ({ page }) => {
    await page.getByRole('link', { name: /biblioteca|materiais|library/i }).first().click();
    await page.waitForURL(/\/professor\/materiais/i);
    await expect(page.getByText(/biblioteca|materiais|library/i).first()).toBeVisible();
  });

  test('deve acessar comunicados', async ({ page }) => {
    await page.getByRole('link', { name: /comunicados|announcements/i }).first().click();
    await page.waitForURL(/\/professor\/comunicados/i);
    
    await expect(page.getByText(/comunicados|announcements/i).first()).toBeVisible();
  });
});

test.describe('Professor - Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login/professor');
    await page.getByLabel(/cpf/i).fill('111.111.111-11');
    await page.getByLabel(/senha|password/i).fill('prof123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/professor\/dashboard/i, { timeout: 10000 });
  });

  test('deve navegar entre páginas pelo menu', async ({ page }) => {
    // Dashboard
    await page.getByRole('link', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/professor\/dashboard/i);
    
    // Turmas
    await page.getByRole('link', { name: /turmas|classes/i }).first().click();
    await page.waitForURL(/\/professor\/turmas/i);
    
    // Voltar ao dashboard
    await page.getByRole('link', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/professor\/dashboard/i);
  });
});
